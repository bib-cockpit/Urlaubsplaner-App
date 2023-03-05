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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterContentChecked {

  private AuthSubscription: Subscription;
  private unsubscribe = new Subject<void>();

  constructor(private platform: Platform,
              private Pool: DatabasePoolService,
              private Menuservice: MenueService,
              private AuthService: DatabaseAuthenticationService,
              private changeDetector: ChangeDetectorRef,
              private MSALService: MsalService,
              private MSALBroadcastService: MsalBroadcastService,
              private Basics: BasicsProvider,
              private Tools: ToolsProvider,
              private Const: ConstProvider,
              private MitarbeiterDB: DatabaseMitarbeiterService,
              private MitarbeitersettingsDB: DatabaseMitarbeitersettingsService,
              private StandortDB: DatabaseStandorteService,
              private ProjekteDB: DatabaseProjekteService,
              private StorageService: LocalstorageService,
              private Debug: DebugProvider) {

    try {

      this.AuthSubscription = null;

      // Test

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'App Component', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.unsubscribe.next(undefined);
      this.unsubscribe.complete();

      if(this.AuthSubscription !== null) {

        this.AuthSubscription.unsubscribe();

        this.AuthSubscription = null;
      }

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

        this.MSALBroadcastService.inProgress$
          .pipe(
            filter((status: InteractionStatus) => status === InteractionStatus.None),
            takeUntil(this.unsubscribe)
          ).subscribe((data: InteractionStatus) => {

            debugger;

            this.Debug.ShowMessage('Authentication status changed', 'App Component', 'OnInit', this.Debug.Typen.Component);

          this.AuthService.SetAuthenticationStatus();
        });

        this.MSALBroadcastService.msalSubject$.pipe(
          filter((message: EventMessage) =>  message.eventType === EventType.LOGIN_SUCCESS),
          takeUntil(this.unsubscribe)
        ).subscribe((message: EventMessage) => {

          debugger;

          const AuthResult = <AuthenticationResult>message.payload;

          this.MSALService.instance.setActiveAccount(AuthResult.account);
        });

        this.AuthSubscription = this.AuthService.AuthenticationChanged.subscribe(() => {

          debugger;

          this.StartApp();
        });

      } else {

        debugger;

        this.StartApp();
      }


      /*


      this.MSALService.instance.handleRedirectPromise().then((res: AuthenticationResult) => {

        debugger;

        if(res !== null && res.account !== null) {

          this.MSALService.instance.setActiveAccount(res.account);
        }
        else {

          this.MSALService.instance.setActiveAccount(null);
        }

        this.SetPage();
      });

       */




    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'App Component', 'OnInit', this.Debug.Typen.Component);
    }
  }

  public async StartApp() {

    try {

      this.Debug.ShowMessage('Start App', 'App Component', 'StartApp', this.Debug.Typen.Component);

      await this.platform.ready();

      this.Basics.Contentbreite = this.platform.width();
      this.Basics.Contenthoehe  = this.platform.height();

      if(this.AuthService.IsAuthenticated) {

        this.Debug.ShowMessage('Benutzer ist authentifiziert', 'App Component', 'StartApp', this.Debug.Typen.Component);

        let token = await this.StorageService.GetSecurityToken();

        this.AuthService.SecurityToken = token;

        debugger;

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

            // Mitarbeiter ist bereits registriert

            this.Debug.ShowMessage('Mitarbeiter ist bereits registriert.', 'App Component', 'StartApp', this.Debug.Typen.Component);


            this.Pool.Mitarbeiterdaten     = this.Pool.InitMitarbeiter(result.Mitarbeiter);
            this.AuthService.SecurityToken = result.Token;

            await this.StorageService.SetSecurityToken(this.AuthService.SecurityToken);
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



              await this.Pool.ReadProjektdaten(this.ProjekteDB.Projektliste);

              this.ProjekteDB.InitMenuProjektauswahl();

              this.Menuservice.SetCurrentPage();


            }

            this.Pool.LoadingAllDataFinished.emit();
          }
        }
      }
      else {

        this.Tools.SetRootPage(this.Const.Pages.LoginPage);
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
