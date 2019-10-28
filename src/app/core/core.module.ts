import { NgModule } from '@angular/core';
import {CurrencySelectionService} from "./currency-selection.service";
import {LoginService} from "./login-service";
import {NotifyService} from "./notify.service";

@NgModule({
  imports: [
  ],
  providers: [
    CurrencySelectionService,
    LoginService,
    NotifyService,
  ]
})
export class CoreModule { }
