import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedViewComponent } from './advanced-view.component';

describe('AdvancedViewComponent', () => {
  let component: AdvancedViewComponent;
  let fixture: ComponentFixture<AdvancedViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedViewComponent]
    });
    fixture = TestBed.createComponent(AdvancedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
