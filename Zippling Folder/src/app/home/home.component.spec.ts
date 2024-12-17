import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing'; // For testing routes
import { HttpClientTestingModule } from '@angular/common/http/testing'; // If HTTP is used
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router; // Mock router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule, // Provides Router for testing navigation
        HttpClientTestingModule // For HTTP mocking
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); // Get the instance of the Router
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to add-contract on Add Contracts button click', () => {
    spyOn(router, 'navigate'); // Spy on the navigate function
    const addContractButton = fixture.nativeElement.querySelector('.add-contract');
    addContractButton.click();
    expect(router.navigate).toHaveBeenCalledWith(['/add-contract']);
  });

  it('should navigate to manage-contracts on Manage & View Contracts button click', () => {
    spyOn(router, 'navigate');
    const manageContractsButton = fixture.nativeElement.querySelector('.manage-contracts');
    manageContractsButton.click();
    expect(router.navigate).toHaveBeenCalledWith(['/manage-contracts']);
  });

  it('should navigate to search-contracts on Search Hotels button click', () => {
    spyOn(router, 'navigate');
    const searchContractsButton = fixture.nativeElement.querySelector('.search-contracts');
    searchContractsButton.click();
    expect(router.navigate).toHaveBeenCalledWith(['/search-contracts']);
  });
});
