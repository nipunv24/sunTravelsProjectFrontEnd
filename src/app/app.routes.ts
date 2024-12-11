import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddContractComponent } from './add-contract/add-contract.component';
import { ManageContractsComponent } from './manage-contracts/manage-contracts.component';
import { SearchContractsComponent } from './search-contracts/search-contracts.component';
import { SearchResultsComponent } from './search-results/search-results.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route (Home)
  { path: 'add-contract', component: AddContractComponent }, // Add Contract Page
  { path: 'manage-contracts', component: ManageContractsComponent }, // Manage Contracts Page
  { path: 'search-contracts', component: SearchContractsComponent },
  { path: 'search-results', component: SearchResultsComponent}
];

export const appRouterProviders = [provideRouter(routes)];
