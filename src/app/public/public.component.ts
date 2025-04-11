import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss'
})
export class PublicComponent {
  isMenuOpen = false;
  isReportDropdownOpen: boolean = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleDropdown() {
    this.isReportDropdownOpen = !this.isReportDropdownOpen;
    
  }
}
