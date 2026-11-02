import { Component, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { Toasts } from './components/toasts/toasts';
import { Navbar } from './shared/layout/navbar/navbar';
import { SidebarComponent } from './components/sidebar/sidebar';


@Component({
  imports: [RouterOutlet, Toasts,Navbar, SidebarComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnDestroy {

  showNavbar = false;
  private routerSubscription: Subscription;

  constructor(private router: Router) {
    this.updateNavbarVisibility();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateNavbarVisibility();
      });
  }

  private updateNavbarVisibility(): void {
    const currentRoute = this.router.url.split('?')[0];

    const hiddenRoutes = [
      '/login',
      '/register',
      '/verify-email'
    ];

    this.showNavbar = !hiddenRoutes.includes(currentRoute);
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
