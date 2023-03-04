import { Component, OnInit } from '@angular/core';
import {BasicsProvider} from '../../services/basics/basics';
import {DebugProvider} from '../../services/debug/debug';
import {ConstProvider} from '../../services/const/const';
import {ToolsProvider} from '../../services/tools/tools';
import {LoadingAnimationService} from "../../services/loadinganimation/loadinganimation";
import {ErrorService} from "../../services/error/error.service";
import {Fehlermeldungparameterstruktur} from "../../dataclasses/fehlermeldungstruktur";
import MyMoment from "moment";
import moment from 'moment';

@Component({
  selector: 'common-error-page',
  templateUrl: './common-error.page.html',
  styleUrls: ['./common-error.page.scss'],
})
export class CommonErrorPage {

  public Titel: string = 'Zoomtest';
  public Message: string;
  public Stack: string;
  public SendMailFinished: boolean;
  public SendMailResult: string;
  public SendMailError: boolean;
  public Title: string;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Const: ConstProvider,
              public Tools: ToolsProvider,
              public Fehlerservice: ErrorService,
              public LoadingAnimation: LoadingAnimationService) {



    try {

      this.Message = '';
      this.Stack   = '';

      MyMoment();

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Common Error', 'Constructor', this.Debug.Typen.Page);
    }
  }

  ionViewDidEnter() {

    try {

      this.Message = '';
      this.Title   = 'Fehlermeldung';

      this.LoadingAnimation.HideLoadingAnimation(false);

      for(let Eintrag of this.Fehlerservice.Fehlermeldung) {

        switch(Eintrag.Type) {

          case this.Const.Fehlermeldungtypen.Script:

            this.ShowError(Eintrag);

            break;

          case this.Const.Fehlermeldungtypen.Sql:

            this.ShowSqlError(Eintrag);

            break;


          case this.Const.Fehlermeldungtypen.Transaction:

            this.ShowTransactionError(Eintrag);

            break;

          case this.Const.Fehlermeldungtypen.Firebase:



            break;
        }
      }


    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Common Error', 'ionViewDidEnter', this.Debug.Typen.Page);
    }
  }

  ShowError(data: Fehlermeldungparameterstruktur) {

    try {

      let Skript   = data.Script;
      let Error    = data.Error;
      let Funktion = data.Funktion;
      let Typ      = data.Scripttype;

      this.SendMailFinished = false;

      this.Message += '<table cellpadding="4" cellspacing="4" style="color: black">';
      this.Message += '<tr>';
      this.Message += '<td colspan="2">';
      this.Message += '<span>';
      this.Message += 'Runtime Error';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td>';
      this.Message += '<span>';
      this.Message += 'Skript';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>' + Skript + '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td>';
      this.Message += '<span>';
      this.Message += 'Funktion';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>' + Funktion + '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td>';
      this.Message += '<span>';
      this.Message += 'Typ';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>' + Typ + '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td valign="top">';
      this.Message += '<span>';
      this.Message += 'Message';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>' + Error.message + '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td valign="top">';
      this.Message += '<span>';
      this.Message += 'Stack';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>' + Error.stack + '</td>';
      this.Message += '</tr>';
      this.Message += '</table>';

      console.log(this.Message);
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Error', 'ShowError', this.Debug.Typen.Component);
    }
  }


  ShowTransactionError(data: Fehlermeldungparameterstruktur) {

    try {

      let Errormessage    = data.Errormessage;
      let Stack           = data.Stack;
      let Commonscript    = data.Commonscript;
      let Callingscript   = data.Callingscript;
      let Callingfunction = data.Callingfunction;
      let Sqlliste        = data.Sql;

      this.SendMailFinished = false;

      this.Message += '<table cellpadding="4" cellspacing="4">';
      this.Message += '<tr>';
      this.Message += '<td colspan="2">';
      this.Message += '<span>';
      this.Message += 'Transaction Error';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td>';
      this.Message += '<span>';
      this.Message += 'Common Script';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>' + Commonscript + '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td>';
      this.Message += '<span>';
      this.Message += 'Calling Script';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>' + Callingscript + '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td>';
      this.Message += '<span>';
      this.Message += 'Calling Function';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>' + Callingfunction + '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td valign="top">';
      this.Message += '<span>';
      this.Message += 'Error Message';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>' + Errormessage + '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<tr>';
      this.Message += '<td valign="top">';
      this.Message += '<span>';
      this.Message += 'Stack';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>' + Stack + '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td valign="top">';
      this.Message += '<span>';
      this.Message += 'Sql';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>';

      this.Message += '<table class="TablePaddingClass">';

      for(let Sql of Sqlliste) {

        this.Message += '<tr>';
        this.Message += '<td>';
        this.Message += Sql;
        this.Message += '</td>';
        this.Message += '</tr>';
      }

      this.Message += '</table>';

      this.Message += '</td>';
      this.Message += '</tr>';
      this.Message += '</table>';
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Error', 'ShowTransactionError', this.Debug.Typen.Component);
    }
  }


  ShowSqlError(data: Fehlermeldungparameterstruktur) {

    try {

      let Errormessage    = data.Errormessage;
      let Commonscript    = data.Commonscript;
      let Callingscript   = data.Callingscript;
      let Callingfunction = data.Callingfunction;
      let Sqlliste        = data.Sql;

      this.SendMailFinished = false;

      this.Message += '<table cellpadding="4" cellspacing="4">';
      this.Message += '<tr>';
      this.Message += '<td colspan="2">';
      this.Message += '<span>';
      this.Message += 'Sql Error';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td>';
      this.Message += '<span>';
      this.Message += 'Common Script';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>' + Commonscript + '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td>';
      this.Message += '<span>';
      this.Message += 'Calling Script';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>' + Callingscript + '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td>';
      this.Message += '<span>';
      this.Message += 'Calling Function';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>' + Callingfunction + '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td valign="top">';
      this.Message += '<span>';
      this.Message += 'Error Message';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>' + Errormessage + '</td>';
      this.Message += '</tr>';
      this.Message += '<tr>';
      this.Message += '<td valign="top">';
      this.Message += '<span>';
      this.Message += 'Sql';
      this.Message += '</span>';
      this.Message += '</td>';
      this.Message += '<td>';

      this.Message += '<table class="TablePaddingClass">';

      for(let Sql of Sqlliste) {

        this.Message += '<tr>';
        this.Message += '<td>';
        this.Message += Sql;
        this.Message += '</td>';
        this.Message += '</tr>';
      }

      this.Message += '</table>';

      this.Message += '</td>';
      this.Message += '</tr>';
      this.Message += '</table>';
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Error', 'ShowSqlError', this.Debug.Typen.Component);
    }
  }


  SendMail() {

    try {

      let Version     : string = '';
      let Manufacturer: string = '';
      let Model       : string = '';
      let Daten;
      let Url;
      let Message;

      Message = '';
      Message += '<table>';
      Message += '<tr>';
      Message += '<td>';
      Message += '<span>';
      Message += 'App Type';
      Message += '</span>';
      Message += '</td>';
      Message += '<td></td>';
      Message += '</tr>';
      Message += '<tr>';
      Message += '<td>';
      Message += '<span>';
      Message += 'App Version';
      Message += '</span>';
      Message += '</td>';
      Message += '</tr>';
      Message += '<tr>';
      Message += '<td>';
      Message += '<span>';
      Message += 'OS';
      Message += '</span>';
      Message += '</td>';
      Message += '<td>' + Version + '</td>';
      Message += '</tr>';
      Message += '<tr>';
      Message += '<td>';
      Message += '<span>';
      Message += 'Hersteller';
      Message += '</span>';
      Message += '</td>';
      Message += '<td>' + Manufacturer + '</td>';
      Message += '</tr>';
      Message += '<tr>';
      Message += '<td>';
      Message += '<span>';
      Message += 'Gerätemodel';
      Message += '</span>';
      Message += '</td>';
      Message += '<td>' + Model + '</td>';
      Message += '</tr>';

      Message += '</table>';
      Message += this.Message;

      Daten = {

        'Message'      : Message,
        'Manufacturer' : Manufacturer,
        'Model'        : Model,
        'Product'      : '',
        'Version'      : Version
      };

      /*

      Daten = JSON.stringify(Daten);
      Url   = this.Basics.SERVER_URL + "/errorlog/httprequest/updateerrorlog.php";

      this.Internetlibary.SendData(Url, Daten).then(() => {

        // success

        this.SendMailError    = false;
        this.SendMailFinished = true;
        this.SendMailResult   = 'Fehlerbericht wurde versendet.';


      }).catch((error) => {

        // error

        this.SendMailError    = true;
        this.SendMailFinished = true;
        this.SendMailResult   = 'Verbindungsfehler. Fehlerbericht wurde nicht versendet.';

      });

       */
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'PageError', 'SendMail', this.Debug.Typen.Component);
    }
  }

  SendMailButtonCLicked() {

    try {

      this.SendMail();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'PageError', 'SendMailButtonCLicked', this.Debug.Typen.Component);
    }
  }
}
