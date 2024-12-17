import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeIn', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('1s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class HomeComponent {
  constructor(private router: Router) { }
  imagePath: string = 'assets/backgroundImage.jpg';
  logoPath: string = 'assets/logo.jpg';
  image1Path: string = 'assets/image1.jpg';
  image2Path: string = 'assets/image2.jpg';
  image3Path: string = 'assets/image3.png';

  navigateToAddContract() {
    this.router.navigate(['/add-contract']);
  }

  navigateToManageContracts() {
    this.router.navigate(['/manage-contracts']);
  }

  navigateToSearchContracts() {
    this.router.navigate(['/search-contracts']);
  }
}
