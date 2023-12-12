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
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {LOPListestruktur} from "../../dataclasses/loplistestruktur";
import {FailedEmitResult} from "@angular/compiler-cli/src/ngtsc/imports";
import {Urlaubprojektbeteiligtestruktur} from "../../dataclasses/urlaubprojektbeteiligtestruktur";

@Injectable({
  providedIn: 'root'
})
export class DatabaseUrlaubService {

  public PlanungsmonateChanged: EventEmitter<any> = new EventEmitter<any>();
  public ExterneUrlaubeChanged: EventEmitter<any> = new EventEmitter<any>();
  public UrlaubStatusChanged:   EventEmitter<any> = new EventEmitter<any>();

  public Bundeslandkuerzel: string;
  public Bundesland: string;
  public Regionenliste: Regionenstruktur[];
  public Jahr: number;
  public Feiertageliste: Feiertagestruktur[];
  public Ferienliste: Ferienstruktur[];
  public CurrentUrlaub: Urlaubsstruktur;
  public UrlaublisteExtern: Urlaubsstruktur[];
  public UrlaublisteFreigaben: Urlaubsstruktur[];
  public CurrentMonatindex: number;
  public LastMonatIndex: number;
  public FirstMonatIndex: number;
  public Laendercode: string;
  public ShowFeiertage_DE: boolean;
  public ShowFeiertage_BG: boolean;
  public ShowFerientage_DE: boolean;
  public ShowFerientage_BG: boolean;
  public Ferienfarbe_DE: string;
  public Ferienfarbe_BG: string;
  public Feiertagefarbe_DE: string;
  public Feiertagefarbe_BG: string;
  public CurrentZeitspanne: Urlauzeitspannenstruktur;
  public Monateliste: string[];
  private ServerReadfeiertageUrl: string;
  private ServerReadRegionenUrl: string;
  private ServerReadFerienUrl: string;
  public Vertretrungliste: Mitarbeiterstruktur[];
  public Freigabenliste: Mitarbeiterstruktur[];
  public Vertretungenanzahl: number;
  public Freigabenanzahl: number;
  public Anfragenanzahl: number;
  public CorrectSetup: boolean;

  public Sendestatausvarianten = {

    None: 'none',
    Vertreteranfrage_gesendet: 'Vertreteranfrage_gesendet',
    Vertreterabsage_gesendet:  'Vertreterabsage_gesendet',
    Vertreterzusage_gesendet:  'Vertreterzusage_gesendet',
    Urlaubfreigabe_gesendet:   'Urlaubfreigabe_gesendet',
    Urlaubablehnung_gesendet:  'Urlaubablehnung_gesendet'
  };

