import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
@Injectable()
export class CurrencySelectionService {
    public select: Subject<any> = new Subject<any>();

    changeCurrency(rowData, type: 'buy' | 'sell') {
        const currencyInfo = {
            data: {
                'code': rowData.code,
                'name': rowData.name,
                'icon': rowData.icon
            },
            'typeCurrency': type
        };

        this.select.next(currencyInfo);
    }
}