import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ConvertProcessingIndexComponent} from "./convert-processing-index/convert-processing-index.component";

const routes: Routes = [
  { path: '',
    component: ConvertProcessingIndexComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})

export class ConvertProcessingRoutingModule {}
