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
  logoPath: string = 'assets/logo.jpg';
  addMessage: string = '';

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
  roomNameEmpty: boolean = false;
  roomsNumberAndAdultsWrong: boolean = false;
  roomBasePriceWrong: boolean = false;
  roomBasePriceError: string | null = null;
  roomCountAndAdultsError: string | null = null;

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

    if (!this.validateRoomTypeName()) {
      window.scrollTo(0, 0);
      return;
    }
    
    if (!this.validateRoomCountAndAdultCount()) {
      window.scrollTo(0, 0);
      return;
    }
    
    if (!this.validateRoomBasePrice()) {
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
    this.roomBasePriceWrong = false;
    this.roomNameEmpty = false;
    this.roomsNumberAndAdultsWrong = false;
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
    const startDateObj = new Date(this.startDate);
    const today = new Date();
    const endDateObj = new Date(this.endDate);
    // Check if the end date is not after today or is equal to today
    if (endDateObj <= today) {
      this.endDateWrong = true;
      this.errorMessage = 'End date must be after today\'s date.';
      return false;
    }

    if (startDateObj > endDateObj) {
      this.endDateWrong = true;
      this.errorMessage = 'Start date cannot be after the end date.';
      return false;
    }

    
    return true;
  }

  private validateMarkup(): boolean {
    if (this.markup < 0 || this.markup > 100) {
      this.markupWrong = true;
      this.errorMessage = 'Markup must be greater than 100.';
      return false;
    }
    return true;
  }

  private validateRoomTypeName(): boolean {
    for (const roomType of this.roomTypes) {
      if (!roomType.roomTypeName) {
        this.roomNameEmpty = true;
        this.errorMessage = 'Please fill all fields for room types with valid values.';
        return false;
      }
    }
    return true;
  }

  private validateRoomBasePrice(): boolean {
    this.roomBasePriceError = null;
    for (const roomType of this.roomTypes) {
      if (roomType.basePrice <= 0) {
        this.roomBasePriceWrong = true;
        this.roomBasePriceError = '(Base Price cannot be negative!)';
        return false;
      }
    }
    return true;
  }

  private validateRoomCountAndAdultCount(): boolean {
    this.roomCountAndAdultsError = null;
    for (const roomType of this.roomTypes) {
      if (!Number.isInteger(roomType.numberOfRooms) || !Number.isInteger(roomType.maxAdults) || roomType.numberOfRooms<0 || roomType.maxAdults<0) {
        this.roomsNumberAndAdultsWrong = true;
        this.roomCountAndAdultsError = '(Number of rooms and adults should be positive integers!)';
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
      markup: (this.markup)/100,
      roomTypes: this.roomTypes
    };

    console.log(this.markup);

    this.contractService.postContractData(contractData).subscribe({
      next: (response) => {
        console.log('Success:', response);
        window.scrollTo(0, 0);
        this.addMessage = 'Contract added successfully';
        setTimeout(()=>{
          this.addMessage = '';
        },3000);
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
