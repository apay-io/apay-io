import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {sparkline} from '@fnando/sparkline';
import {CurrencySelectionService} from "../core/currency-selection.service";

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
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {
    displayedColumns: string[] = ['icon', 'name', 'change', 'usd', 'volume', 'depth', 'graph', 'convert'];
    dataSource: MatTableDataSource<UserData>;

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    users;
    isMobile;

    constructor(
        public currencySelectionService: CurrencySelectionService
    ) {
        this.users = [
            {
                'icon': 'https://apay.io/public/logo/btc.svg',
                'name': 'Bitcoin',
                'code': 'BTC',
                'change': '-0.25',
                'usd': '0.0000090',
                'volume': '0',
                'depth': '5,026,742',
                'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
                'convert': '1',
                'favorites': '2'
            },
            {
                'icon': 'https://apay.io/public/logo/bch.svg',
                'name': 'Bitcoin Cash',
                'code': 'BCH',
                'change': '+0.252',
                'usd': '0.02000090',
                'volume': '20',
                'depth': '25,026,742',
                'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
                'convert': '1',
                'favorites': '2'
            },
            {
                'icon': 'https://apay.io/public/logo/eth.png',
                'name': 'Ethereum',
                'code': 'ETH',
                'change': '-0.25',
                'usd': '0.0000090',
                'volume': '0',
                'depth': '5,026,742',
                'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
                'convert': '1',
                'favorites': '2'
            },
            {
                'icon': './../../assets/img/1.png',
                'name': 'Ethereum',
                'code': 'ETH',
                'change': '+0.252',
                'usd': '0.02000090',
                'volume': '20',
                'depth': '25,026,742',
                'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
                'convert': '1',
                'favorites': '2'
            },
            {
                'icon': './../../assets/img/1.png',
                'name': 'Bancor',
                'code': 'BNT',
                'change': '-0.25',
                'usd': '0.0000090',
                'volume': '0',
                'depth': '5,026,742',
                'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
                'convert': '1',
                'favorites': '2'
            },
            {
                'icon': './../../assets/img/1.png',
                'name': 'Ethereum',
                'code': 'ETH',
                'change': '+0.252',
                'usd': '0.02000090',
                'volume': '20',
                'depth': '25,026,742',
                'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
                'convert': '1',
                'favorites': '2'
            },
            {
                'icon': './../../assets/img/1.png',
                'name': 'Bancor',
                'code': 'BNT',
                'change': '-0.25',
                'usd': '0.0000090',
                'volume': '0',
                'depth': '5,026,742',
                'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
                'convert': '1',
                'favorites': '2'
            },
            {
                'icon': './../../assets/img/1.png',
                'name': 'Ethereum',
                'code': 'ETH',
                'change': '+0.252',
                'usd': '0.02000090',
                'volume': '20',
                'depth': '25,026,742',
                'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
                'convert': '1',
                'favorites': '2'
            },
            {
                'icon': './../../assets/img/1.png',
                'name': 'Bancor',
                'code': 'BNT',
                'change': '-0.25',
                'usd': '0.0000090',
                'volume': '0',
                'depth': '5,026,742',
                'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
                'convert': '1',
                'favorites': '2'
            },
            {
                'icon': './../../assets/img/1.png',
                'name': 'Ethereum',
                'code': 'ETH',
                'change': '+0.252',
                'usd': '0.02000090',
                'volume': '20',
                'depth': '25,026,742',
                'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
                'convert': '1',
                'favorites': '2'
            },
            {
                'icon': './../../assets/img/1.png',
                'name': 'Bancor',
                'code': 'BNT',
                'change': '-0.25',
                'usd': '0.0000090',
                'volume': '0',
                'depth': '5,026,742',
                'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
                'convert': '1',
                'favorites': '2'
            },
            {
                'icon': './../../assets/img/1.png',
                'name': 'Ethereum',
                'code': 'ETH',
                'change': '+0.252',
                'usd': '0.02000090',
                'volume': '20',
                'depth': '25,026,742',
                'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
                'convert': '1',
                'favorites': '2'
            },
            {
                'icon': './../../assets/img/1.png',
                'name': 'Bancor',
                'code': 'BNT',
                'change': '-0.25',
                'usd': '0.0000090',
                'volume': '0',
                'depth': '5,026,742',
                'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
                'convert': '1',
                'favorites': '2'
            },
            {
                'icon': './../../assets/img/1.png',
                'name': 'Ethereum',
                'code': 'ETH',
                'change': '+0.252',
                'usd': '0.02000090',
                'volume': '20',
                'depth': '25,026,742',
                'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
                'convert': '1',
                'favorites': '2'
            },
        ];

        this.dataSource = new MatTableDataSource(this.users);
    }

    ngOnInit() {
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        setTimeout(() => {
            this.users.forEach((item, id) => {
            sparkline(document.getElementsByClassName('sparkline')[id], item.graph);
            });
        }, 2000);

        if (window.innerWidth >= 1024) {
            this.isMobile = false;
        } else {
            this.isMobile = true;
        }
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    currencySelection(event, type: 'buy' | 'sell') {
        this.currencySelectionService.changeCurrency(event, type)
    }
}
