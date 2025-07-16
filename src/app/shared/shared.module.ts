import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';



@NgModule({
  declarations: [
    ModalComponent,
    SkeletonComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ModalComponent,
    SkeletonComponent
  ]
})
export class SharedModule { }
