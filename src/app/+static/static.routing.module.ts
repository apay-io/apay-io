import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BotTermsComponent} from './bot-terms/bot-terms.component';

const routes: Routes = [
  {
    path: 'bot-terms',
    component: BotTermsComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})

export class StaticRoutingModule {}
