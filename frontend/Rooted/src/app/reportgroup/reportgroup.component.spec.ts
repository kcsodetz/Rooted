import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportgroupComponent } from './reportgroup.component';

describe('ReportgroupComponent', () => {
  let component: ReportgroupComponent;
  let fixture: ComponentFixture<ReportgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
