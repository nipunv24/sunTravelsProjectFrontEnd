import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsNewComponent } from './search-results-new.component';

describe('SearchResultsNewComponent', () => {
  let component: SearchResultsNewComponent;
  let fixture: ComponentFixture<SearchResultsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchResultsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
