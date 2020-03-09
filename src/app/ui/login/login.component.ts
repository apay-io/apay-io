import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalService} from '../../services/modal/modal.service';
import {LoginService} from '../../core/login-service';
import {StellarService} from '../../services/stellar/stellar.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    step = 'choose';
    loading = false;
    isAddressValid = true;

    @Input() currentComponent: string;
    @Output() public outFlagLogin = new EventEmitter();

    @ViewChild('address', {static: false}) ElementAddress: ElementRef;
    @ViewChild('trezor', {static: false}) ElementTrezor: ElementRef;

    constructor(
        public modalService: ModalService,
        public loginServices: LoginService,
        private readonly stellarService: StellarService,
        private readonly router: Router,
    ) {
    }

    ngOnInit() {

    }

    stepAddress() {
        this.step = 'login-nickname-address';
        setTimeout(() => {
            this.ElementAddress.nativeElement.focus();
        }, 300);
    }

    stepLedger() {
        this.step = 'login-ledger';
    }

    stepTresor() {
        this.step = 'login-trezor';
        setTimeout(() => {
            this.ElementTrezor.nativeElement.focus();
        }, 300)
    }

    login(account) {
      this.loading = true;
      this.isAddressValid = true;
      this.stellarService.balances(account)
        .then((result) => {
          if (result.length) {
            localStorage.setItem('account', account);
            this.outFlagLogin.emit(true);
            this.loginServices.close();
            this.clear();
            this.router.navigate(['/account']);
          } else {
            this.isAddressValid = false;
          }
          this.loading = false;
        });
    }

    closeModal() {
      this.loginServices.close();
      this.clear();
    }

    clear() {
        this.step = 'choose';
    }
}
