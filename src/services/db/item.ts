import { supabase } from '@/services/supabase';
import { mapItemFromDb } from '@/services/mappers';
import type { Item, ItemStatus } from '@/types';
import type { Database } from '@/types/supabase';

type DbItemInsert = Database['public']['Tables']['items']['Insert'];
type DbItemUpdate = Database['public']['Tables']['items']['Update'];

export async function getItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapItemFromDb);
}

export async function getItemById(id: string): Promise<Item | null> {
  const { data, error } = await supabase.from('items').select('*').eq('id', id).single();

  if (error || !data) return null;
  return mapItemFromDb(data);
}

export async function getItemsByUser(userId: string): Promise<Item[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapItemFromDb);
}

export async function createItem(
  item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Item> {
  const dbItem: DbItemInsert = {
    user_id: item.userId,
    title: item.title,
    description: item.description,
    status: item.status,
  };
  const { data, error } = await supabase.from('items').insert(dbItem).select().single();

  if (error || !data) throw error ?? new Error('Failed to create item');
  return mapItemFromDb(data);
}

export async function updateItem(
  id: string,
  updates: Partial<Pick<Item, 'title' | 'description' | 'status'>>,
): Promise<Item> {
  const dbUpdates: DbItemUpdate = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.status !== undefined) dbUpdates.status = updates.status;

  const { data, error } = await supabase
    .from('items')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) throw error ?? new Error('Failed to update item');
  return mapItemFromDb(data);
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase.from('items').delete().eq('id', id);

  if (error) throw error;
}

export async function updateItemStatus(id: string, status: ItemStatus): Promise<Item> {
  return updateItem(id, { status });
}
