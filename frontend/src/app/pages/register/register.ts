import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name = '';
  email = '';
  password = '';
  role = 'student';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  register() {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.loading = true;

    const data = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password,
      role: this.role
    };

    console.log('Registration data:', data);

    this.apiService.register(data).subscribe({

      next: (response) => {

        console.log('Registration response:', response);

        this.loading = false;

        this.successMessage =
          response?.message ||
          'Registration successful!';

        // Clear form
        this.name = '';
        this.email = '';
        this.password = '';

        // Go to login after short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 900);
      },

      error: (error) => {

        console.error('Registration error:', error);

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Registration failed. Please try again.';
      }

    });
  }
}