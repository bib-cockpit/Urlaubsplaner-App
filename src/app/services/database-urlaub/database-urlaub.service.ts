import {EventEmitter, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import moment, {Moment} from "moment";
import {ConstProvider} from "../const/const";
import {Changelogstruktur} from "../../dataclasses/changelogstruktur";
import {Urlaubsstruktur} from "../../dataclasses/urlaubsstruktur";
import {Feiertagestruktur} from "../../dataclasses/feiertagestruktur";
import {Ferienstruktur} from "../../dataclasses/ferienstruktur";

@Injectable({
  providedIn: 'root'
})
export class DatabaseUrlaubService {


  public Bundeslandkuerzel: string;
  public Bundesland: string;
  public Jahr: number;
  public Feiertageliste: Feiertagestruktur[];
  public Ferienliste: Ferienstruktur[];
  public CurrentUrlaub: Urlaubsstruktur;
  public Urlaubstatusvarianten = {

    Beantrag:          'Beantragt',
    Vertreterfreigabe: 'Vertreterfreigabe',
    Abgelehnt:         'Abgelehnt',
    Genehmigt:         'Genehmigt',
    Feiertag:          'Feiertag',
    Ferientag:         'Ferientag'
  };
  public Urlaubsfaben = {

    Beantrag:          '#307ac1',
    Vertreterfreigabe: 'orange',
    Abgelehnt:         'red',
    Genehmigt:         'green',
    Ferien:            'burlywood',
    Feiertage:         'lightsteelblue',
    Wochenende:        '#34495E'
  };

  constructor(private Debug: DebugProvider,
              private Pool: DatabasePoolService,
              private Const: ConstProvider,
              private http: HttpClient) {
    try {

      this.CurrentUrlaub = null;
      this.Jahr        = 2023;
      this.Bundeslandkuerzel    = 'by';
      this.Bundesland           = '';
      this.Feiertageliste       = [];
      this.Ferienliste          = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'constructor', this.Debug.Typen.Service);
    }
  }

  public ReadFeiertage(): Promise<any> {

    try {

      let Werte: string[];
      let Jahr: number;
      let Monat: number;
      let Tag: number;
      let Datum: Moment;
      let Weihnachtenstring: string = this.Jahr.toString() + '-12-24';
      let Weihnachten = moment().set({date: 24, month: 11, year: Jahr, hour: 8, minute: 0}).locale('de');
      this.Feiertageliste = [];

      return new Promise((resolve, reject)=> {

        let http: string = 'https://get.api-feiertage.de?years=' + this.Jahr.toString() + '&states=' + this.Bundeslandkuerzel;

        let FeiertageObserver = this.http.get(http);

        FeiertageObserver.subscribe({

          next: (data: any) => {

            this.Feiertageliste = <Feiertagestruktur[]>data.feiertage;
          },
          complete: () => {

            /*
            if(lodash.isUndefined(lodash.find(this.Feiertageliste, {date: Weihnachtenstring}))) {

              this.Feiertageliste.push({
                Zeitstempel: null, date: Weihnachtenstring, fname: "Heillig Abend", katholisch: null
              });
            }
             */

            for(let Feiertag of this.Feiertageliste) {

              Werte = Feiertag.date.split('-');
              Jahr  = parseInt(Werte[0]);
              Monat = parseInt(Werte[1]) - 1;
              Tag   = parseInt(Werte[2]);
              Datum = moment().set({date: Tag, month: Monat, year: Jahr, hour: 8, minute: 0}).locale('de');

              Feiertag.Zeitstempel = Datum.valueOf();
            }

            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });

      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'function', this.Debug.Typen.Page);
    }
  }

  public ReadFerien(): Promise<any> {

    try {

      let Werte: string[];
      let Jahr: number;
      let Monat: number;
      let Tag: number;
      let Datum: Moment;
      let Weihnachtenstring: string = this.Jahr.toString() + '-12-24';
      let Weihnachten = moment().set({date: 24, month: 11, year: Jahr, hour: 8, minute: 0}).locale('de');

      this.Ferienliste    = [];

      return new Promise((resolve, reject)=> {

        let http: string = 'https://ferien-api.de/api/v1/holidays/' + this.Bundeslandkuerzel.toUpperCase() + '/' + this.Jahr.toString();

        let FerienObserver = this.http.get(http);

        FerienObserver.subscribe({

          next: (data: any) => {

            this.Ferienliste = <Ferienstruktur[]>data;
          },
          complete: () => {

            for(let Ferien of this.Ferienliste) {

              Werte = Ferien.start.split('T');
              Werte = Werte[0].split('-');
              Jahr  = parseInt(Werte[0]);
              Monat = parseInt(Werte[1]) - 1;
              Tag   = parseInt(Werte[2]);
              Datum = moment().set({date: Tag, month: Monat, year: Jahr, hour: 8, minute: 0}).locale('de');

              Ferien.Anfangstempel = Datum.valueOf();

              Werte = Ferien.end.split('T');
              Werte = Werte[0].split('-');
              Jahr  = parseInt(Werte[0]);
              Monat = parseInt(Werte[1]) - 1;
              Tag   = parseInt(Werte[2]);
              Datum = moment().set({date: Tag, month: Monat, year: Jahr, hour: 8, minute: 0}).locale('de');

              Ferien.Endestempel = Datum.valueOf();
              Ferien.name        = Ferien.name.charAt(0).toUpperCase() + Ferien.name.slice(1);
            }

            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });

      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Dataabse Urlaub', 'ReadFerien', this.Debug.Typen.Service);
    }
  }


  public GetEmptyUrlaub(): Urlaubsstruktur {

    try {

      // let Heute: Moment = moment();

      return {

        Startstempel: null,
        Endestempel:  null,
        Endestring: "",
        Startstring: "",
        Status: this.Urlaubstatusvarianten.Beantrag,
        VertreterID: null,
        Jahr: this.Jahr
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'GetEmptyChangelog', this.Debug.Typen.Service);
    }
  }

  public AddUrlaub(): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Changelog: Changelogstruktur;

      debugger;

      return new Promise<any>((resove, reject) => {

        /*

        // POST für neuen Eintrag

        Observer = this.http.post(this.ServerUrl, this.CurrentChangelog);

        Observer.subscribe({

          next: (result) => {

            debugger;

            Changelog = result.Changelog;

          },
          complete: () => {

            this.UpdateChangelogliste(Changelog);
            this.Pool.ChangeloglisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });

         */
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'AddUrlaub', this.Debug.Typen.Service);
    }
  }

  private UpdateUrlaubsliste(changelog: Changelogstruktur) {

    try {

      /*

      let Index: number;

      Index = lodash.findIndex(this.Pool.Changlogliste, {_id : this.CurrentChangelog._id});

      if(Index !== -1) {

        this.Pool.Changlogliste[Index] = changelog; // aktualisieren

        this.Debug.ShowMessage('Changelogliste updated: ' + changelog.Version, 'Database Changelog', 'UpdateChangelogliste', this.Debug.Typen.Service);

      }
      else {

        this.Debug.ShowMessage('Chnagelog nicht gefunden -> neues Changlog hinzufügen', 'Database Chnagelog', 'UpdateChangelogliste', this.Debug.Typen.Service);

        this.Pool.Changlogliste.unshift(changelog); // neuen
      }

      // Gelöscht markiert Einträge entfernen

      this.Pool.Changlogliste = lodash.filter(this.Pool.Changlogliste, (currentchangelog: Changelogstruktur) => {

        return currentchangelog.Deleted === false;
      });

       */


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'UpdateUrlaubsliste', this.Debug.Typen.Service);
    }
  }


  public UpdateUrlaub(): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams();



      return new Promise<any>((resove, reject) => {

        /*

          // PUT für update

        Observer = this.http.put(this.ServerUrl, this.CurrentChangelog);

        Observer.subscribe({

          next: (ne) => {

            debugger;

          },
          complete: () => {

            debugger;

            this.UpdateChangelogliste(this.CurrentChangelog);

            this.Pool.ChangeloglisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });

         */
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'UpdateUrlaub', this.Debug.Typen.Service);
    }
  }
  public DeleteUrlaub(): Promise<any> {

    try {

      let Observer: Observable<any>;

      // this.CurrentChangelog.Deleted = true;

      return new Promise<any>((resove, reject) => {

        /*

          // PUT für update

        Observer = this.http.put(this.ServerUrl, this.CurrentChangelog);

        Observer.subscribe({

          next: (ne) => {

            debugger;

          },
          complete: () => {

            debugger;

            this.UpdateChangelogliste(this.CurrentChangelog);

            this.Pool.ChangeloglisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });

         */
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'DeleteUrlaub', this.Debug.Typen.Service);
    }
  }
}
