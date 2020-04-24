import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ModalService} from '../../services/modal/modal.service';
import {currencies} from '../../../assets/currencies-list';
import {ReplaySubject, Subject} from 'rxjs/index';
import {takeUntil} from 'rxjs/internal/operators';
import {FormControl} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {Currency} from '../../core/currency.interface';
import {HttpClient} from '@angular/common/http';
import {StellarService} from '../../services/stellar/stellar.service';
import {environment} from '../../../environments/environment';

interface Token {
  code: string;
  name: string;
  icon: string;
  issuer?: string;
  change: string;
  usd: string;
  volume: string;
  depth: string;
  graph: Array<number>;
  convert: string;
  favorites: string;
}

export interface memoTypes {
  value: string;
  viewValue: string;
}


export interface selectedToken {
  code: string;
  name: string;
  icon: string;
  issuer: string;
}


@Component({
  selector: 'app-exchange-info',
  templateUrl: './exchange-info.component.html',
  styleUrls: ['./exchange-info.component.scss']
})
export class ExchangeInfoComponent implements OnInit, OnDestroy {
  selectedToken: Currency;
  stellarAddress: string;
  memoValue: string;
  selectedMemoType: string;
  depositAddress: string;
  errorMessage = '';
  loading = false;

  memoTypes: memoTypes[] = [
    {value: 'none', viewValue: 'None'},
    {value: 'text', viewValue: 'Text'},
    {value: 'id', viewValue: 'ID'}
  ];
  arraySearchValue = [];

  @Input() currentComponent: string;

  @ViewChild('searchInputDesktop', {static: false}) searchElementDesktop: ElementRef;
  @ViewChild('searchInput', {static: false}) searchElement: MatSelect;

  private _onDestroy = new Subject<void>();
  public tokenCtrl: FormControl = new FormControl();
  public tokenFilterCtr: FormControl = new FormControl();
  public tokenWithdraw: FormControl = new FormControl();
  public filteredTokens: ReplaySubject<Token[]> = new ReplaySubject<Token[]>(1);
  private tokens: Token[] = Object.assign([], currencies);
  public fundingFee = false;
  public xdr: string;

  constructor(public modalService: ModalService,
              private stellarService: StellarService,
              private readonly http: HttpClient) {
    // remove XLM token
    this.tokens = this.tokens.filter(token => token.code !== 'XLM');
  }

  ngOnInit() {
    this.selectedMemoType = 'none';
    this.arraySearchValue = this.tokens;
    console.log(this.arraySearchValue);
    this.filteredTokens.next(this.tokens.slice());

    this.tokenFilterCtr.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTokens();
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private filterTokens() {
    if (!this.tokens) {
      return;
    }
    let search = this.tokenFilterCtr.value;
    if (!search) {
      this.filteredTokens.next(this.tokens.slice());
      this.arraySearchValue = this.tokens.slice();
      return;
    } else {
      search = search.toLowerCase();
    }
    this.arraySearchValue = this.tokens.filter(token =>
      token.code.toLowerCase().indexOf(search) > -1 || token.name.toLowerCase().indexOf(search) > -1
    );
    this.filteredTokens.next(this.arraySearchValue);
  }

  selectToken(event) {
    this.errorMessage = '';
    this.stellarAddress = '';
    this.selectedMemoType = 'none';
    this.memoValue = '';
    this.selectedToken = event;
  }

  clearFilter() {
    this.tokenFilterCtr.setValue('');
    this.arraySearchValue = this.tokens;
    this.searchElementDesktop.nativeElement.focus();
  }

  getAddress() {
    this.loading = true;
    this.errorMessage = '';
    this.http.get(`${environment.api}/api/deposit?account=` + this.stellarAddress +
      `&asset_code=` + this.selectedToken.code +
      (this.selectedMemoType !== 'none' ? `&memo_type=` + this.selectedMemoType + `&memo=` + this.memoValue : '')).subscribe(
      async (res) => {
        this.depositAddress = res['how'];
        if (res['extra_info'] && res['extra_info']['message'] && res['extra_info']['message'].indexOf('will be funded') > -1) {
          this.fundingFee = true;
          this.modalService.open('deposit');
        } else if (res['extra_info'] && res['extra_info']['message'] && res['extra_info']['message'].indexOf('Trustline') > -1) {
          this.xdr = await this.stellarService.buildTrustlineTx(this.stellarAddress, this.selectedToken.code, this.selectedToken.issuer);
          this.modalService.open('trustline');
        } else {
          this.modalService.open('deposit');
        }
        this.loading = false;
      },
      err => {
        this.errorMessage = err.error.error;
        this.loading = false;
      });
  }
}
