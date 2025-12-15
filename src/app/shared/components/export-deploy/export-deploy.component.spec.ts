import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDeployComponent } from './export-deploy.component';

describe('ExportDeployComponent', () => {
  let component: ExportDeployComponent;
  let fixture: ComponentFixture<ExportDeployComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportDeployComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportDeployComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
