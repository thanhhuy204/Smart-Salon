export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  avatar: string | null;
  role: 'USER' | 'ADMIN';
}

export interface UpdateProfileRequest {
  fullName: string;
  phone: string;
}

export interface AppointmentSummary {
  id: number;
  serviceName: string;
  staffName: string;
  appointmentTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalPrice: number;
}

export interface OrderSummary {
  id: number;
  orderCode: string;
  createdAt: string;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  itemCount: number;
  firstItemName: string;
  firstItemImage: string | null;
}
