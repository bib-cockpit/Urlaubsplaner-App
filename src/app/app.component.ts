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
import {LocalstorageService} from "./services/localstorage/localstorage";
import {DatabaseStandorteService} from "./services/database-standorte/database-standorte.service";
import {DatabaseProjekteService} from "./services/database-projekte/database-projekte.service";
import {
  DatabaseMitarbeitersettingsService
} from "./services/database-mitarbeitersettings/database-mitarbeitersettings.service";

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
              private StorageService: LocalstorageService,
              private MitarbeiterDB: DatabaseMitarbeiterService,
              private MitarbeitersettingsDB: DatabaseMitarbeitersettingsService,
              private StandortDB: DatabaseStandorteService,
              private ProjekteDB: DatabaseProjekteService,
              private Debug: DebugProvider) {

    try {

      this.AuthSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'App Component', 'constructor', this.Debug.Typen.Component);
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

      this.Debug.ShowErrorMessage(error, 'App Component', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  ngOnInit(): void {

    try {

      this.MSALBroadcastService.inProgress$
        .pipe(
          filter((status: InteractionStatus) => status === InteractionStatus.None),
          takeUntil(this.unsubscribe)
        ).subscribe(() => {

          console.log('Authentication stataus cnhaged');

        this.AuthService.SetAuthenticationStatus();
      });

      /*

      this.MSALBroadcastService.msalSubject$.pipe(
        filter((message: EventMessage) =>  message.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this.unsubscribe)
      ).subscribe((message: EventMessage) => {

        const AuthResult = <AuthenticationResult>message.payload;

        this.MSALService.instance.setActiveAccount(AuthResult.account);
      });
      */



      this.AuthSubscription = this.AuthService.AuthenticationChanged.subscribe(() => {

        this.StartApp();

          // debugger;
      });

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

      this.Debug.ShowErrorMessage(error, 'App Component', 'OnInit', this.Debug.Typen.Component);
    }
  }

  public async StartApp() {

    try {

      console.log('Start App');

      await this.platform.ready();

      this.Basics.Contentbreite = this.platform.width();
      this.Basics.Contenthoehe  = this.platform.height();

      if(this.AuthService.IsAuthenticated) {

        let token = await this.StorageService.GetSecurityToken();

        this.AuthService.SecurityToken = token;

        let result = await this.MitarbeiterDB.GetMitarbeiterRegistrierung(this.AuthService.ActiveUser.username);

        if (result === null) {

          // Neuen Mitarbeiter registrieren

          await this.Pool.ReadStandorteliste();

          this.Menuservice.ShowRegistrierungPage();
        }
        else {

          // Mitarbeiter ist bereits registriert

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
      else {

        this.Menuservice.ShowLoginPage();
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'App Component', 'StartApp', this.Debug.Typen.Component);
    }
  }

  ngAfterContentChecked(): void {

    this.changeDetector.detectChanges();

    /*
    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiter Auswahl', 'function', this.Debug.Typen.Component);
    }

     */
  }
}
