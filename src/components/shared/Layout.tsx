import { Link, useRouter } from '@tanstack/react-router';
import { LogOut, Home, LayoutDashboard, Package, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './Button';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut, isAdmin } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    void router.navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Base Project
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/items"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Package className="h-4 w-4" />
                  Items
                </Link>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <Button variant="ghost" size="sm" onClick={() => void handleSignOut()}>
                  <LogOut className="mr-1 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
