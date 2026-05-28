import { Component } from '@angular/core';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { ServicesSectionComponent } from './components/services-section/services-section.component';
import { TeamSectionComponent } from './components/team-section/team-section.component';
import { PricingSectionComponent } from './components/pricing-section/pricing-section.component';
import { ProductsSectionComponent } from './components/products-section/products-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    AboutSectionComponent,
    ServicesSectionComponent,
    TeamSectionComponent,
    PricingSectionComponent,
    ProductsSectionComponent,
  ],
  template: `
    <app-hero-section />
    <app-about-section />
    <app-services-section />
    <app-team-section />
    <app-pricing-section />
    <app-products-section />
  `,
})
export class HomeComponent {}
