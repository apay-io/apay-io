import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
@Injectable()
export class CurrencySelectionService {
    public select: Subject<any> = new Subject<any>();

    changeCurrency(rowData, type: 'buy' | 'sell') {
        const currencyInfo = {
            data: rowData,
            'typeCurrency': type
        };

        this.select.next(currencyInfo);
    }
}
