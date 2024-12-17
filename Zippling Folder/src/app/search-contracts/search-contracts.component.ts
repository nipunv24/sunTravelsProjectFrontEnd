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
  checkInDateWrong: boolean = false;
  checkInDateEmpty: boolean = false;
  logoPath: string = 'assets/logo.jpg';
  duplicateAdultsError: boolean = false;

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
    this.checkInDateWrong = false;
    this.checkInDateEmpty = false;
    this.duplicateAdultsError = false;

    if (!this.validateCheckInDateNonEmpty()) {
      window.scrollTo(0, 0); // Scroll to the top of the page
      return;
    }

    if (!this.validateCheckInDate()) {
      window.scrollTo(0, 0); // Scroll to the top of the page
      return;
    }

    if (!this.validateUniqueAdults()) {
      window.scrollTo(0, 0); // Scroll to the top of the page
      return;
    }


    const searchData = {
      checkInDate: this.checkInDate,
      numberOfNights: this.numberOfNights,
      selections: this.selections
    };

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
        console.error('Error during search:', err);
      },
    });
  }

  private validateCheckInDate(): boolean {
    const today = new Date();
    const checkInDateObj = new Date(this.checkInDate);

    if (checkInDateObj < today) {
      this.checkInDateWrong = true;
      return false;
    }
    return true;
  }

  private validateCheckInDateNonEmpty(): boolean {
    if (!this.checkInDate) {
      this.checkInDateEmpty = true;
      return false;
    }
    return true;
  }

  private validateUniqueAdults(): boolean {
    this.duplicateAdultsError = false;
    const adultsSet = new Set<number>();
  
    for (const selection of this.selections) {
      if (adultsSet.has(selection.numberOfAdults)) {
        this.duplicateAdultsError = true;
        return false;
      }
      adultsSet.add(selection.numberOfAdults);
    }
    return true;
  }

  saveFormData() {
    const formData = {
      checkInDate: this.checkInDate,
      numberOfNights: this.numberOfNights,
      selections: this.selections
    };
    sessionStorage.setItem('searchFormData', JSON.stringify(formData));
  }
}
