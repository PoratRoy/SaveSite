import { User } from './user';
import { Folder } from './folder';
import { Tag } from './tag';

export interface Website {
  id: string;
  title: string;
  link: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  color?: string | null;
  position: number;
  starred: boolean;
  ownerId: string;
  owner?: User;
  folders?: Folder[];
  tags?: Tag[];
  createdAt: Date;
  updatedAt: Date;
}
