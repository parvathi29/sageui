import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAutomationShellComponent } from './test-automation-shell.component';

describe('TestAutomationShellComponent', () => {
  let component: TestAutomationShellComponent;
  let fixture: ComponentFixture<TestAutomationShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAutomationShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestAutomationShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
