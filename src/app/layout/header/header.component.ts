import { Component, output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  toggleMenu = output<void>();

  toggleMobileMenu(): void {
    this.toggleMenu.emit();
  }
}
