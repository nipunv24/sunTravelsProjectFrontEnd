import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContractService } from '../contract.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-contracts',
  standalone: true,
  imports: [FormsModule, NgFor, CommonModule],
  templateUrl: './search-contracts.component.html',
  styleUrls: ['./search-contracts.component.css']
})
export class SearchContractsComponent implements OnInit {
  checkInDate: string = '';
  numberOfNights: number = 1;
  selections: any[] = [{ numberOfRooms: 1, numberOfAdults: 1 }];
  results: any[] = [];

  constructor(
    private router: Router,
    private contractService: ContractService
  ) {}

  ngOnInit(): void {
    // Load form data from sessionStorage if it exists
    const storedData = sessionStorage.getItem('searchFormData');
    if (storedData) {
      const formData = JSON.parse(storedData);
      this.checkInDate = formData.checkInDate || '';
      this.numberOfNights = formData.numberOfNights || 1;
      this.selections = formData.selections || [{ numberOfRooms: 1, numberOfAdults: 1 }];
    }
  }

  goBack() {
    this.router.navigate(['']);
  }

  addSelection() {
    this.selections.push({ numberOfRooms: 1, numberOfAdults: 1 });
    this.saveFormData();  // Save form data to sessionStorage
  }

  removeSelection(index: number) {
    this.selections.splice(index, 1);
    this.saveFormData();  // Save form data to sessionStorage
  }

  submitSearchData() {
    // Check if the check-in date is provided
    if (!this.checkInDate || this.checkInDate.trim() === '') {
      alert('Check-In Date is required.');
      return; // Stop the function if validation fails
    }

    // Create the search data object
    const searchData = {
      checkInDate: this.checkInDate,
      numberOfNights: this.numberOfNights,
      selections: this.selections
    };

    // Call the service to fetch results based on searchData
    this.contractService.searchContracts(searchData).subscribe({
      next: (response) => {
        this.results = response; // Assign fetched results to display later
        console.log('Search Results:', response);

        // Navigate to the new search results page with fetched data
        this.router.navigate(['/search-results-new'], {
          queryParams: {
            checkInDate: this.checkInDate,
            numberOfNights: this.numberOfNights,
            selections: JSON.stringify(this.selections), // Serialize the selections array
          },
        });
        sessionStorage.removeItem('searchFormData'); // Clear session storage after search
      },
      error: (err) => {
        console.error('Search Error:', err);
        alert(err);
      }
    });
  }

  // Save form data to sessionStorage
  saveFormData() {
    const formData = {
      checkInDate: this.checkInDate,
      numberOfNights: this.numberOfNights,
      selections: this.selections
    };
    sessionStorage.setItem('searchFormData', JSON.stringify(formData));
  }
}
