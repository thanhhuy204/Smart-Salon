import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-success.component.html'
})
export class BookingSuccessComponent {
  private router = inject(Router);
  bookingData: any;

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['booking']) {
      this.bookingData = navigation.extras.state['booking'];
    }
  }

  goToAppointments() {
    this.router.navigate(['/profile/appointments']);
  }
}
