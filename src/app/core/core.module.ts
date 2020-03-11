import { NgModule } from '@angular/core';
import {CurrencySelectionService} from './currency-selection.service';
import {NotifyService} from './notify.service';
import {GetCurrenciesServices} from './get-currencies.services';
import {ControlsCustomModalService} from './controls-custom-modal.service';

@NgModule({
  imports: [
  ],
  providers: [
    CurrencySelectionService,
    ControlsCustomModalService,
    NotifyService,
    GetCurrenciesServices
  ]
})
export class CoreModule { }
