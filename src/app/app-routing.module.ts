import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ConvertPageComponent} from "./convert-page/convert-page.component";
import {DepositComponent} from "./deposit/deposit.component";


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
    component: DepositComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
