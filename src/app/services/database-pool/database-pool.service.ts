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
import {Outlookkategoriesstruktur} from "../../dataclasses/outlookkategoriesstruktur";
import {Notizenkapitelstruktur} from "../../dataclasses/notizenkapitelstruktur";
import {Fachbereiche, Fachbereichestruktur} from "../../dataclasses/fachbereicheclass";
import {Aufgabenansichtstruktur} from "../../dataclasses/aufgabenansichtstruktur";
import {Festlegungskategoriestruktur} from "../../dataclasses/festlegungskategoriestruktur";

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
  public Notizenkapitelliste:     Notizenkapitelstruktur[][];
  public Mitarbeitersettingsliste: Mitarbeitersettingsstruktur[];
  public CockpitserverURL:        string;
  public Mitarbeiterdaten: Mitarbeiterstruktur;
  public Mitarbeiterstandort: Standortestruktur;
  public Mitarbeitersettings: Mitarbeitersettingsstruktur;
  public CurrentAufgabenansichten: Aufgabenansichtstruktur;
  public ShowProgress: boolean;
  public MaxProgressValue: number;
  public CurrentProgressValue: number;
  public ProgressMessage: string;
  public Changlogliste: Changelogstruktur[];
  public MitarbeiterdatenHasError:boolean;
  public Emailcontent: string;
  public Outlookkatekorien: Outlookkategoriesstruktur[];
  public ContacsSubscriptionURl: string;
  public Fachbereich: Fachbereiche;
  public  Festlegungskategorienliste: Festlegungskategoriestruktur[][];
  public Emailcontentvarinaten = {

    NONE: this.Const.NONE,
    Protokoll:    'Protokoll',
    Bautagebuch:  'Bautagebuch',
    Festlegungen: 'Festlegungen',
    LOPListe:     'LOPListe',
    Aufgabenliste: 'Aufgabenliste'
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
  public NotizenkapitellisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public CurrentLOPGewerkelisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public FestlegungskategorienlisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public Signatur: string;

  constructor(private Debug: DebugProvider,
              private Const: ConstProvider,
              private AuthService: DatabaseAuthenticationService,
              private Http:  HttpClient) {
    try {

      this.Mitarbeiterdaten         = null;
      this.MitarbeiterdatenHasError = true;
      this.Mitarbeitersettings      = null;
      this.Mitarbeiterstandort      = null;
      this.ShowProgress             = false;
      this.Mitarbeitersettingsliste = [];
      this.MaxProgressValue         = 0;
      this.CurrentProgressValue     = 0;
      this.Standorteliste           = [];
      this.Mitarbeiterliste         = [];
      this.Projektpunkteliste       = [];
      this.Projektpunkteliste       = [];
      this.Protokollliste           = [];
      this.Changlogliste            = [];
      this.Bautagebuchliste         = [];
      this.LOPListe                 = [];
      this.Notizenkapitelliste      = [];
      this.Outlookkatekorien        = [];
      this.CockpitserverURL         = environment.production === true ? 'https://bae-cockpit-server.azurewebsites.net' : 'http://localhost:8080';
      this.Emailcontent             = this.Emailcontentvarinaten.NONE;
      this.ContacsSubscriptionURl   = this.CockpitserverURL + '/subscription';
      this.Fachbereich              = new Fachbereiche();
      this.CurrentAufgabenansichten = null;
      this.Festlegungskategorienliste = [];

      this.Signatur                 =
        `<span style="font-size: 14px;">
        Beste Grüße,<br><br>
        [Name]<br>
        [Jobtitel]<br><br>
        </span>
        <span style="font-size: 14px; font-weight: bold;">
        BAE-GmbH<br>
        Ingenieure für Versorgungstechnik
        </span>
        <table style="font-size: 12px;">
           <tr><td colspan="2">[Strasse]</td></tr>
           <tr><td colspan="2">[Ort]</td></tr>
           <tr><td>Telefon:</td><td>[Telefon]</td></tr>
           <tr><td>Mobil:</td><td>[Mobil]</td></tr>
           <tr><td>Email:</td><td><a href="mailto:[Email]">[Email]</a></td></tr>
           <tr><td>Web:</td><td><a href="http://www.bae-ingenieure.de">www.bae-ingenieure.de</a></td></tr>
        </table>
        <span style="font-size: 12px; font-weight: bold;">
        Sitz: Coburg, Amtsgericht Coburg HRB 6357, USt.-IdNr.: DE327804364<br>
        Geschäftsführer Jürgen Kerscher, Michael Hölzle<br>
        Bürostandorte: Coburg, Bamberg, Deggendorf, München, Sofia, Varna<br>
        </span>
        <span style="font-size: 10px">
        Der Inhalt dieser E-Mail ist ausschließlich für den bezeichneten Adressaten bestimmt. Wenn Sie nicht der vorgesehene Adressat dieser E-Mail oder dessen Vertreter sein sollten,
        so beachten Sie, dass jede Form der Kenntnis- und Vorteilsnahme, Veröffentlichung, Vervielfältigung oder Weitergabe des Inhalts dieser Mail unzulässig ist. Wir bitten Sie, sich
        in diesem Fall mit dem Absender der E-Mail in Verbindung zu setzen. Aussagen gegenüber dem Adressaten unterliegen den Regelungen des zugrundeliegenden Angebotes bzw. Auftrags,
        insbesondere den Allgemeinen Auftragsbedingungen und der individuellen Haftungsvereinbarung. Der Inhalt der E-Mail ist nur rechtsverbindlich, wenn er unsererseits durch einen Brief
        entsprechend bestätigt wird. Die Versendung von E-Mails an uns hat keine fristwahrende Wirkung. Wir möchten Sie außerdem darauf hinweisen, dass die Kommunikation per E-Mail über das
        Internet unsicher ist, da für unberechtigte Dritte grundsätzlich die Möglichkeit der Kenntnisnahme und Manipulation besteht.<br><br>
        The information contained in this email is intended exclusively for the addressee. Access to this email by anyone else is unauthorized. If you are not the intended recipient or his
        representative, any form of disclosure, reproduction, distribution or any action taken or refrained from in reliance on it, is prohibited. Please notify the sender immediately. All
        statements directed via this email to our clients are subject to the conditions of the submitted offer respectively order, in particular to the General Terms and Conditions and to
        the individual liability agreement between the parties. The content of this email is not legally binding unless confirmed by letter. The sending of emails to us will not constitute
        compliance with any time limits or deadlines. Please note that communication via email over the internet is insecure because third parties generally have the possibility to access
        and manipulate emails.</span><br>
        <img src="[Image]" style="width: 200px;">`;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'constructor', this.Debug.Typen.Service);
    }
  }

  public GetFilledSignatur(local: boolean): string {

    try {

      let Signatur: string = this.Signatur;
      let Telefon: string  = this.Mitarbeiterdaten.Telefon;
      let Mobil: string    = this.Mitarbeiterdaten.Mobil;
      let Email: string    = this.Mitarbeiterdaten.Email;
      let Name: string     = this.Mitarbeiterdaten.Vorname + ' ' + this.Mitarbeiterdaten.Name;
      let Jobtitel: string = this.Mitarbeiterdaten.Jobtitel;
      let Standort: Standortestruktur = lodash.find(this.Standorteliste, {_id: this.Mitarbeiterdaten.StandortID });
      let Strasse: string;
      let Ort: string;

      if(!lodash.isUndefined(Standort)) {

        Strasse = Standort.Strasse;
        Ort     = Standort.PLZ + ' ' + Standort.Ort;

        Signatur = Signatur.replace('[Strasse]', Strasse);
        Signatur = Signatur.replace('[Ort]',     Ort);
      }

      Signatur = Signatur.replace('[Name]',     Name);
      Signatur = Signatur.replace('[Jobtitel]', Jobtitel);
      Signatur = Signatur.replace('[Telefon]',  Telefon);
      Signatur = Signatur.replace('[Mobil]',    Mobil);

      Signatur = Signatur.split('[Email]').join(Email);

      if(local) {

        Signatur = Signatur.split('[Image]').join('assets/images/logo_large.png');
      }
      else {


      }



      return Signatur;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'GetFilledSignatur', this.Debug.Typen.Service);
    }
  }

  public GetAufgabenansichten(projektid: string): Aufgabenansichtstruktur {

    try {
      let Ansichtensetup: Aufgabenansichtstruktur;

      if(this.Mitarbeitersettings !== null)  Ansichtensetup = lodash.find(this.Mitarbeitersettings.Aufgabenansicht, {ProjektID: projektid});

      if(lodash.isUndefined(Ansichtensetup)) {

        Ansichtensetup = {

          ProjektID: projektid,
          AufgabenShowAusfuehrung: true,
          AufgabenShowBearbeitung: true,
          AufgabenShowBilder: true,
          AufgabenShowGeschlossen: false,
          AufgabenShowMeilensteinOnly: false,
          AufgabenShowOffen: true,
          AufgabenShowPlanung: true,
          AufgabenShowRuecklauf: true,
          AufgabenShowMeilensteine: true,
        };
      }

      return Ansichtensetup;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'GetAufgabenansichten', this.Debug.Typen.Service);
    }
  }


  public ReadProjektpunkteliste(projekt: Projektestruktur): Promise<any> {

    try {

      let Params: HttpParams;
      let Headers: HttpHeaders;
      let ProjektpunkteObservable: Observable<any>;
      let Gewerk: Fachbereichestruktur;
      let Index: number;

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
              if(lodash.isUndefined(Projektpunkt.EmailID))                Projektpunkt.EmailID                = null;
              if(lodash.isUndefined(Projektpunkt.Leistungsphase))         Projektpunkt.Leistungsphase         = this.Const.Leistungsphasenvarianten.LPH3;
              if(lodash.isUndefined(Projektpunkt.OutlookkatgorieID))      Projektpunkt.OutlookkatgorieID      = this.Const.NONE;
              if(lodash.isUndefined(Projektpunkt.PlanungsmatrixID))       Projektpunkt.PlanungsmatrixID       = null;
              if(lodash.isUndefined(Projektpunkt.AufgabenbereichID))      Projektpunkt.AufgabenbereichID      = null;
              if(lodash.isUndefined(Projektpunkt.AufgabenteilbereichID))  Projektpunkt.AufgabenteilbereichID  = null;
              if(lodash.isUndefined(Projektpunkt.Matrixanwendung))        Projektpunkt.Matrixanwendung        = false;
              if(lodash.isUndefined(Projektpunkt.Bilderliste))            Projektpunkt.Bilderliste            = [];
              if(lodash.isUndefined(Projektpunkt.ProtokollShowBilder))    Projektpunkt.ProtokollShowBilder    = true;
              if(lodash.isUndefined(Projektpunkt.Thumbnailsize))          Projektpunkt.Thumbnailsize          = 'small';
              if(lodash.isUndefined(Projektpunkt.Ruecklaufreminderliste)) Projektpunkt.Ruecklaufreminderliste = [];

              Projektpunkt.Anmerkungenliste.forEach((Anmerkung: Projektpunktanmerkungstruktur) => {

                Anmerkung.LiveEditor = false;
              });

              // Gerwerke bestimmen

              /*

              Gewerk = this.Fachbereich.GetFachbereichbyKey(Projektpunkt.Fachbereich);

              if(!lodash.isUndefined(Gewerk)) {

                Index = lodash.findIndex(this.CurrentLOPGewerkeliste, {Key: Gewerk.Key});

                if(Index === -1) {

                  Gewerk.Visible = true;

                  this.CurrentLOPGewerkeliste.push(Gewerk);
                }
              }


               */

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

  public ReadNotizenkapitelliste(projekt: Projektestruktur): Promise<any> {

    try {

      let Params: HttpParams;
      let Headers: HttpHeaders;
      let NotizenkapitelObservable: Observable<any>;

      // debugger;

      this.Notizenkapitelliste[projekt.Projektkey] = [];

      return new Promise((resolve, reject) => {

        Params  = new HttpParams({ fromObject: { projektkey: projekt.Projektkey }} );
        Headers = new HttpHeaders({

          'content-type': 'application/json',
        });

        NotizenkapitelObservable = this.Http.get(this.CockpitserverURL + '/notizenkapitel', { headers: Headers, params: Params } );

        NotizenkapitelObservable.subscribe({

          next: (data) => {

            // debugger

            this.Notizenkapitelliste[projekt.Projektkey] = <Notizenkapitelstruktur[]>data;

          },
          complete: () => {

            this.Notizenkapitelliste[projekt.Projektkey].sort((a: Notizenkapitelstruktur, b: Notizenkapitelstruktur) => {

              if (a.Titel < b.Titel) return -1;
              if (a.Titel > b.Titel) return 1;
              return 0;
            });

             // debugger;

            this.Debug.ShowMessage('Read Notizenliste von ' + projekt.Projektkurzname + ' fertig.', 'Database Pool', 'NotizenkReadNotizenkapitellisteapitelroutsClass', this.Debug.Typen.Service);


            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'ReadNotizenkapitelliste', this.Debug.Typen.Service);
    }
  }

  public ReadFestlegungskategorieliste(projekt: Projektestruktur): Promise<any> {

    try {

      let Params: HttpParams;
      let Headers: HttpHeaders;
      let FestlegungskategorieObservable: Observable<any>;

      // debugger;

      this.Festlegungskategorienliste[projekt.Projektkey] = [];

      return new Promise((resolve, reject) => {

        Params  = new HttpParams({ fromObject: { projektkey: projekt.Projektkey }} );
        Headers = new HttpHeaders({

          'content-type': 'application/json',
        });

        FestlegungskategorieObservable = this.Http.get(this.CockpitserverURL + '/festlegungskategorie', { headers: Headers, params: Params } );

        FestlegungskategorieObservable.subscribe({

          next: (data) => {

            this.Festlegungskategorienliste[projekt.Projektkey] = <Festlegungskategoriestruktur[]>data;

          },
          complete: () => {




            this.Debug.ShowMessage('Read Festlegungskategorieliste von ' + projekt.Projektkurzname + ' fertig.', 'Database Pool', 'ReadFestlegungskategorieliste', this.Debug.Typen.Service);

            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'ReadFestlegungskategorieliste', this.Debug.Typen.Service);
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

  public StartContacsSubscription() {

    try {

      let Observer: Observable<any>;

      return new Promise((resolve, reject) => {

        console.log('Start Contacs Subscription');

        debugger;

        Observer = this.Http.post(this.ContacsSubscriptionURl, {});

        Observer.subscribe({

          next: (result) => {

            debugger;

          },
          complete: () => {

            debugger;

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'StartContacsSubscription', this.Debug.Typen.Service);
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

      let Steps: number           = 7;
      this.ShowProgress           = true;
      this.MaxProgressValue       = projektliste.length * Steps;
      this.CurrentProgressValue   = 0;
      this.Projektpunkteliste     = [];
      this.Protokollliste         = [];
      this.Bautagebuchliste       = [];
      this.LOPListe               = [];

      try {

        this.ProgressMessage = 'Projektpunkte Musterprojekt';

        for(let Projekt of projektliste)  {

          this.ProgressMessage = 'Projektpunkte ' + Projekt.Projektkurzname;

          await this.ReadProjektpunkteliste(Projekt);

          this.CurrentProgressValue++;

          this.ProgressMessage = 'Protokolle ' + Projekt.Projektkurzname;

          await this.ReadProtokollliste(Projekt);

          this.CurrentProgressValue++;

          this.ProgressMessage = 'Bautagebücher ' + Projekt.Projektkurzname;

          await this.ReadBautagebuchliste(Projekt);

          this.CurrentProgressValue++;

          this.ProgressMessage = 'LOP Liste ' + Projekt.Projektkurzname;

          await this.ReadLOPListe(Projekt);

          this.CurrentProgressValue++;

          this.ProgressMessage = 'Notizenkapitel Liste ' + Projekt.Projektkurzname;

          await this.ReadNotizenkapitelliste(Projekt);

          this.CurrentProgressValue++;

          this.ProgressMessage = 'Festlegungskategorien Liste ' + Projekt.Projektkurzname;

          await this.ReadFestlegungskategorieliste(Projekt);

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
      this.NotizenkapitellisteChanged.emit();

      this.CurrentProgressValue = this.MaxProgressValue;
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
        Zoomfaktor:              100,
        Textsize:                14,
        StandortFilter:          null,
        LeistungsphaseFilter:    this.Const.Leistungsphasenvarianten.UNBEKANNT,
        Aufgabenansicht:         [],
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

        OberkostengruppeFilter: null,
        HauptkostengruppeFilter: null,
        UnterkostengruppeFilter: null,

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

          if(lodash.isUndefined(Settings.Favoritprojektindex))      Settings.Favoritprojektindex      = 3000;
          if(lodash.isUndefined(Settings.HeadermenueMaxFavoriten))  Settings.HeadermenueMaxFavoriten  = 6;
          if(lodash.isUndefined(Settings.Zoomfaktor))               Settings.Zoomfaktor               = 100;
          if(lodash.isUndefined(Settings.Textsize))                 Settings.Textsize                 = 14;
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
          if(lodash.isUndefined(Settings.Aufgabenansicht))          Settings.Aufgabenansicht          = [];


          if(lodash.isUndefined(Settings.AufgabenTerminfiltervariante))  Settings.AufgabenTerminfiltervariante  = null;
          if(lodash.isUndefined(Settings.AufgabenTerminfilterStartwert)) Settings.AufgabenTerminfilterStartwert = null;
          if(lodash.isUndefined(Settings.AufgabenTerminfilterEndewert))  Settings.AufgabenTerminfilterEndewert  = null;
          if(lodash.isUndefined(Settings.AufgabenSortiermodus))          Settings.AufgabenSortiermodus  = this.Const.AufgabenSortiermodusvarianten.TermineAufsteigend;

          if(lodash.isUndefined(Settings.AufgabenMeilensteineNachlauf)) Settings.AufgabenMeilensteineNachlauf  = 2;

          if(lodash.isUndefined(Settings.LOPListeGeschlossenZeitfilter)) Settings.LOPListeGeschlossenZeitfilter  = 14;

          if(lodash.isUndefined(Settings.LeistungsphaseFilter)) Settings.LeistungsphaseFilter  = this.Const.Leistungsphasenvarianten.UNBEKANNT;

          if(lodash.isUndefined(Settings.OberkostengruppeFilter))  Settings.OberkostengruppeFilter   = null;
          if(lodash.isUndefined(Settings.UnterkostengruppeFilter)) Settings.UnterkostengruppeFilter  = null;
          if(lodash.isUndefined(Settings.HauptkostengruppeFilter)) Settings.HauptkostengruppeFilter  = null;

          this.CurrentAufgabenansichten = this.GetAufgabenansichten(null);

          return Settings;
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Pool', 'InitMitarbeitersettings', this.Debug.Typen.Service);
    }
  }
}
