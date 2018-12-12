import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/do';
import { Injectable } from "@angular/core";
import { AppConfig } from './app.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const apiUrl :string = AppConfig.API_URL +  req.url;
        const token: string = null;// this.sessionService.getToken();  
        req = req.clone({url : apiUrl });
        
        if (token) {
            req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token)});
        }
        if (!req.headers .has('Content-Type')) {
            req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        }
       //req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
        return next.handle(req);

    //     if (req.headers.get('No-Auth') == "True")
    //         return next.handle(req.clone({}));

    //     if (localStorage.getItem('userToken') != null) {
    //         const clonedreq = req.clone({
    //             headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem('userToken'))
    //         });
    //         return next.handle(clonedreq)
    //             .do(
    //             succ => { },
    //             err => {
    //                 if (err.status === 401)
    //                     this.router.navigateByUrl('/login');
    //             }
    //             );
    //     }
    //     else {
    //         this.router.navigateByUrl('/login');
    //     }
     }
}