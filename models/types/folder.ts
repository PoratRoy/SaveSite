import { User } from './user';
import { Website } from './website';

export interface Folder {
  id: string;
  name: string;
  userId: string;
  user?: User;
  parentId?: string | null;
  parent?: Folder | null;
  children?: Folder[];
  websites?: Website[];
  createdAt: Date;
}
