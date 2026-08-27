import { WatchlistItem, WatchlistType, BlockchainNetwork } from '../types';

const STORAGE_KEY = 'cryptotrace_watchlist_v1';

const defaultWatchlist: WatchlistItem[] = [
  {
    id: 'wl-001',
    type: 'Wallet',
    target: '0x7A3c9e9b384f912c0192837461abcef0192891F2',
    label: 'Primary Phishing Drainer Ingress',
    chain: 'Ethereum',
    isCaseLinked: true,
    linkedCaseId: 'CT-2026-0184',
    isHighPriority: true,
    addedAt: '2026-08-26 14:30 UTC',
    notes: 'Originating wallet for Uniswap clone phishing drainer scam ($25,400 loss).',
    alertCount: 4,
    lastActive: '12 mins ago',
    tags: ['Drainer', 'Phishing', 'Sanctions-Flagged'],
  },
  {
    id: 'wl-002',
    type: 'Entity',
    target: '0x10B4af092837461abcef0192837461abcef088EE',
    label: 'High-Risk Aggregator Cluster C',
    chain: 'Ethereum',
    isCaseLinked: true,
    linkedCaseId: 'CT-2026-0184',
    isHighPriority: true,
    addedAt: '2026-08-26 16:15 UTC',
    notes: 'Central aggregation node receiving multi-hop split funds before exchange off-ramp.',
    alertCount: 3,
    lastActive: '25 mins ago',
    tags: ['Aggregator', 'Layering', 'High-Risk'],
  },
  {
    id: 'wl-003',
    type: 'Wallet',
    target: '0xd8dA6bf26964aF9D7eEd9e03E53415D37aA96045',
    label: 'Tornado-Style Mixer / Peel Contract',
    chain: 'Ethereum',
    isCaseLinked: false,
    isHighPriority: true,
    addedAt: '2026-08-25 09:00 UTC',
    notes: 'Anonymity pool receiving automated peel transactions to sever provenance trail.',
    alertCount: 6,
    lastActive: '1 hour ago',
    tags: ['Mixer', 'Obfuscation', 'AML-Trigger'],
  },
  {
    id: 'wl-004',
    type: 'Case',
    target: 'CT-2026-0183',
    label: 'Fake Yield Pool Exploit ($84k)',
    chain: 'BNB Chain',
    isCaseLinked: true,
    linkedCaseId: 'CT-2026-0183',
    isHighPriority: false,
    addedAt: '2026-08-27 08:30 UTC',
    notes: 'Smart contract liquidity siphon across BNB Chain and Arbitrum bridge.',
    alertCount: 2,
    lastActive: '42 mins ago',
    tags: ['DeFi', 'Exploit', 'Cross-Chain'],
  },
];

export class WatchlistService {
  private static getStoredItems(): WatchlistItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWatchlist));
        return defaultWatchlist;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to read watchlist from storage, using defaults', e);
      return defaultWatchlist;
    }
  }

  private static saveItems(items: WatchlistItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save watchlist to storage', e);
    }
  }

  public static getWatchlist(): WatchlistItem[] {
    return this.getStoredItems();
  }

  public static addWatchlistItem(
    item: Omit<WatchlistItem, 'id' | 'addedAt' | 'alertCount' | 'lastActive'>
  ): WatchlistItem {
    const items = this.getStoredItems();
    const newItem: WatchlistItem = {
      ...item,
      id: `wl-${Date.now().toString(36).slice(-5)}`,
      addedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
      alertCount: 0,
      lastActive: 'Just now',
    };
    items.unshift(newItem);
    this.saveItems(items);
    return newItem;
  }

  public static removeWatchlistItem(id: string): void {
    const items = this.getStoredItems().filter((i) => i.id !== id);
    this.saveItems(items);
  }

  public static updateWatchlistItem(
    id: string,
    updates: Partial<WatchlistItem>
  ): WatchlistItem | null {
    const items = this.getStoredItems();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    this.saveItems(items);
    return items[index];
  }

  public static isTargetWatchlisted(target: string): boolean {
    if (!target) return false;
    const cleanTarget = target.toLowerCase().trim();
    return this.getStoredItems().some(
      (item) => item.target.toLowerCase().trim() === cleanTarget
    );
  }

  public static getWatchlistItemByTarget(
    target: string
  ): WatchlistItem | undefined {
    if (!target) return undefined;
    const cleanTarget = target.toLowerCase().trim();
    return this.getStoredItems().find(
      (item) =>
        item.target.toLowerCase().trim() === cleanTarget ||
        (item.linkedCaseId && item.linkedCaseId.toLowerCase() === cleanTarget)
    );
  }

  public static incrementAlertCount(target: string): void {
    const items = this.getStoredItems();
    const cleanTarget = target.toLowerCase().trim();
    const item = items.find(
      (i) => i.target.toLowerCase().trim() === cleanTarget
    );
    if (item) {
      item.alertCount += 1;
      item.lastActive = 'Just now';
      this.saveItems(items);
    }
  }

  public static resetToDefaults(): WatchlistItem[] {
    this.saveItems(defaultWatchlist);
    return defaultWatchlist;
  }
}
