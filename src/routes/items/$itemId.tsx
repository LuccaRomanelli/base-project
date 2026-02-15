import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { ItemForm } from '@/components/items/ItemForm';
import { useItem } from '@/hooks/useItems';

export const Route = createFileRoute('/items/$itemId')({
  component: ItemDetailPage,
});

function ItemDetailPage() {
  const { itemId } = Route.useParams();
  const { data: item, isLoading } = useItem(itemId);

  return (
    <ProtectedRoute>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : item ? (
        <ItemForm item={item} />
      ) : (
        <div className="py-12 text-center text-gray-500">Item not found</div>
      )}
    </ProtectedRoute>
  );
}
