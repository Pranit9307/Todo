import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';

  constructor(private router: Router, private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  login() {
    const credentials = {
      username: this.username,
      password: this.password
    };

    this.http.post('http://localhost:8000/api/login', credentials).subscribe({
      next: (response: any) => {
        alert('Login Successful!');
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('username', this.username); // Save username
        }
        this.router.navigate(['/posts']);
      },
      error: (error) => {
        alert('Invalid Credentials');
        console.error('Login error', error);
      }
    });
  }
}
