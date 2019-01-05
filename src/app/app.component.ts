import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { HomePage } from '../pages/home/home';
import { InfoPage } from '../pages/info/info';
import { AdminNumberPage } from '../pages/admin-number/admin.number';
import { LoginPage } from '../pages/login/login';
import { PasswordPage } from '../pages/password/password';
import { UserProfileDTO } from '../models/userProfileDTO';
import { UserService } from '../services/user.service';
import { AppService } from '../services/app.service';
import { Device } from '@ionic-native/device';
import { AppUpdate } from '@ionic-native/app-update';
import { AppConfig } from './app.config';
import { AppVersion } from '@ionic-native/app-version';
//import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
//import { File } from '@ionic-native/file';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

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
    private appService: AppService,
    private device: Device,
    private appUpdate: AppUpdate,
    private appVersion: AppVersion,
    //private transfer: FileTransfer, 
    //private file: File,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();

    this.pages = [
      { title: 'Numbers', component: HomePage },
      { title: 'Info', component: InfoPage },
    ];

  }

  initializeApp() {
    this.version = "demo";
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.message = this.platform.is("android").toString();
      if (this.platform.is('cordova')) {
        this.appVersion.getVersionNumber().then(res => {
          this.version = res;
          this.checkUpdateAvailable();
          // const updateUrl = AppConfig.API_URL + 'app/update.xml';
          // if (this.platform.is("android")) {
          //   this.appUpdate.checkAppUpdate(updateUrl).then(() => {
          //      console.log('Update available');
          //     }).catch(error => { console.error("catch: "+error); this.checkUpdateAvailable();});
          // }
        });
      }
      this.checkForAdminDevice();
      this.checkUserLoggedIn(null);
    });
  }

  checkUpdateAvailable() {
    this.appService.checkVersion(this.version).subscribe(response => {
      const isAvailable: any = response;
      if (isAvailable) {
        const confirm = this.alertCtrl.create({
          title: 'Update available',
          message: 'Do you want to download the latest app?',
          buttons: [
            {
              text: 'No',
              handler: () => {}
            },
            {
              text: 'Download',
              handler: () => {
                this.downloadLatestApp();
              }
            }
          ]
        });
        confirm.present();
      }
    },
      error => {
        console.error(JSON.stringify(error));
      });
  }

  downloadLatestApp() {
    const url = AppConfig.API_URL + 'app/twenty20.apk';
    window.open(url,"_system","location=yes");
    //const fileTransfer: FileTransferObject = this.transfer.create();
    // fileTransfer.download(url, this.file.dataDirectory + 'twenty20.apk').then((entry) => {
    //   console.log('download complete: ' + entry.toURL());
    //   const toast = this.toastCtrl.create({
    //     message: 'Latest app has been downloaded successfully',
    //     duration: 3000
    //   });
    //   toast.present();
    // }, (error) => {
    //   const toast = this.toastCtrl.create({
    //     message: 'Error ocurred on downloading: ' + JSON.stringify(error),
    //     duration: 3000
    //   });
    //   toast.present();
    // });
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
