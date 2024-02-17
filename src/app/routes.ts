import { Routes } from '@angular/router';
import { RainComponent } from './rain/rain.component';
import { AdvancedViewComponent } from './advanced-view/advanced-view.component';

export const allAppRoutes: Routes = [
  { path: '', component: RainComponent },
  { path: 'advanced', component: AdvancedViewComponent },
];
