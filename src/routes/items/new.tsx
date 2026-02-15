import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { ItemForm } from '@/components/items/ItemForm';

export const Route = createFileRoute('/items/new')({
  component: NewItemPage,
});

function NewItemPage() {
  return (
    <ProtectedRoute>
      <ItemForm />
    </ProtectedRoute>
  );
}
