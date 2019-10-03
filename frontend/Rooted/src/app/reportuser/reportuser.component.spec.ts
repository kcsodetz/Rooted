import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportuserComponent } from './reportuser.component';

describe('ReportuserComponent', () => {
  let component: ReportuserComponent;
  let fixture: ComponentFixture<ReportuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
