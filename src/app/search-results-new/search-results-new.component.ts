import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../contract.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-results-new',
  templateUrl: './search-results-new.component.html',
  styleUrls: ['./search-results-new.component.css'],
  imports: [CommonModule]
})
export class SearchResultsNewComponent implements OnInit {
  results: any[] = []; // Array to store the search results

  constructor(
    private contractService: ContractService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to query parameters
    this.route.queryParams.subscribe((params) => {
      let selections = [];
      try {
        selections = params['selections'] ? JSON.parse(params['selections']) : [];
      } catch (e) {
        console.error('Error parsing selections:', e);
      }
  
      const searchData = {
        checkInDate: params['checkInDate'],
        numberOfNights: params['numberOfNights'],
        selections: selections, // Use the parsed or default empty array
      };
  
      // Fetch the results based on the search data
      this.contractService.searchContracts(searchData).subscribe({
        next: (response) => {
          this.results = response; // Assign the fetched results
          console.log('Search Results:', response);
        },
        error: (err) => {
          console.error('Search Error:', err);
        },
      });
    });
  }

  // Navigate back to the search page
  goBack() {
    this.router.navigate(['search-contracts']);
  }
}
