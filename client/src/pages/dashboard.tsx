import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WalletConnection from '@/components/wallet/WalletConnection';
import NetworkSwitcher from '@/components/wallet/NetworkSwitcher';
import AtomsList from '@/components/atoms/AtomsList';
import CreateAtomModal from '@/components/atoms/CreateAtomModal';
import StakingModal from '@/components/staking/StakingModal';
import ContractInteractions from '@/components/contracts/ContractInteractions';
import TransactionHistory from '@/components/transactions/TransactionHistory';
import { useWeb3 } from '@/hooks/useWeb3';
import { 
  Box, 
  Coins, 
  FileText, 
  ExternalLink, 
  Wallet, 
  Plus,
  Zap,
  Network
} from 'lucide-react';
import { INTUITION_TESTNET } from '@/lib/web3';

export default function Dashboard() {
  const { walletState, isIntuitionTestnet } = useWeb3();
  const [showNetworkModal, setShowNetworkModal] = React.useState(false);
  const [showCreateAtomModal, setShowCreateAtomModal] = React.useState(false);
  const [showStakingModal, setShowStakingModal] = React.useState(false);
  const [selectedAtomId, setSelectedAtomId] = React.useState<string | null>(null);

  const handleCreateAtom = () => {
    setShowCreateAtomModal(true);
  };

  const handleStakeOnAtom = (atomId: string) => {
    setSelectedAtomId(atomId);
    setShowStakingModal(true);
  };

  const handleViewAtom = (atomId: string) => {
    // TODO: Implement atom detail view
    console.log('View atom:', atomId);
  };

  const openBlockExplorer = () => {
    window.open(INTUITION_TESTNET.blockExplorerUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900" data-testid="app-title">
                  <Box className="inline w-6 h-6 text-blue-600 mr-2" />
                  Intuition Testnet
                </h1>
              </div>
              <nav className="hidden md:flex space-x-6">
                <span className="text-blue-600 font-medium" data-testid="nav-dashboard">Dashboard</span>
                <span className="text-gray-600 hover:text-blue-600 font-medium cursor-pointer" data-testid="nav-atoms">Atoms</span>
                <span className="text-gray-600 hover:text-blue-600 font-medium cursor-pointer" data-testid="nav-staking">Staking</span>
                <span className="text-gray-600 hover:text-blue-600 font-medium cursor-pointer" data-testid="nav-history">History</span>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <WalletConnection onNetworkSwitch={() => setShowNetworkModal(true)} />
              
              <Badge 
                className={`${
                  isIntuitionTestnet 
                    ? 'bg-cyan-100 text-cyan-700 border-cyan-200' 
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}
                data-testid="network-indicator"
              >
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isIntuitionTestnet ? 'bg-cyan-500' : 'bg-gray-400'}`}></div>
                  <span>Intuition Testnet</span>
                </div>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white" data-testid="welcome-section">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-4">Welcome to Intuition Testnet</h2>
              <p className="text-lg mb-6 opacity-90">
                Explore the decentralized knowledge graph. Create Atoms (Identities), stake on data, and interact with smart contracts on the Intuition protocol.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Box className="w-4 h-4" />
                    <span>EthMultiVault</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4" />
                    <span>AtomWallet</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-4 h-4" />
                    <span>$TRUST Token</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Wallet Status Card */}
          <div className="lg:col-span-1">
            <Card data-testid="wallet-status-card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Wallet className="w-5 h-5 text-blue-600 mr-2" />
                  Wallet Status
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Connection</span>
                    <span className={`font-medium ${walletState.isConnected ? 'text-green-600' : 'text-red-600'}`} data-testid="connection-status">
                      {walletState.isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Network</span>
                    <span className={`font-medium ${isIntuitionTestnet ? 'text-cyan-600' : 'text-amber-600'}`} data-testid="network-status">
                      {isIntuitionTestnet ? 'Intuition Testnet' : 'Wrong Network'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">ETH Balance</span>
                    <span className="text-gray-900 font-mono" data-testid="eth-balance">
                      {walletState.balance ? `${parseFloat(walletState.balance).toFixed(4)} ETH` : '--'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">$TRUST Balance</span>
                    <span className="text-gray-900 font-mono" data-testid="trust-balance">
                      {walletState.trustBalance ? `${walletState.trustBalance} TRUST` : '--'}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => setShowNetworkModal(true)}
                  data-testid="switch-network-card-button"
                >
                  <Network className="w-4 h-4 mr-2" />
                  Switch Network
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Quick Actions Card */}
          <div className="lg:col-span-2">
            <Card data-testid="quick-actions-card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Zap className="w-5 h-5 text-amber-600 mr-2" />
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto text-left justify-start"
                    onClick={handleCreateAtom}
                    disabled={!walletState.isConnected || !isIntuitionTestnet}
                    data-testid="create-atom-action"
                  >
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center justify-between w-full mb-2">
                        <Plus className="w-6 h-6" />
                        <span className="text-xs opacity-70">→</span>
                      </div>
                      <h4 className="font-semibold mb-1">Create Atom</h4>
                      <p className="text-blue-100 text-sm">Create a new identity (0.0003 ETH)</p>
                    </div>
                  </Button>
                  
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white p-6 h-auto text-left justify-start"
                    disabled={!walletState.isConnected || !isIntuitionTestnet}
                    data-testid="stake-atom-action"
                  >
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center justify-between w-full mb-2">
                        <Coins className="w-6 h-6" />
                        <span className="text-xs opacity-70">→</span>
                      </div>
                      <h4 className="font-semibold mb-1">Stake on Atom</h4>
                      <p className="text-green-100 text-sm">Stake tokens to support data</p>
                    </div>
                  </Button>
                  
                  <Button
                    className="bg-cyan-600 hover:bg-cyan-700 text-white p-6 h-auto text-left justify-start"
                    disabled={!walletState.isConnected || !isIntuitionTestnet}
                    data-testid="view-contracts-action"
                  >
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center justify-between w-full mb-2">
                        <FileText className="w-6 h-6" />
                        <span className="text-xs opacity-70">→</span>
                      </div>
                      <h4 className="font-semibold mb-1">View Contracts</h4>
                      <p className="text-cyan-100 text-sm">Interact with smart contracts</p>
                    </div>
                  </Button>
                  
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white p-6 h-auto text-left justify-start"
                    onClick={openBlockExplorer}
                    data-testid="view-explorer-action"
                  >
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center justify-between w-full mb-2">
                        <ExternalLink className="w-6 h-6" />
                        <span className="text-xs opacity-70">→</span>
                      </div>
                      <h4 className="font-semibold mb-1">Block Explorer</h4>
                      <p className="text-purple-100 text-sm">View on Blockscout</p>
                    </div>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Atoms Section */}
        <section className="mb-8">
          <AtomsList
            onCreateAtom={handleCreateAtom}
            onStakeOnAtom={handleStakeOnAtom}
            onViewAtom={handleViewAtom}
          />
        </section>

        {/* Transaction History and Contract Interactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TransactionHistory />
          <ContractInteractions />
        </div>
      </main>

      {/* Modals */}
      <NetworkSwitcher 
        open={showNetworkModal} 
        onOpenChange={setShowNetworkModal} 
      />
      
      <CreateAtomModal
        open={showCreateAtomModal}
        onOpenChange={setShowCreateAtomModal}
      />
      
      <StakingModal
        open={showStakingModal}
        onOpenChange={setShowStakingModal}
        atomId={selectedAtomId}
      />
    </div>
  );
}
