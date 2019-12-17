import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ConvertPageComponent} from "./main/convert-page/convert-page.component";
import {DepositPageComponent} from "./main/deposit-page/deposit-page.component";
import {WithdrawPageComponent} from "./main/withdraw-page/withdraw-page.component";
import {AccountPageComponent} from "./main/account-page/account-page.component";


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
  },
  {
    path: 'withdraw',
    component: WithdrawPageComponent
  },
  {
    path: 'processing',
    loadChildren: './+convert-processing/convert-processing.module#ConvertProcessingModule'
  },
  {
    path: 'account',
    component: AccountPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
