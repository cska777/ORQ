import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OeuvreDetailsComponent } from './oeuvre-details.component';

describe('OeuvreDetailsComponent', () => {
  let component: OeuvreDetailsComponent;
  let fixture: ComponentFixture<OeuvreDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OeuvreDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OeuvreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
