import { Component } from '@angular/core';
import {LoginService} from "./core/login-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'papaya';
    constructor(public loginServices: LoginService) {}
}


