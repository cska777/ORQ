import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindFilmsComponent } from './find-films.component';

describe('FindFilmsComponent', () => {
  let component: FindFilmsComponent;
  let fixture: ComponentFixture<FindFilmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindFilmsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindFilmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
