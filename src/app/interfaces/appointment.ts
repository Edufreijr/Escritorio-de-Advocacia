export interface Appointment {
  id: number;
  userId: number;
  lawyerId?: number;

  name: string;
  email: string;
  phone: string;
  area: string;
  date: string;
  time: string;
  message: string;

  status: 'pending' | 'confirmed' | 'cancelled';
}
