import {EventEmitter, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import moment, {Moment} from "moment";
import {ConstProvider} from "../const/const";
import {Changelogstruktur} from "../../dataclasses/changelogstruktur";
import {Urlaubsstruktur} from "../../dataclasses/urlaubsstruktur";
import {Feiertagestruktur, FeiertagsubdevisionsStruktur} from "../../dataclasses/feiertagestruktur";
import {Ferienstruktur} from "../../dataclasses/ferienstruktur";
import {Regionenstruktur} from "../../dataclasses/regionenstruktur";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {Urlauzeitspannenstruktur} from "../../dataclasses/urlauzeitspannenstruktur";
import {Kalendertagestruktur} from "../../dataclasses/kalendertagestruktur";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";

@Injectable({
  providedIn: 'root'
})
export class DatabaseUrlaubService {

  public PlanungsmonateChanged: EventEmitter<any> = new EventEmitter<any>();

  public Bundeslandkuerzel: string;
  public Bundesland: string;
  public Regionenliste: Regionenstruktur[];
  public Jahr: number;
  public Feiertageliste: Feiertagestruktur[];
  public Ferienliste: Ferienstruktur[];
  public CurrentUrlaub: Urlaubsstruktur;
  public UrlaublisteExtern: Urlaubsstruktur[];
  public CurrentMonatindex: number;
  public LastMonatIndex: number;
  public FirstMonatIndex: number;
  public Laendercode: string;
  public ShowFeiertage: boolean;
  public ShowFerientage: boolean;
  public Ferienfarbe: string;
  public Feiertagefarbe: string;
  public CurrentZeitspanne: Urlauzeitspannenstruktur;
  public Monateliste: string[];
  public Urlaubstatusvarianten = {

    Beantragt:          'Beantragt',
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
    Ferien_DE:            '#999999',
    Ferien_BG:            '#999999',
    Feiertage_DE:         '#454545',
    Feiertage_BG:         '#454545',
    Wochenende:           '#34495E'
  };

  constructor(private Debug: DebugProvider,
              private Pool: DatabasePoolService,
              private Const: ConstProvider,
              private http: HttpClient) {
    try {

      this.CurrentUrlaub           = null;
      this.Jahr                    = moment().year();
      this.Bundeslandkuerzel       = 'DE-BY';
      this.Bundesland              = '';
      this.Feiertageliste          = [];
      this.Ferienliste             = [];
      this.CurrentMonatindex       = 7; // moment().month();
      this.FirstMonatIndex         = this.CurrentMonatindex - 1;
      this.LastMonatIndex          = this.CurrentMonatindex + 1;
      this.CurrentZeitspanne       = null;
      this.Laendercode             = 'DE';
      this.ShowFeiertage           = false;
      this.ShowFerientage          = false;
      this.Ferienfarbe             = this.Const.NONE;
      this.Feiertagefarbe          = this.Const.NONE;
      this.Monateliste             = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'constructor', this.Debug.Typen.Service);
    }
  }

  public ReadRegionen(landcode: string) {

    try {

      return new Promise((resolve, reject)=> {

        let http: string = 'https://openholidaysapi.org/Subdivisions?countryIsoCode=' + landcode; // DE&validFrom=2023-01-01&validTo=2023-12-31'; // 'https://ferien-api.de/api/v1/holidays/' + this.Bundeslandkuerzel.toUpperCase() + '/' + this.Jahr.toString();

        let RegionenObserver = this.http.get(http);

        RegionenObserver.subscribe({

          next: (data: any) => {

            this.Regionenliste = <Regionenstruktur[]>data;
          },
          complete: () => {

            this.Regionenliste = lodash.filter(this.Regionenliste, (region: Regionenstruktur) => {

              return region.isoCode !== '';
            });

            for(let Region of this.Regionenliste) {

              Region.Name = Region.name[0].text;
            }

            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'ReadRegionen', this.Debug.Typen.Service);
    }
  }

  public ReadCountries() {

    try {

      return new Promise((resolve, reject)=> {

        let http: string = 'https://openholidaysapi.org/Countries'; // Subdivisions?countryIsoCode // =' + landcode; // DE&validFrom=2023-01-01&validTo=2023-12-31'; // 'https://ferien-api.de/api/v1/holidays/' + this.Bundeslandkuerzel.toUpperCase() + '/' + this.Jahr.toString();


        let RegionenObserver = this.http.get(http);

        RegionenObserver.subscribe({

          next: (data: any) => {

            // debugger;

            // this.Regionenliste = <Regionenstruktur[]>data;


          },
          complete: () => {


            resolve(true);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'ReadRegionen', this.Debug.Typen.Service);
    }
  }

  public ReadFeiertage(landcode: string): Promise<any> {

    try {

      let Werte: string[];
      let Jahr: number;
      let Monat: number;
      let Tag: number;
      let Datum: Moment;
      let Index: number;
      let Allerheiligen: Moment   = moment().set({year: this.Jahr, month: 10, date: 1 }).locale('de');  // 1. November
      let Reformationstag: Moment = moment().set({year: this.Jahr, month: 10, date: 31 }).locale('de'); // 31. Novemberg
      let Standort: Standortestruktur = lodash.find(this.Pool.Standorteliste, {_id: this.Pool.Mitarbeiterdaten.StandortID});

      if(lodash.isUndefined(Standort)) Standort = null;

      this.Feiertageliste[landcode] = [];

      return new Promise((resolve, reject)=> {

        let http: string = 'https://openholidaysapi.org/PublicHolidays?countryIsoCode=' + landcode + '&validFrom=' + this.Jahr + '-01-01&validTo=' + this.Jahr + '-12-31';

        let headers = new HttpHeaders();

        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'POST, GET');

        let options = {headers: headers};
        let FeiertageObserver = this.http.get(http, options);

        FeiertageObserver.subscribe({

          next: (data: any) => {

            this.Feiertageliste[landcode] = <Feiertagestruktur[]>data;

          },
          complete: () => {

            for(let Feiertag of this.Feiertageliste[landcode]) {

              Werte = Feiertag.startDate.split('-');
              Jahr  = parseInt(Werte[0]);
              Monat = parseInt(Werte[1]) - 1;
              Tag   = parseInt(Werte[2]);
              Datum = moment().set({date: Tag, month: Monat, year: Jahr, hour: 8, minute: 0}).locale('de');

              Feiertag.Anfangstempel = Datum.valueOf();

              Werte = Feiertag.endDate.split('-');
              Jahr  = parseInt(Werte[0]);
              Monat = parseInt(Werte[1]) - 1;
              Tag   = parseInt(Werte[2]);
              Datum = moment().set({date: Tag, month: Monat, year: Jahr, hour: 8, minute: 0}).locale('de');

              Index = landcode === 'DE' ? 0 : 1;

              Feiertag.Endestempel = Datum.valueOf();
              Feiertag.Name        = Feiertag.name[Index].text; // .toUpperCase() + Ferien.name.slice(1);
              Feiertag.Konfession  = null;

              // Religiöse Feiertage markieren

              if(Datum.isSame(Reformationstag, 'day')) Feiertag.Konfession = 'EV';
              if(Datum.isSame(Allerheiligen,   'day')) Feiertag.Konfession = 'RK';
            }

            // Nicht bundeseinheitliche Feiertag nach Bundesland ausfiltern

            this.Feiertageliste[landcode] = lodash.filter(this.Feiertageliste[landcode], (Feiertag: Feiertagestruktur) => {

              if(Feiertag.nationwide) return true;
              else {

                let Sub = lodash.find(Feiertag.subdivisions, (sub: FeiertagsubdevisionsStruktur) => {

                  return sub.code === this.Bundeslandkuerzel;
                });

                return !lodash.isUndefined(Sub);
              }
            });

            // Religiöse Feiertage nach Kofession des Standortes filtern

            if(Standort !== null) {

              this.Feiertageliste[landcode] = lodash.filter(this.Feiertageliste[landcode], (Feiertag: Feiertagestruktur) => {

                if(Feiertag.nationwide || Feiertag.Konfession === null) return true;
                else {

                  return Feiertag.Konfession === Standort.Konfession;
                }
              });
            }

            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'ReadFeiertage', this.Debug.Typen.Service);
    }
  }

  public ReadFerien(landcode: string): Promise<any> {

    try {

      let Werte: string[];
      let Jahr: number;
      let Monat: number;
      let Tag: number;
      let Datum: Moment;
      let Index: number;
      let Liste: Ferienstruktur[];
      let Zeitstempelliste: number[];

      this.Ferienliste[landcode] = [];

      return new Promise((resolve, reject)=> {

        let http: string = 'https://openholidaysapi.org/SchoolHolidays?countryIsoCode=' + landcode + '&validFrom=' + this.Jahr + '-01-01&validTo=' + this.Jahr + '-12-31';

        switch (landcode) {

          case 'DE':

            http += '&subdivisionCode=' + this.Bundeslandkuerzel;

            break;

          default:

            break;
        }

        let FerienObserver = this.http.get(http);

        FerienObserver.subscribe({

          next: (data: any) => {

            Liste = <Ferienstruktur[]>data;
          },
          complete: () => {

            for (let Ferien of Liste) {

              if (lodash.isUndefined(Ferien.subdivisions)) Ferien.subdivisions = [];

              Werte = Ferien.startDate.split('-');
              Jahr = parseInt(Werte[0]);
              Monat = parseInt(Werte[1]) - 1;
              Tag = parseInt(Werte[2]);
              Datum = moment().set({date: Tag, month: Monat, year: Jahr, hour: 8, minute: 0}).locale('de');

              Ferien.Anfangstempel = Datum.valueOf();

              Werte = Ferien.endDate.split('-');
              Jahr = parseInt(Werte[0]);
              Monat = parseInt(Werte[1]) - 1;
              Tag = parseInt(Werte[2]);
              Datum = moment().set({date: Tag, month: Monat, year: Jahr, hour: 8, minute: 0}).locale('de');

              Index = landcode === 'DE' ? 0 : 1;

              Ferien.Endestempel = Datum.valueOf();
              Ferien.Name = Ferien.name[Index].text; // .toUpperCase() + Ferien.name.slice(1);
            }

            // Doppelte Ferieneintraege ausfiltern

            this.Ferienliste[landcode] = [];

            Zeitstempelliste = [];

            for(let Ferien of Liste) {

              if(Zeitstempelliste.indexOf(Ferien.Anfangstempel) === -1) {

                Zeitstempelliste.push(Ferien.Anfangstempel);
                this.Ferienliste[landcode].push(Ferien);
              }
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

  public Init() {

    try {

      let Standort: Standortestruktur;
      let Mitarbeiter: Mitarbeiterstruktur;
      let Urlaub: Urlaubsstruktur;

      // Land einstellen

      if(this.Pool.Mitarbeiterdaten !== null) {

        Standort = lodash.find(this.Pool.Standorteliste, {_id: this.Pool.Mitarbeiterdaten.StandortID});

        if(lodash.isUndefined(Standort)) this.Laendercode = 'DE';
        else {

          this.Laendercode = Standort.Land;
        }

        switch (this.Laendercode) {

          case 'DE':

            this.ShowFerientage = this.Pool.Mitarbeitersettings.UrlaubShowFerien_DE;
            this.ShowFeiertage  = this.Pool.Mitarbeitersettings.UrlaubShowFeiertage_DE;
            this.Ferienfarbe    = this.Urlaubsfaben.Ferien_DE;
            this.Feiertagefarbe = this.Urlaubsfaben.Feiertage_DE;

            break;

          case 'BG':

            this.ShowFerientage = this.Pool.Mitarbeitersettings.UrlaubShowFerien_BG;
            this.ShowFeiertage  = this.Pool.Mitarbeitersettings.UrlaubShowFeiertage_BG;
            this.Ferienfarbe    = this.Urlaubsfaben.Ferien_BG;
            this.Feiertagefarbe = this.Urlaubsfaben.Feiertage_BG;

            break;
        }

      }
      else {

        this.Laendercode     = 'DE';
        this.ShowFerientage = true;
        this.ShowFeiertage  = true;
        this.Ferienfarbe    = this.Urlaubsfaben.Ferien_DE;
        this.Feiertagefarbe = this.Urlaubsfaben.Feiertage_DE;
      }

      // Urlaub initialisieren

      if(this.Pool.Mitarbeiterdaten !== null) {

        this.CurrentUrlaub = lodash.find(this.Pool.Mitarbeiterdaten.Urlaubsliste, {Jahr: this.Jahr});

        if(lodash.isUndefined(this.CurrentUrlaub)) {

          this.CurrentUrlaub         = this.GetEmptyUrlaub(this.Jahr);
          this.CurrentZeitspanne     = null;

          this.Pool.Mitarbeiterdaten.Urlaubsliste.push(this.CurrentUrlaub);
        }
        else {

          this.CurrentZeitspanne  = null;
        }
      }

      // Fremde Urlaube zur Einsicht vorbereiten

      this.UrlaublisteExtern = [];

      for(let Zeitspanne of this.CurrentUrlaub.Zeitspannen) {

        if(Zeitspanne.VertreterID !== null) {

          Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: Zeitspanne.VertreterID});

          if(!lodash.isUndefined(Mitarbeiter)) {

            Urlaub = lodash.find(Mitarbeiter.Urlaubsliste, {Jahr: this.Jahr});

            if(!lodash.isUndefined(Urlaub)) {

              Urlaub.MitarbeiterIDExtern = Mitarbeiter._id;
              Urlaub.NameExtern          = Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name;
              Urlaub.NameKuerzel         = Mitarbeiter.Kuerzel;
              Urlaub.DisplayExtern       = true;
              Urlaub.Zeitspannen         = lodash.filter(Urlaub.Zeitspannen, (spanne: Urlauzeitspannenstruktur) => {

                return spanne.Status !== this.Urlaubstatusvarianten.Abgelehnt;
              });

              if(Urlaub.Zeitspannen.length > 0) this.UrlaublisteExtern.push(Urlaub);
            }
          }
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Dataabse Urlaub', 'Init', this.Debug.Typen.Service);
    }
  }

  public SetPlanungsmonate() {

    try {

      if(this.CurrentMonatindex === 0) {

        this.FirstMonatIndex   = 0;
        this.CurrentMonatindex = 1;
        this.LastMonatIndex    = 2;
      }
      else if(this.CurrentMonatindex === 11) {

        this.FirstMonatIndex   = 9;
        this.CurrentMonatindex = 10;
        this.LastMonatIndex    = 11;
      }
      else {

        this.FirstMonatIndex = this.CurrentMonatindex - 1;
        this.LastMonatIndex  = this.CurrentMonatindex + 1;
      }

      // debugger;

      // this.PlanungsmonateChanged.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Dataabse Urlaub', 'SetPlanungsmonate', this.Debug.Typen.Service);
    }
  }

  public GetEmptyUrlaub(jahr): Urlaubsstruktur {

    try {

      return {
        Jahr: jahr,
        Resturlaub: 0,
        Zeitspannen: []
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'GetEmptyUrlaub', this.Debug.Typen.Service);
    }
  }

  CheckIsFerientag(Tag: Kalendertagestruktur, landcode: string): boolean {

    try {

      let CurrentTag: Moment = moment(Tag.Tagstempel);
      let Starttag: Moment;
      let Endetag: Moment;
      let IsFerientag: boolean = false;

      if(!lodash.isUndefined(this.Ferienliste[landcode])) {

        for(let Eintrag of this.Ferienliste[landcode]) {

          Starttag = moment(Eintrag.Anfangstempel);
          Endetag  = moment(Eintrag.Endestempel);

          if(CurrentTag.isSameOrAfter(Starttag, 'day') && CurrentTag.isSameOrBefore(Endetag, 'day')) {

            IsFerientag = true;

            break;
          }
        }
      }

      return IsFerientag;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'CheckIsFerientag', this.Debug.Typen.Service);
    }
  }

  GetFerientag(Tag: Kalendertagestruktur, landcode: string): Kalendertagestruktur {

    try {

      let CurrentTag: Moment = moment(Tag.Tagstempel);
      let Starttag: Moment;
      let Endetag: Moment;

      if(!lodash.isUndefined(this.Ferienliste[landcode])) {

        for(let Eintrag of this.Ferienliste[landcode]) {

          Starttag = moment(Eintrag.Anfangstempel);
          Endetag  = moment(Eintrag.Endestempel);

          if(CurrentTag.isSameOrAfter(Starttag, 'day') && CurrentTag.isSameOrBefore(Endetag, 'day')) {

            return Eintrag;

            break;
          }
        }
      }

      return null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetFerientag', this.Debug.Typen.Service);
    }
  }

  CheckIsFeiertag(Tag: Kalendertagestruktur, landcode: string): boolean {

    try {

      let CurrentTag: Moment = moment(Tag.Tagstempel);
      let Feiertag: Moment;
      let IsFeiertag: boolean = false;

      if(!lodash.isUndefined(this.Feiertageliste[landcode])) {

        for(let Eintrag of this.Feiertageliste[landcode]) {

          Feiertag = moment(Eintrag.Anfangstempel);

          if(Feiertag.isSame(CurrentTag, 'day')) {

            IsFeiertag = true;

            break;
          }
        }
      }

      return IsFeiertag;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'CheckIsFeiertag', this.Debug.Typen.Service);
    }
  }

  GetFeiertag(currenttag: Kalendertagestruktur, landcode: string): Feiertagestruktur {

    try {

      let CurrentTag: Moment = moment(currenttag.Tagstempel);
      let Feiertag: Moment;

      if(!lodash.isUndefined(this.Feiertageliste[landcode])) {

        for(let Tag of this.Feiertageliste[landcode]) {

          Feiertag = moment(Tag.Anfangstempel);

          if(Feiertag.isSame(CurrentTag, 'day')) {

            return Tag;

            break;
          }
        }
      }

      return null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetFeiertag', this.Debug.Typen.Service);
    }
  }

  public GetEmptyZeitspanne(): Urlauzeitspannenstruktur {

    try {

      return {

        Startstempel: null,
        Endestempel:  null,
        Startstring: "",
        Endestring:  "",
        FreigeberID: null,
        VertreterID: null,
        Status: this.Urlaubstatusvarianten.Beantragt,
        Tageanzahl: 0
      };
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'GetEmptyZeitspanne', this.Debug.Typen.Service);
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
