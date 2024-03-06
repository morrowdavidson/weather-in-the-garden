import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempPrecipChartComponent } from './temp-precip-chart.component';

describe('TempPrecipChartComponent', () => {
  let component: TempPrecipChartComponent;
  let fixture: ComponentFixture<TempPrecipChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TempPrecipChartComponent]
    });
    fixture = TestBed.createComponent(TempPrecipChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
