import { ErrorHandler, Inject  } from '@angular/core';
import { AlertController } from 'ionic-angular';

export class AppErrorHandler implements ErrorHandler {
  constructor(
    @Inject(AlertController) private alerts: AlertController,
  ) {}

  async handleError(error) {
    console.error("ERROR:===> " +error);
    const alert = this.alerts.create({
        title: 'An Error Has Occurred',
        subTitle: error,
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'Ok',
            handler: () => {
            }
          },
          {
            text: 'Restart',
            handler: () => {
              window.location.reload();
            }
          }
        ]
      });
      alert.present();
  }
}