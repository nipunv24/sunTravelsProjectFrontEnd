// import { Component, OnInit } from '@angular/core';
// import { ContractService } from '../contract.service';
// import { DatePipe, CurrencyPipe, PercentPipe } from '@angular/common';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-manage-contracts',
//   templateUrl: './manage-contracts.component.html',
//   styleUrls: ['./manage-contracts.component.css'],
//   providers: [DatePipe],
//   imports: [CommonModule]
// })
// export class ManageContractsComponent implements OnInit {

//   contracts: any[] = [];  // Declare a variable to store the contracts
//   selectedHotel: any = null;  // Store the selected hotel for the popup
//   logoPath: string = 'assets/logo.jpg';
//   deleteMessage: string = ''; 
  

//   constructor(
//     private contractService: ContractService,
//     private datePipe: DatePipe,
//     private currencyPipe: CurrencyPipe,
//     private percentPipe: PercentPipe,
//     private router: Router
//   ) { }

//   manageContractImagePath: string = 'assets/manageContractsImage.jpg';



//   ngOnInit(): void {
//     // Call the service to get the contract data when the component is initialized
//     this.contractService.getContracts().subscribe(
//       (data) => {
//         this.contracts = data;  // Store the fetched contracts in the component's variable
//       },
//       (error) => {
//         console.error('Error fetching contracts:', error);  // Handle errors
//       }
//     );
//   }

//   formatDate(date: any): string | null {
//     return this.datePipe.transform(date, 'shortDate');  // Format the date
//   }

//   formatPercent(markup: any): string | null {
//     return this.percentPipe.transform(markup);  // Format the markup as percentage
//   }

//   formatCurrency(price: any): string | null {
//     return this.currencyPipe.transform(price);  // Format the price as currency
//   }

//   // Go Back Button Routing
//   goBack() {
//     this.router.navigate(['']);
//   }

//   // View more details for the selected hotel
//   viewDetails(contract: any) {
//     this.selectedHotel = contract;  // Set the selected hotel to the clicked contract
//   }

//   // Close the popup
//   closePopup() {
//     this.selectedHotel = null;  // Reset the selected hotel to null to close the popup
//   }

//   // Delete contract by contractId
//   deleteContract(contractId: number) {
//     this.contractService.deleteContract(contractId).subscribe(
//       () => {
//         // Remove the deleted contract from the contracts array
//         this.contracts = this.contracts.filter(contract => contract.contractId !== contractId);
//         // Close the popup after deletion
//         this.closePopup();
//         this.deleteMessage = 'Contract deleted successfully'; //Set the success message
//         setTimeout(()=>{
//           this.deleteMessage = '';
//         }, 3000);
//       },
//       (error) => {
//         console.error('Error deleting contract:', error);
//         alert('An error occurred while deleting the contract');
//       }
//     );
//   }
// }



import { Component, OnInit } from '@angular/core';
import { ContractService } from '../contract.service';
import { DatePipe, CurrencyPipe, PercentPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-manage-contracts',
  templateUrl: './manage-contracts.component.html',
  styleUrls: ['./manage-contracts.component.css'],
  providers: [DatePipe],
  imports: [CommonModule]
})
export class ManageContractsComponent implements OnInit {

  contracts: any[] = [];  // Declare a variable to store the contracts
  selectedHotel: any = null;  // Store the selected hotel for the popup
  logoPath: string = 'assets/logo.jpg';
  deleteMessage: string = ''; 
  manageContractImagePath: string = 'assets/manageContractsImage.jpg';

  constructor(
    private contractService: ContractService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private percentPipe: PercentPipe,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Call the service to get the contract data when the component is initialized
    this.contractService.getContracts().subscribe({
      next: (data) => {
        this.contracts = data;  // Store the fetched contracts in the component's variable
      },
      error: (error) => {
        console.error('Error fetching contracts:', error);  // Handle errors
      }
    });
  }

  formatDate(date: any): string | null {
    return this.datePipe.transform(date, 'shortDate');  // Format the date
  }

  formatPercent(markup: any): string | null {
    return this.percentPipe.transform(markup);  // Format the markup as percentage
  }

  formatCurrency(price: any): string | null {
    return this.currencyPipe.transform(price);  // Format the price as currency
  }

  // Go Back Button Routing
  goBack() {
    this.router.navigate(['']);
  }

  // View more details for the selected hotel
  viewDetails(contract: any) {
    this.selectedHotel = contract;  // Set the selected hotel to the clicked contract
  }

  // Close the popup
  closePopup() {
    this.selectedHotel = null;  // Reset the selected hotel to null to close the popup
  }

  // Delete contract by contractId
  deleteContract(contractId: number) {
    this.contractService.deleteContract(contractId).subscribe({
      next: () => {
        // Remove the deleted contract from the contracts array
        this.contracts = this.contracts.filter(contract => contract.contractId !== contractId);
        // Close the popup after deletion
        this.closePopup();
        this.deleteMessage = 'Contract deleted successfully'; // Set the success message
        setTimeout(() => {
          this.deleteMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error deleting contract:', error);
        alert('An error occurred while deleting the contract');
      }
    });
  }
}

