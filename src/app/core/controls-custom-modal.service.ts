import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class ControlsCustomModalService {
    public isVisibleModal = new Subject();

    modal = this.isVisibleModal.asObservable();

    open(modalName) {
        this.isVisibleModal.next({name: modalName, state: true});
    }

    close(modalName) {
        this.isVisibleModal.next({name: modalName, state: false});
    }
}
