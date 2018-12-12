import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {App, NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { AdminNumberPage } from '../admin-number/admin.number';
import { UserProfileDTO } from '../../models/userProfileDTO';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    loading: any;
    token: string;
    username: string;
    password: string;
    error: string;

    constructor(public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        private _userService: UserService,
        private storage: Storage,
        private app :App
    ) {
        
    }

    doLogin() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();

        this._userService.doLogin(this.username, this.password).subscribe(response => {
            const data: any = response;
            let loginRes: UserProfileDTO = data;

            if (loginRes.IsAthenticated) {
                this.storage.set('token', JSON.stringify(loginRes));
                //var nav = this.app.getRootNav();
                //this.navCtrl.pop();
                
                  //this.navCtrl.push("Logout");
                this.navCtrl.setRoot(AdminNumberPage);
            }
            else {
                this.error = loginRes.Message;
            }
            this.loading.dismiss();
        },
            error => {
                console.error(JSON.stringify(error));
                this.loading.dismiss();
            });
    }
}
