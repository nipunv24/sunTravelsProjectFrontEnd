import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchContractsComponent } from './search-contracts.component';
import {HttpClientTestingModule} from '@angular/common/http/testing'


describe('SearchContractsComponent', () => {
  let component: SearchContractsComponent;
  let fixture: ComponentFixture<SearchContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchContractsComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
