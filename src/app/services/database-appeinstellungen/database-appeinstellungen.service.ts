 import {EventEmitter, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import moment, {Moment} from "moment";
import {ConstProvider} from "../const/const";
 import {Appeinstellungenstruktur} from "../../dataclasses/appeinstellungenstruktur";

@Injectable({
  providedIn: 'root'
})
export class DatabaseAppeinstellungenService {

  public Appeinstellungen: Appeinstellungenstruktur;
  private ServerUrl: string;

  constructor(private Debug: DebugProvider,
              private Pool: DatabasePoolService,
              private Const: ConstProvider,
              private http: HttpClient) {
    try {

      this.Appeinstellungen    = null;
      this.ServerUrl           = this.Pool.CockpitdockerURL + '/appeinstellungen';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Appeinstellungen', 'constructor', this.Debug.Typen.Service);
    }
  }

  public ReadAppeinstellungen(): Promise<any> {

    try {

      let Liste: Appeinstellungenstruktur[] = [];

      this.Debug.ShowMessage('ReadAppeinstellungen', 'Database Appeinstellungen', 'ReadAppeinstellungen', this.Debug.Typen.Service);

      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
      });

      return new Promise((resolve, reject) => {

        let AppeinstellungenObservable = this.http.get(this.ServerUrl, { headers: headers });

        AppeinstellungenObservable.subscribe({

          next: (data) => {

            Liste = <Appeinstellungenstruktur[]>data;
          },
          complete: () => {

            if(Liste.length > 0) {

              this.Appeinstellungen = Liste[0];
            }
            else {

              this.Appeinstellungen = this.GetEmptyAppeinstellungen();
            }

            this.Pool.Appeinstellungen = this.Appeinstellungen;

            resolve(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'ReadAppeinstellungen', this.Debug.Typen.Service);
    }
  }

  public GetEmptyAppeinstellungen(): Appeinstellungenstruktur {

    try {

      return {

        _id: null,
        ShowHomeScreenInfos:  true,
        DebugNoExternalEmail: true,
        AdminStartseite: this.Const.Pages.HomePage
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Appeinstellungen', 'GetEmptyAppeinstellungen', this.Debug.Typen.Service);
    }
  }

  public async SaveAppeinstellungen(): Promise<any> {

    try {

      if(this.Appeinstellungen._id === null) {

        await this.AddAppeinstellungen();
      }
      else {

        await this.UpdateAppeinstellungen();
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Appeinstellungen', 'SaveAppeinstellungen', this.Debug.Typen.Service);
    }
  }

  public AddAppeinstellungen(): Promise<any> {

    try {

      let Observer: Observable<any>;

      return new Promise<any>((resove, reject) => {

        // POST für neuen Eintrag

        Observer = this.http.post(this.ServerUrl, this.Appeinstellungen);

        Observer.subscribe({

          next: (result) => {

            this.Appeinstellungen = result.data;

          },
          complete: () => {

            this.Pool.Appeinstellungen = this.Appeinstellungen;

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Appeinstellungen', 'AddAppeinstellungen', this.Debug.Typen.Service);
    }
  }


  public UpdateAppeinstellungen(): Promise<any> {

    try {

      let Observer: Observable<any>;

      return new Promise<any>((resove, reject) => {

          // PUT für update

        Observer = this.http.put(this.ServerUrl, this.Appeinstellungen);

        Observer.subscribe({

          next: (ne) => {

          },
          complete: () => {

            this.Pool.Appeinstellungen = this.Appeinstellungen;

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Appeinstellungen', 'UpdateAppeinstellungen', this.Debug.Typen.Service);
    }
  }
}
