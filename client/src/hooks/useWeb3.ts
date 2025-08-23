import { useState, useEffect, useCallback } from 'react';
import { WalletState } from '@/types/web3';
import { web3Service, INTUITION_TESTNET } from '@/lib/web3';
import { contractService } from '@/lib/contracts';
import { useToast } from '@/hooks/use-toast';

export function useWeb3() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    trustBalance: null,
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const updateWalletState = useCallback(async (address: string, chainId: number) => {
    try {
      const balance = await web3Service.getBalance(address);
      
      setWalletState({
        isConnected: true,
        address,
        chainId,
        balance,
        trustBalance: '0', // TODO: Implement TRUST token balance fetching
      });

      // Initialize contract service with the signer
      const signer = web3Service.getSigner();
      contractService.initialize(signer);
    } catch (error) {
      console.error('Failed to update wallet state:', error);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      const { address, chainId } = await web3Service.connectWallet();
      await updateWalletState(address, chainId);
      
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, updateWalletState, toast]);

  const switchToIntuitionTestnet = useCallback(async () => {
    try {
      await web3Service.switchNetwork(INTUITION_TESTNET.chainId);
      
      if (walletState.address) {
        await updateWalletState(walletState.address, INTUITION_TESTNET.chainId);
      }
      
      toast({
        title: "Network Switched",
        description: "Successfully switched to Intuition Testnet",
      });
    } catch (error: any) {
      console.error('Failed to switch network:', error);
      toast({
        title: "Network Switch Failed",
        description: error.message || "Failed to switch to Intuition Testnet",
        variant: "destructive",
      });
    }
  }, [walletState.address, updateWalletState, toast]);

  const switchNetwork = useCallback(async (chainId: number) => {
    try {
      await web3Service.switchNetwork(chainId);
      
      if (walletState.address) {
        await updateWalletState(walletState.address, chainId);
      }
      
      toast({
        title: "Network Switched",
        description: "Successfully switched network",
      });
    } catch (error: any) {
      console.error('Failed to switch network:', error);
      toast({
        title: "Network Switch Failed",
        description: error.message || "Failed to switch network",
        variant: "destructive",
      });
    }
  }, [walletState.address, updateWalletState, toast]);

  const disconnect = useCallback(async () => {
    await web3Service.disconnect();
    contractService.removeEventListeners();
    
    setWalletState({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
      trustBalance: null,
    });
    
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from wallet",
    });
  }, [toast]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        try {
          const provider = web3Service.getProvider();
          if (provider) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();
            
            await updateWalletState(address, Number(network.chainId));
          }
        } catch (error) {
          console.error('Failed to restore connection:', error);
        }
      }
    };

    checkConnection();
  }, [updateWalletState]);

  // Listen for account/network changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== walletState.address) {
          connectWallet();
        }
      };

      const handleChainChanged = (chainId: string) => {
        const newChainId = parseInt(chainId, 16);
        if (walletState.address) {
          updateWalletState(walletState.address, newChainId);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [walletState.address, connectWallet, disconnect, updateWalletState]);

  return {
    walletState,
    isConnecting,
    connectWallet,
    switchToIntuitionTestnet,
    switchNetwork,
    disconnect,
    isIntuitionTestnet: walletState.chainId === INTUITION_TESTNET.chainId,
  };
}
