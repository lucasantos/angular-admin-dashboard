// models/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  role: 'Admin' | 'User' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin?: Date;
}
