import { Injectable } from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import moment, {Moment} from "moment";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {DatabaseAuthenticationService} from "../database-authentication/database-authentication.service";
import {head} from "lodash-es";
import {Mitarbeitersettingsstruktur} from "../../dataclasses/mitarbeitersettingsstruktur";
import {ConstProvider} from "../const/const";

@Injectable({
  providedIn: 'root'
})
export class DatabaseMitarbeitersettingsService {

  private ServerSettingsUrl: string;

  constructor(private Debug: DebugProvider,
              private http: HttpClient,
              private Const: ConstProvider,
              private AuthService: DatabaseAuthenticationService,
              private Pool: DatabasePoolService) {
    try {

      this.ServerSettingsUrl = this.Pool.CockpitserverURL + '/settings/';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeitersettings', 'constructor', this.Debug.Typen.Service);
    }
  }

  public InitService() {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeitersettings', 'InitService', this.Debug.Typen.Service);
    }
  }

  public FinishService() {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeitersettings', 'FinishService', this.Debug.Typen.Service);
    }
  }

  SaveMitarbeitersettings() {

    let Observer: Observable<any>;

    return new Promise<any>((resolve, reject) => {

      debugger;

      if(this.Pool.Mitarbeitersettings._id === null) {

        // POST für neue Settings

        Observer = this.http.post(this.ServerSettingsUrl, this.Pool.Mitarbeitersettings);

        Observer.subscribe({

          next: (result) => {

            this.Pool.Mitarbeitersettings = result.Settings;

          },
          complete: () => {

            this.Pool.MitarbeitersettingslisteChanged.emit();

            resolve(this.Pool.Mitarbeitersettings);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });

      }
      else {

        // PUT für update Settings

        Observer = this.http.put(this.ServerSettingsUrl, this.Pool.Mitarbeitersettings);

        Observer.subscribe({

          next: (ne) => {

            this.Pool.Mitarbeitersettings = ne.Settings;
          },
          complete: () => {

            this.Pool.MitarbeitersettingslisteChanged.emit();

            resolve(this.Pool.Mitarbeitersettings);
          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      }
    });

  } catch (error) {

    this.Debug.ShowErrorMessage(error, 'Database Standorte', 'SaveMitarbeitersettings', this.Debug.Typen.Service);
  }

  public UpdateMitarbeitersettings(settings: Mitarbeitersettingsstruktur) {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams();

      Params.set('id', settings._id);

      return new Promise<any>((resove, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerSettingsUrl, settings);

        Observer.subscribe({

          next: (ne) => {

            this.Pool.Mitarbeitersettings = ne.Settings;

          },
          complete: () => {

            this.Pool.MitarbeitersettingsChanged.emit();

            this.UpdateMitarbeitersettingsliste(settings);

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeitersettings', 'UpdateMitarbeiter', this.Debug.Typen.Page);
    }
  }


  private UpdateMitarbeitersettingsliste(settings: Mitarbeitersettingsstruktur) {

    try {

      let Index: number;

      Index = lodash.findIndex(this.Pool.Mitarbeitersettingsliste, {_id : settings._id});

      if(Index !== -1) {

        this.Pool.Mitarbeitersettingsliste[Index] = settings; // aktualisieren

        console.log('Mitarbeitersettingsliste updated: ' + settings.MitarbeiterID);
      }
      else {

        console.log('Mitarbeitersetting nicht gefunden -> neuen Mitarbeiter hinzufügen');

        this.Pool.Mitarbeitersettingsliste.push(settings); // neuen
      }

      // Gelöscht markiert Einträge entfernen

      this.Pool.Mitarbeitersettingsliste = lodash.filter(this.Pool.Mitarbeitersettingsliste, (currentsetting: Mitarbeitersettingsstruktur) => {

        return currentsetting.Deleted === false;
      });

      this.Pool.MitarbeitersettingslisteChanged.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeitersettings', 'UpdateMitarbeiterliste', this.Debug.Typen.Service);
    }
  }

  public AddMitarbeitersetting(setting: Mitarbeitersettingsstruktur) {

    try {

      let Observer: Observable<any>;
      let Mitarbeiter: Mitarbeiterstruktur;

      return new Promise((resolve, reject) => {

        // POST für neuen Eintrag

        Observer = this.http.post(this.ServerSettingsUrl, setting);

        Observer.subscribe({

          next: (result) => {

            debugger;

            setting = result.Setting;

          },
          complete: () => {


            this.UpdateMitarbeitersettingsliste(setting);
            this.Pool.MitarbeitersettingslisteChanged.emit();

            resolve(Mitarbeiter);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeitersettings', 'AddMitarbeiter', this.Debug.Typen.Page);
    }
  }
  public DeleteMitarbeitersetting(setting: Mitarbeitersettingsstruktur): Promise<any> {

    try {

      setting.Deleted = true;

      return this.UpdateMitarbeitersettings(setting);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeitersettings', 'DeleteMitarbeiter', this.Debug.Typen.Service);
    }
  }
}
