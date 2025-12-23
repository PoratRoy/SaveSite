import { Tag } from './tag';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  tags?: Tag[];
  createdAt: Date;
}

export type UserRole = "admin" | "user" | "guest";
