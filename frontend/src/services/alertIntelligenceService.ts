import {
  IntelligenceAlert,
  MonitoredEventType,
  EventRuleConfig,
  PriorityScoreBreakdown,
  RiskLevel,
  BlockchainNetwork,
  AlertStatus,
  AlertEvidence,
} from '../types';
import { WatchlistService } from './watchlistService';

const ALERTS_STORAGE_KEY = 'cryptotrace_alerts_v1';
const RULES_STORAGE_KEY = 'cryptotrace_alert_rules_v1';

export const defaultEventRules: EventRuleConfig[] = [
  {
    id: 'KNOWN_ENTITY_INTERACTION',
    name: 'Known Entity / Sanctions Match',
    description: 'Direct counterparty matches a sanctioned address, known exploit cluster, or blacklist record.',
    enabled: true,
    baseSeverity: 'CRITICAL',
    severityWeight: 30,
    thresholdValue: 1,
    thresholdUnit: 'Match',
  },
  {
    id: 'RAPID_FUND_MOVEMENT',
    name: 'Rapid Fund Movement (Layering)',
    description: 'Multiple automated peel hops executed in a compressed time window (< 60 minutes).',
    enabled: true,
    baseSeverity: 'CRITICAL',
    severityWeight: 26,
    thresholdValue: 3,
    thresholdUnit: 'Hops / hr',
  },
  {
    id: 'SUSPICIOUS_PATTERN',
    name: 'Structuring / Peeling Heuristic',
    description: 'Systematic transaction splitting just below standard AML surveillance reporting thresholds.',
    enabled: true,
    baseSeverity: 'HIGH',
    severityWeight: 24,
    thresholdValue: 80,
    thresholdUnit: '% Retained',
  },
  {
    id: 'BRIDGE_ACTIVITY',
    name: 'Cross-Chain Bridge Interaction',
    description: 'Funds routed into cross-chain liquidity bridges (e.g., Stargate, Hop, Arbitrum Bridge).',
    enabled: true,
    baseSeverity: 'HIGH',
    severityWeight: 22,
    thresholdValue: 5000,
    thresholdUnit: 'USD Min',
  },
  {
    id: 'CROSS_CHAIN_MOVEMENT',
    name: 'Cross-Chain Evasion Flight',
    description: 'Rapid movement across disjoint blockchain networks within minutes of victim drain.',
    enabled: true,
    baseSeverity: 'HIGH',
    severityWeight: 20,
    thresholdValue: 10000,
    thresholdUnit: 'USD Min',
  },
  {
    id: 'ANOMALY_DETECTION',
    name: 'Behavioral Baseline Anomaly',
    description: 'Transaction volume or frequency deviates significantly (>3.0 std dev) from wallet history.',
    enabled: true,
    baseSeverity: 'HIGH',
    severityWeight: 18,
    thresholdValue: 3,
    thresholdUnit: 'Std Dev',
  },
  {
    id: 'LARGE_TX',
    name: 'High-Value Outlier Transfer',
    description: 'Single transfer size significantly exceeding typical address baseline volume.',
    enabled: true,
    baseSeverity: 'MEDIUM',
    severityWeight: 14,
    thresholdValue: 20000,
    thresholdUnit: 'USD Min',
  },
  {
    id: 'DORMANT_ACTIVATION',
    name: 'Dormant Wallet Reactivation',
    description: 'Inactive wallet suddenly executes outbound transfers after > 90 days of zero activity.',
    enabled: true,
    baseSeverity: 'MEDIUM',
    severityWeight: 14,
    thresholdValue: 90,
    thresholdUnit: 'Days Inactive',
  },
  {
    id: 'SUDDEN_BALANCE_CHANGE',
    name: 'Sharp Balance Depletion / Sweep',
    description: 'Wallet balance drops by > 90% in a single transaction block.',
    enabled: true,
    baseSeverity: 'MEDIUM',
    severityWeight: 12,
    thresholdValue: 90,
    thresholdUnit: '% Balance Drop',
  },
  {
    id: 'NEW_COUNTERPARTY',
    name: 'Unseen First-Time Counterparty',
    description: 'High-value interaction with an address that has no historical graph association.',
    enabled: true,
    baseSeverity: 'LOW',
    severityWeight: 8,
    thresholdValue: 1,
    thresholdUnit: 'New Address',
  },
];

