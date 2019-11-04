import { Component } from '@angular/core';
import {LoginService} from "./core/login-service";
import {GetCurrenciesServices} from "./core/get-currencies.services";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'papaya';
    constructor(public loginServices: LoginService,
                public getCurrencies: GetCurrenciesServices) {
      this.getCurrencies.get()
    }
}


