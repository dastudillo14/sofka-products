import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProductComponent } from './pages/list-product/list-product.component';
import { FormProductComponent } from './pages/form-product/form-product.component';

const routes: Routes = [
  {
    path: '',
    component: ListProductComponent,
  },
  {
    path: 'new',
    component: FormProductComponent,
  },
  {
    path: 'edit/:id',
    component: FormProductComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
