import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { App, NavController, ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { HomePage } from '../home/home';
import { UserProfileDTO } from '../../models/userProfileDTO';

@Component({
    selector: 'page-password',
    templateUrl: 'password.html'
})
export class PasswordPage {

    loading: any;
    token: string;
    username: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
    error: string;
    passType: string;
    newPassType: string;
    flagShowPass: boolean;
    flagShowNewPass: boolean;
    passEyeType: string;
    newPassEyeType: string;

    constructor(public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        private _userService: UserService,
        private storage: Storage,
        private app: App,
        private toastCtrl: ToastController
    ) {
        this.flagShowPass = true;
        this.flagShowNewPass = true;
        this.togglePassword();
        this.toggleNewPassword();

        this.storage.get('token').then((val) => {
            if (val) {
                let user: UserProfileDTO = JSON.parse(val);
                if (user && user.IsAthenticated) {
                    this.username = user.Username;
                }
            }
        });

    }
    togglePassword() {
        this.flagShowPass = !this.flagShowPass;

        if (this.flagShowPass) {
            this.passEyeType = "ios-eye-outline";
            this.passType = 'text';
        } else {
            this.passEyeType = "ios-eye-off-outline";
            this.passType = 'password';
        }
    }
    toggleNewPassword() {
        this.flagShowNewPass = !this.flagShowNewPass;

        if (this.flagShowPass) {
            this.newPassEyeType = "ios-eye-outline";
            this.newPassType = 'text';
        } else {
            this.newPassEyeType = "ios-eye-off-outline";
            this.newPassType = 'password';
        }
    }

    changePassword() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();

        this._userService.changePassword(this.username, this.password, this.newPassword).subscribe(response => {
            const data: any = response;
            let res: UserProfileDTO = data;

            if (res.IsAthenticated) {
                this.storage.set('token', JSON.stringify(res));
                const toast = this.toastCtrl.create({
                    message: 'Password has been changed successfully',
                    duration: 3000
                });
                toast.present();
                this.navCtrl.setRoot(HomePage);
            }
            else {
                this.error = res.Message;
            }
            this.loading.dismiss();
        },
            error => {
                console.error(JSON.stringify(error));
                const toast = this.toastCtrl.create({
                    message: JSON.stringify(error),
                    duration: 3000
                });
                toast.present();
                this.loading.dismiss();
            });
    }
}
