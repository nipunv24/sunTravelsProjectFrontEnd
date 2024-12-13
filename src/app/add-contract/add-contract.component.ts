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
  loadedWrong: boolean = false;
  unequalDates: boolean = false;
  endDateWrong: boolean = false;
  markupWrong: boolean = false; // New flag for markup validation
  errorMessage: string | null = null;

  constructor(
    private contractService: ContractService,
    private router: Router
  ) {}

  

  goBack() {
    this.router.navigate(['']);
  }

  submitContractData() {
    // Clear previous error messages
    this.resetValidationFlags();

    // Validate required fields, dates, markup, and room types
    if (!this.validateRequiredFields()) {
      window.scrollTo(0, 0);
      return;
    }

    if (!this.validateStartEndDates()) {
      window.scrollTo(0, 0);
      return;
    }

    if (!this.validateEndDate()) {
      window.scrollTo(0, 0);
      return;
    }

    if (!this.validateMarkup()) {
      window.scrollTo(0, 0);
      return;
    }

    if (!this.validateRoomTypes()) {
      window.scrollTo(0, 0);
      return;
    }

    // If all validations pass, proceed to submit the contract data
    this.submitContract();
  }

  private resetValidationFlags() {
    this.loadedWrong = false;
    this.unequalDates = false;
    this.endDateWrong = false;
    this.markupWrong = false; // Reset the markupWrong flag
    this.errorMessage = null;
  }

  private validateRequiredFields(): boolean {
    if (!this.hotelName || !this.startDate || !this.endDate) {
      this.loadedWrong = true;
      this.errorMessage = 'Please fill all required fields.';
      return false;
    }
    return true;
  }

  private validateStartEndDates(): boolean {
    const startDateObj = new Date(this.startDate);
    const endDateObj = new Date(this.endDate);
    if (startDateObj.getTime() === endDateObj.getTime()) {
      this.unequalDates = true;
      this.errorMessage = 'Start date and end date cannot be the same.';
      return false;
    }
    return true;
  }

  private validateEndDate(): boolean {
    const today = new Date();
    const endDateObj = new Date(this.endDate);
    // Check if the end date is not after today or is equal to today
    if (endDateObj <= today) {
      this.endDateWrong = true;
      this.errorMessage = 'End date must be after today\'s date.';
      return false;
    }
    return true;
  }

  private validateMarkup(): boolean {
    if (this.markup >= 1) {
      this.markupWrong = true;
      this.errorMessage = 'Markup must be greater than 1.';
      return false;
    }
    return true;
  }

  private validateRoomTypes(): boolean {
    for (const roomType of this.roomTypes) {
      if (!roomType.roomTypeName || roomType.basePrice <= 0 || roomType.numberOfRooms <= 0 || roomType.maxAdults <= 0) {
        this.loadedWrong = true;
        this.errorMessage = 'Please fill all fields for room types with valid values.';
        return false;
      }
    }
    return true;
  }

  private submitContract() {
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
        this.loadedWrong = false;
      },
      error: (err) => {
        console.error('Error:', err);
        alert(err); // Display the error message propagated by handleError
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
