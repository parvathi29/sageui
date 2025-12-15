import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputRequirementsComponent } from './input-requirements.component';

describe('InputRequirementsComponent', () => {
  let component: InputRequirementsComponent;
  let fixture: ComponentFixture<InputRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputRequirementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
