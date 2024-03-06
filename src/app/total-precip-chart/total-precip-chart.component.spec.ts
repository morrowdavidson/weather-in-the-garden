import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPrecipChartComponent } from './total-precip-chart.component';

describe('TotalPrecipChartComponent', () => {
  let component: TotalPrecipChartComponent;
  let fixture: ComponentFixture<TotalPrecipChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalPrecipChartComponent]
    });
    fixture = TestBed.createComponent(TotalPrecipChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
