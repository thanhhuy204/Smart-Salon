import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavLink {
  label: string;
  routerLink: string;
  fragment?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private authService = inject(AuthService);

  isMenuOpen = signal(false);
  hasScrolled = signal(false);
  isDropdownOpen = signal(false);

  currentUser = this.authService.currentUser;
  isLoggedIn = this.authService.isLoggedIn.bind(this.authService);

  navLinks: NavLink[] = [
    { label: 'Giới thiệu', routerLink: '/', fragment: 'about' },
    { label: 'Đặt lịch',   routerLink: '/booking' },
    { label: 'Bảng giá',   routerLink: '/', fragment: 'pricing' },
    { label: 'Sản phẩm',   routerLink: '/shop' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.hasScrolled.set(window.scrollY > 10);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-user-menu]')) {
      this.isDropdownOpen.set(false);
    }
  }

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
    this.isDropdownOpen.set(false);
    this.isMenuOpen.set(false);
  }
}
