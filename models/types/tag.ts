import { Website } from './website';
import { User } from './user';
import { Folder } from './folder';

export interface Tag {
  id: string;
  name: string;
  position: number;
  
  // Tag scope: either user-level (global) or folder-specific
  userId?: string | null;
  user?: User;
  
  folderId?: string | null;
  folder?: Folder;
  
  websites?: Website[];
}

export type TagScope = 'global' | 'folder';
