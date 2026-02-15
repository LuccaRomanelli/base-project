import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { AdminPanel } from '@/components/admin/AdminPanel';

export const Route = createFileRoute('/admin')({
  component: AdminPage,
});

function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminPanel />
    </ProtectedRoute>
  );
}
