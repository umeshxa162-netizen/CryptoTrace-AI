import { GraphNode, GraphEdge, FundFlowStep } from '../types';

export interface ForensicTimelineStep {
  stepIndex: number;
  timeLabel: string;
  utcTime: string;
  blockNumber: number;
  activeEdgeIds: string[];
  activeNodeIds: string[];
  highlightNodeId: string;
  txHash: string;
  amountCrypto: string;
  amountUsd: number;
  cumulativeLossUsd: number;
  stageTitle: string;
  stageDescription: string;
  anomalyDetected?: {
    title: string;
    description: string;
    deviation: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  };
  crossChainBridge?: {
    sourceChain: string;
    destChain: string;
    bridgeName: string;
  };
}

export const forensicReplaySequence: ForensicTimelineStep[] = [
  {
    stepIndex: 0,
    timeLabel: '10:14 UTC',
    utcTime: '2026-08-27 10:14:02 UTC',
    blockNumber: 21908412,
    activeEdgeIds: ['e1'],
    activeNodeIds: ['node-victim', 'node-suspect'],
    highlightNodeId: 'node-suspect',
    txHash: '0xfa89b271c6d37651a029384bcdef9012384756cba098231456bcdaef90123456',
    amountCrypto: '10.00 ETH',
    amountUsd: 25400,
    cumulativeLossUsd: 25400,
    stageTitle: 'Stage 1: Victim Ingress Exploitation',
    stageDescription:
      'Victim wallet tricked by malicious Uniswap airdrop contract. 10.00 ETH swept directly into suspect ingress address.',
  },
  {
    stepIndex: 1,
    timeLabel: '10:22 UTC',
    utcTime: '2026-08-27 10:22:15 UTC',
    blockNumber: 21908436,
    activeEdgeIds: ['e1', 'e2', 'e3'],
    activeNodeIds: ['node-victim', 'node-suspect', 'node-wallet-a', 'node-wallet-b'],
    highlightNodeId: 'node-wallet-a',
    txHash: '0xcc89304192837461abcef0192837461abcef0192837461abcef0192837461abc',
    amountCrypto: '7.16 ETH & 2.84 ETH',
    amountUsd: 18200,
    cumulativeLossUsd: 25400,
    stageTitle: 'Stage 2: Rapid Splitter & Mule Dispersion',
    stageDescription:
      'Suspect initiates automated 2-way split within 8 minutes: 71.6% routed to Splitter A, 28.4% routed to Mule B.',
    anomalyDetected: {
      title: 'Automated Burst Velocity Spike',
      description: 'Sub-minute transaction dispatch matches known script pattern (>4.5x normal baseline).',
      deviation: '+4.5 Std Dev Velocity',
      severity: 'HIGH',
    },
  },
  {
    stepIndex: 2,
    timeLabel: '10:41 UTC',
    utcTime: '2026-08-27 10:41:09 UTC',
    blockNumber: 21908490,
    activeEdgeIds: ['e1', 'e2', 'e3', 'e4'],
    activeNodeIds: ['node-victim', 'node-suspect', 'node-wallet-a', 'node-wallet-b', 'node-wallet-c'],
    highlightNodeId: 'node-wallet-c',
    txHash: '0x77283910293847561a0b92837461abcef0192837461abcef0192837461abcef0',
    amountCrypto: '6.88 ETH',
    amountUsd: 17500,
    cumulativeLossUsd: 25400,
    stageTitle: 'Stage 3: High-Risk Aggregator Funneling',
    stageDescription:
      'Splitter A forwards $17,500 into High-Risk Aggregator C (96% cluster taint), consolidating illicit funds.',
  },
  {
    stepIndex: 3,
    timeLabel: '10:55 UTC',
    utcTime: '2026-08-27 10:55:22 UTC',
    blockNumber: 21908535,
    activeEdgeIds: ['e1', 'e2', 'e3', 'e4', 'e5'],
    activeNodeIds: ['node-victim', 'node-suspect', 'node-wallet-a', 'node-wallet-b', 'node-wallet-c', 'node-mixer'],
    highlightNodeId: 'node-mixer',
    txHash: '0x9928172635441a0b92837461abcef0192837461abcef0192837461abcef01928',
    amountCrypto: '2.71 ETH',
    amountUsd: 6900,
    cumulativeLossUsd: 25400,
    stageTitle: 'Stage 4: Mixer Anonymity Evasion',
    stageDescription:
      'Secondary split routes $6,900 into privacy mixer pool to sever attribution trail.',
    anomalyDetected: {
      title: 'Tornado-Style Privacy Mixer Pool Evasion',
      description: 'Zero-knowledge anonymity pool interaction detected on secondary peel path.',
      deviation: 'High-Risk Sanctioned Mixer',
      severity: 'CRITICAL',
    },
  },
  {
    stepIndex: 4,
    timeLabel: '11:15 UTC',
    utcTime: '2026-08-27 11:15:30 UTC',
    blockNumber: 21908610,
    activeEdgeIds: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'],
    activeNodeIds: ['node-victim', 'node-suspect', 'node-wallet-a', 'node-wallet-b', 'node-wallet-c', 'node-mixer', 'node-exchange'],
    highlightNodeId: 'node-exchange',
    txHash: '0x3344556677881a0b92837461abcef0192837461abcef0192837461abcef01928',
    amountCrypto: '6.61 ETH',
    amountUsd: 16800,
    cumulativeLossUsd: 25400,
    stageTitle: 'Stage 5: Tier-1 Exchange Off-Ramp Endpoint',
    stageDescription:
      'Aggregator C completes final liquidation deposit into Tier-1 regulated KYC exchange. Immediate freeze recommended.',
  },
];
