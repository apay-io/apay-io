import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {currencies} from '../../../assets/currencies-list';
import {ModalService} from '../../services/modal/modal.service';
import {FormControl} from "@angular/forms";
import {ReplaySubject, Subject} from "rxjs/index";
import {MatSelect} from "@angular/material";
import {take, takeUntil} from "rxjs/internal/operators";

interface Token {
    code: string,
    name: string,
    icon: string,
    issuer: string,
    change: string,
    usd: string,
    volume: string,
    depth: string,
    graph: Array<number>,
    convert: string,
    favorites: string,
}

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit-page.component.html',
  styleUrls: ['./deposit-page.component.scss']
})

export class DepositPageComponent implements OnInit, OnDestroy, AfterViewInit {
    currencies;
    selectedToken = {
        code: null,
        name: null,
        icon: null,
        issuer: null
    };
    arraySearchValue = [];

    @ViewChild('searchInput', {static: false}) searchElementDesktop: ElementRef;
    @ViewChild('searchInput', {static: false}) searchElement: MatSelect;

    private _onDestroy = new Subject<void>();
    public tokenCtrl: FormControl = new FormControl();
    public tokenFilterCtr: FormControl = new FormControl();
    public filteredTokens: ReplaySubject<Token[]> = new ReplaySubject<Token[]>(1);
    private tokens : Token[] = currencies;

    constructor(
        public modalService: ModalService
    ) {
        this.currencies = currencies;
    }

    ngOnInit() {
        this.arraySearchValue = this.currencies;
        this.filteredTokens.next(this.tokens.slice());

        this.tokenFilterCtr.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterTokens();
            });
    }

    ngAfterViewInit() {
        this.setInitialValue();
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    private setInitialValue() {
        this.filteredTokens
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                this.searchElement.compareWith = (a: Token, b: Token) => a.name === b.name;
            });
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
        this.selectedToken = {
            code: event.code,
            name: event.name,
            icon: event.icon,
            issuer: event.issuer,
        };
    }

    clearFilter() {
        this.tokenFilterCtr.setValue('');
        this.arraySearchValue = this.currencies;
        this.searchElementDesktop.nativeElement.focus();
    }
}
