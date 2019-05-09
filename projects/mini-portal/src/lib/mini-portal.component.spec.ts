import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniPortalComponent } from './mini-portal.component';

describe('MiniPortalComponent', () => {
  let component: MiniPortalComponent;
  let fixture: ComponentFixture<MiniPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
