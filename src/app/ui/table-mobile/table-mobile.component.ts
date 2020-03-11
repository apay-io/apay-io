import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {sparkline} from '@fnando/sparkline';
import {CurrencySelectionService} from '../../core/currency-selection.service';
import {ControlsCustomModalService} from '../../core/controls-custom-modal.service';

export interface UserData {
    icon: string;
    name: string;
    change: string;
    usd: string;
    volume: string;
    depth: string;
    graph;
}

@Component({
  selector: 'app-table-mobile',
  templateUrl: './table-mobile.component.html',
  styleUrls: ['./table-mobile.component.scss']
})

export class TableMobileComponent implements OnInit {
    displayedColumns: string[] = ['icon', 'name', 'change', 'usd'];
    dataSource: MatTableDataSource<UserData>;
    @Input() currencyTableInfo: object;
    @Input() getInfoCurrencies;

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    currencies;
    searchValue;

    constructor(
        public currencySelectionService: CurrencySelectionService,
        public controlsCustomModalService: ControlsCustomModalService,
    ) {
    }

    ngOnInit() {
      this.dataSource = new MatTableDataSource(this.getInfoCurrencies);
      this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    currencySelection(event, type: 'buy' | 'sell') {
        this.searchValue = '';
        this.applyFilter(this.searchValue);
        this.currencySelectionService.changeCurrency(event, type);
        this.controlsCustomModalService.close('choiceCurrency');
    }
}
