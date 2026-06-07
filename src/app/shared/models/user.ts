// shared/models/user.ts
export interface User {
  id: string;
  tenantId: string; // Para multi-tenancy
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  role: 'Admin' | 'User' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin?: Date;
  token?: string; // Para simular autenticação JWT
}
