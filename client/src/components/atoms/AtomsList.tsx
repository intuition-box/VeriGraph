import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Atom } from '@shared/schema';
import { Box, Eye, Coins, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AtomsListProps {
  onCreateAtom: () => void;
  onStakeOnAtom: (atomId: string) => void;
  onViewAtom: (atomId: string) => void;
}

export default function AtomsList({ onCreateAtom, onStakeOnAtom, onViewAtom }: AtomsListProps) {
  const { data: atoms, isLoading, error } = useQuery<Atom[]>({
    queryKey: ['/api/atoms'],
  });

  if (error) {
    return (
      <Card data-testid="atoms-error">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <Box className="w-12 h-12 mx-auto" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Atoms</h4>
            <p className="text-gray-600 mb-4">Unable to fetch atoms from the blockchain</p>
            <Button onClick={() => window.location.reload()} data-testid="retry-button">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card data-testid="atoms-loading">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Box className="w-5 h-5 text-blue-600 mr-2" />
              My Atoms (Identities)
            </CardTitle>
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right space-y-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!atoms || atoms.length === 0) {
    return (
      <Card data-testid="atoms-empty">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Box className="w-5 h-5 text-blue-600 mr-2" />
              My Atoms (Identities)
            </CardTitle>
            <Button onClick={onCreateAtom} data-testid="create-atom-header">
              <Box className="w-4 h-4 mr-2" />
              Create Atom
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Box className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Atoms Created Yet</h4>
            <p className="text-gray-600 mb-4">
              Create your first Atom (Identity) to get started with the Intuition protocol.
            </p>
            <Button onClick={onCreateAtom} data-testid="create-first-atom">
              Create Your First Atom
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="atoms-list">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Box className="w-5 h-5 text-blue-600 mr-2" />
            My Atoms (Identities)
          </CardTitle>
          <Button onClick={onCreateAtom} data-testid="create-atom-button">
            <Box className="w-4 h-4 mr-2" />
            Create Atom
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {atoms.map((atom) => (
            <div 
              key={atom.id} 
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors duration-200"
              data-testid={`atom-${atom.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Box className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900" data-testid={`atom-name-${atom.id}`}>
                      {atom.name}
                    </h4>
                    <p className="text-sm text-gray-600" data-testid={`atom-id-${atom.id}`}>
                      Atom ID: #{atom.atomId}
                    </p>
                    <p className="text-xs text-gray-500" data-testid={`atom-created-${atom.id}`}>
                      Created: {atom.createdAt ? formatDistanceToNow(new Date(atom.createdAt), { addSuffix: true }) : 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm font-medium text-gray-900">
                      <Users className="w-4 h-4" />
                      <span data-testid={`atom-stakeholders-${atom.id}`}>
                        {atom.stakeholderCount || 0} Stakeholders
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Coins className="w-3 h-3" />
                      <span data-testid={`atom-total-stake-${atom.id}`}>
                        Total: {atom.totalStake || '0'} ETH
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => onStakeOnAtom(atom.id)}
                      data-testid={`stake-button-${atom.id}`}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Coins className="w-3 h-3 mr-1" />
                      Stake
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewAtom(atom.id)}
                      data-testid={`view-button-${atom.id}`}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
              {atom.description && (
                <div className="mt-3 text-sm text-gray-600" data-testid={`atom-description-${atom.id}`}>
                  {atom.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
