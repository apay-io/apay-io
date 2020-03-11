import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalService} from '../../services/modal/modal.service';
import {StellarService} from '../../services/stellar/stellar.service';
import {Router} from '@angular/router';
import {ControlsCustomModalService} from '../../core/controls-custom-modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    modalInfo;
    step = 'choose';
    loading = false;
    isAddressValid = true;

    @Input() currentComponent: string;
    @Output() public outFlagLogin = new EventEmitter();

    @ViewChild('address', {static: false}) ElementAddress: ElementRef;
    @ViewChild('trezor', {static: false}) ElementTrezor: ElementRef;

    constructor(
        public modalService: ModalService,
        public controlsCustomModalService: ControlsCustomModalService,
        private readonly stellarService: StellarService,
        private readonly router: Router,
    ) {
      this.controlsCustomModalService.modal.subscribe(
        event => {
          this.modalInfo = event;
        }
      );
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
            this.controlsCustomModalService.close('login');
            this.clear();
            this.router.navigate(['/account']);
          } else {
            this.isAddressValid = false;
          }
          this.loading = false;
        });
    }

    closeModal() {
      this.controlsCustomModalService.close('login');
      this.clear();
    }

    clear() {
        this.step = 'choose';
    }
}
