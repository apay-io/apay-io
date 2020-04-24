import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {StellarService} from '../../services/stellar/stellar.service';
import {Router} from '@angular/router';
import {ControlsCustomModalService} from '../../core/controls-custom-modal.service';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import Str from '@ledgerhq/hw-app-str';
import TrezorConnect, {DEVICE_EVENT} from 'trezor-connect';
import {NotifyService} from '../../core/notify.service';
import Timeout = NodeJS.Timeout;

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
  public ledgerAddress: string;
  private ledgerReconnect: Timeout;
  private bip32Path = `44'/148'/0'`;

  constructor(
    public controlsCustomModalService: ControlsCustomModalService,
    private notify: NotifyService,
    private readonly stellarService: StellarService,
    private readonly router: Router,
  ) {
    this.controlsCustomModalService.modal.subscribe(
      event => {
        this.modalInfo = event;
      }
    );
    TrezorConnect.manifest({
      email: 'support@apay.io',
      appUrl: 'https://beta.apay.io',
    });

    TrezorConnect.on(DEVICE_EVENT, (event) => {
      console.log(event);
    });
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
    this.connectLedger();
  }

  connectLedger() {
    this.loading = true;
    TransportU2F.create().then((transport) => {
      return new Str(transport).getPublicKey(this.bip32Path).then((result) => {
        this.loading = false;
        this.ledgerAddress = result.publicKey;
      });
    }).catch(err => {
      console.log(err);

      // Try again in 5 seconds if timeout error:
      // if (err.message && err.message.indexOf('U2F TIMEOUT') !== -1) {
        console.log('Connecting to Ledger failed. Trying again in 5 seconds...');
        this.ledgerReconnect = setTimeout(this.connectLedger, 5 * 1000);
      // }
    });
  }

  stepTresor() {
    this.step = 'login-trezor';
  }

  async login(account) {
    this.loading = true;
    clearTimeout(this.ledgerReconnect);
    let accountId;
    if (!this.stellarService.validateAddress(account) && account.indexOf('*') > -1) {
      try {
        const fed = await this.stellarService.resolveFederatedAddress(account);
        accountId = fed.account_id;
      } catch (err) {
        this.isAddressValid = false;
        this.loading = false;
        return;
      }
    }
    this.isAddressValid = true;
    localStorage.setItem('account', accountId || account);
    this.outFlagLogin.emit(true);
    this.controlsCustomModalService.close('login');
    this.clear();
    await this.router.navigate(['/account']);
    this.loading = false;
  }

  closeModal() {
    this.controlsCustomModalService.close('login');
    this.clear();
  }

  clear() {
    clearTimeout(this.ledgerReconnect);
    this.step = 'choose';
  }

  async loginTrezor(bip32Path: string) {
    this.loading = true;
    TrezorConnect.stellarGetAddress({
      path: 'm/' + bip32Path,
      showOnTrezor: false
    }).then((result) => {
      this.loading = false;
      if (!result.success) {
        this.notify.update('Could not connect to Trezor', 'error');
        return;
      }

      this.login(result.payload.address);
    });
  }

  updateLedgerAddress(event: KeyboardEvent) {
    this.bip32Path = (event.target as any).value;
    this.connectLedger();
  }
}
