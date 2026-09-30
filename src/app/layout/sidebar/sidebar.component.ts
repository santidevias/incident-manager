import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  protected authService = inject(AuthService);
  isMobileMenuOpen = input<boolean>(false);
  toggleMenu = output<void>();
  closeMenu = output<void>();

  toggleMobileMenu(): void {
    this.toggleMenu.emit();
  }

  closeMobileMenu(): void {
    this.closeMenu.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}
