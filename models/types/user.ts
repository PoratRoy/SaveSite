import { Tag } from './tag';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tags?: Tag[];
  createdAt: Date;
}

export type UserRole = "admin" | "user" | "guest";
