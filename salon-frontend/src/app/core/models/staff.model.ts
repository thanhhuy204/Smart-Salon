export interface StaffModel {
  id: number;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  averageRating: number;
  totalCompletedAppointments: number;
  isActive?: boolean;
}
