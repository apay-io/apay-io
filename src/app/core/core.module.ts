import { NgModule } from '@angular/core';
import {CurrencySelectionService} from "./currency-selection.service";
import {LoginService} from "./login-service";

@NgModule({
  imports: [
  ],
  providers: [
    CurrencySelectionService,
    LoginService
  ]
})
export class CoreModule { }
