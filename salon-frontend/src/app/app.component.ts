import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';

const SHELL_HIDDEN_PREFIXES = ['/admin', '/auth'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private router = inject(Router);

  showShell = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => !SHELL_HIDDEN_PREFIXES.some(p => (e as NavigationEnd).urlAfterRedirects.startsWith(p))),
      startWith(!SHELL_HIDDEN_PREFIXES.some(p => this.router.url.startsWith(p)))
    ),
    { initialValue: true }
  );
}
