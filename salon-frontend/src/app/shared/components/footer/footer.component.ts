import { Component } from '@angular/core';

interface SocialLink {
  platform: string;
  ariaLabel: string;
  url: string;
  svgPath: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socialLinks: SocialLink[] = [
    {
      platform: 'Facebook',
      ariaLabel: 'Theo dõi trên Facebook',
      url: 'https://facebook.com',
      svgPath: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
    },
    {
      platform: 'Instagram',
      ariaLabel: 'Theo dõi trên Instagram',
      url: 'https://instagram.com',
      svgPath: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5a1 1 0 1 0-1-1 1 1 0 0 0 1 1zM21 8a9 9 0 0 0-9-9H12A9 9 0 0 0 3 8v.08a9 9 0 0 0 9 12.92A9 9 0 0 0 21 12.08z',
    },
    {
      platform: 'TikTok',
      ariaLabel: 'Theo dõi trên TikTok',
      url: 'https://tiktok.com',
      svgPath: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.16 8.16 0 0 0 4.78 1.52V7.02a4.85 4.85 0 0 1-1.01-.33z',
    },
    {
      platform: 'YouTube',
      ariaLabel: 'Theo dõi trên YouTube',
      url: 'https://youtube.com',
      svgPath: 'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
    },
  ];
}
