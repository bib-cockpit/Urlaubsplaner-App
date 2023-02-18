import {Component, OnDestroy, OnInit} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {ConstProvider} from "../../services/const/const";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";
import {AuswahlDialogService} from "../../services/auswahl-dialog/auswahl-dialog.service";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {MenueService} from "../../services/menue/menue.service";
import {DatabaseAuthenticationService} from "../../services/database-authentication/database-authentication.service";
import {HttpErrorResponse} from "@angular/common/http";
import {LocalstorageService} from "../../services/localstorage/localstorage";


@Component({
  selector: 'common-registrierung-page',
  templateUrl: './common-registrierung.page.html',
  styleUrls: ['./common-registrierung.page.scss'],
})
export class CommonRegistrierungPage implements OnInit, OnDestroy {

  public Title: string;
  public ShowEditor: boolean;
  public ShowAuswahl: boolean;
  public Auswahlliste: Auswahldialogstruktur[];
  public Auswahlindex: number;
  public Auswahltitel: string;
  public Auswahldialogorigin: string;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public Const: ConstProvider,
              public fb: FormBuilder,
              public  Pool: DatabasePoolService,
              public Auswahlservice: AuswahlDialogService,
              private Menueservice: MenueService,
              private AuthService: DatabaseAuthenticationService,
              private Menuservice: MenueService,
              private StorageService: LocalstorageService,
              public DB: DatabaseMitarbeiterService) {
    try
    {

      this.ShowEditor = true;
      this.ShowAuswahl       = false;
      this.Auswahltitel      = 'Standort festlegen';
      this.Auswahlliste      = [];
      this.Auswahldialogorigin = this.Const.NONE;

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Login', 'constructor', this.Debug.Typen.Page);
    }
  }

  GetDialogTitel(): string {

    try {

      return 'Mitarbeiter registrieren';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Registrierung', 'GetDialogTitel', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {

      let Liste: string[];

      this.DB.CurrentMitarbeiter = this.DB.GetEmptyMitarbeiter();

      if(this.AuthService.ActiveUser !== null) {

        debugger;

        Liste = this.AuthService.ActiveUser.name.split(' ');

        this.DB.CurrentMitarbeiter.Email = this.AuthService.ActiveUser.username;

        if(Liste.length > 1) {

          this.DB.CurrentMitarbeiter.Vorname = Liste[0];
          this.DB.CurrentMitarbeiter.Name    = Liste[1];
        }
        else {

          this.DB.CurrentMitarbeiter.Name    = Liste[0];
        }
      }
      else {

        this.Tools.ShowHinweisDialog('Keine Authentifizierung');
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Registrierung', 'OnInit', this.Debug.Typen.Page);
    }
  }

  ionViewDidEnter() {

    try {

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Registrierung', 'ionViewDidEnter', this.Debug.Typen.Page);
    }
  }



  FachbereichClickedHandler() {

    try {

      this.ShowAuswahl  = true;
      this.Auswahltitel = 'Fachbereich festlegen';
      this.Auswahlliste = [];

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Fachbereich;

      this.Auswahlliste.push({Index: 0, FirstColumn: this.Const.Fachbereiche.unbekannt, SecoundColumn: '',      Data: this.Const.Fachbereiche.unbekannt});
      this.Auswahlliste.push({Index: 1, FirstColumn: this.Const.Fachbereiche.Elektrotechnik, SecoundColumn: '', Data: this.Const.Fachbereiche.Elektrotechnik});
      this.Auswahlliste.push({Index: 1, FirstColumn: this.Const.Fachbereiche.HLS, SecoundColumn: '',            Data: this.Const.Fachbereiche.HLS});
      this.Auswahlliste.push({Index: 2, FirstColumn: this.Const.Fachbereiche.Heizung, SecoundColumn: '',        Data: this.Const.Fachbereiche.Heizung});
      this.Auswahlliste.push({Index: 2, FirstColumn: this.Const.Fachbereiche.Lueftung, SecoundColumn: '',       Data: this.Const.Fachbereiche.Lueftung});
      this.Auswahlliste.push({Index: 2, FirstColumn: this.Const.Fachbereiche.Sanitaer, SecoundColumn: '',       Data: this.Const.Fachbereiche.Sanitaer});
      this.Auswahlliste.push({Index: 2, FirstColumn: this.Const.Fachbereiche.Klimatisierung, SecoundColumn: '', Data: this.Const.Fachbereiche.Klimatisierung});
      this.Auswahlliste.push({Index: 2, FirstColumn: this.Const.Fachbereiche.MSR, SecoundColumn: '',            Data: this.Const.Fachbereiche.MSR});
      this.Auswahlliste.push({ Index: 3, FirstColumn: 'Geschäftsführung', SecoundColumn: '',                    Data: this.Const.Fachbereiche.Geschaeftsfuehrung });
      this.Auswahlliste.push({ Index: 4, FirstColumn: 'Assistenz', SecoundColumn: '',                           Data: this.Const.Fachbereiche.Assistenz });

      this.Auswahlindex = this.DB.Fachbereichsliste.indexOf(this.DB.CurrentMitarbeiter.Fachbereich);

      if(this.Auswahlindex === -1) this.Auswahlindex = 0;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Registrierung', 'StandortClickedHandler', this.Debug.Typen.Page);
    }
  }

  StandortClickedHandler() {

    try {

      let Index = 0;

      this.ShowAuswahl  = true;
      this.Auswahltitel = 'Standort festlegen';
      this.Auswahlliste = [];

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Standort;

      for(let Eintrag of this.Pool.Standorteliste) {

        this.Auswahlliste.push({ Index: Index, FirstColumn: Eintrag.Kuerzel, SecoundColumn: Eintrag.Ort, Data: Eintrag });
        Index++;
      }

      this.Auswahlindex = lodash.findIndex(this.Pool.Standorteliste, {_id: this.DB.CurrentMitarbeiter.StandortID});

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Registrierung', 'StandortClickedHandler', this.Debug.Typen.Page);
    }
  }

  GetDialogTitelicon(): string {

    try {

      if(this.DB.CurrentMitarbeiter) {

        switch (this.Auswahltitel) {

          case 'Standort festlegen':

            return 'location-outline';

            break;

          case 'Fachbereich festlegen':

            return 'hammer-outline';

            break;

          default:

            return 'help-outline';

            break;

        }
      }
      else return 'help-outline';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Registrierung', 'GetDialogTitelicon', this.Debug.Typen.Page);
    }
  }

  AuswahlOkButtonClicked(data: any) {

    try {

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Standort:

          this.DB.CurrentMitarbeiter.StandortID = data._id;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Fachbereich:

          this.DB.CurrentMitarbeiter.Fachbereich = data;

          break;
      }

      this.ShowAuswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Registrierung', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Registrierung', 'OnDestroy', this.Debug.Typen.Page);
    }
  }



  EditorCancelButtonClicked(event: any) {

    try {

      this.ShowEditor = false;

      this.Menueservice.ShowLoginPage();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Registrierung', 'EditorCancelButtonClicked', this.Debug.Typen.Page);
    }
  }

  EditorOkButtonClicked() {

    try {

      this.DB.RegisterMitarbeiter().then((result: any) => {

        this.Pool.Mitarbeiterdaten     = result.Mitarbeiter;
        this.AuthService.SecurityToken = result.Token;

        this.StorageService.SetSecurityToken(this.AuthService.SecurityToken).then(() => {

          this.Pool.Init().then(() => {

            this.Menuservice.SetCurrentPage();

          }).catch((error: HttpErrorResponse) => {

            this.Tools.ShowHinweisDialog('Pool.Init: ' + error.message);
          });
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Registrierung', 'EditorOkButtonClicked', this.Debug.Typen.Page);
    }
  }
}
