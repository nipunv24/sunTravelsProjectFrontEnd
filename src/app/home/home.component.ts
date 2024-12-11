import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router){}

  navigateToAddContract(){
    this.router.navigate(['/add-contract']);
  }

  navigateToManageContracts(){
    this.router.navigate(['/manage-contracts']);
  }

  navigateToSearchContracts(){
    this.router.navigate(['/search-contracts']);
  }
}
