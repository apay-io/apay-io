import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit-page.component.html',
  styleUrls: ['./deposit-page.component.scss']
})

export class DepositPageComponent implements OnInit {
    currentComponentSave;
    @Output() currentComponentChange: EventEmitter<string> = new EventEmitter();

    constructor() {}

    ngOnInit() {
        this.currentComponentSave = 'deposit';
    }
}
