import { Component } from '@angular/core';
import { ContractService } from '../contract.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-contract',
  standalone: true,
  imports: [FormsModule, NgFor, CommonModule],
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.css']
})
export class AddContractComponent {
  title = 'SunTravels Add Contract';

  hotelName: string = '';
  startDate: string = '';
  endDate: string = '';
  markup: number = 0;
  roomTypes: any[] = [{ roomTypeName: '', basePrice: 0, numberOfRooms: 0, maxAdults: 1 }];
  loadedWrong: boolean = false;  // Track if any required fields are missing

  constructor(
    private contractService: ContractService,
    private router: Router
  ) {}

  goBack() {
    this.router.navigate(['']);
  }

  submitContractData() {
    // Check if required fields are empty
    if (!this.hotelName || !this.startDate || !this.endDate) {
      this.loadedWrong = true;  // Set to true if required fields are empty

      window.scrollTo(0, 0);
      
      return;  // Prevent form submission if validation fails
    }

    // If validation passes, prepare and submit the contract data
    const startDateFormatted = this.startDate.split('T')[0];
    const endDateFormatted = this.endDate.split('T')[0];

    const contractData = {
      hotelName: this.hotelName,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
      markup: this.markup,
      roomTypes: this.roomTypes
    };

    this.contractService.postContractData(contractData).subscribe({
      next: (response) => {
        console.log('Success:', response);
        alert('Contract data submitted successfully');
        this.loadedWrong = false;  // Reset after successful submission
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Failed to submit contract data.');
      },
    });
  }

  addRoomType() {
    this.roomTypes.push({ roomTypeName: '', basePrice: 0, numberOfRooms: 0, maxAdults: 1 });
  }

  removeRoomType(index: number) {
    this.roomTypes.splice(index, 1);
  }
}
