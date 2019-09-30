import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ConvertProcessingRoutingModule} from './convert-processing.routing.module';
import {UiModule} from '../ui/ui.module';
import {MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalService} from '../services/modal/modal.service';
import {CoreModule} from '../core/core.module';
import {ConvertProcessingIndexComponent} from "./convert-processing-index/convert-processing-index.component";
import {EnterAmountComponent} from "./enter-amount/enter-amount.component";
import {MatSelectSearchModule} from "../ui/mat-select-search/mat-select-search.module";
import {EnterAddressComponent} from "./enter-address/enter-address.component";
import {CheckDetailsComponent} from "./check-details/check-details.component";
import {SendFundsComponent} from "./send-funds/send-funds.component";
import {WaitExchangeComponent} from "./wait-exchange/wait-exchange.component";
import {TxCompleteComponent} from "./tx-complete/tx-complete.component";

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
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    UiModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSelectSearchModule,
    MatCheckboxModule,
  ],
  providers: [
    ModalService,
  ],

})
export class ConvertProcessingModule {
}
