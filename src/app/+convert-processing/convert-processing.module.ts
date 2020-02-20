import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ConvertProcessingRoutingModule} from './convert-processing.routing.module';
import {UiModule} from '../ui/ui.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalService} from '../services/modal/modal.service';
import {CoreModule} from '../core/core.module';
import {ConvertProcessingIndexComponent} from './convert-processing-index/convert-processing-index.component';
import {EnterAmountComponent} from './enter-amount/enter-amount.component';
import {MatSelectSearchModule} from '../ui/mat-select-search/mat-select-search.module';
import {EnterAddressComponent} from './enter-address/enter-address.component';
import {CheckDetailsComponent} from './check-details/check-details.component';
import {SendFundsComponent} from './send-funds/send-funds.component';
import {WaitExchangeComponent} from './wait-exchange/wait-exchange.component';
import {TxCompleteComponent} from './tx-complete/tx-complete.component';
import { QrCodeModule } from 'ng-qrcode';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    ConvertProcessingIndexComponent,
    EnterAmountComponent,
    EnterAddressComponent,
    CheckDetailsComponent,
    SendFundsComponent,
    WaitExchangeComponent,
    TxCompleteComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    ConvertProcessingRoutingModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    UiModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSelectSearchModule,
    MatCheckboxModule,
    QrCodeModule,
  ],
  providers: [
    ModalService,
  ],

})
export class ConvertProcessingModule {
}
