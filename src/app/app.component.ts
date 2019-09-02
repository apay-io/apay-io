import { Component } from '@angular/core';
import {ModalService} from "./services/modal/modal.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'papaya';
  selected = 'USD';
  menuInfo = false;

    constructor(public modalService: ModalService,) {}

    menu() {
      this.menuInfo = !this.menuInfo;
    }
}


