import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useIntuitionContracts } from '@/hooks/useIntuitionContracts';
import { useWeb3 } from '@/hooks/useWeb3';
import { Coins, Loader2, AlertTriangle } from 'lucide-react';

const stakingSchema = z.object({
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Amount must be a positive number')
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 0.001;
    }, 'Minimum stake amount is 0.001 ETH'),
});

type StakingForm = z.infer<typeof stakingSchema>;

interface StakingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  atomId: string | null;
  atomName?: string;
}

export default function StakingModal({ open, onOpenChange, atomId, atomName }: StakingModalProps) {
  const [isStaking, setIsStaking] = React.useState(false);
  const { stakeOnAtom } = useIntuitionContracts();
  const { walletState } = useWeb3();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<StakingForm>({
    resolver: zodResolver(stakingSchema),
    defaultValues: {
      amount: '',
    },
  });

  const watchedAmount = watch('amount');
  const numericAmount = parseFloat(watchedAmount || '0');
  const userBalance = parseFloat(walletState.balance || '0');
  const hasInsufficientBalance = numericAmount > userBalance;

  const onSubmit = async (data: StakingForm) => {
    if (!atomId) return;
    
    setIsStaking(true);
    try {
      await stakeOnAtom(parseInt(atomId), data.amount);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to stake:', error);
    } finally {
      setIsStaking(false);
    }
  };

  const setMaxAmount = () => {
    // Reserve some ETH for gas fees
    const maxAmount = Math.max(0, userBalance - 0.01);
    if (maxAmount > 0) {
      reset({ amount: maxAmount.toString() });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="staking-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Coins className="w-5 h-5 text-green-600 mr-2" />
            Stake on Atom
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Staking on:</span>
                <span className="font-medium text-gray-900" data-testid="staking-atom-name">
                  {atomName || `Atom #${atomId}`}
                </span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="amount">Stake Amount (ETH) *</Label>
              <div className="mt-1 relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.001"
                  min="0.001"
                  {...register('amount')}
                  placeholder="0.001"
                  className={errors.amount || hasInsufficientBalance ? 'border-red-500' : ''}
                  data-testid="stake-amount-input"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs"
                  onClick={setMaxAmount}
                  data-testid="max-button"
                >
                  MAX
                </Button>
              </div>
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1" data-testid="amount-error">
                  {errors.amount.message}
                </p>
              )}
              {hasInsufficientBalance && !errors.amount && (
                <p className="text-sm text-red-500 mt-1" data-testid="insufficient-balance-error">
                  Insufficient balance. Available: {userBalance.toFixed(4)} ETH
                </p>
              )}
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Available Balance:</span>
                <span className="font-mono" data-testid="available-balance">
                  {userBalance.toFixed(4)} ETH
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Gas:</span>
                <span className="font-mono">~0.005 ETH</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Coins className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-900 mb-1">Staking Benefits</p>
                <p className="text-green-700">
                  By staking on this atom, you're supporting its credibility and may earn rewards 
                  from future interactions with this data.
                </p>
              </div>
            </div>
          </div>
          
          {hasInsufficientBalance && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-900 mb-1">Insufficient Balance</p>
                  <p className="text-red-700">
                    You don't have enough ETH to complete this transaction. Please reduce the amount or add more ETH to your wallet.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isStaking}
              data-testid="cancel-staking-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isStaking || hasInsufficientBalance}
              className="flex-1 bg-green-600 hover:bg-green-700"
              data-testid="stake-submit-button"
            >
              {isStaking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Staking...
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4 mr-2" />
                  Stake ETH
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
