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

@Injectable({
  providedIn: 'root'
})
export class DatabasePoolService {

  public Standorteliste:          Standortestruktur[];
  public Mitarbeiterliste:        Mitarbeiterstruktur[];
  public Gesamtprojektliste:      Projektestruktur[];
  public Projektpunkteliste:      Projektpunktestruktur[][];
  public Protokollliste:          Protokollstruktur[][];
  public Mitarbeitersettingsliste: Mitarbeitersettingsstruktur[];
  public CockpitserverURL:        string;
  public Mitarbeiterdaten: Mitarbeiterstruktur;
  public Mitarbeitersettings: Mitarbeitersettingsstruktur;
  public ShowProgress: boolean;
  public MaxProgressValue: number;
  public CurrentProgressValue: number;
  public ProgressMessage: string;

  public StandortelisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public MitarbeiterlisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public GesamtprojektelisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public MitarbeiterdatenChanged: EventEmitter<any> = new EventEmitter<any>();
  public MitarbeitersettingslisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public MitarbeitersettingsChanged: EventEmitter<any> = new EventEmitter<any>();
  public LoadingAllDataFinished: EventEmitter<any> = new EventEmitter<any>();
  public ProjektpunktelisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public ProtokolllisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public ProtokollprojektpunktChanged: EventEmitter<any> = new EventEmitter<any>();
  public ProjektpunktChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(private Debug: DebugProvider,
              private Const: ConstProvider,
              private Http:  HttpClient,
              private Basics: BasicsProvider,
              private AuthService: DatabaseAuthenticationService,
              private Tools: ToolsProvider) {
    try {

      this.Mitarbeiterdaten         = null;
      this.Mitarbeitersettings      = null;
      this.ShowProgress             = false;
      this.Mitarbeitersettingsliste = [];
      this.MaxProgressValue         = 10;
      this.CurrentProgressValue     = 5;
      this.Standorteliste           = [];
      this.Mitarbeiterliste         = [];
      this.Gesamtprojektliste       = [];
      this.Projektpunkteliste       = [];
      this.Projektpunkteliste       = [];
      this.Protokollliste           = [];
      this.CockpitserverURL         = 'http://localhost:5000';

      // Test

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'constructor', this.Debug.Typen.Service);
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
          'authorization': this.AuthService.GetAuthenticationToken()
        });

        ProjektpunkteObservable = this.Http.get(this.CockpitserverURL + '/projektpunkte', { headers: Headers, params: Params } );

        ProjektpunkteObservable.subscribe({

          next: (data) => {

            this.Projektpunkteliste[projekt.Projektkey] = <Projektpunktestruktur[]>data;

            // debugger;

          },
          complete: () => {

            console.log('Read Projektpunkte liste von ' + projekt.Projektkurzname + ' fertig.');

            this.Projektpunkteliste[projekt.Projektkey].forEach((Projektpunkt: Projektpunktestruktur) => {

              if(lodash.isUndefined(Projektpunkt.Zeitansatz))             Projektpunkt.Zeitansatz             = 30;
              if(lodash.isUndefined(Projektpunkt.Zeitansatz))             Projektpunkt.Zeitansatz             = 30;
              if(lodash.isUndefined(Projektpunkt.Zeitansatzeinheit))      Projektpunkt.Zeitansatzeinheit      = this.Const.Zeitansatzeinheitvarianten.Minuten;
              if(lodash.isUndefined(Projektpunkt.Geschlossenzeitstempel)) Projektpunkt.Geschlossenzeitstempel = null;
              if(lodash.isUndefined(Projektpunkt.Geschlossenzeitstring))  Projektpunkt.Geschlossenzeitstring  = null;
              if(lodash.isUndefined(Projektpunkt.EndeKalenderwoche))      Projektpunkt.EndeKalenderwoche      = null;

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

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'ReadProjektpunkteliste', this.Debug.Typen.Service);
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
          'authorization': this.AuthService.GetAuthenticationToken()
        });

        ProtokollObservable = this.Http.get(this.CockpitserverURL + '/protokolle', { headers: Headers, params: Params } );

        ProtokollObservable.subscribe({

          next: (data) => {

            // debugger;

            this.Protokollliste[projekt.Projektkey] = <Protokollstruktur[]>data;

          },
          complete: () => {

             // debugger;

            console.log('Read Protokollliste von ' + projekt.Projektkurzname + ' fertig.');

            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'ReadProtokollliste', this.Debug.Typen.Service);
    }
  }

  public ReadMitarbeiterliste(): Promise<any> {

    try {

      this.Mitarbeiterliste = [];

      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
        'authorization': this.AuthService.GetAuthenticationToken()
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

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'ReadMitarbeiterliste', this.Debug.Typen.Service);
    }
  }

  public ReadStandorteliste(): Promise<any> {

    try {

      this.Standorteliste = [];

      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
        'authorization': this.AuthService.GetAuthenticationToken()
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

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'ReadStandorteliste', this.Debug.Typen.Service);
    }
  }


  public ReadSettingsliste(): Promise<any> {

    try {

      this.Mitarbeitersettingsliste = [];

      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
        'authorization': this.AuthService.GetAuthenticationToken()
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

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'ReadStandorteliste', this.Debug.Typen.Service);
    }
  }

  public ReadGesamtprojektliste(): Promise<any> {

    try {

      this.Gesamtprojektliste = [];

      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
        'authorization': this.AuthService.GetAuthenticationToken()
      });

      return new Promise((resolve, reject) => {

        let StandortObservable = this.Http.get(this.CockpitserverURL + '/projekte', { headers: headers });

        StandortObservable.subscribe({

          next: (data) => {

            this.Gesamtprojektliste = <Projektestruktur[]>data;
          },
          complete: () => {

            for(let Projekt of this.Gesamtprojektliste) {

              if(lodash.isUndefined(Projekt.Projektfarbe)) Projekt.Projektfarbe = 'Burnicklgruen';
            }

            this.GesamtprojektelisteChanged.emit();

            resolve(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'ReadGesamtprojektliste', this.Debug.Typen.Service);
    }
  }

  public InitMitarbeiter(mitarbeiter: Mitarbeiterstruktur): Mitarbeiterstruktur {

    try {

      if(lodash.isUndefined(mitarbeiter.SettingsID)) {

        mitarbeiter.SettingsID = null;
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

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'InitMitarbeiter', this.Debug.Typen.Service);
    }
  }

  public async ReadProjektdaten(projektliste: Projektestruktur[]): Promise<any> {

    try {

      this.ShowProgress         = true;
      this.MaxProgressValue     = projektliste.length;
      this.CurrentProgressValue = 0;
      this.Projektpunkteliste   = [];
      this.Protokollliste       = [];

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


      } catch (error) {

        this.ShowProgress = false;

        return Promise.reject(error);
      }

      this.ProjektpunktelisteChanged.emit();
      this.ProtokolllisteChanged.emit();

      this.ShowProgress = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'ReadProjektdaten', this.Debug.Typen.Service);
    }
  }

  public async Init() {

    try {

      try {

        await this.ReadStandorteliste();
        await this.ReadMitarbeiterliste();
        await this.ReadSettingsliste();
        await this.ReadGesamtprojektliste();

      }
      catch(error: any) {

        return Promise.reject(error);
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'Init', this.Debug.Typen.Service);
    }
  }

  public GetNewUniqueID(): string {

    try {

      return uuidv4();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'GetNewUniqueID', this.Debug.Typen.Service);
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

        AufgabenTerminfiltervariante:  null,
        AufgabenTerminfilterStartwert: null,
        AufgabenTerminfilterEndewert:  null
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'GetNewMitarbeitersettings', this.Debug.Typen.Service);
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

          if(lodash.isUndefined(Settings.AufgabenTerminfiltervariante))  Settings.AufgabenTerminfiltervariante  = null;
          if(lodash.isUndefined(Settings.AufgabenTerminfilterStartwert)) Settings.AufgabenTerminfilterStartwert = null;
          if(lodash.isUndefined(Settings.AufgabenTerminfilterEndewert))  Settings.AufgabenTerminfilterEndewert  = null;
          if(lodash.isUndefined(Settings.AufgabenSortiermodus))          Settings.AufgabenSortiermodus  = this.Const.AufgabenSortiermodusvarianten.TermineAufsteigend;

          if(lodash.isUndefined(Settings.AufgabenMeilensteineNachlauf)) Settings.AufgabenMeilensteineNachlauf  = 2;

          return Settings;
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'InitMitarbeitersettings', this.Debug.Typen.Service);
    }
  }

  private async ReadMitarbeitersettings() {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'ReadMitarbeitersettings', this.Debug.Typen.Service);
    }
  }
}
