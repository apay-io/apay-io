import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class LoginService {
    public isVisibleLogin = new Subject<boolean>();

    login = this.isVisibleLogin.asObservable();

    open() {
        this.isVisibleLogin.next(true);
    }

    close() {
        this.isVisibleLogin.next(false);
    }
}
