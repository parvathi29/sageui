import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTestInputComponent } from './unit-test-input.component';

describe('UnitTestInputComponent', () => {
  let component: UnitTestInputComponent;
  let fixture: ComponentFixture<UnitTestInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitTestInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitTestInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
