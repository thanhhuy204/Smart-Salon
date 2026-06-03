export interface StaffReviewModel {
  id: number;
  appointmentId: number;
  userId: number;
  staffId: number;
  rating: number; // Điểm đánh giá từ 1 đến 5
  comment?: string; // Nhận xét của khách hàng
  createdAt: string; // ISO Datetime string
}

export interface CreateStaffReviewRequest {
  appointmentId: number;
  rating: number; // Điểm đánh giá từ 1 đến 5
  comment?: string; // Nhận xét của khách hàng
}
