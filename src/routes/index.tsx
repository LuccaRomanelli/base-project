import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Package, Shield, Zap } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Base Project Template</h1>
        <p className="mb-8 text-lg text-gray-600">
          A production-ready starter kit with Auth, CRUD, and Admin — powered by React, TanStack,
          Supabase, and Tailwind.
        </p>
        {user ? (
          <Link to="/dashboard">
            <Button size="lg">
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        ) : (
          <div className="flex justify-center gap-4">
            <Link to="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Log In
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
        <Card>
          <Shield className="mb-3 h-8 w-8 text-blue-600" />
          <h3 className="mb-2 font-semibold text-gray-900">Authentication</h3>
          <p className="text-sm text-gray-600">
            Supabase Auth with email/password, session management, and role-based access.
          </p>
        </Card>
        <Card>
          <Package className="mb-3 h-8 w-8 text-green-600" />
          <h3 className="mb-2 font-semibold text-gray-900">CRUD Operations</h3>
          <p className="text-sm text-gray-600">
            Full create, read, update, delete with TanStack Query caching and mutations.
          </p>
        </Card>
        <Card>
          <Zap className="mb-3 h-8 w-8 text-yellow-600" />
          <h3 className="mb-2 font-semibold text-gray-900">Type Safety</h3>
          <p className="text-sm text-gray-600">
            End-to-end types from database to UI with Zod validation and TypeScript strict mode.
          </p>
        </Card>
      </div>
    </div>
  );
}
