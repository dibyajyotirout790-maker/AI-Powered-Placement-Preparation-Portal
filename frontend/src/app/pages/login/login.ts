import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  login() {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }

    this.loading = true;

    const data = {
      email: this.email.trim(),
      password: this.password
    };

    console.log('Login data:', data);

    this.apiService.login(data).subscribe({

      next: (response) => {

        console.log('Login response:', response);

        this.loading = false;

        // Save JWT if backend returns one
        if (response?.token) {
          localStorage.setItem('token', response.token);
        }

        // Save user information
        if (response?.user) {
          localStorage.setItem(
            'user',
            JSON.stringify(response.user)
          );
        }

        this.successMessage =
          response?.message || 'Login successful!';

        // Move to home quickly
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 700);
      },

      error: (error) => {

        console.error('Login error:', error);

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Login failed. Please check your email and password.';
      }

    });
  }
}