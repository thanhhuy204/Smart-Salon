import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ProductCard {
  image: string;
  name: string;
  description: string;
  price: number;
}

@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './products-section.component.html',
  styleUrl: './products-section.component.scss',
})
export class ProductsSectionComponent {
  products: ProductCard[] = [
    {
      image: 'assets/images/sp1.avif',
      name: 'Wax tạo kiểu tóc',
      description: 'Giữ nếp cả ngày, không bết dính, hương thơm nhẹ nhàng. Phù hợp mọi kiểu tóc.',
      price: 180000,
    },
    {
      image: 'assets/images/sp2.avif',
      name: 'Dầu gội đặc trị',
      description: 'Làm sạch sâu, nuôi dưỡng da đầu, giảm gãy rụng tóc hiệu quả.',
      price: 150000,
    },
    {
      image: 'assets/images/sp3.avif',
      name: 'Keo xịt định hình',
      description: 'Giữ kiểu tóc bền vững suốt ngày dài, dễ gội sạch, không làm hỏng tóc.',
      price: 120000,
    },
  ];

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + ' ₫';
  }
}
