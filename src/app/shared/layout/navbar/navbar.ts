
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/Auth/auth';
import { Role } from '../../../Enums/Role';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  userEmail = localStorage.getItem('userEmail') ?? '';
  role = localStorage.getItem('role') ?? '';

  constructor(
    private router: Router,
    private authServices: Auth
  ) {}

  navigateToDashboard(): void {
    switch (this.role) {
      case Role.Admin:
        this.router.navigate(['/admindashboard']);
        break;

      case Role.Officer:
        this.router.navigate(['/officerdashboard']);
        break;

      case Role.Customer:
        this.router.navigate(['/customerdashboard']);
        break;

      default:
        this.router.navigate(['/login']);
        break;
    }
  }

  logout(): void {
    this.authServices.logout();
    this.router.navigate(['/login']);
  }
}
