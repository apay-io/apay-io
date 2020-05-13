import { Component, OnInit } from '@angular/core';
import {ModalService} from '../../services/modal/modal.service';
import {AppState} from '../../store/states/app.state';
import {select, Store} from '@ngrx/store';

@Component({
  selector: 'app-bot-terms',
  templateUrl: './bot-terms.component.html',
  styleUrls: ['./bot-terms.component.scss']
})
export class BotTermsComponent implements OnInit {

  constructor(
    public modalService: ModalService,
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit() {

  }
}
