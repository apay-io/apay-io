import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ControlsCustomModalService} from './core/controls-custom-modal.service';

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
      public controlsCustomModalService: ControlsCustomModalService,
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

  async logout() {
    this.loginFlag = false;
    localStorage.setItem('account', '');
    this.publicKey = '';
    await this.router.navigate(['/']);
    window.location.href = '/';
  }

  routeAccount() {
    if (!this.loginFlag) {
      this.controlsCustomModalService.open('login');
      return false;
    }
  }

}


