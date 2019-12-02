import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteAdminPageComponent } from './site-admin-page.component';

describe('SiteAdminPageComponent', () => {
  let component: SiteAdminPageComponent;
  let fixture: ComponentFixture<SiteAdminPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteAdminPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
