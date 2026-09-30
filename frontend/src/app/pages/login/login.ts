import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(): void {

    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate input
    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }

    this.loading = true;

    const data = {
      email: this.email.trim(),
      password: this.password
    };

    console.log('Login data:', {
      email: data.email
    });

    this.apiService.login(data).subscribe({

      next: (response: any) => {

        console.log('Login response:', response);

        this.loading = false;

        /*
         * localStorage is available only in the browser.
         * This check prevents the Vercel/Angular SSR build
         * from throwing:
         * "ReferenceError: localStorage is not defined"
         */
        if (isPlatformBrowser(this.platformId)) {

          // Save JWT token
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

          // Save role separately if available
          if (response?.user?.role) {
            localStorage.setItem(
              'role',
              response.user.role
            );
          }
        }

        this.successMessage =
          response?.message || 'Login successful!';

        /*
         * Navigate to home page after successful login.
         */
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 700);
      },

      error: (error: any) => {

        console.error('Login error:', error);

        this.loading = false;

        /*
         * Handle different possible backend error formats.
         */
        if (error?.error?.message) {

          this.errorMessage = error.error.message;

        } else if (error?.error?.error) {

          this.errorMessage = error.error.error;

        } else if (error?.status === 401) {

          this.errorMessage =
            'Invalid email or password.';

        } else if (error?.status === 404) {

          this.errorMessage =
            'Login service not found. Please try again later.';

        } else if (error?.status === 0) {

          this.errorMessage =
            'Unable to connect to the server. Please check the backend connection.';

        } else {

          this.errorMessage =
            'Login failed. Please check your email and password.';
        }
      }

    });
  }
}