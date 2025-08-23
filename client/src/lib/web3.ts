import { ethers } from 'ethers';
import { NetworkConfig } from '@/types/web3';

export const INTUITION_TESTNET: NetworkConfig = {
  chainId: 1337, // Replace with actual Intuition testnet chain ID
  name: 'Intuition Testnet',
  rpcUrl: 'https://intuition-testnet.caldera.xyz', // Replace with actual RPC URL
  blockExplorerUrl: 'https://intuition-testnet.explorer.caldera.xyz',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
};

export const SUPPORTED_NETWORKS: NetworkConfig[] = [
  INTUITION_TESTNET,
  {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorerUrl: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
];

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  async connectWallet(): Promise<{
    address: string;
    chainId: number;
  }> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      
      this.provider = provider;
      this.signer = signer;

      return {
        address,
        chainId: Number(network.chainId),
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async switchNetwork(chainId: number): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const network = SUPPORTED_NETWORKS.find(n => n.chainId === chainId);
    if (!network) {
      throw new Error('Unsupported network');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // Network not added to MetaMask
      if (error.code === 4902) {
        await this.addNetwork(network);
      } else {
        throw error;
      }
    }
  }

  private async addNetwork(network: NetworkConfig): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${network.chainId.toString(16)}`,
        chainName: network.name,
        rpcUrls: [network.rpcUrl],
        blockExplorerUrls: [network.blockExplorerUrl],
        nativeCurrency: network.nativeCurrency,
      }],
    });
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async getTransactionReceipt(hash: string) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    return await this.provider.getTransactionReceipt(hash);
  }

  getSigner(): ethers.Signer {
    if (!this.signer) {
      throw new Error('Signer not initialized');
    }
    return this.signer;
  }

  getProvider(): ethers.BrowserProvider {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    return this.provider;
  }

  isConnected(): boolean {
    return this.provider !== null && this.signer !== null;
  }

  async disconnect(): Promise<void> {
    this.provider = null;
    this.signer = null;
  }
}

export const web3Service = new Web3Service();

declare global {
  interface Window {
    ethereum?: any;
  }
}
