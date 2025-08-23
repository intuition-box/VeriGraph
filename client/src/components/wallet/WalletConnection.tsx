import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWeb3 } from '@/hooks/useWeb3';
import { Wallet, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectionProps {
  onNetworkSwitch?: () => void;
}

export default function WalletConnection({ onNetworkSwitch }: WalletConnectionProps) {
  const { walletState, isConnecting, connectWallet, isIntuitionTestnet } = useWeb3();
  const [showModal, setShowModal] = React.useState(false);
  const { toast } = useToast();

  const copyAddress = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (walletState.isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" data-testid="connection-indicator"></div>
            <span className="text-sm font-medium text-green-700" data-testid="wallet-address">
              {truncateAddress(walletState.address!)}
            </span>
            <Copy 
              className="w-4 h-4 text-green-500 cursor-pointer hover:opacity-70" 
              onClick={copyAddress}
              data-testid="copy-address"
            />
          </div>
        </div>
        
        <Badge 
          variant={isIntuitionTestnet ? "default" : "secondary"}
          className={isIntuitionTestnet ? "bg-cyan-100 text-cyan-700 border-cyan-200" : ""}
          data-testid="network-badge"
        >
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isIntuitionTestnet ? 'bg-cyan-500' : 'bg-gray-400'}`}></div>
            <span>{isIntuitionTestnet ? 'Intuition Testnet' : 'Wrong Network'}</span>
          </div>
        </Badge>
        
        {!isIntuitionTestnet && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onNetworkSwitch}
            data-testid="switch-network-button"
          >
            Switch Network
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <Button 
        onClick={() => setShowModal(true)}
        disabled={isConnecting}
        data-testid="connect-wallet-button"
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md" data-testid="wallet-modal">
          <DialogHeader>
            <DialogTitle className="text-center">Connect Your Wallet</DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
            
            <p className="text-gray-600">
              Connect with one of our supported wallet providers
            </p>
            
            <div className="space-y-3">
              <Button
                className="w-full justify-between p-4 h-auto"
                variant="outline"
                onClick={() => {
                  connectWallet();
                  setShowModal(false);
                }}
                disabled={isConnecting}
                data-testid="connect-metamask"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                    M
                  </div>
                  <span className="font-medium">MetaMask</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </Button>
              
              <Button
                className="w-full justify-between p-4 h-auto"
                variant="outline"
                disabled
                data-testid="connect-walletconnect"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">
                    📱
                  </div>
                  <span className="font-medium">WalletConnect</span>
                  <Badge variant="secondary" className="text-xs">Soon</Badge>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
