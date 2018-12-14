import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
//import { ListPage } from '../pages/list/list';
import { InfoPage } from '../pages/info/info';
import { AdminNumberPage } from '../pages/admin-number/admin.number';
import { LoginPage } from '../pages/login/login';
import { PasswordPage } from '../pages/password/password';
import { UserProfileDTO } from '../models/userProfileDTO';
import { UserService } from '../services/user.service';
import { Device } from '@ionic-native/device';
import { AppUpdate } from '@ionic-native/app-update';
import { AppConfig } from './app.config';
import { AppVersion } from '@ionic-native/app-version';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  isAdminLoggedIn: boolean = false;
  uuid: string;
  message: string;
  version: string;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    private userService: UserService,
    private device: Device,
    private appUpdate: AppUpdate,
    private appVersion: AppVersion
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Numbers', component: HomePage },
      { title: 'Info', component: InfoPage },
      //{ title: 'Declare Number', component: AdminNumberPage },
      //{ title: 'Change Password', component: PasswordPage }
      //{ title: 'Login', component: LoginPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.checkForAdminDevice();
      this.checkUserLoggedIn(null);
      this.message = this.platform.is("android").toString();
      
      if (this.platform.is('cordova')) {
        this.appVersion.getVersionNumber().then(res => {
          this.version = res;
        });
        const updateUrl = AppConfig.API_URL + '/app/get/update-android-xml';
        if (this.platform.is("android")) {
          //this.appUpdate.checkAppUpdate(updateUrl).then(() => { console.log('Update available') });
        }
      }

    });
  }

  checkForAdminDevice() {
    this.uuid = this.device.uuid;
    this.userService.checkDevice(this.uuid).subscribe(response => {
      const isValid: any = response;
      if (isValid && this.pages.length == 2) {
        this.pages.push({ title: 'Declare Number', component: AdminNumberPage });
        this.pages.push({ title: 'Change Password', component: PasswordPage });
      }
      else if (this.pages.length == 4) {
        this.pages.pop();
        this.pages.pop();
      }
    },
      error => {
        console.error(JSON.stringify(error));
      });

  }

  checkUserLoggedIn(page) {
    this.storage.get('token').then((val) => {
      if (val) {
        let user: UserProfileDTO = JSON.parse(val);
        let today = new Date();
        if (user && user.IsAthenticated && today >= user.TokenExpiredOn) {
          this.isAdminLoggedIn = true;
          // if(this.pages.length == 4){
          //   this.pages.pop();
          // }
          //this.pages.push({title: "Logout",component : LoginPage});
          if (page) {
            this.nav.setRoot(page.component);
          }
          else {
            return;
          }
        }
      }

      // if(this.pages.length == 4){
      //   this.pages.pop();
      // }
      // this.pages.push({title: "Login",component : LoginPage});
      if (page) {
        this.nav.setRoot(LoginPage);
      }
    });
  }

  openPage(page) {
    if (page.title == "Logout") {
      this.storage.remove("token");
      this.pages.pop();
      this.nav.setRoot(HomePage);
    }
    else if (page.title == "Declare Number") {
      this.checkUserLoggedIn(page);

    }
    else {
      this.nav.setRoot(page.component);
    }
  }
}
