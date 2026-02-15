import { createFileRoute, Link } from '@tanstack/react-router';
import { SignupForm } from '@/components/auth/SignupForm';

export const Route = createFileRoute('/signup')({
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md">
        <SignupForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
