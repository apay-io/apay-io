import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule, MatInputModule} from '@angular/material';
import {ModalComponent} from "../_directives/modal.component";
@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ModalComponent,
  ],
  exports: [
    ModalComponent,
  ]
})
export class UiModule {}
