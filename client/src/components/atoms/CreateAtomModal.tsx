import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useIntuitionContracts } from '@/hooks/useIntuitionContracts';
import { Box, Loader2 } from 'lucide-react';

const createAtomSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

type CreateAtomForm = z.infer<typeof createAtomSchema>;

interface CreateAtomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateAtomModal({ open, onOpenChange }: CreateAtomModalProps) {
  const [isCreating, setIsCreating] = React.useState(false);
  const { createAtom } = useIntuitionContracts();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAtomForm>({
    resolver: zodResolver(createAtomSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateAtomForm) => {
    setIsCreating(true);
    try {
      await createAtom(data.name, data.description || '');
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create atom:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="create-atom-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Box className="w-5 h-5 text-blue-600 mr-2" />
            Create New Atom
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter atom name"
                className={errors.name ? 'border-red-500' : ''}
                data-testid="atom-name-input"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1" data-testid="name-error">
                  {errors.name.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Enter atom description (optional)"
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
                data-testid="atom-description-input"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1" data-testid="description-error">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Creation Cost</p>
                <p className="text-blue-700">
                  Creating an atom requires <strong>0.0003 ETH</strong> as per the Intuition protocol.
                  This fee helps maintain the quality of the knowledge graph.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isCreating}
              data-testid="cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              data-testid="create-atom-submit"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Box className="w-4 h-4 mr-2" />
                  Create Atom
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
