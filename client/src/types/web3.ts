export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  trustBalance: string | null;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface ContractConfig {
  address: string;
  abi: any[];
}

export interface AtomData {
  id: string;
  name: string;
  description?: string;
  creator: string;
  uri?: string;
  totalStake: string;
  stakeholderCount: number;
  createdAt: Date;
}

export interface TransactionData {
  hash: string;
  type: string;
  from: string;
  to?: string;
  value?: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  atomId?: string;
}

export interface ContractEventData {
  contractAddress: string;
  eventName: string;
  blockNumber: number;
  transactionHash: string;
  eventData: any;
  timestamp: Date;
}
