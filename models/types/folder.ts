import { User } from './user';
import { Website } from './website';
import { Tag } from './tag';

export interface Folder {
  id: string;
  name: string;
  userId: string;
  user?: User;
  parentId?: string | null;
  parent?: Folder | null;
  children?: Folder[];
  websites?: Website[];
  tags?: Tag[];
  createdAt: Date;
}
