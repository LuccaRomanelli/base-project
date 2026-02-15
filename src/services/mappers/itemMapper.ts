import type { Item } from '@/types';
import type { Database } from '@/types/supabase';

type DbItem = Database['public']['Tables']['items']['Row'];
type DbItemInsert = Database['public']['Tables']['items']['Insert'];

export function mapItemFromDb(dbItem: DbItem): Item {
  return {
    id: dbItem.id,
    userId: dbItem.user_id,
    title: dbItem.title,
    description: dbItem.description,
    status: dbItem.status,
    createdAt: new Date(dbItem.created_at),
    updatedAt: new Date(dbItem.updated_at),
  };
}

export function mapItemToDb(item: Partial<Item>): Partial<DbItemInsert> {
  return {
    ...(item.userId !== undefined && { user_id: item.userId }),
    ...(item.title !== undefined && { title: item.title }),
    ...(item.description !== undefined && { description: item.description }),
    ...(item.status !== undefined && { status: item.status }),
  };
}
