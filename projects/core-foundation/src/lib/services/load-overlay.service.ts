import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ILoadOverlay } from '../interfaces/i-load-overlay';

@Injectable({
    providedIn: 'root'
})
export class LoadOverlayService {

    public loaderSubject = new Subject<ILoadOverlay>();

    loaderState = this.loaderSubject.asObservable();

    constructor() { }

    show() {
        this.loaderSubject.next(<ILoadOverlay>{ show: true });
    }

    hide() {
        this.loaderSubject.next(<ILoadOverlay>{ show: false });
    }
}