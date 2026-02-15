import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { itemSchema, fieldError } from '@/lib/validators';
import { useCreateItem, useUpdateItem } from '@/hooks/useItems';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Card } from '@/components/shared/Card';
import type { Item } from '@/types';
import { useState } from 'react';

interface ItemFormProps {
  item?: Item;
}

export function ItemForm({ item }: ItemFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!item;

  const form = useForm({
    defaultValues: {
      title: item?.title ?? '',
      description: item?.description ?? '',
      status: item?.status ?? 'draft',
    },
    validators: { onChange: itemSchema },
    onSubmit: async ({ value }) => {
      try {
        setError(null);
        if (isEditing && item) {
          await updateItem.mutateAsync({ id: item.id, ...value });
        } else if (user) {
          await createItem.mutateAsync({ ...value, userId: user.id });
        }
        void navigate({ to: '/items' });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save item');
      }
    },
  });

  return (
    <Card className="mx-auto w-full max-w-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        {isEditing ? 'Edit Item' : 'New Item'}
      </h2>
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
        <form.Field name="title">
          {(field) => (
            <Input
              label="Title"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={fieldError(field.state.meta.errors)}
              placeholder="Enter item title"
            />
          )}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <div className="w-full">
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                rows={4}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Describe the item"
              />
              {fieldError(field.state.meta.errors) ? (
                <p className="mt-1 text-sm text-red-600">{fieldError(field.state.meta.errors)}</p>
              ) : null}
            </div>
          )}
        </form.Field>
        <form.Field name="status">
          {(field) => (
            <div className="w-full">
              <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(e.target.value as 'draft' | 'published' | 'archived')
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          )}
        </form.Field>
        <div className="flex gap-3">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" loading={isSubmitting}>
                {isEditing ? 'Update' : 'Create'} Item
              </Button>
            )}
          </form.Subscribe>
          <Button type="button" variant="secondary" onClick={() => void navigate({ to: '/items' })}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
