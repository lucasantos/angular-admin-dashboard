// models/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'Admin' | 'User' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin?: Date;
}