export class AlertIntelligenceService {
  private static subscribers: Array<() => void> = [];

  public static subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  private static notifySubscribers(): void {
    this.subscribers.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error('Error notifying alert subscriber', e);
      }
    });
  }

  // ----------------------------------------------------
  // EVENT RULES CONFIGURATION
  // ----------------------------------------------------

  public static getEventRules(): EventRuleConfig[] {
    try {
      const stored = localStorage.getItem(RULES_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(defaultEventRules));
        return defaultEventRules;
      }
      return JSON.parse(stored);
    } catch (e) {
      return defaultEventRules;
    }
  }

  public static updateEventRule(
    id: MonitoredEventType,
    updates: Partial<EventRuleConfig>
  ): EventRuleConfig[] {
    const rules = this.getEventRules();
    const index = rules.findIndex((r) => r.id === id);
    if (index !== -1) {
      rules[index] = { ...rules[index], ...updates };
      localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(rules));
      this.notifySubscribers();
    }
    return rules;
  }

  public static resetEventRules(): EventRuleConfig[] {
    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(defaultEventRules));
    this.notifySubscribers();
    return defaultEventRules;
  }

  // ----------------------------------------------------
  // PRIORITIZATION SCORING ENGINE (Section 4)
  // ----------------------------------------------------

  public static calculatePriorityScore(params: {
    trigger: MonitoredEventType;
    confidence: number;
    amountUsd: number;
    walletAddress: string;
    isSanctionedMatch?: boolean;
    timestampMs?: number;
    destinationChain?: BlockchainNetwork;
  }): { priorityScore: number; priorityBreakdown: PriorityScoreBreakdown; severity: RiskLevel } {
    const rules = this.getEventRules();
    const rule = rules.find((r) => r.id === params.trigger) || defaultEventRules[0];

    // 1. Trigger severity weight (0 to 30)
    const triggerWeight = rule.severityWeight || 15;

    // 2. Model/Rule confidence (0 to 20)
    const confidenceWeight = Math.round((Math.max(0, Math.min(100, params.confidence)) / 100) * 20);

    // 3. Watchlist linkage boost (+25 for case-linked, +20 for high-priority)
    const watchlistItem = WatchlistService.getWatchlistItemByTarget(params.walletAddress);
    let watchlistBoost = 0;
    if (watchlistItem) {
      if (watchlistItem.isCaseLinked) watchlistBoost += 25;
      if (watchlistItem.isHighPriority) watchlistBoost += 20;
    }

    // 4. Known-entity / Sanctions match (+30)
    let knownEntityBoost = 0;
    if (params.isSanctionedMatch || params.trigger === 'KNOWN_ENTITY_INTERACTION') {
      knownEntityBoost = 30;
    }

    // 5. Log-scaled capped transaction amount (0 to 20)
    // Formula: log10(amountUsd + 1) * 3.5, capped at 20 pts
    // Example: $500 -> 9.4 pts | $25,000 -> 15.4 pts | $1,000,000 -> 20 pts
    const amountLogScaled = Math.round(
      Math.min(20, Math.max(0, Math.log10(params.amountUsd + 1) * 3.5))
    );

    // 6. Recency boost (+10 with gentle linear decay over 24 hours)
    const ageHours = Math.max(0, (Date.now() - (params.timestampMs || Date.now())) / (1000 * 60 * 60));
    const recencyBoost = Math.max(0, Math.round(10 - Math.min(10, ageHours * 0.4)));

    // Combined raw score
    const rawTotal =
      triggerWeight +
      confidenceWeight +
      watchlistBoost +
      knownEntityBoost +
      amountLogScaled +
      recencyBoost;

    const totalScore = Math.min(100, Math.max(5, rawTotal));

    // Dynamic Severity Classification based on Priority Score
    let severity: RiskLevel = 'LOW';
    if (totalScore >= 80) severity = 'CRITICAL';
    else if (totalScore >= 60) severity = 'HIGH';
    else if (totalScore >= 35) severity = 'MEDIUM';

    // Generate clear, explainable reasoning narrative
    const reasons: string[] = [];
    if (watchlistItem?.isCaseLinked) reasons.push(`Linked to active Case #${watchlistItem.linkedCaseId} (+25)`);
    if (watchlistItem?.isHighPriority) reasons.push('High-priority watchlist target (+20)');
    if (knownEntityBoost > 0) reasons.push('Sanctions / Threat Intel List Direct Match (+30)');
    reasons.push(`${rule.name} trigger baseline (+${triggerWeight})`);
    if (confidenceWeight >= 15) reasons.push(`High model confidence ${params.confidence}% (+${confidenceWeight})`);
    if (amountLogScaled >= 14) reasons.push(`Significant fund exposure $${params.amountUsd.toLocaleString()} (+${amountLogScaled})`);

    const reasoning = reasons.join(' • ');

    const priorityBreakdown: PriorityScoreBreakdown = {
      triggerWeight,
      confidenceWeight,
      watchlistBoost,
      knownEntityBoost,
      amountLogScaled,
      recencyBoost,
      totalScore,
      reasoning,
    };

    return { priorityScore: totalScore, priorityBreakdown, severity };
  }

  // ----------------------------------------------------
  // INITIAL DEMO ALERTS GENERATOR (Truth & Integrity Verified)
  // ----------------------------------------------------

  private static getInitialAlerts(): IntelligenceAlert[] {
    const rawData = [
      {
        id: 'ALT-2026-9041',
        trigger: 'KNOWN_ENTITY_INTERACTION' as MonitoredEventType,
        triggerLabel: 'Sanctions List Direct Counterparty',
        walletAddress: '0x7A3c9e9b384f912c0192837461abcef0192891F2',
        txHash: '0xfa89b271c6d37651a029384bcdef9012384756cba098231456bcdaef90123456',
        amountCrypto: '10.00 ETH',
        amountUsd: 25400,
        chain: 'Ethereum' as BlockchainNetwork,
        confidence: 98,
        timestamp: '6 mins ago',
        rawTimestamp: Date.now() - 6 * 60 * 1000,
        explanation:
          'Suspect wallet interacted directly with flagged Uniswap Phishing Drainer contract cluster (OFAC / Chainabuse Match ID #CR-2026-891).',
        evidence: {
          facts: [
            'EVM Block #21,908,412 confirms 10.00 ETH ingress transfer.',
            'Target wallet tagged in 14 independent victim scam reports.',
            'Deterministic smart contract bytecode match with known phishing drainer.',
          ],
          knownEntityMatch: 'Phishing Drainer Cluster #CL-441 (Chainabuse Tagged)',
          isSanctionedMatch: true,
          counterpartyAddress: '0x38923a10984f912c0192837461abcef01924b19',
          counterpartyLabel: 'Victim Reporting Address',
          traceHops: 1,
        },
      },
      {
        id: 'ALT-2026-9040',
        trigger: 'RAPID_FUND_MOVEMENT' as MonitoredEventType,
        triggerLabel: 'High-Velocity Peel Dispersion',
        walletAddress: '0x10B4af092837461abcef0192837461abcef088EE',
        txHash: '0x77283910293847561a0b92837461abcef0192837461abcef0192837461abcef0',
        amountCrypto: '6.88 ETH',
        amountUsd: 17500,
        chain: 'Ethereum' as BlockchainNetwork,
        confidence: 94,
        timestamp: '18 mins ago',
        rawTimestamp: Date.now() - 18 * 60 * 1000,
        explanation:
          'High-Risk Aggregator C forwarded $17,500 across 3 intermediate split hops in under 42 minutes toward an exchange deposit endpoint.',
        evidence: {
          facts: [
            'Hop 3 transfer executed at 10:41 UTC.',
            'Peel retention ratio computed at 68.8% value preservation.',
            'Destination endpoint matches KYC-regulated Tier-1 Exchange deposit wallet.',
          ],
          traceHops: 3,
          timingAnalysis: '3 hops completed in 42 minutes (velocity > 4.2x baseline).',
          counterpartyAddress: '0x28C6c0984f912c0192837461abcef019288290',
          counterpartyLabel: 'Tier-1 Exchange Deposit Endpoint',
        },
      },
      {
        id: 'ALT-2026-9039',
        trigger: 'BRIDGE_ACTIVITY' as MonitoredEventType,
        triggerLabel: 'Arbitrum Bridge Liquidity Siphon',
        walletAddress: '0x88f01b92837461abcef0192837461abcef01cc10',
        txHash: '0x11223344556677889900aabbccddeeff0011223344556677889900aabbccddee',
        amountCrypto: '32.50 BNB',
        amountUsd: 18400,
        chain: 'BNB Chain' as BlockchainNetwork,
        destinationChain: 'Arbitrum' as BlockchainNetwork,
        confidence: 91,
        timestamp: '42 mins ago',
        rawTimestamp: Date.now() - 42 * 60 * 1000,
        explanation:
          'Stolen assets from Fake Yield Pool exploit bridged across BNB Chain to Arbitrum via Stargate Bridge contract to obscure attribution.',
        evidence: {
          facts: [
            'Bridge deposit transaction verified on BNB Chain block #41,209,114.',
            'Arbitrum receipt contract 0x1122...ff00 funded 4 minutes post-bridge.',
            'Linked to active Case #CT-2026-0183 ($84k total loss exposure).',
          ],
          knownEntityMatch: 'Stargate Cross-Chain Router Bridge',
          traceHops: 2,
          counterpartyAddress: '0x11223344556677889900aabbccddeeff00112233',
          counterpartyLabel: 'Arbitrum Bridge Receiver',
        },
      },
      {
        id: 'ALT-2026-9038',
        trigger: 'SUSPICIOUS_PATTERN' as MonitoredEventType,
        triggerLabel: 'Tornado Privacy Mixer Peeling',
        walletAddress: '0xd8dA6bf26964aF9D7eEd9e03E53415D37aA96045',
        txHash: '0x9928172635441a0b92837461abcef0192837461abcef0192837461abcef01928',
        amountCrypto: '2.71 ETH',
        amountUsd: 6900,
        chain: 'Ethereum' as BlockchainNetwork,
        confidence: 89,
        timestamp: '1 hour ago',
        rawTimestamp: Date.now() - 65 * 60 * 1000,
        explanation:
          'Secondary split sub-wallet routed 2.71 ETH into privacy mixing pool contract to break cryptographic transaction link.',
        evidence: {
          facts: [
            'Zero-knowledge anonymity pool deposit proof registered.',
            'Peel ratio: $6,900 split off from originating $25,400 fund flow.',
          ],
          knownEntityMatch: 'Tornado-Style Mixer / Peel Contract',
          isSanctionedMatch: true,
          traceHops: 3,
          counterpartyAddress: '0x44F011AA984f912c0192837461abcef019283746',
          counterpartyLabel: 'Intermediate Mule Sub-Wallet B',
        },
      },
      {
        id: 'ALT-2026-9037',
        trigger: 'DORMANT_ACTIVATION' as MonitoredEventType,
        triggerLabel: 'Dormant Mule Awakening (180+ Days)',
        walletAddress: '0x44F011AA984f912c0192837461abcef019283746',
        txHash: '0x110293847561a0b92837461abcef0192837461abcef0192837461abcef019283',
        amountCrypto: '2.84 ETH',
        amountUsd: 7200,
        chain: 'Ethereum' as BlockchainNetwork,
        confidence: 86,
        timestamp: '2 hours ago',
        rawTimestamp: Date.now() - 120 * 60 * 1000,
        explanation:
          'Wallet with zero transactions since February 2026 suddenly received and forwarded funds within 6 minutes of suspect drain.',
        evidence: {
          facts: [
            'Last recorded transaction: 184 days prior.',
            'Activated with 2.84 ETH incoming transfer from primary drainer.',
          ],
          baselineDeviation: 'Dormancy 184 days broken by burst velocity.',
          traceHops: 2,
          counterpartyAddress: '0x7A3c9e9b384f912c0192837461abcef0192891F2',
          counterpartyLabel: 'Suspect Drainer Ingress',
        },
      },
      {
        id: 'ALT-2026-9036',
        trigger: 'LARGE_TX' as MonitoredEventType,
        triggerLabel: 'High-Value Outlier Transfer',
        walletAddress: '0x3344ee092837461abcef0192837461abcef09901',
        txHash: '0x3344556677881a0b92837461abcef0192837461abcef0192837461abcef01928',
        amountCrypto: '50,000 MATIC',
        amountUsd: 28500,
        chain: 'Polygon' as BlockchainNetwork,
        confidence: 82,
        timestamp: '3 hours ago',
        rawTimestamp: Date.now() - 180 * 60 * 1000,
        explanation:
          'Polygon wallet linked to Telegram OTC Impersonation case transferred 50,000 MATIC in single burst transaction.',
        evidence: {
          facts: [
            'Polygon block #61,904,210 verified.',
            'Linked to Case #CT-2026-0182 ($12,500 initial reported loss).',
          ],
          traceHops: 1,
          counterpartyAddress: '0x9920aa984f912c0192837461abcef019284411',
          counterpartyLabel: 'Victim OTC Wallet',
        },
      },
    ];

    return rawData.map((item) => {
      const { priorityScore, priorityBreakdown, severity } = this.calculatePriorityScore({
        trigger: item.trigger,
        confidence: item.confidence,
        amountUsd: item.amountUsd,
        walletAddress: item.walletAddress,
        isSanctionedMatch: item.evidence.isSanctionedMatch,
        timestampMs: item.rawTimestamp,
        destinationChain: item.destinationChain,
      });

      const watchlistItem = WatchlistService.getWatchlistItemByTarget(item.walletAddress);

      return {
        ...item,
        severity,
        priorityScore,
        priorityBreakdown,
        isWatchlistLinked: !!watchlistItem,
        watchlistType: watchlistItem?.type,
        isHighPriority: !!watchlistItem?.isHighPriority,
        linkedCaseId: watchlistItem?.linkedCaseId,
        status: 'new' as AlertStatus,
        isSimulated: true, // Marked as simulated data according to trust safeguards
      };
    });
  }

  // ----------------------------------------------------
  // ALERT CRUD & STORAGE
  // ----------------------------------------------------

  public static getAlerts(): IntelligenceAlert[] {
    try {
      const stored = localStorage.getItem(ALERTS_STORAGE_KEY);
      if (!stored) {
        const initial = this.getInitialAlerts();
        this.saveAlerts(initial);
        return initial;
      }
      const alerts: IntelligenceAlert[] = JSON.parse(stored);
      // Re-sort dynamically by priority score descending
      return alerts.sort((a, b) => b.priorityScore - a.priorityScore);
    } catch (e) {
      console.warn('Failed to load alerts from storage, using defaults', e);
      return this.getInitialAlerts();
    }
  }

  private static saveAlerts(alerts: IntelligenceAlert[]): void {
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
      this.notifySubscribers();
    } catch (e) {
      console.error('Failed to save alerts to storage', e);
    }
  }

  public static getAlertById(id: string): IntelligenceAlert | undefined {
    return this.getAlerts().find((a) => a.id === id);
  }

  public static acknowledgeAlert(id: string): void {
    const alerts = this.getAlerts();
    const alert = alerts.find((a) => a.id === id);
    if (alert && alert.status === 'new') {
      alert.status = 'acknowledged';
      this.saveAlerts(alerts);
    }
  }

  public static dismissAlert(id: string): void {
    const alerts = this.getAlerts();
    const alert = alerts.find((a) => a.id === id);
    if (alert) {
      alert.status = 'dismissed';
      this.saveAlerts(alerts);
    }
  }

  public static promoteAlertToCase(id: string, caseId: string): void {
    const alerts = this.getAlerts();
    const alert = alerts.find((a) => a.id === id);
    if (alert) {
      alert.status = 'added_to_case';
      alert.linkedCaseId = caseId;
      alert.isWatchlistLinked = true;
      this.saveAlerts(alerts);
    }
  }

  public static addAlert(alert: IntelligenceAlert): void {
    const alerts = this.getAlerts();
    alerts.unshift(alert);
    // Keep max 50 alerts in history
    if (alerts.length > 50) alerts.pop();
    this.saveAlerts(alerts);
    WatchlistService.incrementAlertCount(alert.walletAddress);
  }

  public static getUnacknowledgedCount(): number {
    return this.getAlerts().filter((a) => a.status === 'new').length;
  }

  public static resetAlertsToDefaults(): IntelligenceAlert[] {
    const defaults = this.getInitialAlerts();
    this.saveAlerts(defaults);
    return defaults;
  }

  // ----------------------------------------------------
  // SIMULATED STREAM EMITTER (For Interactive Live Demos)
  // ----------------------------------------------------

  public static triggerSimulatedLiveEvent(): IntelligenceAlert {
    const sampleEvents: Array<{
      trigger: MonitoredEventType;
      triggerLabel: string;
      walletAddress: string;
      amountCrypto: string;
      amountUsd: number;
      chain: BlockchainNetwork;
      destinationChain?: BlockchainNetwork;
      confidence: number;
      explanation: string;
      evidence: AlertEvidence;
    }> = [
      {
        trigger: 'KNOWN_ENTITY_INTERACTION',
        triggerLabel: 'High-Risk Contract Interaction',
        walletAddress: '0x7A3c9e9b384f912c0192837461abcef0192891F2',
        amountCrypto: '4.50 ETH',
        amountUsd: 11430,
        chain: 'Ethereum',
        confidence: 96,
        explanation: 'Active suspect drainer dispatched 4.50 ETH to newly surfaced phishing proxy contract.',
        evidence: {
          facts: ['Real-time block stream match #21,908,499.'],
          knownEntityMatch: 'Phishing Relay Smart Contract (Chainabuse)',
          isSanctionedMatch: true,
          traceHops: 2,
        },
      },
      {
        trigger: 'SUDDEN_BALANCE_CHANGE',
        triggerLabel: 'Emergency Fund Sweep Outflow',
        walletAddress: '0x10B4af092837461abcef0192837461abcef088EE',
        amountCrypto: '14.20 ETH',
        amountUsd: 36068,
        chain: 'Ethereum',
        confidence: 92,
        explanation: 'Aggregator C balance swept by 94% within 1 block into unverified intermediate address.',
        evidence: {
          facts: ['Balance shifted from 15.10 ETH to 0.90 ETH in block #21,908,502.'],
          baselineDeviation: 'Single tx drained 94% of liquid balance.',
          traceHops: 1,
        },
      },
      {
        trigger: 'CROSS_CHAIN_MOVEMENT',
        triggerLabel: 'Polygon-to-Tron Cross-Chain Bridge',
        walletAddress: '0x3344ee092837461abcef0192837461abcef09901',
        amountCrypto: '22,000 USDT',
        amountUsd: 22000,
        chain: 'Polygon',
        destinationChain: 'Tron',
        confidence: 90,
        explanation: 'OTC Impersonator transferred 22,000 USDT across chains to escape EVM tracing.',
        evidence: {
          facts: ['USDT Bridge lock contract called on Polygon.'],
          knownEntityMatch: 'TronBridge Gateway Contract',
          traceHops: 2,
        },
      },
    ];

    const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
    const id = `ALT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const { priorityScore, priorityBreakdown, severity } = this.calculatePriorityScore({
      trigger: randomEvent.trigger,
      confidence: randomEvent.confidence,
      amountUsd: randomEvent.amountUsd,
      walletAddress: randomEvent.walletAddress,
      isSanctionedMatch: randomEvent.evidence.isSanctionedMatch,
      timestampMs: Date.now(),
      destinationChain: randomEvent.destinationChain,
    });

    const watchlistItem = WatchlistService.getWatchlistItemByTarget(randomEvent.walletAddress);

    const newAlert: IntelligenceAlert = {
      id,
      severity,
      timestamp: 'Just now',
      rawTimestamp: Date.now(),
      walletAddress: randomEvent.walletAddress,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      amountCrypto: randomEvent.amountCrypto,
      amountUsd: randomEvent.amountUsd,
      chain: randomEvent.chain,
      destinationChain: randomEvent.destinationChain,
      trigger: randomEvent.trigger,
      triggerLabel: randomEvent.triggerLabel,
      explanation: randomEvent.explanation,
      confidence: randomEvent.confidence,
      evidence: randomEvent.evidence,
      priorityScore,
      priorityBreakdown,
      isWatchlistLinked: !!watchlistItem,
      watchlistType: watchlistItem?.type,
      isHighPriority: !!watchlistItem?.isHighPriority,
      linkedCaseId: watchlistItem?.linkedCaseId,
      status: 'new',
      isSimulated: true,
    };

    this.addAlert(newAlert);
    return newAlert;
  }
}
