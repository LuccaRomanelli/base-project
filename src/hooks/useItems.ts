import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItems, getItemById, createItem, updateItem, deleteItem } from '@/services/db/item';
import type { Item } from '@/types';

const ITEMS_KEY = ['items'] as const;

export function useItems() {
  return useQuery({
    queryKey: ITEMS_KEY,
    queryFn: getItems,
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: [...ITEMS_KEY, id],
    queryFn: () => getItemById(id),
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => createItem(item),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ITEMS_KEY });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...updates
    }: { id: string } & Partial<Pick<Item, 'title' | 'description' | 'status'>>) =>
      updateItem(id, updates),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ITEMS_KEY });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ITEMS_KEY });
    },
  });
}
