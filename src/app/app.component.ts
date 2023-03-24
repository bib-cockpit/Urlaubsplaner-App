import {AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Platform} from "@ionic/angular";
import {DebugProvider} from "./services/debug/debug";
import {DatabasePoolService} from "./services/database-pool/database-pool.service";
import {MenueService} from "./services/menue/menue.service";
import {BasicsProvider} from "./services/basics/basics";
import {DatabaseAuthenticationService} from "./services/database-authentication/database-authentication.service";
import {ToolsProvider} from "./services/tools/tools";
import {HttpErrorResponse} from "@angular/common/http";
import {filter, Subject, Subscription, takeUntil} from "rxjs";
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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterContentChecked {

  private AuthSubscription: Subscription;
  // private unsubscribe = new Subject<void>();
  private isIframe: boolean;
  private readonly Destroying = new Subject<void>();

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

      this.AuthSubscription = null;
      this.isIframe         = false;

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

      this.Debug.ShowMessage('Start App', 'App Component', 'StartApp', this.Debug.Typen.Component);

      await this.platform.ready();
      await this.AuthService.SetActiveUser();

      this.Basics.Contentbreite = this.platform.width();
      this.Basics.Contenthoehe  = this.platform.height();

      if(this.AuthService.ActiveUser !== null) {

        // Benutzer ist angemeldet

        await this.GraphService.GetUserinfo();
        await this.GraphService.GetUserimage();

        debugger;

        this.Debug.ShowMessage('Benutzer ist angemeldet: ' + this.AuthService.ActiveUser.username, 'App Component', 'StartApp', this.Debug.Typen.Component);


        let result = await this.MitarbeiterDB.GetMitarbeiterRegistrierung(this.AuthService.ActiveUser.username);


        if(result !== null && !lodash.isUndefined(result.error)) {

          // Databse not available

          this.Debug.ShowErrorMessage('Lesen in der Mitarbeiter Datenbank fehlgeschlagen', 'App Component', 'StartApp', this.Debug.Typen.Component);

          this.Tools.SetRootPage(this.Const.Pages.HomePage);
        }
        else {

          if (result === null) {

            // Neuen Mitarbeiter registrieren

            this.Debug.ShowMessage('Mitarbeiter ist neu und muss registriert werden', 'App Component', 'StartApp', this.Debug.Typen.Component);

            await this.Pool.ReadStandorteliste();

            this.Menuservice.ShowRegistrierungPage();
          }
          else {

            debugger;

            // Mitarbeiter ist bereits registriert

            this.Debug.ShowMessage('Mitarbeiter ist bereits registriert.', 'App Component', 'StartApp', this.Debug.Typen.Component);

            this.Pool.Mitarbeiterdaten = this.Pool.InitMitarbeiter(result.Mitarbeiter);

            await this.Pool.Init();

            this.Pool.Mitarbeitersettings = this.Pool.InitMitarbeitersettings();

            await this.MitarbeitersettingsDB.SaveMitarbeitersettings();

            // this.Pool.Mitarbeiterdaten.Favoritenliste = [];

            this.Pool.MitarbeitersettingsChanged.emit();

            if(this.Pool.Mitarbeiterdaten.SettingsID === null) {

              this.Pool.Mitarbeiterdaten.SettingsID = this.Pool.Mitarbeitersettings._id;

              await this.MitarbeiterDB.UpdateMitarbeiter(this.Pool.Mitarbeiterdaten);
            }

            this.MitarbeiterDB.InitService();
            this.StandortDB.InitService();
            this.ProjekteDB.InitService();

            if(this.Pool.Mitarbeiterdaten.Favoritenliste.length === 0) {

              this.Tools.SetRootPage(this.Const.Pages.HomePage);
            }
            else {

              this.ProjekteDB.InitGesamtprojekteliste();
              this.ProjekteDB.InitProjektfavoritenliste();

              // await this.Pool.ReadProjektdaten(this.ProjekteDB.Projektliste);
              // this.ProjekteDB.InitMenuProjektauswahl();
              // this.Menuservice.SetCurrentPage();

              this.Tools.SetRootPage(this.Const.Pages.HomePage);
            }

            this.Pool.LoadingAllDataFinished.emit();
          }
        }
      }
      else {

        // Benutzer ist nicht angemeldet -> der Login wird angezeigt

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
