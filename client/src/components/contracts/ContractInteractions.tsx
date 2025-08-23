import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { ContractEvent } from '@shared/schema';
import { FileText, Play, List, ExternalLink, Activity } from 'lucide-react';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { INTUITION_TESTNET } from '@/lib/web3';

export default function ContractInteractions() {
  const { data: events, isLoading: eventsLoading } = useQuery<ContractEvent[]>({
    queryKey: ['/api/contract-events'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalAtoms: number;
    totalStaked: string;
  }>({
    queryKey: ['/api/stats'],
  });

  const openBlockExplorer = (contractAddress: string) => {
    const url = `${INTUITION_TESTNET.blockExplorerUrl}/address/${contractAddress}`;
    window.open(url, '_blank');
  };

  const contracts = [
    {
      name: 'EthMultiVault',
      address: CONTRACT_ADDRESSES.ETHMULTIVAULT,
      description: 'Main protocol contract for atoms and staking',
      status: 'active',
    },
    {
      name: 'AtomWallet',
      address: CONTRACT_ADDRESSES.ATOMWALLET_BEACON,
      description: 'Beacon proxy for atom wallet implementations',
      status: 'active',
    },
  ];

  return (
    <Card data-testid="contract-interactions">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 text-cyan-600 mr-2" />
          Smart Contracts
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {contracts.map((contract) => (
          <div key={contract.address} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900" data-testid={`contract-name-${contract.name}`}>
                {contract.name}
              </h4>
              <Badge 
                variant="secondary"
                className="bg-green-100 text-green-700 border-green-200"
                data-testid={`contract-status-${contract.name}`}
              >
                {contract.status}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-3" data-testid={`contract-description-${contract.name}`}>
              {contract.description}
            </p>
            
            <p className="text-xs text-gray-500 font-mono mb-3 break-all" data-testid={`contract-address-${contract.name}`}>
              {contract.address}
            </p>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                disabled
                data-testid={`interact-button-${contract.name}`}
              >
                <Play className="w-3 h-3 mr-1" />
                Interact
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled
                data-testid={`events-button-${contract.name}`}
              >
                <List className="w-3 h-3 mr-1" />
                Events
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openBlockExplorer(contract.address)}
                data-testid={`explorer-button-${contract.name}`}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Explorer
              </Button>
            </div>
          </div>
        ))}
        
        {/* Protocol Statistics */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="font-medium text-gray-900 mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Protocol Statistics
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600" data-testid="stats-total-atoms">
                {statsLoading ? '--' : (stats?.totalAtoms || 0)}
              </p>
              <p className="text-xs text-gray-600">Total Atoms</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600" data-testid="stats-total-staked">
                {statsLoading ? '--' : (stats?.totalStaked || '0')}
              </p>
              <p className="text-xs text-gray-600">ETH Staked</p>
            </div>
          </div>
        </div>
        
        {/* Recent Contract Events */}
        <div className="border-t pt-4">
          <h5 className="font-medium text-gray-900 mb-3">Recent Events</h5>
          {eventsLoading ? (
            <div className="text-sm text-gray-500">Loading events...</div>
          ) : events && events.length > 0 ? (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {events.slice(0, 5).map((event) => (
                <div key={event.id} className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                  <div className="flex justify-between items-start">
                    <span className="font-medium" data-testid={`event-name-${event.id}`}>
                      {event.eventName}
                    </span>
                    <span className="text-gray-400" data-testid={`event-block-${event.id}`}>
                      #{event.blockNumber}
                    </span>
                  </div>
                  <div className="font-mono truncate" data-testid={`event-hash-${event.id}`}>
                    {event.transactionHash}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500" data-testid="no-events">
              No recent events found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
