import { NgModule } from '@angular/core';
import {CurrencySelectionService} from "./currency-selection.service";
import {LoginService} from "./login-service";
import {NotifyService} from "./notify.service";
import {GetCurrenciesServices} from "./get-currencies.services";

@NgModule({
  imports: [
  ],
  providers: [
    CurrencySelectionService,
    LoginService,
    NotifyService,
    GetCurrenciesServices
  ]
})
export class CoreModule { }
