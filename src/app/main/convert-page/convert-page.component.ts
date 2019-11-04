import {Component, OnInit} from '@angular/core';
import {NotifyService} from '../../core/notify.service';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-convert-page',
  templateUrl: './convert-page.component.html',
  styleUrls: ['./convert-page.component.scss']
})

export class ConvertPageComponent implements OnInit {
    selected = 'USD';
    constructor(
      private notify: NotifyService,
      public readonly appComponent: AppComponent,
    ) {}

    ngOnInit() {
        //use for test notifi
        // this.notify.update('test', 'error');
    }
}
