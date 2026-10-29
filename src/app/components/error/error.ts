import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../Enums/Role';

@Component({
  imports: [],
  standalone:true,
  selector: 'app-error',
  styleUrl: './error.css',
  templateUrl: './error.html',
})
export class Error {

  role = localStorage.getItem('role');

  constructor(private router: Router) {}

  navigateToDashboard(): void {
    if (this.role === Role.Admin) {
      this.router.navigate(['/admindashboard']);
    }
    else if (this.role === Role.Officer) {
      this.router.navigate(['/officerdashboard']);
    }
    else if (this.role === Role.Customer) {
      this.router.navigate(['/customerdashboard']);
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
