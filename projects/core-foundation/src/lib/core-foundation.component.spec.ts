import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreFoundationComponent } from './core-foundation.component';

describe('CoreFoundationComponent', () => {
  let component: CoreFoundationComponent;
  let fixture: ComponentFixture<CoreFoundationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreFoundationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreFoundationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
