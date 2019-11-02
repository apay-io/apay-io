import { Component, OnInit } from '@angular/core';
import {ModalService} from '../../services/modal/modal.service';

@Component({
  selector: 'app-convert-processing-index',
  templateUrl: './convert-processing-index.component.html',
  styleUrls: ['./convert-processing-index.component.scss']
})
export class ConvertProcessingIndexComponent implements OnInit {
  public step: number;

  public orderParams = {};

  constructor(public modalService: ModalService) {
  }

  ngOnInit() {
    // if (sessionStorage.getItem('id')) {
    //   this.step = 4;
    // } else {
      this.step = 1;
    // }
  }

  nextStep(event) {
    this.step = event;
  }
}
