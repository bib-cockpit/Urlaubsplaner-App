 import {EventEmitter, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import moment, {Moment} from "moment";
import { v4 as uuidv4 } from 'uuid';
import {ConstProvider} from "../const/const";

@Injectable({
  providedIn: 'root'
})
export class DatabaseStandorteService {

  public CurrentStandort: Standortestruktur;
  public CurrentStandortfilter: Standortestruktur;
  public StandortfilterChanged = new EventEmitter<Standortestruktur>();
  private ServerUrl: string;

  constructor(private Debug: DebugProvider,
              private Pool: DatabasePoolService,
              private Const: ConstProvider,
              private http: HttpClient) {
    try {

      this.CurrentStandort       = null;
      this.CurrentStandortfilter = null;
      this.ServerUrl             = this.Pool.CockpitdockerURL + '/standorte';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Standorte', 'constructor', this.Debug.Typen.Service);
    }
  }

  public InitService() {

    try {

      let Standort: Standortestruktur;

      if(this.Pool.Mitarbeiterdaten !== null && this.Pool.Mitarbeitersettings.StandortFilter !== this.Const.NONE) {

        Standort = lodash.find(this.Pool.Standorteliste, {_id: this.Pool.Mitarbeitersettings.StandortFilter });

        if(Standort) this.CurrentStandortfilter = lodash.cloneDeep(Standort);
      }
      else {

        this.CurrentStandortfilter = null;
      }

      if(this.Pool.Mitarbeiterdaten !== null) {

        Standort = lodash.find(this.Pool.Standorteliste, {_id: this.Pool.Mitarbeiterdaten.StandortID });

        if(lodash.isUndefined(Standort) === false) this.Pool.Mitarbeiterstandort = Standort;
      }
      else {

        this.Pool.Mitarbeiterstandort = null;
      }

      this.StandortfilterChanged.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Standorte', 'InitService', this.Debug.Typen.Service);
    }
  }

  public FinishService() {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Standorte', 'FinishService', this.Debug.Typen.Service);
    }
  }

  GetStandort(standortid):string {

    try {

      let Standort: Standortestruktur;

        Standort = lodash.find(this.Pool.Standorteliste, {_id: standortid});

        if(!lodash.isUndefined(Standort)) {

          return Standort.Kuerzel + ' - ' + Standort.Ort;
        }
        else return 'unbekannt';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiter Editor', 'GetStandort', this.Debug.Typen.Component);
    }
  }

  public GetEmptyStandort(): Standortestruktur {

    try {

      let Heute: Moment = moment();

      return {

        _id:       null,
        Standort: "",
        Kuerzel:  "",
        Strasse:  "",
        PLZ:      "",
        Ort:      "",
        Telefon:  "",
        Email:    "",
        Deleted:  false,
        Bundesland: 'DE-BY',
        Konfession: 'RK',
        Land: 'DE',
        Zeitstempel: Heute.valueOf(),
        Zeitpunkt: Heute.format('DD.MM.YYYY')
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Standorte', 'GetEmptyStandort', this.Debug.Typen.Service);
    }
  }

  public GetUniqueStandortID(): string {

    try {

      let StandortID: string = this.CurrentStandort.Kuerzel;

      StandortID = StandortID.replace(/ /g, '_');
      StandortID = StandortID.replace(/-/g, '_');
      StandortID = StandortID.replace(/./g, '_');

      return StandortID + '_' + uuidv4();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Standorte', 'GetUniqueStandortID', this.Debug.Typen.Service);
    }
  }

  public AddStandort(): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Standort: Standortestruktur;

      return new Promise<any>((resove, reject) => {

        // POST für neuen Eintrag

        Observer = this.http.post(this.ServerUrl, this.CurrentStandort);

        Observer.subscribe({

          next: (result) => {

            debugger;

            Standort = result.data;

          },
          complete: () => {

            this.UpdateStandortliste(Standort);
            this.Pool.StandortelisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Standorte', 'AddStandort', this.Debug.Typen.Service);
    }
  }

  private UpdateStandortliste(standort: Standortestruktur) {

    try {

      let Index: number;

      Index = lodash.findIndex(this.Pool.Standorteliste, {_id : this.CurrentStandort._id});

      if(Index !== -1) {

        this.Pool.Standorteliste[Index] = standort;

        this.Debug.ShowMessage('Standortliste updated: ' + standort.Standort, 'Database Standorte', 'UpdateStandortliste', this.Debug.Typen.Service);

      }
      else {

        this.Debug.ShowMessage('Standort nicht gefunden -> neuen Standort hinzufügen', 'Database Standorte', 'UpdateStandortliste', this.Debug.Typen.Service);

        this.Pool.Standorteliste.push(standort); // neuen
      }

      // Gelöscht markiert Einträge entfernen

      this.Pool.Standorteliste = lodash.filter(this.Pool.Standorteliste, (currentstandort: Standortestruktur) => {

        return currentstandort.Deleted === false;
      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Standorte', 'UpdateStandortliste', this.Debug.Typen.Service);
    }
  }


  public UpdateStandort(): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams();

      Params.set('id', this.CurrentStandort._id);

      return new Promise<any>((resove, reject) => {

          // PUT für update

        Observer = this.http.put(this.ServerUrl, this.CurrentStandort);

        Observer.subscribe({

          next: (ne) => {

            debugger;

          },
          complete: () => {

            debugger;

            this.UpdateStandortliste(this.CurrentStandort);

            this.Pool.StandortelisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Standorte', 'UpdateStandort', this.Debug.Typen.Service);
    }
  }


  public DeleteStandort(): Promise<any> {

    try {

      let Observer: Observable<any>;

      this.CurrentStandort.Deleted = true;

      return new Promise<any>((resove, reject) => {

          // PUT für update

        Observer = this.http.put(this.ServerUrl, this.CurrentStandort);

        Observer.subscribe({

          next: (ne) => {

            debugger;

          },
          complete: () => {

            debugger;

            this.UpdateStandortliste(this.CurrentStandort);

            this.Pool.StandortelisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Standorte', 'DeleteStandort', this.Debug.Typen.Service);
    }
  }

  GetStandortfiller(): string{

    try {

      if(this.CurrentStandortfilter === null) return 'kein Standortfilter';
      else return this.CurrentStandortfilter.Kuerzel + ' / ' + this.CurrentStandortfilter.Ort;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Standorte', 'GetStandortfiller', this.Debug.Typen.Service);
    }
  }
}
