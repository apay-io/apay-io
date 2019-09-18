import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-withdraw-page',
    templateUrl: './withdraw-page.component.html',
    styleUrls: ['./withdraw-page.component.scss']
})

export class WithdrawPageComponent implements OnInit {
    currentComponentSave;
    @Output() currentComponentChange: EventEmitter<string> = new EventEmitter();

    constructor() {}

    ngOnInit() {
        this.currentComponentSave = 'withdraw';
    }
}
