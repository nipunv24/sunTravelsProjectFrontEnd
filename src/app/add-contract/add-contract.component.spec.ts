import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddContractComponent } from './add-contract.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';  // Import `of` for success and `throwError` for error handling
import { ContractService } from '../contract.service';

describe('AddContractComponent', () => {
  let component: AddContractComponent;
  let fixture: ComponentFixture<AddContractComponent>;
  let contractService: jasmine.SpyObj<ContractService>;

  beforeEach(async () => {
    // Create a spy object for ContractService
    contractService = jasmine.createSpyObj('ContractService', ['postContractData']);

    await TestBed.configureTestingModule({
      imports: [AddContractComponent, HttpClientTestingModule, FormsModule, RouterTestingModule],
      providers: [
        { provide: ContractService, useValue: contractService }  // Use the spy for the service
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should create the component', () => {
    expect(component).toBeTruthy();
  });



  it('should validate required fields and show error message', () => {
    component.hotelName = '';
    component.startDate = '';
    component.endDate = '';
    component.submitContractData();
    
    expect(component.loadedWrong).toBeTrue();
    expect(component.errorMessage).toBe('Please fill all required fields.');
  });



  it('should validate start and end dates', () => {
    component.hotelName = 'TestHotel';
    component.startDate = '2024-12-15';
    component.endDate = '2024-12-15'; // Same date, which is invalid
    component.markup = 10;
    component.roomTypes = [
      { roomTypeName: 'testRoomType', basePrice: 10, numberOfRooms: 10, maxAdults: 2 } // Invalid room type
    ];
    component.submitContractData();
    
    expect(component.unequalDates).toBeTrue();
    expect(component.errorMessage).toBe('Start date and end date cannot be the same.');
  });




  it('should validate end date to be after today', () => {
    const today = new Date().toISOString().split('T')[0];
    //Adding dummy data for other fields.
    component.hotelName = 'TestHotel';
    component.startDate = '2024-12-15';
    component.endDate = today; // Same date, which is invalid
    component.markup = 10;
    component.roomTypes = [
      { roomTypeName: 'testRoomType', basePrice: 10, numberOfRooms: 10, maxAdults: 2 } // Invalid room type
    ];
    component.submitContractData();
    
    expect(component.endDateWrong).toBeTrue();
    expect(component.errorMessage).toBe("End date must be after today's date.");
  });




  it('should validate markup percentage', () => {
        //Adding dummy data for other fields.
        component.hotelName = 'TestHotel';
        component.startDate = '2024-12-15';
        component.endDate = '2029-12-15'; 
        component.markup = -1;
        component.roomTypes = [
          { roomTypeName: 'testRoomType', basePrice: 10, numberOfRooms: 10, maxAdults: 2 } // Invalid room type
        ];
    component.submitContractData();
    expect(component.markupWrong).toBeTrue();
    expect(component.errorMessage).toBe('Markup must be greater than 100.');
  });




  it('should add and remove room types', () => {
    const initialRoomTypesCount = component.roomTypes.length;

    component.addRoomType();
    expect(component.roomTypes.length).toBe(initialRoomTypesCount + 1);

    component.removeRoomType(0);
    expect(component.roomTypes.length).toBe(initialRoomTypesCount);
  });



  it('should submit contract data successfully and show success message', () => {
    component.hotelName = 'Test Hotel';
    component.startDate = '2024-12-15';
    component.endDate = '2029-12-20';
    component.markup = 10;
    component.roomTypes = [
      { roomTypeName: 'Standard', basePrice: 100, numberOfRooms: 10, maxAdults: 2 }
    ];

    // Mock postContractData to return an Observable of success response
    contractService.postContractData.and.returnValue(of({ success: true }));

    component.submitContractData();
    
    expect(component.addMessage).toBe('Contract added successfully');
    setTimeout(() => {
      expect(component.addMessage).toBe('');
    }, 3000);
  });

  it('should not submit contract data if validation fails', () => {
    component.hotelName = 'Test Hotel';
    component.startDate = '2024-12-15';
    component.endDate = '2024-12-15'; // Invalid end date
    component.markup = 10;
    component.roomTypes = [
      { roomTypeName: 'Standard', basePrice: 100, numberOfRooms: 10, maxAdults: 2 }
    ];

    // Mock postContractData to return an Observable of success response
    contractService.postContractData.and.returnValue(of({ success: true }));

    component.submitContractData();

    expect(component.unequalDates).toBeTrue();
    expect(component.errorMessage).toBe('Start date and end date cannot be the same.');
  });



  it('should scroll to top when validation fails', () => {
    spyOn(window, 'scrollTo');
    
    component.hotelName = '';
    component.startDate = '';
    component.endDate = '';
    component.submitContractData();
    
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should correctly bind inputs', () => {
    const hotelNameInput = fixture.debugElement.query(By.css('#hotelName')).nativeElement;
    hotelNameInput.value = 'Hotel A';
    hotelNameInput.dispatchEvent(new Event('input'));
    
    fixture.detectChanges();
    
    expect(component.hotelName).toBe('Hotel A');
  });
});
