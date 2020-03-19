import { Component, OnInit } from '@angular/core';
import {ModalService} from '../../services/modal/modal.service';
import {AppState} from '../../store/states/app.state';
import {select, Store} from '@ngrx/store';
import {selectExchange} from '../../store/selectors/exchange.selectors';

@Component({
  selector: 'app-convert-processing-index',
  templateUrl: './convert-processing-index.component.html',
  styleUrls: ['./convert-processing-index.component.scss']
})
export class ConvertProcessingIndexComponent implements OnInit {
  public step: number;

  constructor(
    public modalService: ModalService,
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.store.pipe(select(selectExchange))
      .subscribe((exchange) => {
        this.step = exchange.step;
      });
  }
}

