import {AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Platform} from "@ionic/angular";
import {DebugProvider} from "./services/debug/debug";
import {DatabasePoolService} from "./services/database-pool/database-pool.service";
import {MenueService} from "./services/menue/menue.service";
import {BasicsProvider} from "./services/basics/basics";
import {DatabaseAuthenticationService} from "./services/database-authentication/database-authentication.service";
import {ToolsProvider} from "./services/tools/tools";
import {HttpErrorResponse} from "@angular/common/http";
import {filter, Subject, Subscription, takeUntil, using} from "rxjs";
import {MsalBroadcastService, MsalService} from "@azure/msal-angular";
import {AuthenticationResult, EventMessage, EventType, InteractionStatus} from "@azure/msal-browser";
import {ConstProvider} from "./services/const/const";
import {DatabaseMitarbeiterService} from "./services/database-mitarbeiter/database-mitarbeiter.service";
import {DatabaseStandorteService} from "./services/database-standorte/database-standorte.service";
import {DatabaseProjekteService} from "./services/database-projekte/database-projekte.service";
import {DatabaseMitarbeitersettingsService} from "./services/database-mitarbeitersettings/database-mitarbeitersettings.service";
import {LocalstorageService} from "./services/localstorage/localstorage";
import * as lodash from "lodash-es";
import {Graphservice} from "./services/graph/graph";
import {Mitarbeiterstruktur} from "./dataclasses/mitarbeiterstruktur";
import {indexOf} from "lodash-es";
import {environment} from "../environments/environment";
import {PjPlanungsmatrixPage} from "./pages/pj-planungsmatrix/pj-planungsmatrix.page";

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
              private ProjekteDB: DatabaseProjekteService,
              private StorageService: LocalstorageService,
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
      this.ProjekteDB.FinishService();

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

        this.msalBroadcastService.inProgress$
          .pipe(
            filter((status_a: InteractionStatus) => {

              this.Debug.ShowMessage('Interaction Status: ' + status_a, 'App Component', 'StartApp', this.Debug.Typen.Component);

              return status_a === InteractionStatus.None;
            }),
            takeUntil(this.Destroying)
          )
          .subscribe((status_b: InteractionStatus) => {

            this.AuthService.SetShowLoginStatus();
          });

        this.AuthService.LoginSuccessEvent.subscribe(() => {

          this.StartApp();
        });
      }

      this.StartApp();

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
        this.Pool.MaxProgressValue     = 10;
        this.Pool.CurrentProgressValue = 0;

        try {

          await this.GraphService.GetOwnUserinfo();  // 1

          this.Pool.ProgressMessage = 'Lade eigene Daten';
          this.Pool.CurrentProgressValue++;

          await this.GraphService.GetOwnUserimage(); // 2

          this.Pool.ProgressMessage = 'Lade eigens Bild';
          this.Pool.CurrentProgressValue++;

          this.Pool.Outlookkatekorien = await this.GraphService.GetOwnOutlookCategories(); // 3

          this.Pool.ProgressMessage = 'Lade eigene Outlookkategorien';
          this.Pool.CurrentProgressValue++;

          await this.Pool.ReadChangelogliste(); // 4

          this.Pool.ProgressMessage = 'Lade Change Log';
          this.Pool.CurrentProgressValue++;

          await this.Pool.ReadStandorteliste(); // 5

          this.Pool.ProgressMessage = 'Lade Standortliste';
          this.Pool.CurrentProgressValue++;

          console.log('Read Mitarbeiterliste:');

          await this.Pool.ReadMitarbeiterliste(); // 6

          this.Pool.ProgressMessage = 'Lade aktuelle Mitarbeiterliste';
          this.Pool.CurrentProgressValue++;

          await this.ProjekteDB.ReadGesamtprojektliste(); // 7

          this.Pool.ProgressMessage = 'Lade Gesamtprojektliste';
          this.Pool.CurrentProgressValue++;

          await this.ProjekteDB.AddMusterprojekt(); // 8

          this.Pool.ProgressMessage = 'Erstelle Musterprojekt';
          this.Pool.CurrentProgressValue++;

          let Liste = await this.GraphService.GetAllUsers(); // 9

          this.Pool.ProgressMessage = 'Aktuallisiere Mitarbeiterliste';
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

        await this.Pool.ReadSettingsliste(); // 9

        this.Pool.ProgressMessage = 'Lade Einstellungen';
        this.Pool.CurrentProgressValue++;

        await this.ProjekteDB.SyncronizeGesamtprojektlisteWithTeams(this.GraphService.Teamsliste); // 10

        this.Pool.ProgressMessage = 'Syncronisiere Gesamtprojektliste';
        this.Pool.CurrentProgressValue++;

        this.ProjekteDB.CheckMyProjektdaten();

        this.Pool.Mitarbeitersettings = this.Pool.InitMitarbeitersettings(); // fehlende Settingseintraege initialisieren

        await this.MitarbeitersettingsDB.SaveMitarbeitersettings();

        this.Pool.ProgressMessage = 'Aktualisiere Mitarbeitereinstellungen';
        this.Pool.CurrentProgressValue++;

        this.Zoomfaktor = this.Pool.Mitarbeitersettings.Zoomfaktor;

        this.Pool.MitarbeitersettingsChanged.emit();

        if(this.Pool.Mitarbeiterdaten.SettingsID === null) {

          this.Pool.Mitarbeiterdaten.SettingsID = this.Pool.Mitarbeitersettings._id;

          await this.MitarbeiterDB.UpdateMitarbeiter(this.Pool.Mitarbeiterdaten);
        }

        this.MitarbeiterDB.InitService();
        this.StandortDB.InitService();
        this.ProjekteDB.InitService();

        this.Pool.ShowProgress = false;

        if(this.Pool.Mitarbeiterdaten.Favoritenliste.length === 0) {

          this.Tools.SetRootPage(this.Const.Pages.HomePage).then(() => {

            this.Pool.LoadingAllDataFinished.emit();
          });
        }
        else {

          this.ProjekteDB.InitGesamtprojekteliste();
          this.ProjekteDB.InitProjektfavoritenliste();

          if(environment.production) {

            Page = this.Const.Pages.HomePage;
          }
          else {

            Page = this.Const.Pages.PjBaustelleLoplistePage; // .PjProtokolleListePage;  // PjListePage; // PjAufgabenlistePage; // .PjFilebrowserPage;  // PjPlanungsmatrixPage; // PjFilebrowserPage; // HomePage; // .PjPlanungsmatrixPage; //.PjAufgabenlistePage; // EinstellungenPage; // PjAufgabenlistePage ; // HomePage ; // EmaillistePage //  HomePage PjBaustelleTagebuchlistePage PjBaustelleLoplistePage

            this.ProjekteDB.SetProjekteliste(this.ProjekteDB.CurrentFavorit.Projekteliste); // Dise Zeile bie HomePage wieder raus -> Daten über Play Button laden
            await this.Pool.ReadProjektdaten(this.ProjekteDB.Projektliste);                 // Dise Zeile bie HomePage wieder raus -> Daten über Play Button laden

            this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.LOPListe; // .Aufgabenliste;
          }

          this.Tools.SetRootPage(Page).then(() => {

            this.Pool.LoadingAllDataFinished.emit();
          });
        }

      }
      else {

        // Benutzer ist nicht angemeldet -> der Login wird angezeigt

        this.Tools.SetRootPage(this.Const.Pages.HomePage).then(() => {


        });

        this.Debug.ShowMessage('Benutzer ist nicht angemeldet', 'App Component', 'StartApp', this.Debug.Typen.Component);

      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'App Component', 'StartApp', this.Debug.Typen.Component);
    }
  }

  ngAfterContentChecked(): void {

    this.changeDetector.detectChanges();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiter Auswahl', 'function', this.Debug.Typen.Component);
    }
  }
}
