import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../contract.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  imports: [FormsModule, NgFor, CommonModule],
})
export class SearchResultsComponent implements OnInit {
  results: any[] = [];

  constructor(
    private contractService: ContractService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // This will be used to capture the search data from the route
    this.route.queryParams.subscribe(params => {
      const searchData = {
        checkInDate: params['checkInDate'],
        numberOfNights: params['numberOfNights'],
        selections: JSON.parse(params['selections'])
      };

      // Fetch the results based on the data passed
      this.contractService.searchContracts(searchData).subscribe({
        next: (response) => {
          this.results = response; // Assign the fetched results to display
          console.log('Search Results:', response);
        },
        error: (err) => {
          console.error('Search Error:', err);
        }
      });
    });
  }
}
