import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule, MatNativeDateModule} from '@angular/material';
import {MaterialModule} from '../../material-module';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { TableComponent } from './table/table.component';
import {UiModule} from "./ui/ui.module";
import {ModalService} from "./services/modal/modal.service";

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        MaterialModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatInputModule,
        UiModule
    ],
    entryComponents: [AppComponent],
    declarations: [AppComponent, TableComponent],
    bootstrap: [AppComponent],
    providers: [ModalService]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);