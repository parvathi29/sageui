import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarProjectsComponent } from './sidebar-projects.component';

describe('SidebarProjectsComponent', () => {
  let component: SidebarProjectsComponent;
  let fixture: ComponentFixture<SidebarProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
