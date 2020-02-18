import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalService} from "../../services/modal/modal.service";
import {LoginService} from "../../core/login-service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    step = 'choose';

    @Input() currentComponent: string;
    @Output() public outFlagLogin = new EventEmitter();

    @ViewChild('address', {static: false}) ElementAddress: ElementRef;
    @ViewChild('trezor', {static: false}) ElementTrezor: ElementRef;

    constructor(
        public modalService: ModalService,
        public loginServices: LoginService
    ) {
    }

    ngOnInit() {

    }

    stepAddress() {
        this.step = 'login-nickname-address';
        setTimeout(() => {
            this.ElementAddress.nativeElement.focus();
        }, 300)
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
      localStorage.setItem('account', account);
      this.outFlagLogin.emit(true);
      this.loginServices.close();
      this.clear();
    }

    closeModal() {
      this.loginServices.close();
      this.clear();
    }

    clear() {
        this.step = 'choose'
    }
}
