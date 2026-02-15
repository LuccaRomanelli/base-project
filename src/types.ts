export type UserRole = 'user' | 'admin';
export type ItemStatus = 'draft' | 'published' | 'archived';

export interface User {
  id: string;
  authId: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: ItemStatus;
  createdAt: Date;
  updatedAt: Date;
}
