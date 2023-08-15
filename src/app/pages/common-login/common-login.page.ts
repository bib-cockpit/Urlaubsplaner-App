import {Component, OnDestroy, OnInit} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {ConstProvider} from "../../services/const/const";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadingAnimationService} from "../../services/loadinganimation/loadinganimation";
import {DatabaseAuthenticationService} from "../../services/database-authentication/database-authentication.service";


@Component({
  selector: 'common-login-page',
  templateUrl: './common-login.page.html',
  styleUrls: ['./common-login.page.scss'],
})
export class CommonLoginPage implements OnInit, OnDestroy {

  public Title: string;
  public LoginForm: FormGroup;
  public OkBorder: string;
  public RequiredBorder: string;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public Const: ConstProvider,
              public fb: FormBuilder,
              public AuthService: DatabaseAuthenticationService,
              private LoadingAnimation: LoadingAnimationService) {
    try
    {
      let Border: number = 2;

      this.OkBorder         = Border + 'px solid green';
      this.RequiredBorder   = Border + 'px solid orange';

      /*
      this.LoginForm = this.fb.group({

        Email:          [null, Validators.compose([Validators.required, Validators.email,    Validators.maxLength(255), Validators.minLength(8)])],
        Password:       [null, Validators.compose([Validators.required, Validators.maxLength(80), Validators.minLength(6)])],
      });

      this.LoginForm.controls['Email'].setValue('info@alinea-software.net');
      this.LoginForm.controls['Password'].setValue('Spekyland');

       */
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Login', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Login', 'OnInit', this.Debug.Typen.Page);
    }
  }

  ionViewDidEnter() {

    try {

      this.Title = 'Anmeldung';
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Login', 'ionViewDidEnter', this.Debug.Typen.Page);
    }
  }

  OkButtonClicked() {

    try {

      this.SubmitLoginForm();

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Login', 'OkButtonClicked', this.Debug.Typen.Page);
    }
  }

  SubmitLoginForm() {

    try {

      /*

      let data = this.LoginForm.value;
      let InputError: boolean;
      let Password: string;
      let Email: string;
      let Message: string;


      InputError = (
          !this.LoginForm.controls['Email'].valid ||
          !this.LoginForm.controls['Password'].valid);

      Email       = data.Email;
      Password    = data.Password;

      if(InputError) {

        this.Tools.ShowHinweisDialog('Login.Bitte_pruefen_Sie_die_erforderlichen_Angaben');
      }
      else {

        this.LoadingAnimation.ShowLoadingAnimation('Login.Titel', 'Login.Die_Anmeldedaten_werden_uebertragen').then(() => {

          this.AuthDatabase.Login(Email, Password).then((result: any) => {

            this.LoadingAnimation.HideLoadingAnimation(true).then(() => {

              this.Tools.SetRootPage(this.Constclass.Pages.StartseitePage).then(() => {

              });
            });

          }).catch((error: FirebaseError) => {

            this.LoadingAnimation.HideLoadingAnimation(false).then(() => {

              switch(error.code) {

                case 'auth/user-not-found':

                  Message = 'Login.Benutzer_wurde_nicht_gefunden';

                  break;

                case 'auth/wrong-password':

                  Message = 'Login.Das_angegebene_Passwort_ist_falsch';

                  break;

                case 'auth/user-disabled':

                  Message = 'Login.Ihr_Benutzerkonto_wurde_deaktiviert';

                  break;

                default:

                  Message = 'Leider_ist_ein_Fehler_aufgetreten_Btte_versuchen_Sie_es_spaeter_noch_einmal';

                  break;
              }

              this.Tools.ShowHinweisDialog(Message);

            });


        });

        });
      }

       */
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Login', 'CheckForm', this.Debug.Typen.Page);
    }
  }


  NeuButtonClicked() {

    try {

      this.Tools.SetRootPage(this.Const.Pages.RegistrierungPage).then(() => {

      });
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Login', 'NeuButtonClicked', this.Debug.Typen.Page);
    }
  }

  CheckLoginForm(): boolean {

    try {

       return false; //  this.LoginForm.controls['Email'].valid && this.LoginForm.controls['Password'].valid && this.Internet.InternetAvailable();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Login', 'CheckLoginForm', this.Debug.Typen.Page);
    }
  }

  PasswortVergessenButtonClicked() {

    try {

      this.Tools.PushPage(this.Const.Pages.PasswortVergessenPage);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Login', 'PasswortVergessenButtonClicked', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Login', 'OnDestroy', this.Debug.Typen.Page);
    }
  }
}
