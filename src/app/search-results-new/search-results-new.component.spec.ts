import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchResultsNewComponent } from './search-results-new.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';  // Import ActivatedRoute
import { of } from 'rxjs';  // Import `of` to simulate observables
// Optionally, you can create a custom mock class

describe('SearchResultsNewComponent', () => {
  let component: SearchResultsNewComponent;
  let fixture: ComponentFixture<SearchResultsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsNewComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => {
                if (key === 'id') return 'dummyId';  // Mock value for a specific route parameter
                return null;
              }
            }),
            // If you're using queryParams or other observables in your component, mock them as well:
            queryParams: of({ search: 'test' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
