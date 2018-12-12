import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { NumberDTO } from '../models/numberDTO';

@Injectable()
export class NumberService {

  constructor(private _http: HttpClient) { }

  saveNumber(numberDTO : NumberDTO) {
    var jsonData = JSON.stringify(numberDTO);
    return this._http.post('number/declare/number', jsonData);
  }

  getNumberByDate(date:string) {
    return this._http.get('number/get/declarednumber/date/' + date);
  }
  
  getNumbers() {
    return this._http.get('number/get/lastmonth/numbers');
  }
}
