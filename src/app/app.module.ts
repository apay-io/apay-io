import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../material-module';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {UiModule} from './ui/ui.module';
import {ModalService} from './services/modal/modal.service';
import {CoreModule} from './core/core.module';
import {AppRoutingModule} from './app-routing.module';
import {ConvertPageComponent} from './main/convert-page/convert-page.component';
import {DepositPageComponent} from './main/deposit-page/deposit-page.component';
import {WithdrawPageComponent} from './main/withdraw-page/withdraw-page.component';
import {StellarService} from './services/stellar/stellar.service';
import {AccountPageComponent} from './main/account-page/account-page.component';
import {ChartsModule} from 'ng2-charts';
import {MatInputModule} from '@angular/material/input';

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
