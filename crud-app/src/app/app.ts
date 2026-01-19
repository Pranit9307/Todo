import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router'; // Import RouterLink and RouterLinkActive
import { CommonModule, isPlatformBrowser } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule], // Add CommonModule and RouterModule
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('crud-app');

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  get isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('username');
    }
    return false;
  }

  get username(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('username');
    }
    return null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('username');
    }
    this.router.navigate(['/login']);
  }
}
