import { Website } from './website';

export interface Tag {
  id: string;
  name: string;
  websites?: Website[];
}
