import {EventEmitter, Inject, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService} from "@azure/msal-angular";
import {
  AccountInfo,
  AuthenticationResult,
  InteractionType,
  PopupRequest,
  PublicClientApplication, RedirectRequest
} from "@azure/msal-browser";
import {ConstProvider} from "../const/const";
import {LocalstorageService} from "../localstorage/localstorage";
import {environment} from "../../../environments/environment";
import {Route, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Graphuserstruktur} from "../../dataclasses/graphuserstruktur";
import {catchError, map, Observable, of} from "rxjs";
import {DomSanitizer} from "@angular/platform-browser";
import Cookies from "js-cookie";

const GRAPH_ENDPOINT          = 'https://graph.microsoft.com/v1.0/me';
const GRAPH_ENDPOINT_PHOTO    = 'https://graph.microsoft.com/v1.0/me/photo/$value';
const GRAPH_ENDPOINT_CALENDAR = 'https://graph.microsoft.com/v1.0/me/calendar';

const Keys = {

  AccessToken: 'AccessToken',
};

@Injectable({
  providedIn: 'root'
})
export class DatabaseAuthenticationService {

  public LoginSuccessEvent: EventEmitter<any> = new EventEmitter<any>();
  public ActiveUsername: string;
  public ActiveUser: AccountInfo;
  public AccessToken: string;
  public SecurityEnabled: boolean;
  private DevelopmentUser: AccountInfo;
  public ShowLogin: boolean;

  constructor(
              @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
              private Debug: DebugProvider,
              private authService: MsalService,
              private Const: ConstProvider,
              private http: HttpClient,
              private StorgeService: LocalstorageService,
              private router: Router,
              private domSanitizer: DomSanitizer,
              private Storage: LocalstorageService,
              private MSALService: MsalService
  ) {
    try {

      this.SecurityEnabled = true;
      this.AccessToken     = this.Const.NONE;
      this.ActiveUser      = null;
      this.ShowLogin       = false;

      this.DevelopmentUser = {

        environment:    "",
        homeAccountId:  "",
        localAccountId: "",
        tenantId: "",
        username: "p.hornburger@burnickl.com",
        name:     "Peter Hornburger"
      };
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Authentication', 'constructor', this.Debug.Typen.Service);
    }
  }

  public async SetActiveUser(): Promise<any> {

    try {

      let Account;

      return new  Promise((resolve, reject) => {

        if(this.SecurityEnabled) {

          Account = this.MSALService.instance.getActiveAccount();

          if(Account !== null) {

            this.LoadAccessToken().then((token) => {

              if(token !== this.Const.NONE) {

                this.ActiveUser  = Account;
                this.AccessToken = token;
              }
              else {

                this.ActiveUser  = null;
                this.AccessToken = null;
              }

              resolve(true);
            });
          }
          else
          {
            this.ActiveUser  = null;
            this.AccessToken = null;

            resolve(true);
          }
        }
        else {

          this.ActiveUser  = this.DevelopmentUser;
          this.AccessToken = null;

          resolve(true);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Authentication', 'SetActiveUser', this.Debug.Typen.Service);
    }
  }

  public SetShowLoginStatus() {

    try {

      let message: string;
      let acountliste: any[] = this.MSALService.instance.getAllAccounts();

      if(acountliste.length === 0) {

        this.ShowLogin   = true;
        this.ActiveUser  = null;
        this.AccessToken = null;
      }

      if(this.SecurityEnabled === false) this.ShowLogin = false;

      message = this.ShowLogin === true ? 'Anmeldung anzeigen' : 'Hauptmenu anzeigen';

      this.Debug.ShowMessage(message, 'Database Authentication', 'SetShowLogin', this.Debug.Typen.Service );

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Authentication', 'SetShowLoginStatus', this.Debug.Typen.Service );
    }
  }

  Login() {

    try {

      if(this.SecurityEnabled) {

        if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
          if (this.msalGuardConfig.authRequest) {
            this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
              .subscribe((response: AuthenticationResult) => {
                this.authService.instance.setActiveAccount(response.account);
              });
          } else {
            this.authService.loginPopup()
              .subscribe((response: AuthenticationResult) => {

                this.SaveAccessToken(response.accessToken);
                this.authService.instance.setActiveAccount(response.account);
              });
          }
        } else {
          if (this.msalGuardConfig.authRequest) {
            this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
          } else {
            this.authService.loginRedirect();
          }
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'file', 'Login', this.Debug.Typen.Service);
    }
  }

  public Logout() {

    try {

      if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
        this.authService.logoutPopup({
          postLogoutRedirectUri: "/",
          mainWindowRedirectUri: "/"
        });
      } else {
        this.authService.logoutRedirect({
          postLogoutRedirectUri: "/",
        });

      }

      this.ActiveUser = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Authentication', 'Logout', this.Debug.Typen.Service);
    }
  }

  canLoad(route: Route): boolean {

    try {

      if (this.CheckSecurity() === true) {

        this.Debug.ShowMessage('Database Authentication -> can load: ' + route.path, 'Security', 'canLoad', this.Debug.Typen.Service);

        return true;
      }
      else {

        this.Debug.ShowMessage('Database Authentication -> can not load: ' + route.path, 'Security', 'canLoad', this.Debug.Typen.Service);

        this.router.navigate([this.Const.Pages.LoginPage]);

        return false;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Authentication', 'canLoad', this.Debug.Typen.Service);
    }
  }

  public CheckSecurity(): boolean {

    try {

      return true; //  this.AuthenticationDB.HasActiveAccount();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Authentication', 'CheckSecurity', this.Debug.Typen.Service);
    }
  }

  private LoadAccessToken(): Promise<string> {

    try {

      return new Promise<string>((resolve, reject) => {

        let Wert = Cookies.get(Keys.AccessToken);

        console.log('Load Access Token: ' + Wert);

        if(typeof Wert === 'undefined') {

          resolve(this.Const.NONE);
        }
        else {

          resolve(Wert);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Authentication', 'LoadAccessToken', this.Debug.Typen.Service);
    }
  }

  public SaveAccessToken(token: string): Promise<boolean> {

    try {

      return new Promise((resolve) => {

        console.log('Save Access Token: ' + token);

        Cookies.set(Keys.AccessToken, token);

        resolve(true);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Authentication', 'SaveAccessToken', this.Debug.Typen.Service);
    }
  }

  public DeleteAccessToken(): Promise<boolean> {

    try {

      return new Promise((resolve, reject) => {

        Cookies.remove(Keys.AccessToken);

        resolve(true);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Authentication', 'DeleteAccessToken', this.Debug.Typen.Service);
    }
  }
}
