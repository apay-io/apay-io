import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {UiModule} from '../ui/ui.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalService} from '../services/modal/modal.service';
import {CoreModule} from '../core/core.module';
import { QrCodeModule } from 'ng-qrcode';
import {MaterialModule} from '../material-module';
import {BotTermsComponent} from './bot-terms/bot-terms.component';
import {StaticRoutingModule} from './static.routing.module';

@NgModule({
  declarations: [
    BotTermsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CoreModule,
    FormsModule,
    UiModule,
    FormsModule,
    ReactiveFormsModule,
    StaticRoutingModule,
    QrCodeModule,
  ],
  providers: [
    ModalService,
  ],

})
export class StaticModule {
}
