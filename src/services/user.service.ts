import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(private _http: HttpClient) { }

  checkDevice(uuid: string) {
    return this._http.get('user/check/device/uuid/' + uuid);
  }

  doLogin(username: string, password: string) {
    return this._http.get('user/login/username/' + username + '/password/' + password);
  }
  changePassword(username: string, password: string,newPassword:string) {
    return this._http.get('user/change/password/username/' + username + '/password/' + password + "/newPassword/" + newPassword);
  }

}
