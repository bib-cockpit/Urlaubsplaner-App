import {AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Platform} from "@ionic/angular";
import {DebugProvider} from "./services/debug/debug";
import {DatabasePoolService} from "./services/database-pool/database-pool.service";
import {MenueService} from "./services/menue/menue.service";
import {BasicsProvider} from "./services/basics/basics";
import {DatabaseAuthenticationService} from "./services/database-authentication/database-authentication.service";
import {ToolsProvider} from "./services/tools/tools";
import {filter, Subject, Subscription, takeUntil} from "rxjs";
import {MsalBroadcastService, MsalService} from "@azure/msal-angular";
import {InteractionStatus} from "@azure/msal-browser";
import {ConstProvider} from "./services/const/const";
import {DatabaseMitarbeiterService} from "./services/database-mitarbeiter/database-mitarbeiter.service";
import {DatabaseStandorteService} from "./services/database-standorte/database-standorte.service";
import {DatabaseMitarbeitersettingsService} from "./services/database-mitarbeitersettings/database-mitarbeitersettings.service";
import * as lodash from "lodash-es";
import {Graphservice} from "./services/graph/graph";
import {Mitarbeiterstruktur} from "./dataclasses/mitarbeiterstruktur";
import {environment} from "../environments/environment";
import {DatabaseUrlaubService} from "./services/database-urlaub/database-urlaub.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterContentChecked {

  private AuthSubscription: Subscription;
  private isIframe: boolean;
  private readonly Destroying = new Subject<void>();
  public Zoomfaktor: number;
  private Settingssubscription: Subscription;

  constructor(private platform: Platform,
              private Pool: DatabasePoolService,
              private Menuservice: MenueService,
              private AuthService: DatabaseAuthenticationService,
              private changeDetector: ChangeDetectorRef,
              private MSALService: MsalService,
              private Basics: BasicsProvider,
              private Tools: ToolsProvider,
              private Const: ConstProvider,
              private authService: MsalService,
              private msalBroadcastService: MsalBroadcastService,
              private MitarbeiterDB: DatabaseMitarbeiterService,
              private MitarbeitersettingsDB: DatabaseMitarbeitersettingsService,
              private StandortDB: DatabaseStandorteService,
              private UrlaubDB: DatabaseUrlaubService,
              public GraphService: Graphservice,
              private Debug: DebugProvider) {
    try {

      this.AuthSubscription     = null;
      this.isIframe             = false;
      this.Zoomfaktor           = 100;
      this.Settingssubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'App Component', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.Destroying.next(undefined);
      this.Destroying.complete();

      this.StandortDB.FinishService();
      this.MitarbeiterDB.FinishService();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'App Component', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  ngOnInit(): void {

    try {

      this.Settingssubscription = this.Pool.MitarbeitersettingsChanged.subscribe(() => {

        this.Zoomfaktor = this.Pool.Mitarbeitersettings.Zoomfaktor;
      });

      if(this.AuthService.SecurityEnabled) {

        this.isIframe = window !== window.parent && !window.opener;

        this.authService.initialize().subscribe(() => {

        this.msalBroadcastService.inProgress$
          .pipe(
            filter((status_a: InteractionStatus) => {

              this.Debug.ShowMessage('Interaction Status: ' + status_a, 'App Component', 'StartApp', this.Debug.Typen.Component);

              return status_a === InteractionStatus.None;
            }),
            takeUntil(this.Destroying)
          )
          .subscribe((status_b: InteractionStatus) => {

            this.Debug.ShowMessage('Interaction Status: ' + status_b, 'App Component', 'StartApp', this.Debug.Typen.Component);

            this.AuthService.SetShowLoginStatus();
          });

          this.AuthService.LoginSuccessEvent.subscribe(() => {

            this.Debug.ShowMessage('LoginSuccessEvent -> Start App', 'App Component', 'StartApp', this.Debug.Typen.Component);

            this.StartApp();
          });

          this.StartApp();
        });
      }
      else {

        this.StartApp();
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'App Component', 'OnInit', this.Debug.Typen.Component);
    }
  }

  public async StartApp() {

    try {

      let Mitarbeiter: Mitarbeiterstruktur;
      let Page: string;

      this.Debug.ShowMessage('Start App', 'App Component', 'StartApp', this.Debug.Typen.Component);

      await this.platform.ready();
      await this.AuthService.SetActiveUser();

      this.Basics.Contentbreite = this.platform.width();
      this.Basics.Contenthoehe  = this.platform.height();

      if(this.AuthService.ActiveUser !== null) {

        // Benutzer ist angemeldet

        this.AuthService.SetShowLoginStatus();

        this.Debug.ShowMessage('Benutzer ist angemeldet: ' + this.AuthService.ActiveUser.username, 'App Component', 'StartApp', this.Debug.Typen.Component);

        this.Pool.ShowProgress         = true;
        this.Pool.MaxProgressValue     = 8;
        this.Pool.CurrentProgressValue = 0;

        try {

          if(this.AuthService.SecurityEnabled === true)
          {
            this.Pool.ProgressMessage = 'Lade eigene Daten';

            await this.GraphService.GetOwnUserinfo();

            this.Pool.CurrentProgressValue++;
          }

          if(this.AuthService.SecurityEnabled === true) {

            this.Pool.ProgressMessage = 'Lade eigens Bild';

            await this.GraphService.GetOwnUserimage();

            this.Pool.CurrentProgressValue++;
          }

          this.Pool.ProgressMessage = 'Lade Change Log';

          await this.Pool.ReadChangelogliste(); // 1

          this.Pool.CurrentProgressValue++;

          this.Pool.ProgressMessage = 'Lade Standortliste';

          await this.Pool.ReadStandorteliste(); // 2

          this.Pool.CurrentProgressValue++;

          this.Pool.ProgressMessage = 'Lade aktuelle Mitarbeiterliste';

          await this.Pool.ReadMitarbeiterliste(); // 3

          this.Pool.CurrentProgressValue++;

          this.Pool.ProgressMessage = 'Lade Positionenliste';

          await this.Pool.ReadMitarbeiterpositionenliste(); // 4

          this.Pool.CurrentProgressValue++;

          this.Pool.ProgressMessage = 'Aktuallisiere Mitarbeiterliste';

          let Liste = await this.GraphService.GetAllUsers(); // 5

          this.Pool.CurrentProgressValue++;

          this.Pool.ProgressMessage = 'Lade Bundesländer';

          await this.UrlaubDB.ReadRegionen('DE'); // 6

          this.Pool.CurrentProgressValue++;

          this.Pool.ProgressMessage = 'Lade Ferien Deutschland';

          await this.UrlaubDB.ReadFerien('DE'); // 7

          this.Pool.CurrentProgressValue++;

          this.Pool.ProgressMessage = 'Lade Ferien Bulgarien';

          await this.UrlaubDB.ReadFerien('BG'); // 8

          this.Pool.CurrentProgressValue++;

          for(let User of Liste) {

            Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, (currentmitarbeiter: Mitarbeiterstruktur) => {

              return currentmitarbeiter.UserID === User.id;
            });

            if(lodash.isUndefined(Mitarbeiter)) {

              console.log('Mitarbeiter wurde nicht gefunden:');
              console.log(User);

              if(User.mail.toLowerCase().indexOf('admin') === -1) {

                Mitarbeiter = this.MitarbeiterDB.ConvertGraphuserToMitarbeiter(User);

                console.log('Neuer Mitrabeiter:');
                console.log(Mitarbeiter);

                await this.MitarbeiterDB.AddMitarbeiter(Mitarbeiter);
              }
            }
          }
        }
        catch(error) {

          debugger;
        }

        if(this.MitarbeiterDB.CheckMitarbeiterExists(this.GraphService.Graphuser.mail) === false) {

          // Mitarbeiter neu Anlegen

          this.Debug.ShowMessage('Mitarbeiter neu eingetragen.', 'App Component', 'StartApp', this.Debug.Typen.Component);

          Mitarbeiter = this.MitarbeiterDB.ConvertGraphuserToMitarbeiter(this.GraphService.Graphuser);
          Mitarbeiter = <Mitarbeiterstruktur>await this.MitarbeiterDB.AddMitarbeiter(Mitarbeiter);
        }
        else {

          this.Debug.ShowMessage('Mitarbeiter ist bereits eingetragen.', 'App Component', 'StartApp', this.Debug.Typen.Component);

          Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {UserID: this.GraphService.Graphuser.id});
        }

        // Mitarbeiter ist bereits registriert

        this.Pool.Mitarbeiterdaten = this.Pool.InitMitarbeiter(Mitarbeiter); // fehlende Mitarbeiterdaten initialisieren
        this.Pool.CheckMitarbeiterdaten();
        this.UrlaubDB.SetMitarbeiter(this.Pool.Mitarbeiterdaten);

        this.Pool.ProgressMessage = 'Lade Feiertage Deutschland';

        await this.UrlaubDB.ReadFeiertage('DE');

        this.Pool.CurrentProgressValue++;

        this.Pool.ProgressMessage = 'Lade Feiertage Bulgarien';

        await this.UrlaubDB.ReadFeiertage('BG');

        this.Pool.CurrentProgressValue++;

        this.Pool.ProgressMessage = 'Lade Einstellungen';

        await this.Pool.ReadSettingsliste();

        this.Pool.CurrentProgressValue++;

        this.Pool.ProgressMessage = 'Syncronisiere Gesamtprojektliste';

        this.Pool.Mitarbeitersettings = this.Pool.InitMitarbeitersettings(); // fehlende Settingseintraege initialisieren

        this.Pool.ProgressMessage = 'Aktualisiere Mitarbeitereinstellungen';

        await this.MitarbeitersettingsDB.SaveMitarbeitersettings();

        this.Pool.CurrentProgressValue++;

        this.Zoomfaktor = this.Pool.Mitarbeitersettings.Zoomfaktor;

        this.Pool.MitarbeitersettingsChanged.emit();

        if(this.Pool.Mitarbeiterdaten.SettingsID === null) {

          this.Pool.Mitarbeiterdaten.SettingsID = this.Pool.Mitarbeitersettings._id;

          await this.MitarbeiterDB.UpdateMitarbeiter(this.Pool.Mitarbeiterdaten);
        }

        this.MitarbeiterDB.InitService();
        this.StandortDB.InitService();


        this.Pool.ShowProgress = false;

        if(this.Pool.Mitarbeiterdaten.Planeradministrator === true) {

          Page = this.Const.Pages.UrlaubPlanungPage;
        }
        else {

          Page = this.Const.Pages.UrlaubPlanungPage;
        }

        this.Pool.ProjektdatenLoaded = true;

        this.SetProjekteMenuebereich(Page);

        this.Tools.SetRootPage(Page).then(() => {

          this.Pool.LoadingAllDataFinished.emit();
        });

      }
      else {

        // Benutzer ist nicht angemeldet -> der Login wird angezeigt

        this.AuthService.SetShowLoginStatus();

        this.Debug.ShowMessage('Benutzer ist nicht angemeldet', 'App Component', 'StartApp', this.Debug.Typen.Component);

      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'App Component', 'StartApp', this.Debug.Typen.Component);
    }
  }

  SetProjekteMenuebereich(Page: string) {

    try {

      switch (Page) {

        case this.Const.Pages.HomePage:

          this.Menuservice.MainMenuebereich     = this.Menuservice.MainMenuebereiche.Home;
          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Aufgabenliste;

          break;

        case this.Const.Pages.EmaillistePage:

          this.Menuservice.MainMenuebereich = this.Menuservice.MainMenuebereiche.Email;


          break;

        case this.Const.Pages.UrlaubPlanungPage:

          this.Menuservice.MainMenuebereich   = this.Menuservice.MainMenuebereiche.Urlaubsplanung;
          this.Menuservice.UrlaubMenuebereich = this.Menuservice.UrlaubMenuebereiche.Planung;

          break;

        case this.Const.Pages.UrlaubUebersichtPage:

          this.Menuservice.MainMenuebereich   = this.Menuservice.MainMenuebereiche.Urlaubsplanung;
          this.Menuservice.UrlaubMenuebereich = this.Menuservice.UrlaubMenuebereiche.Uebersicht;

          break;

        case this.Const.Pages.UrlaubsgesamtuebersichtPage:

          this.Menuservice.MainMenuebereich   = this.Menuservice.MainMenuebereiche.Urlaubsplanung;
          this.Menuservice.UrlaubMenuebereich = this.Menuservice.UrlaubMenuebereiche.Gesamtplanung;

          break;

        case this.Const.Pages.UrlaubFreigabenPage:

          this.Menuservice.MainMenuebereich   = this.Menuservice.MainMenuebereiche.Urlaubsplanung;
          this.Menuservice.UrlaubMenuebereich = this.Menuservice.UrlaubMenuebereiche.Freigaben;

          break;

        case this.Const.Pages.UrlaubEinstellungenPage:

          this.Menuservice.MainMenuebereich   = this.Menuservice.MainMenuebereiche.Urlaubsplanung;
          this.Menuservice.UrlaubMenuebereich = this.Menuservice.UrlaubMenuebereiche.Einstellungen;

          break;

        default:

          this.Menuservice.MainMenuebereich = this.Menuservice.MainMenuebereiche.Projekte;

          break;

      }

      switch (Page) {

        case this.Const.Pages.PjAufgabenlistePage:

          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Aufgabenliste;

          break;

        case this.Const.Pages.PjProtokolleListePage:

          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Protokolle;

          break;

        case this.Const.Pages.PjBaustelleLoplistePage:

          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.LOPListe;

          break;

        case this.Const.Pages.PjBaustelleTagebuchlistePage:

          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Bautagebuch;

          break;

        case this.Const.Pages.PjFestlegungslistePage:

          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Festlegungen;

          break;

        case this.Const.Pages.PjPlanungsmatrixPage:

          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Planungsmatrix;

          break;

        case this.Const.Pages.PjSimontabellelistePage:

          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Simontabelle;

          break;

        case this.Const.Pages.PjNotizenListePage:

          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Notizen;

          break;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'App Component', 'function', this.Debug.Typen.Component);
    }
  }

  ngAfterContentChecked(): void {

    this.changeDetector.detectChanges();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'App Component', 'ngAfterContentChecked', this.Debug.Typen.Component);
    }
  }
}
