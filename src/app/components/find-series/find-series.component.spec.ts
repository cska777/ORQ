import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindSeriesComponent } from './find-series.component';

describe('FindSeriesComponent', () => {
  let component: FindSeriesComponent;
  let fixture: ComponentFixture<FindSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindSeriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
