import { format } from 'date-fns';
import { Link } from '@tanstack/react-router';
import { Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import type { Item } from '@/types';
import { clsx } from 'clsx';

const statusStyles = {
  draft: 'bg-gray-100 text-gray-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-yellow-100 text-yellow-700',
};

interface ItemCardProps {
  item: Item;
  onDelete?: (id: string) => void;
}

export function ItemCard({ item, onDelete }: ItemCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <Link
          to="/items/$itemId"
          params={{ itemId: item.id }}
          className="text-lg font-semibold text-gray-900 hover:text-blue-600"
        >
          {item.title}
        </Link>
        <span
          className={clsx(
            'rounded-full px-2.5 py-0.5 text-xs font-medium',
            statusStyles[item.status],
          )}
        >
          {item.status}
        </span>
      </div>
      <p className="line-clamp-2 text-sm text-gray-600">{item.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{format(item.createdAt, 'MMM d, yyyy')}</span>
        <div className="flex gap-2">
          <Link to="/items/$itemId" params={{ itemId: item.id }}>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          {onDelete ? (
            <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
