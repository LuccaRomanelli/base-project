import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card } from '@/components/shared/Card';
import { useAuth } from '@/hooks/useAuth';
import { useItems } from '@/hooks/useItems';
import { Link } from '@tanstack/react-router';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/shared/Button';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const { data: items } = useItems();

  const myItems = items?.filter((item) => item.userId === user?.id) ?? [];
  const publishedCount = myItems.filter((i) => i.status === 'published').length;
  const draftCount = myItems.filter((i) => i.status === 'draft').length;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Welcome, {user?.fullName ?? 'User'}</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="text-3xl font-bold text-gray-900">{myItems.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Drafts</p>
          <p className="text-3xl font-bold text-gray-600">{draftCount}</p>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Items</h2>
        <Link to="/items/new">
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            New Item
          </Button>
        </Link>
      </div>

      {myItems.length === 0 ? (
        <Card className="text-center text-gray-500">
          <Package className="mx-auto mb-2 h-12 w-12 text-gray-300" />
          <p>No items yet. Create your first one!</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {myItems.slice(0, 5).map((item) => (
            <Link key={item.id} to="/items/$itemId" params={{ itemId: item.id }}>
              <Card padding="sm" className="flex items-center justify-between hover:bg-gray-50">
                <span className="font-medium text-gray-900">{item.title}</span>
                <span className="text-sm text-gray-500">{item.status}</span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
