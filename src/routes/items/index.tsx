import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { ItemList } from '@/components/items/ItemList';

export const Route = createFileRoute('/items/')({
  component: ItemsPage,
});

function ItemsPage() {
  return (
    <ProtectedRoute>
      <ItemList />
    </ProtectedRoute>
  );
}
