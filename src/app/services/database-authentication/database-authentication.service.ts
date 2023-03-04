import {EventEmitter, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {MsalService} from "@azure/msal-angular";
import {AccountInfo} from "@azure/msal-browser";
import {ConstProvider} from "../const/const";
import {LocalstorageService} from "../localstorage/localstorage";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DatabaseAuthenticationService {

  public AuthenticationChanged: EventEmitter<any> = new EventEmitter<any>();
  public IsAuthenticated: boolean;
  public ActiveUsername: string;
  public ActiveUser: AccountInfo;
  public SecurityToken: string;
  public SecurityEnabled: boolean;
  private DevelopmentUser: AccountInfo;

  constructor(private Debug: DebugProvider,
              private Const: ConstProvider,
              private StorgeService: LocalstorageService,
              private MSALService: MsalService
  ) {
    try {

      this.SecurityEnabled = true;
      this.SecurityToken   = this.Const.NONE;
      this.IsAuthenticated = !this.SecurityEnabled; // Unbedingt auf false setzen
      this.ActiveUser      = null;

      this.DevelopmentUser = {

        environment:    "",
        homeAccountId:  "",
        localAccountId: "",
        tenantId: "",
        username: "p.hornburger@burnickl.com",
        name:     "Peter Hornburger"
      };

      if(!this.SecurityEnabled) this.ActiveUser = this.DevelopmentUser;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Authentication', 'constructor', this.Debug.Typen.Service);
    }
  }

  public HasActiveAccount(): boolean {

    try {

      if(this.SecurityEnabled) {

        return this.MSALService.instance.getActiveAccount() !== null;
      }
      else {

        return true;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Authentication', 'HasActiveAccount', this.Debug.Typen.Service);
    }
  }

  public GetAuthenticationToken(): string {

    try {

      if(this.SecurityToken !== this.Const.NONE) return this.SecurityToken;
      else {

        return environment.SecurityToken; // Einen Hilfstoken zur Verfügung stellen in Configfile.gespeichert.
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Authentication', 'GetAuthenticationToken', this.Debug.Typen.Service);
    }
  }

  public SetAuthenticationStatus(): void {

    try {

      // debugger;

      let activeAccount: AccountInfo;

      if(this.SecurityEnabled) {

        activeAccount = this.MSALService.instance.getActiveAccount();

        if(activeAccount === null && this.MSALService.instance.getAllAccounts().length > 0) {

          activeAccount = this.MSALService.instance.getAllAccounts()[0];

          this.MSALService.instance.setActiveAccount(activeAccount);
        }

        this.IsAuthenticated = activeAccount !== null ? true : false; // Im Construktor auf false setzren
        this.ActiveUsername  = activeAccount !== null ? activeAccount.username : this.Const.NONE;
        this.ActiveUser      = activeAccount;
      }
      else {

        this.IsAuthenticated = true;
        this.ActiveUser      = this.DevelopmentUser;
        this.ActiveUsername  = this.ActiveUser.username;
      }


      this.AuthenticationChanged.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Authentication', 'SetAuthenticationStatus', this.Debug.Typen.Service);
    }
  }

  public Login() {

    try {

      this.MSALService.instance.loginRedirect({

        scopes: ["User.Read"]
      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Authentication', 'Login', this.Debug.Typen.Service);
    }
  }

  public Logout(): Promise<any> {

    try {

      return new Promise((resolve, reject) => {

        this.StorgeService.RemoveSecurityToken().then(() => {

          this.MSALService.instance.logoutRedirect().then(() => {

            resolve(true);

          }).catch((error: any) => {

            reject(error);
          });

        }).catch((error: any) => {

          reject(error);
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Authentication', 'Logout', this.Debug.Typen.Service);
    }
  }
}
