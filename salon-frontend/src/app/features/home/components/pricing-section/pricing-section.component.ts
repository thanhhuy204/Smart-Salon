import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface HairstyleCard {
  image: string;
  name: string;
  price: number;
}

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pricing-section.component.html',
  styleUrl: './pricing-section.component.scss',
})
export class PricingSectionComponent {
  hairstyles: HairstyleCard[] = [
    { image: 'assets/images/toc1.avif', name: 'Undercut cổ điển', price: 120000 },
    { image: 'assets/images/toc2.avif', name: 'Fade low', price: 130000 },
    { image: 'assets/images/toc3.avif', name: 'Pompadour', price: 150000 },
    { image: 'assets/images/toc4.avif', name: 'Textured crop', price: 120000 },
    { image: 'assets/images/toc5.avif', name: 'Side part', price: 110000 },
    { image: 'assets/images/toc6.avif', name: 'Buzz cut', price: 80000 },
    { image: 'assets/images/toc7.avif', name: 'Slick back', price: 140000 },
    { image: 'assets/images/toc8.avif', name: 'French crop', price: 130000 },
  ];

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + ' ₫';
  }
}
