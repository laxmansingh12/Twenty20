import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NumberService } from '../../services/number.service';
import { NumberDTO } from '../../models/numberDTO';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loading: any;
  todayNumber: string;
  numbers: NumberDTO[];
  dateformat: DatePipe;
  error: string;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private _numberService: NumberService) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.todayNumber = "N/A";
    this.dateformat = new DatePipe("en");

    this.loadNumbers();
  }

  loadNumbers() {

    this.loading.present();
    let today = new Date();
    let todayStr = this.dateformat.transform(today, "dd-MM-yyyy");

    this._numberService.getNumbers().subscribe(response => {
      const data: any = response;
      this.numbers = data;

      this.numbers.forEach(n => {
        let decDateStr = this.dateformat.transform(n.DeclaredDate, "dd-MM-yyyy");
        if (decDateStr == todayStr) {
          this.todayNumber = n.Number.toString();
        }
      });

      this.loading.dismiss();
    },
      error => {
        console.error(JSON.stringify(error));
        this.loading.dismiss();
      });
  }
}
