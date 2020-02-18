import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import {ModalComponent} from "../_directives/modal.component";
import {ExchangeInfoComponent} from "./exchange-info/exchange-info.component";
import {ConverterComponent} from "./converter/converter.component";
import {TableMobileComponent} from "./table-mobile/table-mobile.component";
import {TableComponent} from "./table/table.component";
import {MatSelectSearchModule} from "./mat-select-search/mat-select-search.module";
import {MaterialModule} from "../../../material-module";
import {LoginComponent} from "./login/login.component";
import {NotificationMessageComponent} from "./notification-message/notification-message.component";
import {TextCopyDirective} from "../_directives/text-copy.directive";
@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectSearchModule,
    MaterialModule,
    MatNativeDateModule,
  ],
  declarations: [
    ModalComponent,
    TableComponent,
    TableMobileComponent,
    ConverterComponent,
    ExchangeInfoComponent,
    LoginComponent,
    NotificationMessageComponent,
    TextCopyDirective
  ],
  exports: [
    ModalComponent,
    TableComponent,
    TableMobileComponent,
    ConverterComponent,
    ExchangeInfoComponent,
    LoginComponent,
    NotificationMessageComponent,
    TextCopyDirective
  ]
})
export class UiModule {}
