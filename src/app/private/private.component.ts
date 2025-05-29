import { Component } from '@angular/core';
import { RouterLink, RouterOutlet,RouterLinkActive } from '@angular/router';
import { Collapse, initTWE} from "tw-elements";
import { Router } from '@angular/router';

@Component({
  selector: 'app-private',
  standalone: true,
  imports: [RouterOutlet, RouterLink,RouterLinkActive],
  templateUrl: './private.component.html',
  styleUrl: './private.component.scss'
})
export class PrivateComponent {
  ngOnInit(){

    initTWE({ Collapse });
 
  }
constructor(private router: Router){}
  isMenuOpen = false;
  isReportDropdownOpen: boolean = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleDropdown() {
    this.isReportDropdownOpen = !this.isReportDropdownOpen;
    
  }
  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/public/home']);
  }


}
