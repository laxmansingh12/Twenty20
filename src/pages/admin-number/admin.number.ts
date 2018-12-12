import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NumberService } from '../../services/number.service';
import { NumberDTO } from '../../models/NumberDTO';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { UserProfileDTO } from '../../models/userProfileDTO';
import { ToastController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'page-admin-number',
  templateUrl: 'admin.number.html'
})
export class AdminNumberPage {

  loading: any;
  number: NumberDTO;
  dateformat: DatePipe;
  dateStr: string;
  error: string;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private _numberService: NumberService,
    private storage: Storage,
    private toastCtrl: ToastController
  ) {

    this.dateformat = new DatePipe("en");
    this.number = new NumberDTO();
    //this.number.DeclaredDate = new Date();

    this.dateStr = (new Date()).toISOString();

    this.storage.get('token').then((val) => {
      if (val) {
        let user: UserProfileDTO = JSON.parse(val);
        if (user) {
          this.number.DeclaredBy = user.Id;
        }
      }
    });
  }

  declareNumber() {
    if (this.number.Number && this.number.Number > 0 && this.number.Number <= 20 && this.dateStr && this.dateStr != "") {
      this.saveNumber();
    }
    else {
      this.error = "Please enter a number between 1 to 20";
    }
  }

  logout() {
    this.storage.remove("token");
  }

  saveNumber() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
    //let today = new Date();
    //let todayStr = this.dateformat.transform(today, "dd-MM-yyyy");
    this.number.DeclaredDate = new Date(this.dateStr);
    this._numberService.saveNumber(this.number).subscribe(response => {
      const data: any = response;
      if (data && data > 0) {
        this.showMessageToast();
        this.navCtrl.setRoot(HomePage);
      }
      else if (data == -1) {
        this.error = "You have already declared number on selected date";
      }
      else {
        this.error = "Something went wrong !! please contect site administrator";
      }
      this.loading.dismiss();
    },
      error => {
        console.error(JSON.stringify(error));
        this.loading.dismiss();
      });
  }
  showMessageToast() {
    const toast = this.toastCtrl.create({
      message: 'Number has been added successfully',
      duration: 3000
    });
    toast.present();
  }
}