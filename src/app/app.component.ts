import {Component, OnInit} from '@angular/core';
import {LoginService} from "./core/login-service";
import {Router} from "@angular/router";
import {GetCurrenciesServices} from "./core/get-currencies.services";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'papaya';
  loginFlag: boolean;
  publicKey;
  publicKeyPart;
    constructor(
      public loginServices: LoginService,
      public readonly router: Router
    ) {}

  ngOnInit() {
    if (localStorage.getItem('account')) {
      this.loginFlag = true;
      this.accountInfo();
      return false
    }
    this.loginFlag = false;

    this.router.events.subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  receiveLoginFlag(event) {
    this.loginFlag = event;
    this.accountInfo();
  }

  accountInfo() {
    this.publicKey = localStorage.getItem('account');
    this.publicKeyPart = this.publicKey.substring(0,4) + '...' + this.publicKey.substring(this.publicKey.length - 4,this.publicKey.length);
  }

  logout() {
    this.loginFlag = false;
    localStorage.setItem('account', '');
    this.publicKey = '';
    this.router.navigate(['/']);
  }

  routeAccount() {
    if (!this.loginFlag) {
      this.loginServices.open();
      return false;
    }
  }

}


