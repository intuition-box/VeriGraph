import { ethers } from 'ethers';
import { ContractConfig } from '@/types/web3';

// Contract ABIs (simplified for demo - in production these would be imported from artifacts)
export const ETHMULTIVAULT_ABI = [
  "function createAtom(string memory name, string memory data) external payable returns (uint256)",
  "function stake(uint256 atomId) external payable",
  "function getAtom(uint256 atomId) external view returns (tuple(string name, string data, address creator, uint256 totalStake, uint256 stakeholderCount))",
  "function getAtomCount() external view returns (uint256)",
  "function getUserStake(uint256 atomId, address user) external view returns (uint256)",
  "event AtomCreated(uint256 indexed atomId, string name, address indexed creator)",
  "event Staked(uint256 indexed atomId, address indexed staker, uint256 amount)"
];

export const ATOMWALLET_ABI = [
  "function getOwner() external view returns (address)",
  "function execute(address to, uint256 value, bytes calldata data) external",
  "function getBalance() external view returns (uint256)",
  "event Executed(address indexed to, uint256 value, bytes data)"
];

export const CONTRACT_ADDRESSES = {
  // These would be the actual deployed contract addresses on Intuition testnet
  ETHMULTIVAULT: '0x1234567890123456789012345678901234567890',
  ATOMWALLET_BEACON: '0x0987654321098765432109876543210987654321',
};

export class ContractService {
  private ethMultiVault: ethers.Contract | null = null;
  private atomWallet: ethers.Contract | null = null;

  initialize(signer: ethers.Signer) {
    this.ethMultiVault = new ethers.Contract(
      CONTRACT_ADDRESSES.ETHMULTIVAULT,
      ETHMULTIVAULT_ABI,
      signer
    );

    this.atomWallet = new ethers.Contract(
      CONTRACT_ADDRESSES.ATOMWALLET_BEACON,
      ATOMWALLET_ABI,
      signer
    );
  }

  async createAtom(name: string, description: string): Promise<ethers.ContractTransactionResponse> {
    if (!this.ethMultiVault) {
      throw new Error('EthMultiVault contract not initialized');
    }

    const createFee = ethers.parseEther('0.0003'); // 0.0003 ETH as mentioned in the docs
    return await this.ethMultiVault.createAtom(name, description, {
      value: createFee
    });
  }

  async stakeOnAtom(atomId: number, amount: string): Promise<ethers.ContractTransactionResponse> {
    if (!this.ethMultiVault) {
      throw new Error('EthMultiVault contract not initialized');
    }

    const stakeAmount = ethers.parseEther(amount);
    return await this.ethMultiVault.stake(atomId, {
      value: stakeAmount
    });
  }

  async getAtom(atomId: number) {
    if (!this.ethMultiVault) {
      throw new Error('EthMultiVault contract not initialized');
    }

    return await this.ethMultiVault.getAtom(atomId);
  }

  async getAtomCount(): Promise<number> {
    if (!this.ethMultiVault) {
      throw new Error('EthMultiVault contract not initialized');
    }

    const count = await this.ethMultiVault.getAtomCount();
    return Number(count);
  }

  async getUserStake(atomId: number, userAddress: string): Promise<string> {
    if (!this.ethMultiVault) {
      throw new Error('EthMultiVault contract not initialized');
    }

    const stake = await this.ethMultiVault.getUserStake(atomId, userAddress);
    return ethers.formatEther(stake);
  }

  getEthMultiVault(): ethers.Contract {
    if (!this.ethMultiVault) {
      throw new Error('EthMultiVault contract not initialized');
    }
    return this.ethMultiVault;
  }

  getAtomWallet(): ethers.Contract {
    if (!this.atomWallet) {
      throw new Error('AtomWallet contract not initialized');
    }
    return this.atomWallet;
  }

  setupEventListeners(onAtomCreated: (event: any) => void, onStaked: (event: any) => void) {
    if (!this.ethMultiVault) {
      throw new Error('EthMultiVault contract not initialized');
    }

    this.ethMultiVault.on('AtomCreated', onAtomCreated);
    this.ethMultiVault.on('Staked', onStaked);
  }

  removeEventListeners() {
    if (this.ethMultiVault) {
      this.ethMultiVault.removeAllListeners();
    }
    if (this.atomWallet) {
      this.atomWallet.removeAllListeners();
    }
  }
}

export const contractService = new ContractService();
