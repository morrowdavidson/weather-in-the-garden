import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicViewComponent } from './basic-view.component';

describe('BasicViewComponent', () => {
  let component: BasicViewComponent;
  let fixture: ComponentFixture<BasicViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasicViewComponent]
    });
    fixture = TestBed.createComponent(BasicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
