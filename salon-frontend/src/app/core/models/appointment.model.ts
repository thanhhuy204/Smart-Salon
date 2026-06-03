export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface AvailableSlot {
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  isAvailable: boolean;
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
}

export interface BookingRequest {
  serviceIds: number[];
  staffId: number | null; // null for any staff
  apptDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm:ss
  note?: string;
}

export interface CancelAppointmentRequest {
  cancelReason: string;
}

export interface AppointmentServiceSummary {
  id: number;
  serviceName: string;
  price: number;
}

export interface AppointmentModel {
  id: number;
  staffName?: string;
  staffId?: number;
  customerName?: string;
  customerPhone?: string;
  apptDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  totalPrice: number;
  status: AppointmentStatus;
  note?: string;
  cancelReason?: string;
  services: AppointmentServiceSummary[];
  isReviewed?: boolean;
}
