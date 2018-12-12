import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavController, NavParams } from 'ionic-angular';
import { NumberService } from '../../services/number.service';
import { LoadingController } from 'ionic-angular';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  minDate: string;
  maxDate: string;
  selectedDate: Date;
  declaredNumber: string;
  loading: any;
  dateformat:DatePipe;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private _numberService: NumberService) {

    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    
    this.dateformat = new DatePipe("en");

  }
  initData();

  initData(){

    let today = new Date();
    let minDate = new Date();
    minDate.setMonth(minDate.getMonth() - 1)
    this.minDate =  "2017";// this.dateformat.transform(minDate, "yyyy");
    this.maxDate = "2018-11-18" //this.dateformat.transform(today, "MMM DD YYYY");
    this.selectedDate = today;
    this.declaredNumber = "N/A";

  }

  changeDate() {
    //this.declaredNumber = this.declaredNumber + 1;
    this.loading.present();
    if (this.selectedDate) {
      let dateStr = this.dateformat.transform(this.selectedDate, "dd-MM-yyyy");
      this._numberService.getNumberByDate(dateStr).subscribe(response => {
        const data: any = response;
        this.declaredNumber = data;
        this.loading.dismiss();
      },
        error => {
          console.error(JSON.stringify(error));
          this.loading.dismiss();
        });
    }
    else {
      this.declaredNumber = "N/A";
    }
  }
}
