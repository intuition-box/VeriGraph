import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Transaction } from '@shared/schema';
import { History, Plus, Coins, ArrowDown, ExternalLink, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { INTUITION_TESTNET } from '@/lib/web3';

export default function TransactionHistory() {
  const { data: transactions, isLoading, error, refetch } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const openTransactionInExplorer = (hash: string) => {
    const url = `${INTUITION_TESTNET.blockExplorerUrl}/tx/${hash}`;
    window.open(url, '_blank');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'create_atom':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'stake':
        return <Coins className="w-4 h-4 text-amber-600" />;
      case 'reward':
        return <ArrowDown className="w-4 h-4 text-cyan-600" />;
      default:
        return <RefreshCw className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'create_atom':
        return 'Create Atom';
      case 'stake':
        return 'Stake on Atom';
      case 'reward':
        return 'Receive Reward';
      default:
        return 'Transaction';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'pending':
        return 'text-amber-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatValue = (value: string | null, type: string) => {
    if (!value || value === '0') return null;
    
    const ethValue = parseFloat(value) / Math.pow(10, 18);
    const sign = type === 'reward' ? '+' : '-';
    return `${sign}${ethValue.toFixed(4)} ETH`;
  };

  if (error) {
    return (
      <Card data-testid="transactions-error">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 text-amber-600 mr-2" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <History className="w-12 h-12 mx-auto" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Transactions</h4>
            <p className="text-gray-600 mb-4">Unable to fetch transaction history</p>
            <Button onClick={() => refetch()} data-testid="retry-transactions">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card data-testid="transactions-loading">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 text-amber-600 mr-2" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card data-testid="transactions-empty">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 text-amber-600 mr-2" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Yet</h4>
            <p className="text-gray-600">
              Your transaction history will appear here once you start interacting with the protocol.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="transactions-list">
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="w-5 h-5 text-amber-600 mr-2" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 10).map((tx) => (
            <div 
              key={tx.id} 
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              data-testid={`transaction-${tx.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900" data-testid={`tx-type-${tx.id}`}>
                    {getTransactionLabel(tx.type)}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500" data-testid={`tx-time-${tx.id}`}>
                      {tx.timestamp ? formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true }) : 'Unknown'}
                    </p>
                    <button
                      onClick={() => openTransactionInExplorer(tx.hash)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                      data-testid={`tx-explorer-${tx.id}`}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right">
                {formatValue(tx.value, tx.type) && (
                  <p className={`text-sm font-medium ${
                    tx.type === 'reward' ? 'text-green-600' : 'text-gray-900'
                  }`} data-testid={`tx-amount-${tx.id}`}>
                    {formatValue(tx.value, tx.type)}
                  </p>
                )}
                <div className="flex items-center justify-end space-x-1">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getStatusColor(tx.status)}`}
                    data-testid={`tx-status-${tx.id}`}
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {transactions.length > 10 && (
          <div className="text-center mt-6">
            <Button variant="outline" data-testid="view-all-transactions">
              View All Transactions
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
