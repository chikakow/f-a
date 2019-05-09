import { Injectable } from '@angular/core';

import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,    
    HttpHeaders,    
    HttpEvent,
    HttpResponse
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadOverlayService } from './load-overlay.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptService implements HttpInterceptor {

    angular: any = {};

    constructor(
        private cookieService: CookieService,
        private loadOverlayService: LoadOverlayService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.showLoader();
        let mycookie = this.cookieService.get('XSRF-TOKEN');
        if (!mycookie) {
            mycookie = "";
        }
   
        let companyid: number = 1;
        if (!companyid) {
            companyid = 0;
        }

        // If the HttpRequest already has some headers appended to it you will need to append
        // any custom headers or params and clone a new HttpRequest like so:
        // Note that HttpHeaders, HttpParams are immutable so you need to create or get headers 
        // and use append() in same line.
        // Below is the correct way to use this: 
        //      let headers: HttpHeaders = new HttpHeaders().append('someKey', 'someValue');
        //      let headers: HttpHeaders = myHttpReq.headers.append('someKey', 'someValue');
        // You can add more than one header or param by using append but ensure to re-assign the 
        // result as in:
        //      headers = headers.append('otherKey', 'otherValue');
        let headers: HttpHeaders = req.headers.set("companyid", companyid.toString());
        headers = headers.set("X-Requested-With", " XMLHttpRequest");
        headers = headers.set("X-XSRF-TOKEN", mycookie);
        headers = headers.set("Cache-Control", "no-cache");
        headers = headers.set("Pragma", "no-cache");

        const authReq = req.clone({
            headers: headers
        });   

        return next.handle(authReq).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                this.onEnd();
            }
        }, (err: any) => {
                this.onEnd();
            }));
    }

    private onEnd(): void {
        this.hideLoader();
    }
    private showLoader(): void {
        this.loadOverlayService.show();
    }
    private hideLoader(): void {
        this.loadOverlayService.hide();
    }
}
