import {Component, OnInit} from '@angular/core';
import {NotifyService} from '../../core/notify.service';
import {HttpClient} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-convert-page',
  templateUrl: './convert-page.component.html',
  styleUrls: ['./convert-page.component.scss']
})

export class ConvertPageComponent implements OnInit {
    selected = 'USD';
    public stats$: Observable<any>;

    constructor(
      private notify: NotifyService,
      private readonly http: HttpClient,
      public readonly appComponent: AppComponent,
    ) {}

    ngOnInit() {
        //use for test notifi
        // this.notify.update('test', 'error');
      this.stats$ = this.http.get('https://apay.io/api/stats');
    }
}