  public Urlaubstatusvarianten = {

    Beantragt:          'Beantragt',
    Vertreterablehnung: 'Vertreterablehnung',
    Vertreteranfrage:   'Vertreteranfrage',
    Vertreterfreigabe:  'Vertreterfreigabe',
    Abgelehnt:          'Abgelehnt',
    Genehmigt:          'Genehmigt',
    Feiertag:           'Feiertag',
    Ferientag:          'Ferientag'
  };
  public Urlaubsfaben = {

    Beantrag:           '#307ac1',
    Vertreterfreigabe:  'orange',
    Vertreteranfrage:   '#04B4AE',
    Vertreterablehnung: '#8A0886',
    Abgelehnt:          'red',
    Genehmigt:          'green',
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

      this.ServerReadfeiertageUrl  = this.Pool.CockpitdockerURL + '/readfeiertage';
      this.ServerReadFerienUrl     = this.Pool.CockpitdockerURL + '/readferien';
      this.ServerReadRegionenUrl   = this.Pool.CockpitdockerURL + '/readregionen';
      this.CurrentUrlaub           = null;
      this.Jahr                    = moment().year();
      this.Bundeslandkuerzel       = 'DE-BY';
      this.Bundesland              = '';
      this.Feiertageliste          = [];
      this.Ferienliste             = [];
      this.Freigabenliste          = [];
      this.CurrentMonatindex       = 8; // moment().month();
      this.FirstMonatIndex         = this.CurrentMonatindex - 1;
      this.LastMonatIndex          = this.CurrentMonatindex + 1;
      this.CurrentZeitspanne       = null;
      this.Laendercode             = 'DE';
      this.ShowFeiertage_DE        = false;
      this.ShowFeiertage_BG        = false;
      this.ShowFerientage_DE       = false;
      this.ShowFerientage_BG       = false;
      this.Ferienfarbe_DE          = this.Const.NONE;
      this.Feiertagefarbe_DE       = this.Const.NONE;
      this.UrlaublisteExtern       = [];
      this.Vertretrungliste        = [];
      this.Vertretungenanzahl      = 0;
      this.Freigabenanzahl         = 0;
      this.CorrectSetup            = false;
      this.Monateliste             = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'constructor', this.Debug.Typen.Service);
    }
  }

  public CheckSetup() {

    try {

      if(this.CurrentUrlaub !== null && this.Pool.Mitarbeiterdaten !== null) {

        this.CorrectSetup = this.CurrentUrlaub.FreigeberID !== null && this.CurrentUrlaub.Projektbeteiligteliste.length > 0;
      }
      else this.CorrectSetup = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'CheckSetup', this.Debug.Typen.Service);
    }
  }

  private GetFreigabenliste(): Promise<any> {

    try {

      let Urlaub: Urlaubsstruktur;
      let Count: boolean;

      return new Promise((resolve, reject) => {

        this.Freigabenanzahl = 0;
        this.Freigabenliste  = [];

        if(this.Pool.Mitarbeiterdaten !== null) {

          for(let Mitarbeiter of this.Pool.Mitarbeiterliste) {

            if(Mitarbeiter._id !== this.Pool.Mitarbeiterdaten._id) {

              Urlaub = lodash.find(Mitarbeiter.Urlaubsliste, (urlaub: Urlaubsstruktur) => {

                return urlaub.Jahr === this.Jahr && urlaub.FreigeberID === this.Pool.Mitarbeiterdaten._id;
              });

              if(!lodash.isUndefined(Urlaub)) {

                Count = false;

                for (let Zeitspanne of Urlaub.Zeitspannen) {

                  if(lodash.isUndefined(Zeitspanne.FreigabeantwortSended)) Zeitspanne.FreigabeantwortSended = false;

                  if (Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterfreigabe ||
                      Zeitspanne.Status === this.Urlaubstatusvarianten.Abgelehnt ||
                      Zeitspanne.Status === this.Urlaubstatusvarianten.Genehmigt) {

                    if(lodash.isUndefined(lodash.find(this.Freigabenliste, {_id: Mitarbeiter._id}))) {

                      this.Freigabenliste.push(Mitarbeiter);

                      if(Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterfreigabe) Count = true; // nur offene Anfragen zaehlen
                    }
                  }
                }

                if(Count === true) {

                  this.Anfragenanzahl++;
                  this.Freigabenanzahl++;
                }
              }
            }
          }

          resolve(true);
        }
        else {

          reject(false);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetFreigabenliste', this.Debug.Typen.Service);
    }
  }

  private GetVertretungFreigabenliste(): Promise<any> {

    try {

      let Urlaub: Urlaubsstruktur;
      let Vertretung: Mitarbeiterstruktur;
      let Count: boolean;

      return new Promise((resolve, reject) => {

        this.Vertretrungliste   = [];
        this.Vertretungenanzahl = 0;

        if(this.Pool.Mitarbeiterdaten !== null) {

          for(let Mitarbeiter of this.Pool.Mitarbeiterliste) {

            if(Mitarbeiter._id !== this.Pool.Mitarbeiterdaten._id) {

               Urlaub = lodash.find(Mitarbeiter.Urlaubsliste, {Jahr: this.Jahr});

               if(!lodash.isUndefined(Urlaub)) {

                 Count = false;

                 for(let Zeitspanne of Urlaub.Zeitspannen) {

                   if(lodash.isUndefined(Zeitspanne.VertreterantwortSended)) Zeitspanne.VertreterantwortSended = false;
                   /*
                   if(Zeitspanne.VertreterID === this.Pool.Mitarbeiterdaten._id &&
                     ( Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreteranfrage ||
                       Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterablehnung ||
                       Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterfreigabe)) {

                    */
                   if(Zeitspanne.VertreterID === this.Pool.Mitarbeiterdaten._id &&
                      Zeitspanne.Status      !== this.Urlaubstatusvarianten.Abgelehnt &&
                      Zeitspanne.Status      !== this.Urlaubstatusvarianten.Genehmigt) {

                     if(Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreteranfrage) {

                       Count = true;
                     }

                     Vertretung = lodash.find(this.Vertretrungliste, {_id: Mitarbeiter._id});

                     if(lodash.isUndefined(Vertretung)) {

                       this.Vertretrungliste.push(Mitarbeiter);
                     }
                   }
                 }

                 if(Count === true) {

                   this.Vertretungenanzahl++;
                   this.Anfragenanzahl++;
                 }
               }
            }
          }

          resolve(true);
        }
        else {

          reject(false);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetFreigabenliste', this.Debug.Typen.Service);
    }
  }

  public GetStatuscolor(status: string): string {

    try {

      let Color: string = 'none';

      switch (status) {

        case this.Urlaubstatusvarianten.Beantragt:

          Color = this.Urlaubsfaben.Beantrag;

          break;

        case this.Urlaubstatusvarianten.Vertreterfreigabe:

          Color = this.Urlaubsfaben.Vertreterfreigabe;

          break;

        case this.Urlaubstatusvarianten.Vertreterablehnung:

          Color = this.Urlaubsfaben.Vertreterablehnung;

          break;

        case this.Urlaubstatusvarianten.Vertreteranfrage:

          Color = this.Urlaubsfaben.Vertreteranfrage;

          break;

        case this.Urlaubstatusvarianten.Genehmigt:

          Color = this.Urlaubsfaben.Genehmigt;

          break;

        case this.Urlaubstatusvarianten.Abgelehnt:

          Color = this.Urlaubsfaben.Abgelehnt;

          break;
      }


      return Color;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetStatuscolor', this.Debug.Typen.Page);
    }
  }

  public SendVertreteranfragen(Zeitspanne: Urlauzeitspannenstruktur, Vertretung: Mitarbeiterstruktur): Promise<any> {

    try {

      return new Promise((resolve, reject) => {

        if(this.CurrentUrlaub !== null) {


          resolve(true);
        }
        else {

          reject(false);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SendVertreteranfragen', this.Debug.Typen.Service);
    }
  }

  public SendVertreterantworten(Mitarbeiter: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur): Promise<any> {

    try {

      return new Promise((resolve, reject) => {

        for(let Zeitspanne of Urlaub.Zeitspannen) {

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterablehnung ||
             Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterfreigabe) {

            Zeitspanne.VertreterantwortSended = true;
          }
        }

        resolve(true);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SendVertreterantworten', this.Debug.Typen.Service);
    }
  }

  public SendFreigabeanfrage(Mitarbeiter: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur, Freigebender: Mitarbeiterstruktur): Promise<any> {

    try {

      return new Promise((resolve, reject) => {

        resolve(true);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SendFreigabeanfrage', this.Debug.Typen.Service);
    }
  }

  public SendMitarbeiterFreigabezusage(Mitarbeiter: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur, Freigebender: Mitarbeiterstruktur): Promise<any> {

    try {

      return new Promise((resolve, reject) => {

        for(let Zeitspanne of Urlaub.Zeitspannen) {

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Genehmigt && Zeitspanne.FreigabeantwortSended === false) {

            Zeitspanne.FreigabeantwortSended = true;
          }
        }

        resolve(true);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SendMitarbeiterFreigabezusage', this.Debug.Typen.Service);
    }
  }

  public SendOfficeFreigabezusage(Mitarbeiter: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur, Vertretung: Mitarbeiterstruktur, Freigebender: Mitarbeiterstruktur): Promise<any> {

    try {

      return new Promise((resolve, reject) => {

        for(let Zeitspanne of Urlaub.Zeitspannen) {

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Genehmigt && Zeitspanne.FreigabeantwortSended === true) {



          }
        }

        resolve(true);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SendOfficeFreigabezusage', this.Debug.Typen.Service);
    }
  }

  public SendMitarbeiterFreigabeablehnung(Mitarbeiter: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur, Freigebender: Mitarbeiterstruktur): Promise<any> {

    try {

      return new Promise((resolve, reject) => {

        for(let Zeitspanne of Urlaub.Zeitspannen) {

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Abgelehnt && Zeitspanne.FreigabeantwortSended === false) {

            Zeitspanne.FreigabeantwortSended = true;
          }
        }

        resolve(true);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SendMitarbeiterFreigabeablehnung', this.Debug.Typen.Service);
    }
  }

  public ReadRegionen(landcode: string) {

    try {

      return new Promise((resolve, reject)=> {

        let Daten = {

          Landcode: landcode
        };

        let RegionenObserver = this.http.put(this.ServerReadRegionenUrl, Daten);

        RegionenObserver.subscribe({

          next: (data: any) => {

            this.Regionenliste = <Regionenstruktur[]>data.Regionenliste;
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

  public ReadFeiertage(landcode: string): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Standort: Standortestruktur = lodash.find(this.Pool.Standorteliste, {_id: this.Pool.Mitarbeiterdaten.StandortID});

      if(lodash.isUndefined(Standort)) Standort = null;

      let Daten = {

        Standort:          Standort,
        Jahr:              this.Jahr,
        Bundeslandkuerzel: this.Bundeslandkuerzel,
        Landcode:          landcode
      };

      return new Promise((resolve, reject)=> {

        this.Feiertageliste[landcode] = [];

        Observer = this.http.put(this.ServerReadfeiertageUrl, Daten);

        Observer.subscribe({

          next: (ne) => {

            this.Feiertageliste[landcode] = <Feiertagestruktur[]>ne.Feiertageliste;
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

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'ReadFeiertage', this.Debug.Typen.Service);
    }
  }

  public ReadFerien(landcode: string): Promise<any> {

    try {

      let FerienObserver: Observable<any>;
      let Daten = {

        Jahr:              this.Jahr,
        Bundeslandkuerzel: this.Bundeslandkuerzel,
        Landcode:          landcode
      };

      this.Ferienliste[landcode] = [];

      return new Promise((resolve, reject)=> {

        FerienObserver = this.http.put(this.ServerReadFerienUrl, Daten);

        FerienObserver.subscribe({

          next: (data: any) => {

            this.Ferienliste[landcode] = <Ferienstruktur[]>data.Ferienliste;
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

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'ReadFerien', this.Debug.Typen.Service);
    }
  }

   public async GetAnfragenlisten(): Promise<any> {

    try {

      this.Anfragenanzahl     = 0;
      this.Freigabenanzahl    = 0;
      this.Vertretungenanzahl = 0;

      if(this.Pool.Mitarbeiterdaten !== null) {

        try {

          await this.GetVertretungFreigabenliste();
        }
        catch (error: any)  {

        }

        try {

          await this.GetFreigabenliste();
        }
        catch (error: any) {

        }
      }

      return this.Anfragenanzahl;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetAnfragenlisten', this.Debug.Typen.Service);

      return 0;
    }
  }

  public Init() {

    try {

      let Standort: Standortestruktur;
      let Mitarbeiter: Mitarbeiterstruktur;
      let Urlaub: Urlaubsstruktur;

      this.Anfragenanzahl     = 0;
      this.Vertretungenanzahl = 0;
      this.Freigabenanzahl    = 0;

      // Land einstellen

      if(this.Pool.Mitarbeiterdaten !== null) {

        Standort = lodash.find(this.Pool.Standorteliste, {_id: this.Pool.Mitarbeiterdaten.StandortID});

        if (lodash.isUndefined(Standort)) this.Laendercode = 'DE';
        else {

          this.Laendercode = Standort.Land;
        }
      }

      this.ShowFerientage_DE = this.Pool.Mitarbeitersettings.UrlaubShowFerien_DE;
      this.ShowFeiertage_DE  = this.Pool.Mitarbeitersettings.UrlaubShowFeiertage_DE;
      this.Ferienfarbe_DE    = this.Urlaubsfaben.Ferien_DE;
      this.Feiertagefarbe_DE = this.Urlaubsfaben.Feiertage_DE;

      this.ShowFerientage_BG = this.Pool.Mitarbeitersettings.UrlaubShowFerien_BG;
      this.ShowFeiertage_BG  = this.Pool.Mitarbeitersettings.UrlaubShowFeiertage_BG;
      this.Ferienfarbe_BG    = this.Urlaubsfaben.Ferien_BG;
      this.Feiertagefarbe_BG = this.Urlaubsfaben.Feiertage_BG;


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

        if(lodash.isUndefined(this.CurrentUrlaub.Projektbeteiligteliste)) this.CurrentUrlaub.Projektbeteiligteliste = [];
        if(lodash.isUndefined(this.CurrentUrlaub.Ferienblockerliste))     this.CurrentUrlaub.Ferienblockerliste     = [];
        if(lodash.isUndefined(this.CurrentUrlaub.Feiertageblockerliste))  this.CurrentUrlaub.Feiertageblockerliste  = [];
        if(lodash.isUndefined(this.CurrentUrlaub.FreigeberID))            this.CurrentUrlaub.FreigeberID            = null;
      }

      // Fremde Urlaube zur Einsicht vorbereiten

      this.UrlaublisteExtern = [];

      for(let Eintrag of this.CurrentUrlaub.Projektbeteiligteliste) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: Eintrag.MitarbeiterID});

        if(!lodash.isUndefined(Mitarbeiter)) {

          Urlaub = lodash.find(Mitarbeiter.Urlaubsliste, {Jahr: this.Jahr});

          if(!lodash.isUndefined(Urlaub)) {

            Urlaub.MitarbeiterIDExtern = Mitarbeiter._id;
            Urlaub.NameExtern          = Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name;
            Urlaub.NameKuerzel         = Mitarbeiter.Kuerzel;
            Urlaub.Zeitspannen         = lodash.filter(Urlaub.Zeitspannen, (spanne: Urlauzeitspannenstruktur) => {

              return spanne.Status !== this.Urlaubstatusvarianten.Abgelehnt;
            });

          }
          else {

            Urlaub = this.GetEmptyUrlaub(this.Jahr);

            Urlaub.MitarbeiterIDExtern = Mitarbeiter._id;
            Urlaub.NameExtern          = Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name;
            Urlaub.NameKuerzel         = Mitarbeiter.Kuerzel;
          }

          this.UrlaublisteExtern.push(Urlaub);
        }
      }

      /*

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

       */

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'Init', this.Debug.Typen.Service);
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


      // this.PlanungsmonateChanged.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SetPlanungsmonate', this.Debug.Typen.Service);
    }
  }

  public GetEmptyUrlaub(jahr): Urlaubsstruktur {

    try {

      let Urlaub: Urlaubsstruktur =  {
        Jahr: jahr,
        Resturlaub: 0,
        Zeitspannen: [],
        FreigeberID: null,
        Projektbeteiligteliste: [],
        Ferienblockerliste: [],
        Feiertageblockerliste: []
      };

      if(this.Pool.Mitarbeiterdaten !== null && !lodash.isUndefined(this.Pool.Mitarbeiterdaten.Urlaubsliste[0])) {

        Urlaub.Projektbeteiligteliste = this.Pool.Mitarbeiterdaten.Urlaubsliste[0].Projektbeteiligteliste;
        Urlaub.Ferienblockerliste     = this.Pool.Mitarbeiterdaten.Urlaubsliste[0].Ferienblockerliste;
        Urlaub.Feiertageblockerliste  = this.Pool.Mitarbeiterdaten.Urlaubsliste[0].Feiertageblockerliste;
      }

      return Urlaub;

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

  GetFeriennamen(ferientag: Ferienstruktur, laendercode: string) {

    try {

      let Name: string = laendercode + ': Unbekannt';

      for(let name of ferientag.name) {

        if(name.language === laendercode) Name = name.text;
      }

      return Name;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetFeriennamen', this.Debug.Typen.Service);
    }
  }

  GetFeiertagnamen(feiertag: Ferienstruktur, laendercode: string) {

    try {

      let Name: string = laendercode + ': Unbekannt';

      for(let name of feiertag.name) {

        if(name.language === laendercode) Name = name.text;
      }

      return Name;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetFeiertagnamen', this.Debug.Typen.Service);
    }
  }

  GetFerientag(Tag: Kalendertagestruktur, landcode: string): Kalendertagestruktur {

    try {

      let CurrentTag: Moment = moment(Tag.Tagstempel);
      let Starttag: Moment;
      let Endetag: Moment;
      let Ferientag: Kalendertagestruktur;
      let Eintrag: Ferienstruktur;

      if(!lodash.isUndefined(this.Ferienliste[landcode])) {

        for(Eintrag of this.Ferienliste[landcode]) {

          Starttag = moment(Eintrag.Anfangstempel);
          Endetag  = moment(Eintrag.Endestempel);

          if(CurrentTag.isSameOrAfter(Starttag, 'day') && CurrentTag.isSameOrBefore(Endetag, 'day')) {

            Ferientag = {
              Tagnummer: 0,
              Hauptmonat: false,
              Kalenderwoche: 0,
              Tag: "",
              Tagstempel: Eintrag.Anfangstempel,
              Ferienname_DE: this.GetFeriennamen(Eintrag, 'DE'),
              Ferienname_BG: this.GetFeriennamen(Eintrag, 'EN'),
            };

            return Ferientag;

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

  GetFeiertag(currenttag: Kalendertagestruktur, landcode: string): Kalendertagestruktur {

    try {

      let CurrentTag: Moment = moment(currenttag.Tagstempel);
      let Feiertagdatum: Moment;
      let Feiertag: Kalendertagestruktur;
      let Tag: Ferienstruktur;

      if(!lodash.isUndefined(this.Feiertageliste[landcode])) {

        for(Tag of this.Feiertageliste[landcode]) {

          Feiertagdatum = moment(Tag.Anfangstempel);

          if(Feiertagdatum.isSame(CurrentTag, 'day')) {

            Feiertag = {
              Tagnummer: 0,
              Hauptmonat: false,
              Kalenderwoche: 0,
              Tag: "",
              Tagstempel: Tag.Anfangstempel,
              Feiertagname_DE: this.GetFeiertagnamen(Tag, 'DE'),
              Feiertagname_BG: this.GetFeiertagnamen(Tag, 'EN'),
            };

            return Feiertag;

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

        ZeitspannenID: this.Pool.GetNewUniqueID(),
        Startstempel: null,
        Endestempel:  null,
        Startstring: "",
        Endestring:  "",
        VertreterID: null,
        Status: this.Urlaubstatusvarianten.Beantragt,
        Statusmeldung: '',
        Tageanzahl: 0,
        VertreterantwortSended: false,
        FreigabeantwortSended: false,
      };
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'GetEmptyZeitspanne', this.Debug.Typen.Service);
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

  public CountResturlaub(): number {

    try {

      let Gesamturlaub: number = 0;

      if(this.CurrentUrlaub !== null && this.Pool.Mitarbeiterdaten !== null) {

        Gesamturlaub += this.Pool.Mitarbeiterdaten.Urlaub;
        Gesamturlaub += this.CurrentUrlaub.Resturlaub;

        for(let Zeitspanne of this.CurrentUrlaub.Zeitspannen) {

          Gesamturlaub -= Zeitspanne.Tageanzahl;
        }

        return Gesamturlaub;
      }
      else return 0;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'CountResturlaub', this.Debug.Typen.Service);
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

  public CheckDisplayExternenUrlaub(mitrbeiterid: string):boolean {

    try {

      let Beteiligt: Urlaubprojektbeteiligtestruktur;

      if(this.CurrentUrlaub !== null) {

        Beteiligt = lodash.find(this.CurrentUrlaub.Projektbeteiligteliste, {MitarbeiterID: mitrbeiterid});

        if(lodash.isUndefined(Beteiligt)) return false;
        else {

          return Beteiligt.Display;
        }
      }
      else return false;


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'CheckDisplayExternenUrlaub', this.Debug.Typen.Service);
    }
  }
}
