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
  logoPath: string = 'assets/logo.jpg';
  selections: { numberOfRooms: number; numberOfAdults: number }[] = []; // Parsed selection array

  constructor(
    private contractService: ContractService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to query parameters
    this.route.queryParams.subscribe((params) => {
      try {
        this.selections = params['selections'] ? JSON.parse(params['selections']) : [];
      } catch (e) {
        console.error('Error parsing selections:', e);
      }

      const searchData = {
        checkInDate: params['checkInDate'],
        numberOfNights: params['numberOfNights'],
        selections: this.selections, // Use the parsed or default empty array
      };

      // Fetch the results based on the search data
      this.contractService.searchContracts(searchData).subscribe({
        next: (response) => {
          this.results = response.map((hotel: any) => ({
            ...hotel,
            rooms: hotel.rooms.map((room: any) => this.processRoom(room)),
            totalHotelPrice: 0, // Initialize the hotel total price to 0
          }));
          console.log('Search Results:', this.results);
        },
        error: (err) => {
          console.error('Search Error:', err);
        },
      });
    });
  }

  processRoom(room: any) {
    // Find the matching selection based on the room's maxAdults
    const matchingSelection = this.selections.find(
      (sel) => sel.numberOfAdults === room.maxAdults
    );

    // If a matching selection is found, calculate NumberOfRoomsNew and totalPrice
    const numberOfRoomsNew = matchingSelection?.numberOfRooms || 0;
    const totalPrice = numberOfRoomsNew * room.basePrice;

    return {
      ...room,
      numberOfRoomsNew,
      totalPrice,
    };
  }

  onRoomSelectionChange(room: any, event: any) {
    // Get the current hotel for the selected room
    const hotel = this.results.find(hotel => hotel.rooms.includes(room));

    if (!hotel) return;

    if (event.target.checked) {
      // Add the room's total price to the hotel total price when selected
      hotel.totalHotelPrice += room.totalPrice;
    } else {
      // Subtract the room's total price from the hotel total price when unselected
      hotel.totalHotelPrice -= room.totalPrice;
    }
  }

  // Navigate back to the search page
  goBack() {
    this.router.navigate(['search-contracts']);
  }
}
