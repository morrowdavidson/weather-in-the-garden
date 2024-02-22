import { Routes } from '@angular/router';
import { AdvancedViewComponent } from './advanced-view/advanced-view.component';
import { BasicViewComponent } from './basic-view/basic-view.component';

export const allAppRoutes: Routes = [
  { path: '', component: BasicViewComponent },
  { path: 'advanced', component: AdvancedViewComponent },
];
