import { useItems, useDeleteItem } from '@/hooks/useItems';
import { ItemCard } from './ItemCard';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/shared/Button';
import { Plus } from 'lucide-react';

export function ItemList() {
  const { data: items, isLoading, error } = useItems();
  const deleteItem = useDeleteItem();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600">
        Failed to load items: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Items</h1>
        <Link to="/items/new">
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            New Item
          </Button>
        </Link>
      </div>
      {items?.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p>No items yet.</p>
          <Link to="/items/new" className="mt-2 inline-block text-blue-600 hover:underline">
            Create your first item
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items?.map((item) => (
            <ItemCard key={item.id} item={item} onDelete={(id) => deleteItem.mutate(id)} />
          ))}
        </div>
      )}
    </div>
  );
}
