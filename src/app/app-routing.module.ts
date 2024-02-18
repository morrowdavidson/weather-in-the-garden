import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvancedViewComponent } from './advanced-view/advanced-view.component';
import { BasicViewComponent } from './basic-view/basic-view.component';

const routes: Routes = [
  { path: '', component: BasicViewComponent },
  { path: 'advanced', component: AdvancedViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
