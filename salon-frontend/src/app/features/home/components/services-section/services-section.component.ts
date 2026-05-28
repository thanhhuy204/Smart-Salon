import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ServiceCard {
  image: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services-section.component.html',
  styleUrl: './services-section.component.scss',
})
export class ServicesSectionComponent {
  services: ServiceCard[] = [
    {
      image: 'assets/images/cat.avif',
      name: 'Cắt tóc',
      description: 'Tạo kiểu cắt phù hợp với khuôn mặt, phong cách và yêu cầu riêng của từng khách hàng.',
    },
    {
      image: 'assets/images/goi.avif',
      name: 'Gội & Chăm sóc',
      description: 'Gội đầu chuyên sâu kết hợp massage thư giãn, nuôi dưỡng tóc và da đầu khỏe mạnh.',
    },
    {
      image: 'assets/images/sanpham.avif',
      name: 'Tạo kiểu & Sản phẩm',
      description: 'Sử dụng các sản phẩm cao cấp để tạo kiểu tóc bền đẹp, chuẩn phong cách barber.',
    },
  ];
}
