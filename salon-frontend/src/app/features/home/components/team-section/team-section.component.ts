import { Component } from '@angular/core';

interface Barber {
  image: string;
  name: string;
  role: string;
}

@Component({
  selector: 'app-team-section',
  standalone: true,
  templateUrl: './team-section.component.html',
  styleUrl: './team-section.component.scss',
})
export class TeamSectionComponent {
  barbers: Barber[] = [
    { image: 'assets/images/nv1.jpg', name: 'Minh Tuấn', role: 'Senior Barber' },
    { image: 'assets/images/nv2.jpg', name: 'Quang Huy', role: 'Barber' },
    { image: 'assets/images/nv3.jpg', name: 'Hoàng Nam', role: 'Barber' },
    { image: 'assets/images/nv4.jpg', name: 'Đức Thành', role: 'Barber' },
    { image: 'assets/images/nv5.jpg', name: 'Thanh Phong', role: 'Junior Barber' },
  ];
}
