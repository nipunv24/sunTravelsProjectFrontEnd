import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageContractsComponent } from './manage-contracts.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ContractService } from '../contract.service';
import { throwError } from 'rxjs';

describe('ManageContractsComponent', () => {
  let component: ManageContractsComponent;
  let fixture: ComponentFixture<ManageContractsComponent>;
  let contractService: jasmine.SpyObj<ContractService>;

  beforeEach(async () => {
    // Create a spy object for ContractService
    contractService = jasmine.createSpyObj('ContractService', ['getContracts', 'deleteContract']);

      // Mock the return value for getContracts and deleteContract
    contractService.getContracts.and.returnValue(of([])); // returns an empty array for getContracts by default
    contractService.deleteContract.and.returnValue(of({})); // returns an empty object for deleteContract by default

    await TestBed.configureTestingModule({
      imports: [ManageContractsComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ContractService, useValue: contractService },
        CurrencyPipe, DatePipe, PercentPipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load contracts on init', () => {
    const mockContracts = [
      { contractId: 1, hotelName: 'Hotel 1', startDate: '2024-01-01', endDate: '2024-12-31', markup: 10, roomTypes: [] },
      { contractId: 2, hotelName: 'Hotel 2', startDate: '2024-02-01', endDate: '2024-11-30', markup: 12, roomTypes: [] }
    ];
    
    contractService.getContracts.and.returnValue(of(mockContracts));
    
    component.ngOnInit();
    
    expect(component.contracts.length).toBe(2);
    expect(component.contracts).toEqual(mockContracts);
  });

  it('should display no contracts message if no contracts are available', () => {
    contractService.getContracts.and.returnValue(of([]));
    
    component.ngOnInit();
    
    fixture.detectChanges();
    const noContractsMessage = fixture.debugElement.nativeElement.querySelector('.no-contracts-message');
    expect(noContractsMessage).toBeTruthy();
    expect(noContractsMessage.textContent).toContain('No contracts available.');
  });

  it('should open contract details popup when a contract is clicked', () => {
    const mockContract = { contractId: 1, hotelName: 'Test Hotel', startDate: '2024-01-01', endDate: '2024-12-31', markup: 10, roomTypes: [] };
  
    // Call the viewDetails method
    component.viewDetails(mockContract);
  
    // Manually trigger change detection to ensure the view is updated
    fixture.detectChanges();
  
    // Check if the selectedHotel was updated correctly
    expect(component.selectedHotel).toEqual(mockContract);
  
    // Check if the popup content is rendered
    const popupContent = fixture.debugElement.nativeElement.querySelector('.popup-content');
    expect(popupContent).toBeTruthy();
  });

  it('should close the popup when close button is clicked', () => {
    component.selectedHotel = { contractId: 1, hotelName: 'Test Hotel' };

    component.closePopup();

    expect(component.selectedHotel).toBeNull();
    const popup = fixture.debugElement.nativeElement.querySelector('.popup-overlay');
    expect(popup).toBeNull();
  });

  it('should delete a contract and update the contracts list', () => {
    const mockContracts = [
      { contractId: 1, hotelName: 'Hotel 1', startDate: '2024-01-01', endDate: '2024-12-31', markup: 10, roomTypes: [] },
      { contractId: 2, hotelName: 'Hotel 2', startDate: '2024-02-01', endDate: '2024-11-30', markup: 12, roomTypes: [] }
    ];
    
    component.contracts = mockContracts;
    
    contractService.deleteContract.and.returnValue(of({}));
    
    component.deleteContract(1);
    
    expect(component.contracts.length).toBe(1);
    expect(component.contracts.find(contract => contract.contractId === 1)).toBeUndefined();
    expect(component.deleteMessage).toBe('Contract deleted successfully');
  });

  it('should handle error when deleting a contract', () => {
    const mockContracts = [
      { contractId: 1, hotelName: 'Hotel 1', startDate: '2024-01-01', endDate: '2024-12-31', markup: 10, roomTypes: [] }
    ];
    
    component.contracts = mockContracts;
    
    contractService.deleteContract.and.returnValue(of({}));
    
    // Simulate an error during deletion
    contractService.deleteContract.and.returnValue(throwError(() => new Error('Error deleting contract')));

    spyOn(window, 'alert');

    component.deleteContract(1);

    expect(window.alert).toHaveBeenCalledWith('An error occurred while deleting the contract');
  });

  it('should show delete success message for 3 seconds', () => {
    component.deleteMessage = 'Contract deleted successfully';
    fixture.detectChanges();

    const successMessage = fixture.debugElement.nativeElement.querySelector('.success-message');
    expect(successMessage).toBeTruthy();
    expect(successMessage.textContent).toContain('Contract deleted successfully');

    // Wait 3 seconds and check that the success message disappears
    setTimeout(() => {
      expect(component.deleteMessage).toBe('');
      fixture.detectChanges();
      const successMessageAfterTimeout = fixture.debugElement.nativeElement.querySelector('.success-message');
      expect(successMessageAfterTimeout).toBeNull();
    }, 3000);
  });

  it('should navigate back when back button is clicked', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.goBack();
    expect(routerSpy).toHaveBeenCalledWith(['']);
  });
});
