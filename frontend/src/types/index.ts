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
