import { Component, OnInit } from '@angular/core';
import { ContractService } from '../contract.service';
import { DatePipe, CurrencyPipe, PercentPipe } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-manage-contracts',
  imports: [NgFor, NgIf],
  templateUrl: './manage-contracts.component.html',
  styleUrl: './manage-contracts.component.css',
  providers: [DatePipe]
})
export class ManageContractsComponent implements OnInit {

  contracts: any[] = [];  // Declare a variable to store the contracts

  constructor(
    private contractService: ContractService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private percentPipe: PercentPipe
  ) { }

  ngOnInit(): void {
    // Call the service to get the contract data when the component is initialized
    this.contractService.getContracts().subscribe(
      (data) => {
        this.contracts = data;  // Store the fetched contracts in the component's variable
      },
      (error) => {
        console.error('Error fetching contracts:', error);  // Handle errors
      }
    );
  }

  formatDate(date: any): string | null {
    return this.datePipe.transform(date, 'shortDate');  // Format the date
  }

  formatPercent(markup: any): string | null {
    return this.percentPipe.transform(markup);  // Format the markup as percentage
  }

  // Format base price as currency
  formatCurrency(price: any): string | null {
    return this.currencyPipe.transform(price);  // Format the price as currency
  }

  // Delete contract by contractId
  deleteContract(contractId: number) {
    if (confirm('Are you sure you want to delete this contract?')) {
      this.contractService.deleteContract(contractId).subscribe(
        (response) => {
          // Remove the contract from the list after successful deletion
          this.contracts = this.contracts.filter(contract => contract.contractId !== contractId);
          alert('Contract deleted successfully.');
        },
        (error) => {
          console.error('Error deleting contract:', error);
          alert('Failed to delete contract.');
        }
      );
    }
  }
}
