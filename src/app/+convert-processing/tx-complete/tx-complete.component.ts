import {Component, OnInit, Output} from '@angular/core';
import {EventEmitter} from "@angular/core";

@Component({
  selector: 'app-tx-complete',
  templateUrl: './tx-complete.component.html',
  styleUrls: ['./tx-complete.component.scss']
})
export class TxCompleteComponent implements OnInit {
    @Output() currentStep: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {
  }
}
