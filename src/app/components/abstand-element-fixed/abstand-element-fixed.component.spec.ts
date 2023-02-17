import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstandElementFixedComponent } from './abstand-element-fixed.component';

describe('AbstandElementFixedComponent', () => {
  let component: AbstandElementFixedComponent;
  let fixture: ComponentFixture<AbstandElementFixedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbstandElementFixedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstandElementFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
