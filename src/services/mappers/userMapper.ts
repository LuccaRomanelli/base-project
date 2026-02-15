import type { User } from '@/types';
import type { Database } from '@/types/supabase';

type DbUser = Database['public']['Tables']['users']['Row'];
type DbUserInsert = Database['public']['Tables']['users']['Insert'];

export function mapUserFromDb(dbUser: DbUser): User {
  return {
    id: dbUser.id,
    authId: dbUser.auth_id,
    fullName: dbUser.full_name,
    email: dbUser.email,
    avatarUrl: dbUser.avatar_url,
    role: dbUser.role,
    createdAt: new Date(dbUser.created_at),
    updatedAt: new Date(dbUser.updated_at),
  };
}

export function mapUserToDb(user: Partial<User>): Partial<DbUserInsert> {
  return {
    ...(user.authId !== undefined && { auth_id: user.authId }),
    ...(user.fullName !== undefined && { full_name: user.fullName }),
    ...(user.email !== undefined && { email: user.email }),
    ...(user.avatarUrl !== undefined && { avatar_url: user.avatarUrl }),
    ...(user.role !== undefined && { role: user.role }),
  };
}
