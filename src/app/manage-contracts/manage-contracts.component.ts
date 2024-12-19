import { Component, OnInit } from '@angular/core';
import { ContractService } from '../contract.service';
import { DatePipe, CurrencyPipe, PercentPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-contracts',
  templateUrl: './manage-contracts.component.html',
  styleUrls: ['./manage-contracts.component.css'],
  providers: [DatePipe],
  imports: [CommonModule],
})
export class ManageContractsComponent implements OnInit {
  contracts: any[] = []; // Store the contracts
  selectedHotel: any = null; // Store the selected hotel for the popup
  logoPath: string = 'assets/logo.jpg';
  deleteMessage: string = ''; // Success message for deletion
  showDeletePrompt: boolean = false; // Toggle for delete confirmation prompt

  constructor(
    private contractService: ContractService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private percentPipe: PercentPipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch contracts on component initialization
    this.contractService.getContracts().subscribe({
      next: (data) => {
        this.contracts = data; // Store the fetched contracts
      },
      error: (error) => {
        console.error('Error fetching contracts:', error); // Handle errors
      },
    });
  }

  // Format date for display
  formatDate(date: any): string | null {
    return this.datePipe.transform(date, 'shortDate');
  }

  // Format markup as percentage
  formatPercent(markup: any): string | null {
    return this.percentPipe.transform(markup);
  }

  // Format price as currency
  formatCurrency(price: any): string | null {
    return this.currencyPipe.transform(price);
  }

  // Navigate back to the previous route
  goBack() {
    this.router.navigate(['']);
  }

  // View details for the selected contract
  viewDetails(contract: any) {
    this.selectedHotel = contract; // Set the selected hotel
    this.showDeletePrompt = false; // Ensure delete prompt is hidden when viewing details
  }

  // Close the popup
  closePopup() {
    this.selectedHotel = null; // Reset the selected hotel to null
    this.showDeletePrompt = false; // Hide delete prompt
  }

  // Delete contract by contractId
  deleteContract(contractId: number) {
    this.contractService.deleteContract(contractId).subscribe({
      next: () => {
        // Remove the deleted contract from the array
        this.contracts = this.contracts.filter(
          (contract) => contract.contractId !== contractId
        );
        this.closePopup(); // Close the popup after deletion
        this.deleteMessage = 'Contract deleted successfully'; // Show success message
        setTimeout(() => {
          this.deleteMessage = ''; // Clear the success message after 3 seconds
        }, 3000);
      },
      error: (error) => {
        console.error('Error deleting contract:', error);
        alert('An error occurred while deleting the contract');
      },
    });
  }
}
