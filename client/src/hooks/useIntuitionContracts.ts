import { useCallback } from 'react';
import { contractService } from '@/lib/contracts';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function useIntuitionContracts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createAtom = useCallback(async (name: string, description: string) => {
    try {
      toast({
        title: "Creating Atom",
        description: "Transaction submitted, waiting for confirmation...",
      });

      const tx = await contractService.createAtom(name, description);
      
      // Store transaction in backend
      await apiRequest('POST', '/api/transactions', {
        hash: tx.hash,
        type: 'create_atom',
        from: await tx.from,
        to: tx.to,
        value: tx.value?.toString() || '0',
        status: 'pending',
      });

      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        // Update transaction status
        await apiRequest('PUT', `/api/transactions/${tx.hash}`, {
          status: 'confirmed',
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed?.toString(),
        });

        // Extract atom ID from logs if possible
        const atomId = receipt.logs?.[0]?.topics?.[1]; // Simplified extraction
        
        if (atomId) {
          // Store atom in backend
          await apiRequest('POST', '/api/atoms', {
            chainId: receipt.chainId || 1337,
            atomId: atomId,
            name,
            description,
            creator: await tx.from,
          });
        }

        toast({
          title: "Atom Created",
          description: "Your atom has been created successfully!",
        });

        // Invalidate queries to refresh UI
        queryClient.invalidateQueries({ queryKey: ['/api/atoms'] });
        queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
        
        return receipt;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error: any) {
      console.error('Failed to create atom:', error);
      
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to create atom",
        variant: "destructive",
      });
      
      throw error;
    }
  }, [toast, queryClient]);

  const stakeOnAtom = useCallback(async (atomId: number, amount: string) => {
    try {
      toast({
        title: "Staking",
        description: "Transaction submitted, waiting for confirmation...",
      });

      const tx = await contractService.stakeOnAtom(atomId, amount);
      
      // Store transaction in backend
      await apiRequest('POST', '/api/transactions', {
        hash: tx.hash,
        type: 'stake',
        from: await tx.from,
        to: tx.to,
        value: tx.value?.toString() || '0',
        status: 'pending',
        atomId: atomId.toString(),
      });

      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        // Update transaction status
        await apiRequest('PUT', `/api/transactions/${tx.hash}`, {
          status: 'confirmed',
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed?.toString(),
        });

        // Store staking position
        await apiRequest('POST', '/api/staking-positions', {
          userAddress: await tx.from,
          atomId: atomId.toString(),
          amount: amount,
        });

        toast({
          title: "Staking Successful",
          description: `Successfully staked ${amount} ETH on atom #${atomId}`,
        });

        // Invalidate queries to refresh UI
        queryClient.invalidateQueries({ queryKey: ['/api/atoms'] });
        queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
        queryClient.invalidateQueries({ queryKey: ['/api/staking-positions'] });
        
        return receipt;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error: any) {
      console.error('Failed to stake:', error);
      
      toast({
        title: "Staking Failed", 
        description: error.message || "Failed to stake on atom",
        variant: "destructive",
      });
      
      throw error;
    }
  }, [toast, queryClient]);

  const getAtom = useCallback(async (atomId: number) => {
    try {
      return await contractService.getAtom(atomId);
    } catch (error: any) {
      console.error('Failed to get atom:', error);
      throw error;
    }
  }, []);

  const getAtomCount = useCallback(async () => {
    try {
      return await contractService.getAtomCount();
    } catch (error: any) {
      console.error('Failed to get atom count:', error);
      throw error;
    }
  }, []);

  const getUserStake = useCallback(async (atomId: number, userAddress: string) => {
    try {
      return await contractService.getUserStake(atomId, userAddress);
    } catch (error: any) {
      console.error('Failed to get user stake:', error);
      throw error;
    }
  }, []);

  return {
    createAtom,
    stakeOnAtom,
    getAtom,
    getAtomCount,
    getUserStake,
  };
}
