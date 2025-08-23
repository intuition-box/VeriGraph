import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useWeb3 } from '@/hooks/useWeb3';
import { SUPPORTED_NETWORKS, INTUITION_TESTNET } from '@/lib/web3';
import { Network, ExternalLink } from 'lucide-react';

interface NetworkSwitcherProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NetworkSwitcher({ open, onOpenChange }: NetworkSwitcherProps) {
  const { walletState, switchNetwork, switchToIntuitionTestnet } = useWeb3();

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      if (chainId === INTUITION_TESTNET.chainId) {
        await switchToIntuitionTestnet();
      } else {
        await switchNetwork(chainId);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="network-modal">
        <DialogHeader>
          <DialogTitle className="text-center">Switch Network</DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto">
            <Network className="w-8 h-8 text-cyan-600" />
          </div>
          
          <p className="text-gray-600">
            Select the network you want to connect to
          </p>
          
          <div className="space-y-3">
            {SUPPORTED_NETWORKS.map((network) => {
              const isCurrentNetwork = walletState.chainId === network.chainId;
              const isIntuitionTestnet = network.chainId === INTUITION_TESTNET.chainId;
              
              return (
                <Button
                  key={network.chainId}
                  className={`w-full justify-between p-4 h-auto ${
                    isCurrentNetwork 
                      ? 'border-2 border-cyan-500 bg-cyan-50 hover:bg-cyan-50' 
                      : 'border border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                  variant="outline"
                  onClick={() => !isCurrentNetwork && handleNetworkSwitch(network.chainId)}
                  disabled={isCurrentNetwork}
                  data-testid={`network-${network.chainId}`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        isCurrentNetwork ? 'bg-cyan-500' : 'bg-gray-400'
                      }`} 
                    />
                    <span className={`font-medium ${
                      isCurrentNetwork ? 'text-cyan-700' : 'text-gray-900'
                    }`}>
                      {network.name}
                    </span>
                    {isIntuitionTestnet && (
                      <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 border-cyan-200">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  {isCurrentNetwork ? (
                    <Badge variant="secondary" className="text-cyan-700 bg-cyan-100">
                      Connected
                    </Badge>
                  ) : (
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              );
            })}
          </div>
          
          <div className="text-xs text-gray-500 pt-4 border-t">
            <p>
              Switching networks will reload the interface to ensure proper functionality
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
