import { Website } from './website';

export interface Tag {
  id: string;
  name: string;
  position: number;
  websites?: Website[];
}
