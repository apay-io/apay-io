import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-convert-page',
  templateUrl: './convert-page.component.html',
  styleUrls: ['./convert-page.component.scss']
})

export class ConvertPageComponent implements OnInit {
    selected = 'USD';

    constructor(
    ) {}

    ngOnInit() {
    }
}
