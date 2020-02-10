import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule, MatNativeDateModule, MatSidenavModule} from '@angular/material';
import {MaterialModule} from '../../material-module';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { TableComponent } from './ui/table/table.component';
import {UiModule} from './ui/ui.module';
import {ModalService} from './services/modal/modal.service';
import { ConverterComponent } from './ui/converter/converter.component';
import {CoreModule} from './core/core.module';
import {TableMobileComponent} from './ui/table-mobile/table-mobile.component';
import {AppRoutingModule} from './app-routing.module';
import {ConvertPageComponent} from './main/convert-page/convert-page.component';
import {DepositPageComponent} from './main/deposit-page/deposit-page.component';
import {MatSelectSearchModule} from "./ui/mat-select-search/mat-select-search.module";
import {WithdrawPageComponent} from "./main/withdraw-page/withdraw-page.component";
import {ExchangeInfoComponent} from "./ui/exchange-info/exchange-info.component";
import {StellarService} from './services/stellar/stellar.service';
import {AccountPageComponent} from "./main/account-page/account-page.component";
import {ChartsModule} from "ng2-charts";

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatInputModule,
        UiModule,
        CoreModule,
        AppRoutingModule,
        ChartsModule,
        MaterialModule,
    ],
    entryComponents: [AppComponent],
    declarations: [
        AppComponent,
        ConvertPageComponent,
        DepositPageComponent,
        WithdrawPageComponent,
        AccountPageComponent
    ],
    bootstrap: [AppComponent],
    providers: [ModalService, StellarService]
})
export class AppModule {
}
