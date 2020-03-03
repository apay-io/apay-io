import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ModalService} from '../../services/modal/modal.service';
import {currencies} from '../../../assets/currencies-list';
import {ReplaySubject, Subject} from 'rxjs/index';
import {takeUntil} from 'rxjs/internal/operators';
import {FormControl} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {Currency} from '../../core/currency.interface';

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

    memoTypes: memoTypes[] = [
        {value: '0', viewValue: 'None'},
        {value: '1', viewValue: 'Text'},
        {value: '2', viewValue: 'ID'}
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
    private tokens: Token[] = currencies;

    constructor(
        public modalService: ModalService
    ) {
        // remove XLM token
        this.tokens = this.tokens.filter( token => token.code !== 'XLM');
    }

    ngOnInit() {
        this.arraySearchValue = this.tokens;
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
        this.arraySearchValue = this.tokens.filter(token => token.name.toLowerCase().indexOf(search) > -1);
        this.filteredTokens.next(this.arraySearchValue);
    }

    selectToken(event) {
        this.selectedToken = event;
    }

    clearFilter() {
        this.tokenFilterCtr.setValue('');
        this.arraySearchValue = this.tokens;
        this.searchElementDesktop.nativeElement.focus();
    }
}
