import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RainComponent } from './rain/rain.component';
import { AdvancedViewComponent } from './advanced-view/advanced-view.component';

const routes: Routes = [
  { path: '', component: RainComponent },
  { path: 'advanced', component: AdvancedViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
