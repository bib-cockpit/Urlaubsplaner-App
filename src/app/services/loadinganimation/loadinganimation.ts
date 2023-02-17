import {Injectable} from '@angular/core';
import {DebugProvider} from '../debug/debug';
import {BasicsProvider} from '../basics/basics';
import {LoadingController} from "@ionic/angular";

@Injectable()
export class LoadingAnimationService {

  private AjaxTime: number;

  constructor(private Debug: DebugProvider,
              private Loader: LoadingController,
              public Basics: BasicsProvider)
  {
    try {

      this.AjaxTime = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'file', 'constructor', this.Debug.Typen.Service);
    }
  }

  public ShowLoadingAnimation(title: string, message: string): Promise<any> {

    try {

      let HTML = `
      <table cellpadding="10" cellspacing="10">
        <tr>
          <td class="loadingtitleclass">` + title + `</td>
        </tr>
        <tr>
          <td class="loadingmessageclass"><br>` + message + `</td>
        </tr>
      </table>`;

      let Options: any = {

        spinner: 'lines',
        message: HTML,
        cssClass: 'loadingclass',
        showBackdrop: true,
        enableBackdropDismiss: false,
        translucent: false,
        dismissOnPageChange	: false,
      };

      return new Promise((resolve, reject) => {

        this.AjaxTime = new Date().getTime();

        this.Loader.create(Options).then((res: HTMLIonLoadingElement) => {

          res.present();

          resolve(true);

        }).catch((error) => {

          reject(error);
        });
      });
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Loading Message Provider', 'ShowLoadingAnimation', this.Debug.Typen.Service);
    }
  }

  public HideLoadingAnimation(wait: boolean): Promise<any> {

    try {

      let WaitTime  = this.Basics.Waittime;
      let TotalTime;

      if(this.AjaxTime !== null) TotalTime = new Date().getTime() - this.AjaxTime;
      else {

        TotalTime = WaitTime + 1;
      }

      return new Promise<any>((resolve) => {

        if(wait) {

          if(WaitTime > TotalTime) WaitTime = WaitTime - TotalTime;
          else WaitTime = 0;

          setTimeout(() => {

            this.Loader.dismiss().then(() => {

              resolve(true);

            }).catch((error) => {

              resolve(true);
            });

          }, WaitTime);

        } else {

          return this.Loader.dismiss().then(() => {

            resolve(true);

          }).catch((error) => {

            resolve(true);
          });
        }
      });
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Loading Message Provider', 'HideLoadingAnimation', this.Debug.Typen.Service);
    }
  }
}
