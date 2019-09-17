import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ConvertPageComponent} from "./main/convert-page/convert-page.component";
import {DepositPageComponent} from "./main/deposit-page/deposit-page.component";


const routes: Routes = [
  {
    path: '',
    component: ConvertPageComponent
  },
  {
    path: 'convert',
    component: ConvertPageComponent
  },
  {
    path: 'deposit',
    component: DepositPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
