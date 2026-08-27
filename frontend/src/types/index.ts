export type ThemeMode = 'dark' | 'light';

export type OmnibarMode = 'trace' | 'forensics' | 'intelligence' | 'copilot' | 'evidence';

export type BlockchainNetwork =
  | 'Ethereum'
  | 'Bitcoin'
  | 'BNB Chain'
  | 'Polygon'
  | 'Arbitrum'
  | 'Solana'
  | 'Tron';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';

export type EvidenceProvenance = 'OBSERVED' | 'REPORTED' | 'INFERRED' | 'AI SUMMARY';

export interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
  previewUrl?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  address: string;
  type: 'victim' | 'suspect' | 'intermediate' | 'high_risk' | 'exchange' | 'service' | 'mixer';
  riskScore: number;
  balance: string;
  entityName?: string;
  isFlagged?: boolean;
  hop: number;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  amountUsd: number;
  amountCrypto: string;
  txHash: string;
  timestamp: string;
  isCriticalPath?: boolean;
}

export interface RiskFactor {
  name: string;
  weight: number;
  score: number;
  description: string;
  provenance: EvidenceProvenance;
  evidenceRef: string;
}

export interface RiskScoreData {
  score: number;
  level: RiskLevel;
  confidence: number;
  summary: string;
  factors: RiskFactor[];
}

export interface FundFlowStep {
  stepIndex: number;
  entity: string;
  entityType: 'victim' | 'suspect' | 'intermediate' | 'exchange' | 'mixer';
  address: string;
  amount: string;
  amountUsd: string;
  percentageRetained: number;
  txHash: string;
  timestamp: string;
  status: 'confirmed' | 'suspected' | 'flagged';
}

export interface EvidenceItem {
  id: string;
  type: 'FACT' | 'REPORT' | 'INFERENCE' | 'AI_SUMMARY';
  title: string;
  description: string;
  source: string;
  timestamp: string;
  txHash?: string;
  confidence: number;
  verified: boolean;
}

export interface InvestigationPriorityLead {
  rank: number;
  target: string;
  address: string;
  severity: RiskLevel;
  fundExposureUsd: number;
  reason: string;
  recommendedAction: string;
}

export interface CaseFile {
  id: string;
  title: string;
  victimAddress: string;
  suspectAddress: string;
  chain: BlockchainNetwork;
  totalLossUsd: number;
  currentRisk: RiskLevel;
  status: 'ACTIVE_INVESTIGATION' | 'SUBMITTED' | 'TRIAGED' | 'REPORT_GENERATED';
  reportedAt: string;
  lastActivity: string;
  assignedOfficer?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: OmnibarMode;
  isThinking?: boolean;
  thoughtProcess?: string[];
  attachments?: AttachedFile[];
  codeSnippet?: {
    language: string;
    code: string;
  };
  evidenceChain?: EvidenceItem[];
  suggestedFollowups?: string[];
}

export interface IntegrationSource {
  id: string;
  name: string;
  description: string;
  category: 'Blockchain Indexer' | 'Threat Intel' | 'Enterprise SIEM' | 'Law Enforcement';
  icon: string;
  connected: boolean;
  actionLabel: string;
  sampleAction: string;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  badge: string;
  speed: string;
  context: string;
  description: string;
}

export interface IntakeFormData {
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
  reporterRole: 'Victim' | 'Law Enforcement Officer' | 'Legal Representative' | 'Compliance Analyst';
  suspectAddress: string;
  blockchain: BlockchainNetwork;
  lossAmountUsd: string;
  incidentDate: string;
  incidentDescription: string;
  urgency: 'STANDARD' | 'PRIORITY' | 'CRITICAL';
  attachments: AttachedFile[];
}

// ----------------------------------------------------
// WATCHLIST & ALERT INTELLIGENCE TYPES
// ----------------------------------------------------

export type WatchlistType = 'Wallet' | 'Transaction' | 'Entity' | 'Case';

export interface WatchlistItem {
  id: string;
  type: WatchlistType;
  target: string; // Address, txHash, entity identifier, or case ID
  label: string;
  chain: BlockchainNetwork;
  isCaseLinked: boolean;
  linkedCaseId?: string;
  isHighPriority: boolean;
  addedAt: string;
  notes?: string;
  alertCount: number;
  lastActive?: string;
  tags?: string[];
}

export type MonitoredEventType =
  | 'LARGE_TX'
  | 'SUDDEN_BALANCE_CHANGE'
  | 'RAPID_FUND_MOVEMENT'
  | 'NEW_COUNTERPARTY'
  | 'DORMANT_ACTIVATION'
  | 'SUSPICIOUS_PATTERN'
  | 'ANOMALY_DETECTION'
  | 'BRIDGE_ACTIVITY'
  | 'CROSS_CHAIN_MOVEMENT'
  | 'KNOWN_ENTITY_INTERACTION';

export interface EventRuleConfig {
  id: MonitoredEventType;
  name: string;
  description: string;
  enabled: boolean;
  baseSeverity: RiskLevel;
  severityWeight: number; // 1 to 30
  thresholdValue?: number; // e.g. amount USD, hours, hop count
  thresholdUnit?: string;
}

export interface AlertEvidence {
  facts: string[];
  baselineDeviation?: string;
  traceHops?: number;
  knownEntityMatch?: string;
  timingAnalysis?: string;
  counterpartyAddress?: string;
  counterpartyLabel?: string;
  isSanctionedMatch?: boolean;
}

export interface PriorityScoreBreakdown {
  triggerWeight: number;       // Inherent event severity weight (0-30)
  confidenceWeight: number;    // Model/rule confidence component (0-20)
  watchlistBoost: number;      // High priority (+20) and/or Case-linked (+25) (0-45)
  knownEntityBoost: number;    // Direct sanctions/blacklist match (+30)
  amountLogScaled: number;     // Log-scaled, capped value contribution (0-20)
  recencyBoost: number;        // Freshness boost (0-10)
  totalScore: number;          // Clamped 0-100 composite priority score
  reasoning: string;           // Clear plain-language explanation of rank
}

export type AlertStatus = 'new' | 'acknowledged' | 'dismissed' | 'added_to_case';

export interface IntelligenceAlert {
  id: string;
  severity: RiskLevel;
  timestamp: string;
  rawTimestamp: number;
  walletAddress: string;
  txHash: string;
  amountCrypto: string;
  amountUsd: number;
  chain: BlockchainNetwork;
  destinationChain?: BlockchainNetwork;
  trigger: MonitoredEventType;
  triggerLabel: string;
  explanation: string;
  confidence: number;
  evidence: AlertEvidence;
  priorityScore: number;
  priorityBreakdown: PriorityScoreBreakdown;
  isWatchlistLinked: boolean;
  watchlistType?: WatchlistType;
  isHighPriority: boolean;
  linkedCaseId?: string;
  status: AlertStatus;
  isSimulated: boolean; // Trust safeguard: clearly distinguishes simulated vs real RPC
}

