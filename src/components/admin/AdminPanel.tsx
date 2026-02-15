import { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole } from '@/services/db/user';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Shield, User } from 'lucide-react';
import type { User as UserType } from '@/types';

export function AdminPanel() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    await updateUserRole(userId, newRole);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Admin Panel</h1>
      <Card>
        <h2 className="mb-4 text-lg font-semibold">User Management</h2>
        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  {user.role === 'admin' ? (
                    <Shield className="h-5 w-5 text-blue-600" />
                  ) : (
                    <User className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{user.role}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    void handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')
                  }
                >
                  {user.role === 'admin' ? 'Demote' : 'Promote'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
