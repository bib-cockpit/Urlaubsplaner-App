import {EventEmitter, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {ConstProvider} from "../const/const";
import {ToolsProvider} from "../tools/tools";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {Protokollstruktur} from "../../dataclasses/protokollstruktur";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import { v4 as uuidv4 } from 'uuid';
import * as lodash from "lodash-es";
import {DatabaseAuthenticationService} from "../database-authentication/database-authentication.service";
import {BasicsProvider} from "../basics/basics";
import {Mitarbeitersettingsstruktur} from "../../dataclasses/mitarbeitersettingsstruktur";
import {Observable} from "rxjs";
import {Projektpunktanmerkungstruktur} from "../../dataclasses/projektpunktanmerkungstruktur";
import {Changelogstruktur} from "../../dataclasses/changelogstruktur";
import {Bauteilstruktur} from "../../dataclasses/bauteilstruktur";
import {environment} from "../../../environments/environment";
import {Bautagebuchstruktur} from "../../dataclasses/bautagebuchstruktur";
import {LOPListestruktur} from "../../dataclasses/loplistestruktur";

@Injectable({
  providedIn: 'root'
})
export class DatabasePoolService {

  public Standorteliste:          Standortestruktur[];
  public Mitarbeiterliste:        Mitarbeiterstruktur[];
  public Projektpunkteliste:      Projektpunktestruktur[][];
  public Protokollliste:          Protokollstruktur[][];
  public Bautagebuchliste:        Bautagebuchstruktur[][];
  public LOPListe:                LOPListestruktur[][];
  public Mitarbeitersettingsliste: Mitarbeitersettingsstruktur[];
  public CockpitserverURL:        string;
  public Mitarbeiterdaten: Mitarbeiterstruktur;
  public Mitarbeiterstandort: Standortestruktur;
  public Mitarbeitersettings: Mitarbeitersettingsstruktur;
  public ShowProgress: boolean;
  public MaxProgressValue: number;
  public CurrentProgressValue: number;
  public ProgressMessage: string;
  public Changlogliste: Changelogstruktur[];
  public MitarbeiterdatenHasError:boolean;
  public Emailcontent: string;
  public Emailcontentvarinaten = {

    NONE: this.Const.NONE,
    Protokoll: 'Protokoll',
    Bautagebuch: 'Bautagebuch'
  };

  public StandortelisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public MitarbeiterlisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public MitarbeiterdatenChanged: EventEmitter<any> = new EventEmitter<any>();
  public MitarbeitersettingslisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public MitarbeitersettingsChanged: EventEmitter<any> = new EventEmitter<any>();
  public LoadingAllDataFinished: EventEmitter<any> = new EventEmitter<any>();
  public ProjektpunktelisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public ProjektpunktStatusChanged: EventEmitter<any> = new EventEmitter<any>();
  public ProjektpunktKostengruppeChanged: EventEmitter<any> = new EventEmitter<any>();
  public ProtokolllisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public ProtokollprojektpunktChanged: EventEmitter<any> = new EventEmitter<any>();
  public LOPListeprojektpunktChanged: EventEmitter<any> = new EventEmitter<any>();
  public ProjektpunktChanged: EventEmitter<any> = new EventEmitter<any>();
  public ChangeloglisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public BautagebuchlisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public EmailempfaengerChanged: EventEmitter<any> = new EventEmitter<any>();
  public LOPListeChanged: EventEmitter<any> = new EventEmitter<any>();
  public MitarbeiterAuswahlChanged: EventEmitter<any> = new EventEmitter<any>();
  public BeteiligteAuswahlChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(private Debug: DebugProvider,
              private Const: ConstProvider,
              private Http:  HttpClient) {
    try {

      this.Mitarbeiterdaten         = null;
      this.MitarbeiterdatenHasError = true;
      this.Mitarbeitersettings      = null;
      this.Mitarbeiterstandort      = null;
      this.ShowProgress             = false;
      this.Mitarbeitersettingsliste = [];
      this.MaxProgressValue         = 10;
      this.CurrentProgressValue     = 5;
      this.Standorteliste           = [];
      this.Mitarbeiterliste         = [];
      this.Projektpunkteliste       = [];
      this.Projektpunkteliste       = [];
      this.Protokollliste           = [];
      this.Changlogliste            = [];
      this.Bautagebuchliste         = [];
      this.LOPListe                 = [];
      this.CockpitserverURL         = environment.production === true ? 'https://bib-cockpit-server.azurewebsites.net' : 'http://localhost:8080';
      this.Emailcontent             = this.Emailcontentvarinaten.NONE;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'constructor', this.Debug.Typen.Service);
    }
  }

  public ReadProjektpunkteliste(projekt: Projektestruktur): Promise<any> {

    try {

      let Params: HttpParams;
      let Headers: HttpHeaders;
      let ProjektpunkteObservable: Observable<any>;

      this.Projektpunkteliste[projekt.Projektkey] = [];

      return new Promise((resolve, reject) => {

        Params  = new HttpParams({ fromObject: { projektkey: projekt.Projektkey }} );
        Headers = new HttpHeaders({

          'content-type': 'application/json',
          // 'authorization': this.AuthService.AccessToken
        });

        ProjektpunkteObservable = this.Http.get(this.CockpitserverURL + '/projektpunkte', { headers: Headers, params: Params } );

        ProjektpunkteObservable.subscribe({

          next: (data) => {

            this.Projektpunkteliste[projekt.Projektkey] = <Projektpunktestruktur[]>data;


          },
          complete: () => {

            this.Debug.ShowMessage('Read Projektpunkte liste von ' + projekt.Projektkurzname + ' fertig.', 'Database Pool', 'ReadProjektpunkteliste', this.Debug.Typen.Service);

            this.Projektpunkteliste[projekt.Projektkey].forEach((Projektpunkt: Projektpunktestruktur) => {

              if(lodash.isUndefined(Projektpunkt.Zeitansatz))             Projektpunkt.Zeitansatz             = 30;
              if(lodash.isUndefined(Projektpunkt.Zeitansatz))             Projektpunkt.Zeitansatz             = 30;
              if(lodash.isUndefined(Projektpunkt.Zeitansatzeinheit))      Projektpunkt.Zeitansatzeinheit      = this.Const.Zeitansatzeinheitvarianten.Minuten;
              if(lodash.isUndefined(Projektpunkt.Geschlossenzeitstempel)) Projektpunkt.Geschlossenzeitstempel = null;
              if(lodash.isUndefined(Projektpunkt.Geschlossenzeitstring))  Projektpunkt.Geschlossenzeitstring  = null;
              if(lodash.isUndefined(Projektpunkt.EndeKalenderwoche))      Projektpunkt.EndeKalenderwoche      = null;
              if(lodash.isUndefined(Projektpunkt.LOPListeID))             Projektpunkt.LOPListeID             = null;
              if(lodash.isUndefined(Projektpunkt.Prioritaet))             Projektpunkt.Prioritaet             = null;
              if(lodash.isUndefined(Projektpunkt.Thematik))               Projektpunkt.Thematik               = '';

              Projektpunkt.Anmerkungenliste.forEach((Anmerkung: Projektpunktanmerkungstruktur) => {

                Anmerkung.LiveEditor = false;

              });
            });

            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'ReadProjektpunkteliste', this.Debug.Typen.Service);
    }
  }

  public ReadProtokollliste(projekt: Projektestruktur): Promise<any> {

    try {

      let Params: HttpParams;
      let Headers: HttpHeaders;
      let ProtokollObservable: Observable<any>;

      this.Protokollliste[projekt.Projektkey] = [];

      return new Promise((resolve, reject) => {

        Params  = new HttpParams({ fromObject: { projektkey: projekt.Projektkey }} );
        Headers = new HttpHeaders({

          'content-type': 'application/json',
          // 'authorization': this.AuthService.AccessToken
        });

        ProtokollObservable = this.Http.get(this.CockpitserverURL + '/protokolle', { headers: Headers, params: Params } );

        ProtokollObservable.subscribe({

          next: (data) => {

            // debugger;

            this.Protokollliste[projekt.Projektkey] = <Protokollstruktur[]>data;

          },
          complete: () => {


             // debugger;

            this.Debug.ShowMessage('Read Protokollliste von ' + projekt.Projektkurzname + ' fertig.', 'Database Pool', 'ReadProtokollliste', this.Debug.Typen.Service);


            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'ReadProtokollliste', this.Debug.Typen.Service);
    }
  }

  public ReadLOPListe(projekt: Projektestruktur): Promise<any> {

    try {

      let Params: HttpParams;
      let Headers: HttpHeaders;
      let LOPListeObservable: Observable<any>;

      this.LOPListe[projekt.Projektkey] = [];

      return new Promise((resolve, reject) => {

        Params  = new HttpParams({ fromObject: { projektkey: projekt.Projektkey }} );
        Headers = new HttpHeaders({

          'content-type': 'application/json',
        });

        LOPListeObservable = this.Http.get(this.CockpitserverURL + '/lopliste', { headers: Headers, params: Params } );

        LOPListeObservable.subscribe({

          next: (data) => {

            // debugger;

            this.LOPListe[projekt.Projektkey] = <LOPListestruktur[]>data;

          },
          complete: () => {


             // debugger;

            this.Debug.ShowMessage('Read LOP Liste von ' + projekt.Projektkurzname + ' fertig.', 'Database Pool', 'ReadLOPListe', this.Debug.Typen.Service);


            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'ReadLOPListe', this.Debug.Typen.Service);
    }
  }

  public ReadBautagebuchliste(projekt: Projektestruktur): Promise<any> {

    try {

      let Params: HttpParams;
      let Headers: HttpHeaders;
      let BautagebuchObservable: Observable<any>;

      this.Bautagebuchliste[projekt.Projektkey] = [];

      return new Promise((resolve, reject) => {

        Params  = new HttpParams({ fromObject: { projektkey: projekt.Projektkey }} );
        Headers = new HttpHeaders({

          'content-type': 'application/json',
          // 'authorization': this.AuthService.AccessToken
        });

        BautagebuchObservable = this.Http.get(this.CockpitserverURL + '/bautagebuch', { headers: Headers, params: Params } );

        BautagebuchObservable.subscribe({

          next: (data) => {

            this.Bautagebuchliste[projekt.Projektkey] = <Bautagebuchstruktur[]>data;

          },
          complete: () => {


            this.Bautagebuchliste[projekt.Projektkey].forEach((Tagebuch: Bautagebuchstruktur) => {

              if(lodash.isUndefined(Tagebuch.GesendetZeitstring))  Tagebuch.GesendetZeitstring  = this.Const.NONE;
              if(lodash.isUndefined(Tagebuch.GesendetZeitstempel)) Tagebuch.GesendetZeitstempel = null;

            });

            // Tagebücher absteigend mit letztem Eintrag zuerst sortieren

            this.Bautagebuchliste[projekt.Projektkey].sort((a: Bautagebuchstruktur, b: Bautagebuchstruktur) => {

              if (a.Zeitstempel > b.Zeitstempel) return -1;
              if (a.Zeitstempel < b.Zeitstempel) return 1;
              return 0;
            });

            this.Debug.ShowMessage('Read Bautagebuchliste von ' + projekt.Projektkurzname + ' fertig.', 'Database Pool', 'ReadBautagebuchliste', this.Debug.Typen.Service);


            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'ReadProtokollliste', this.Debug.Typen.Service);
    }
  }

  public ReadMitarbeiterliste(): Promise<any> {

    try {

      this.Mitarbeiterliste = [];

      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
        // 'authorization': this.AuthService.AccessToken
      });

      return new Promise((resolve, reject) => {

        let MitarbeiterObservable = this.Http.get(this.CockpitserverURL + '/mitarbeiter', { headers: headers } );

        MitarbeiterObservable.subscribe({

          next: (data) => {

            this.Mitarbeiterliste = <Mitarbeiterstruktur[]>data;

          },
          complete: () => {

            for(let Mitarbeiter of this.Mitarbeiterliste) {

              Mitarbeiter = this.InitMitarbeiter(Mitarbeiter);
            }

            this.MitarbeiterlisteChanged.emit();

            resolve(true);

          },
          error: (error: HttpErrorResponse) => {

            console.log(error.message);
            console.log('Mitarbeiterliste lesen war fehlerhaft.');

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'ReadMitarbeiterliste', this.Debug.Typen.Service);
    }
  }

  public TestServerconnection(): Promise<any> {

    try {

      this.Changlogliste = [];

      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
        // 'authorization': `Bearer ${this.AuthService.AccessToken}`
      });

      return new Promise((resolve, reject) => {

        let TestObservable = this.Http.get(this.CockpitserverURL + '/', { headers: headers } );

        TestObservable.subscribe({

          next: (data) => {

            debugger;

          },
          complete: () => {


            debugger;

            resolve(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'TestServerconnection', this.Debug.Typen.Service);
    }
  }

  public ReadChangelogliste(): Promise<any> {

    try {

      this.Changlogliste = [];

      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
        // 'authorization': this.AuthService.AccessToken
      });

      return new Promise((resolve, reject) => {

        let ChangelogObservable = this.Http.get(this.CockpitserverURL + '/changelog', { headers: headers } );

        ChangelogObservable.subscribe({

          next: (data) => {

            this.Changlogliste = <Changelogstruktur[]>data;

          },
          complete: () => {

            this.Changlogliste.sort((a: Changelogstruktur, b: Changelogstruktur) => {

              if (a.Zeitstempel > b.Zeitstempel) return -1;
              if (a.Zeitstempel < b.Zeitstempel) return 1;
              return 0;
            });

            this.ChangeloglisteChanged.emit();

            resolve(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'ReadChangelogliste', this.Debug.Typen.Service);
    }
  }

  public ReadStandorteliste(): Promise<any> {

    try {

      this.Standorteliste = [];

      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
        // 'authorization': this.AuthService.AccessToken
      });

      return new Promise((resolve, reject) => {

        let StandortObservable = this.Http.get(this.CockpitserverURL + '/standorte', { headers: headers });

        StandortObservable.subscribe({

          next: (data) => {

            this.Standorteliste = <Standortestruktur[]>data;
          },
          complete: () => {

            this.StandortelisteChanged.emit();

            resolve(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'ReadStandorteliste', this.Debug.Typen.Service);
    }
  }


  public ReadSettingsliste(): Promise<any> {

    try {

      this.Mitarbeitersettingsliste = [];

      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
        // 'authorization': this.AuthService.AccessToken
      });

      return new Promise((resolve, reject) => {

        let SettingsObservable = this.Http.get(this.CockpitserverURL + '/settings', { headers: headers });

        SettingsObservable.subscribe({

          next: (data) => {

            this.Mitarbeitersettingsliste = <Mitarbeitersettingsstruktur[]>data;
          },
          complete: () => {

            this.MitarbeitersettingslisteChanged.emit();

            resolve(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'ReadStandorteliste', this.Debug.Typen.Service);
    }
  }


  public InitMitarbeiter(mitarbeiter: Mitarbeiterstruktur): Mitarbeiterstruktur {

    try {

      if(lodash.isUndefined(mitarbeiter.SettingsID)) {

        mitarbeiter.SettingsID = null;
      }
      if(lodash.isUndefined(mitarbeiter.Archiviert)) {

        mitarbeiter.Archiviert = false;
      }

      if(lodash.isUndefined(mitarbeiter.Meintagliste)) {

        mitarbeiter.Meintagliste = [];
      }

      if(lodash.isUndefined(mitarbeiter.Meinewocheliste)) {

        mitarbeiter.Meinewocheliste = [];
      }

      for(let Eintrag of mitarbeiter.Meinewocheliste) {

        if(lodash.isUndefined(Eintrag.Kalenderwoche)) Eintrag.Kalenderwoche = 0;
      }



      return mitarbeiter;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'InitMitarbeiter', this.Debug.Typen.Service);
    }
  }

  public CheckMitarbeiterdaten(): boolean {

    try {

      if(this.Mitarbeiterdaten !== null) {

        this.MitarbeiterdatenHasError = false;
      }
      else this.MitarbeiterdatenHasError = true;

      return this.MitarbeiterdatenHasError;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'CheckMItarbeiterdaten', this.Debug.Typen.Service);
    }
  }

  public async ReadProjektdaten(projektliste: Projektestruktur[]): Promise<any> {

    try {

      this.ShowProgress         = true;
      this.MaxProgressValue     = projektliste.length;
      this.CurrentProgressValue = 0;
      this.Projektpunkteliste   = [];
      this.Protokollliste       = [];
      this.Bautagebuchliste     = [];
      this.LOPListe             = [];

      try {

        for(let Projekt of projektliste)  {

          this.ProgressMessage = 'Projektpunkte ' + Projekt.Projektkurzname;

          await this.ReadProjektpunkteliste(Projekt);

          this.CurrentProgressValue++;
        }

        for(let Projekt of projektliste)  {

          this.ProgressMessage = 'Protokolle ' + Projekt.Projektkurzname;

          await this.ReadProtokollliste(Projekt);

          this.CurrentProgressValue++;
        }

        for(let Projekt of projektliste)  {

          this.ProgressMessage = 'Bautagebücher ' + Projekt.Projektkurzname;

          await this.ReadBautagebuchliste(Projekt);

          this.CurrentProgressValue++;
        }

        for(let Projekt of projektliste)  {

          this.ProgressMessage = 'LOP Liste ' + Projekt.Projektkurzname;

          await this.ReadLOPListe(Projekt);

          this.CurrentProgressValue++;
        }

      } catch (error) {

        this.ShowProgress = false;

        return Promise.reject(error);
      }

      this.ProjektpunktelisteChanged.emit();
      this.ProtokolllisteChanged.emit();
      this.BautagebuchlisteChanged.emit();
      this.LOPListeChanged.emit();

      this.ShowProgress = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'ReadProjektdaten', this.Debug.Typen.Service);
    }
  }


  public GetNewUniqueID(): string {

    try {

      return uuidv4();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'GetNewUniqueID', this.Debug.Typen.Service);
    }
  }

  public GetNewMitarbeitersettings(): Mitarbeitersettingsstruktur {

    try {

      return {

        _id:                     null,
        MitarbeiterID:           null,
        FavoritenID:             null,
        ProjektID:               null,
        Favoritprojektindex:     null,
        StandortFilter:          null,
        AufgabenShowBearbeitung: true,
        AufgabenShowGeschlossen: false,
        AufgabenShowOffen:       true,
        AufgabenShowRuecklauf:   true,
        AufgabenShowMeilensteinOnly: false,
        Deleted:                 false,
        HeadermenueMaxFavoriten: 6,

        AufgabenSortiermodus: this.Const.AufgabenSortiermodusvarianten.TermineAufsteigend,

        AufgabenMeilensteineNachlauf: 2,

        AufgabenShowMeilensteine:  true,
        AufgabenShowNummer:        false,
        AufgabenShowStartdatum:    false,
        AufgabenShowAufgabe:       true,
        AufgabenShowBemerkung:     true,
        AufgabenShowTage:          true,
        AufgabenShowTermin:        true,
        AufgabenShowStatus:        true,
        AufgabenShowFortschritt:   false,
        AufgabenShowZustaendig:    true,
        AufgabenShowMeintag:       true,
        AufgabenShowZeitansatz:    false,
        AufgabenShowMeinewoche:    true,
        AufgabenShowAusfuehrung:   true,
        AufgabenShowPlanung:       true,

        AufgabenTerminfiltervariante:  null,
        AufgabenTerminfilterStartwert: null,
        AufgabenTerminfilterEndewert:  null,

        LOPListeGeschlossenZeitfilter: 14
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'GetNewMitarbeitersettings', this.Debug.Typen.Service);
    }
  }

  public InitMitarbeitersettings(): Mitarbeitersettingsstruktur {

    try {


      let Settings: Mitarbeitersettingsstruktur;

      if(this.Mitarbeiterdaten.SettingsID === null) {

        return  this.GetNewMitarbeitersettings();
      }
      else {

        Settings = lodash.find(this.Mitarbeitersettingsliste, {_id: this.Mitarbeiterdaten.SettingsID});

        if(lodash.isUndefined(Settings)) {

          return this.GetNewMitarbeitersettings();
        }
        else {

          if(lodash.isUndefined(Settings.Favoritprojektindex))      Settings.Favoritprojektindex           = 3000;

          if(lodash.isUndefined(Settings.HeadermenueMaxFavoriten))  Settings.HeadermenueMaxFavoriten  = 6;
          if(lodash.isUndefined(Settings.Deleted))                  Settings.Deleted                  = false;
          if(lodash.isUndefined(Settings.AufgabenShowNummer))       Settings.AufgabenShowNummer       = true;
          if(lodash.isUndefined(Settings.AufgabenShowStartdatum))   Settings.AufgabenShowStartdatum   = true;
          if(lodash.isUndefined(Settings.AufgabenShowAufgabe))      Settings.AufgabenShowAufgabe      = true;
          if(lodash.isUndefined(Settings.AufgabenShowBemerkung))    Settings.AufgabenShowBemerkung    = true;
          if(lodash.isUndefined(Settings.AufgabenShowTage))         Settings.AufgabenShowTage         = true;
          if(lodash.isUndefined(Settings.AufgabenShowTermin))       Settings.AufgabenShowTermin       = true;
          if(lodash.isUndefined(Settings.AufgabenShowStatus))       Settings.AufgabenShowStatus       = true;
          if(lodash.isUndefined(Settings.AufgabenShowFortschritt))  Settings.AufgabenShowFortschritt  = true;
          if(lodash.isUndefined(Settings.AufgabenShowZustaendig))   Settings.AufgabenShowZustaendig   = true;
          if(lodash.isUndefined(Settings.AufgabenShowMeintag))      Settings.AufgabenShowMeintag      = true;
          if(lodash.isUndefined(Settings.AufgabenShowZeitansatz))   Settings.AufgabenShowZeitansatz   = true;
          if(lodash.isUndefined(Settings.AufgabenShowMeinewoche))   Settings.AufgabenShowMeinewoche   = true;

          if(lodash.isUndefined(Settings.AufgabenShowMeilensteinOnly)) Settings.AufgabenShowMeilensteinOnly = false;

          if(lodash.isUndefined(Settings.AufgabenShowGeschlossen))  Settings.AufgabenShowGeschlossen  = true;
          if(lodash.isUndefined(Settings.AufgabenShowOffen))        Settings.AufgabenShowOffen        = true;
          if(lodash.isUndefined(Settings.AufgabenShowBearbeitung))  Settings.AufgabenShowBearbeitung  = true;
          if(lodash.isUndefined(Settings.AufgabenShowRuecklauf))    Settings.AufgabenShowRuecklauf    = true;
          if(lodash.isUndefined(Settings.AufgabenShowMeilensteine)) Settings.AufgabenShowMeilensteine = true;
          if(lodash.isUndefined(Settings.AufgabenShowAusfuehrung))  Settings.AufgabenShowAusfuehrung  = true;
          if(lodash.isUndefined(Settings.AufgabenShowPlanung))      Settings.AufgabenShowPlanung      = true;

          if(lodash.isUndefined(Settings.AufgabenTerminfiltervariante))  Settings.AufgabenTerminfiltervariante  = null;
          if(lodash.isUndefined(Settings.AufgabenTerminfilterStartwert)) Settings.AufgabenTerminfilterStartwert = null;
          if(lodash.isUndefined(Settings.AufgabenTerminfilterEndewert))  Settings.AufgabenTerminfilterEndewert  = null;
          if(lodash.isUndefined(Settings.AufgabenSortiermodus))          Settings.AufgabenSortiermodus  = this.Const.AufgabenSortiermodusvarianten.TermineAufsteigend;

          if(lodash.isUndefined(Settings.AufgabenMeilensteineNachlauf)) Settings.AufgabenMeilensteineNachlauf  = 2;

          if(lodash.isUndefined(Settings.LOPListeGeschlossenZeitfilter)) Settings.LOPListeGeschlossenZeitfilter  = 14;

          return Settings;
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'InitMitarbeitersettings', this.Debug.Typen.Service);
    }
  }
}
