export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'lawyer' | 'admin';
}

