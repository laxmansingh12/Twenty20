import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { AppErrorHandler } from './app.errorHandler';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { InfoPage } from '../pages/info/info';
import { LoginPage } from '../pages/login/login';
import { PasswordPage } from '../pages/password/password';
import { AdminNumberPage } from '../pages/admin-number/admin.number';

import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NumberService } from '../services/number.service';
import { UserService } from '../services/user.service';
import { AppService } from '../services/app.service';
import { NumberDTO } from '../models/numberDTO';
import { UserProfileDTO } from '../models/userProfileDTO';
import { AuthInterceptor } from './auth.interceptor';
import { IonicStorageModule } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { AppUpdate } from '@ionic-native/app-update';
import { AppVersion } from '@ionic-native/app-version';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    InfoPage,
    LoginPage,
    PasswordPage,
    AdminNumberPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    InfoPage,
    LoginPage,
    PasswordPage,
    AdminNumberPage
  ],
  providers: [
    StatusBar,
    Device,
    AppUpdate,
    AppVersion,
    FileTransfer,
    File,
    NumberService,
    UserService,
    AppService,
    SplashScreen,
    NumberDTO,
    UserProfileDTO,
    {provide: ErrorHandler, useClass: AppErrorHandler},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AppModule {}
