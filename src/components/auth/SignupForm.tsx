import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { signupSchema, fieldError } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Card } from '@/components/shared/Card';
import { useState } from 'react';

export function SignupForm() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
    validators: { onChange: signupSchema },
    onSubmit: async ({ value }) => {
      try {
        setError(null);
        await signUp(value.email, value.password, value.fullName);
        void navigate({ to: '/dashboard' });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Signup failed');
      }
    },
  });

  return (
    <Card className="mx-auto w-full max-w-md">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Create Account</h2>
      {error ? (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      ) : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="fullName">
          {(field) => (
            <Input
              label="Full Name"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={fieldError(field.state.meta.errors)}
              placeholder="John Doe"
            />
          )}
        </form.Field>
        <form.Field name="email">
          {(field) => (
            <Input
              label="Email"
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={fieldError(field.state.meta.errors)}
              placeholder="you@example.com"
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <Input
              label="Password"
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={fieldError(field.state.meta.errors)}
              placeholder="••••••••"
            />
          )}
        </form.Field>
        <form.Field name="confirmPassword">
          {(field) => (
            <Input
              label="Confirm Password"
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={fieldError(field.state.meta.errors)}
              placeholder="••••••••"
            />
          )}
        </form.Field>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Create Account
            </Button>
          )}
        </form.Subscribe>
      </form>
    </Card>
  );
}
