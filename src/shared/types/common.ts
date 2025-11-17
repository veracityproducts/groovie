export type AccessLevel = 'free' | 'premium' | 'educator';

export interface User {
  id: string;
  email: string;
  name?: string;
  accessLevel: AccessLevel;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppMode {
  id: 'reading-resource' | 'teaching-assistant' | 'magic-librarian';
  label: string;
  description: string;
  requiredAccess: AccessLevel;
  icon: string;
}
