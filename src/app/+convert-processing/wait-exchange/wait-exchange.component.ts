import {Component, OnInit, Output} from '@angular/core';
import {EventEmitter} from "@angular/core";

@Component({
  selector: 'app-wait-exchange',
  templateUrl: './wait-exchange.component.html',
  styleUrls: ['./wait-exchange.component.scss']
})
export class WaitExchangeComponent implements OnInit {
    showDetails: boolean = false;
    stepWaiting: number = 1;
    @Output() currentStep: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {
      let interval = setInterval(() => {
          this.stepWaiting += 1;
          if (this.stepWaiting > 3) {
              clearInterval(interval)
              this.currentStep.emit(6);
          }
      }, 3500)
  }
}
