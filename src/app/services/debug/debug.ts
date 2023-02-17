import { Injectable } from '@angular/core';
import { BasicsProvider } from '../basics/basics';
import {ConstProvider} from '../const/const';
import {NavController} from '@ionic/angular';
import {ErrorService} from "../error/error.service";

@Injectable({
  providedIn: 'root'
})

export class DebugProvider {

  public Typen = {

    Page: 'Page',
    Component: 'Component',
    Provider: 'Provider',
    Directive: 'Directive',
    Service: 'Service'
  };

  public Debugmessageliste: any[];


  constructor( public Basics: BasicsProvider,
               private nav: NavController,
               private Fehlerservice: ErrorService,
               private Const: ConstProvider){

    try {

      this.Debugmessageliste = [];
    }
    catch (error) {

    }
  }

  public AddDebugMessage(message: any) {

    this.Debugmessageliste.push(message);
  }

  public ShowErrorMessage(error, script, funktion, typ)
  {
    try {

      console.log('---------------------------------------------------------------------------');
      console.log('File:     ' + script);
      console.log('Function: ' + funktion);
      console.log('Typ:      ' + typ);
      console.log('Error:');
      console.log(error.message);
      console.log('---------------------------------------------------------------------------');

      debugger;

      if(this.Basics.ShowFehlerbericht) {

        this.Fehlerservice.Fehlermeldung.push({
          Callingfunction: "",
          Callingscript: "",
          Commonscript: "",
          Errorcode: 0,
          Errormessage: "",
          Sql: [],
          Stack: "",
          Script: script,
          Error: error,
          Funktion: funktion,
          Scripttype: typ,
          Type : this.Const.Fehlermeldungtypen.Script
        });

        /*

        this.NavParameter.Fehlermeldung.Script = ;
        this.NavParameter.Fehlermeldung.Error = error;
        this.NavParameter.Fehlermeldung.Funktion = funktion;
        this.NavParameter.Fehlermeldung.Scripttype = typ;
        this.NavParameter.Fehlermeldung.Type = this.Constclass.Fehlermeldungtypen.Script;

         */

        this.PushPage(this.Const.Pages.ErrorPage);
      }

    }
    catch (error2) {

      debugger;
    }
  }

  public ShowMessage(message: string, script: string, funktion: string, typ: string)
  {
    try {

      let data = {

        message: message,
        code: '',
        stack: ''
      };

      console.log('---------------------------------------------------------------------------');
      console.log('File:     ' + script);
      console.log('Function: ' + funktion);
      console.log('Typ:      ' + typ);
      console.log('Message:');
      console.log(message);
      console.log('---------------------------------------------------------------------------');


      if(this.Basics.ShowFehlerbericht) {

        /*
        this.NavParameter.Fehlermeldung.Script = script;
        this.NavParameter.Fehlermeldung.Error = data;
        this.NavParameter.Fehlermeldung.Funktion = funktion;
        this.NavParameter.Fehlermeldung.Scripttype = typ;
        this.NavParameter.Fehlermeldung.Type = this.Constclass.Fehlermeldungtypen.Script;

         */


        this.Fehlerservice.Fehlermeldung.push({
          Callingfunction: "",
          Callingscript: "",
          Commonscript: "",
          Errorcode: 0,
          Errormessage: "",
          Sql: [],
          Stack: "",
          Script: script,
          Error: data,
          Funktion: funktion,
          Scripttype: typ,
          Type : this.Const.Fehlermeldungtypen.Script
        });

        this.PushPage(this.Const.Pages.ErrorPage);
      }

    }
    catch (error) {

      debugger;
    }
  }

  public ShowFirebaseErrorMessage(error, script, funktion, typ)
  {
    try {

      if(this.Basics.ShowFehlerbericht) {

        /*
        this.NavParameter.Fehlermeldung.Script = script;
        this.NavParameter.Fehlermeldung.Error = error;
        this.NavParameter.Fehlermeldung.Funktion = funktion;
        this.NavParameter.Fehlermeldung.Scripttype = typ;
        this.NavParameter.Fehlermeldung.Type = this.Constclass.Fehlermeldungtypen.Firebase;

         */

        this.Fehlerservice.Fehlermeldung.push({
          Callingfunction: "",
          Callingscript: "",
          Commonscript: "",
          Errorcode: 0,
          Errormessage: "",
          Sql: [],
          Stack: "",
          Script: script,
          Error: error,
          Funktion: funktion,
          Scripttype: typ,
          Type : this.Const.Fehlermeldungtypen.Script
        });


        this.PushPage(this.Const.Pages.ErrorPage);

      }

    }
    catch (error2) {

      debugger;
    }
  }

  public ShowSqlErrorMessage(sql: string[], errormessage: string, errorcode: number, commonscript: string, callingscript: string, callingfunction: string)
  {
    try {

      if(this.Basics.ShowFehlerbericht) {

        /*
        this.NavParameter.Fehlermeldung.Sql = sql;
        this.NavParameter.Fehlermeldung.Errormessage = errormessage;
        this.NavParameter.Fehlermeldung.Errorcode = errorcode;
        this.NavParameter.Fehlermeldung.Commonscript = commonscript;
        this.NavParameter.Fehlermeldung.Callingscript = callingscript;
        this.NavParameter.Fehlermeldung.Callingfunction = callingfunction;
        this.NavParameter.Fehlermeldung.Stack = '';
        this.NavParameter.Fehlermeldung.Type = this.Constclass.Fehlermeldungtypen.Sql;

         */

        this.Fehlerservice.Fehlermeldung.push({
          Callingfunction: callingfunction,
          Callingscript: callingscript,
          Commonscript: commonscript,
          Errorcode: errorcode,
          Errormessage: errormessage,
          Sql: sql,
          Stack: '',
          Script: '',
          Error: '',
          Funktion: '',
          Scripttype: '',
          Type : this.Const.Fehlermeldungtypen.Sql
        });

        this.PushPage(this.Const.Pages.ErrorPage);
      }
    }
    catch (error) {

      debugger;
    }
  }

  public ShowTransactionErrorMessage(sql: string[], errormessage: string, errorcode: number, stack: string, commonscript: string, callingscript: string, callingfunction: string)
  {
    try {

      if(this.Basics.ShowFehlerbericht) {

        /*
        this.NavParameter.Fehlermeldung.Sql = sql;
        this.NavParameter.Fehlermeldung.Errormessage = errormessage;
        this.NavParameter.Fehlermeldung.Errorcode = errorcode;
        this.NavParameter.Fehlermeldung.Commonscript = commonscript;
        this.NavParameter.Fehlermeldung.Callingscript = callingscript;
        this.NavParameter.Fehlermeldung.Callingfunction = callingfunction;
        this.NavParameter.Fehlermeldung.Stack = stack;
        this.NavParameter.Fehlermeldung.Type = this.Constclass.Fehlermeldungtypen.Transaction;

         */

        this.Fehlerservice.Fehlermeldung.push({
          Callingfunction: callingfunction,
          Callingscript: callingscript,
          Commonscript: commonscript,
          Errorcode: errorcode,
          Errormessage: errormessage,
          Sql: sql,
          Stack: stack,
          Script: '',
          Error: '',
          Funktion: '',
          Scripttype: '',
          Type : this.Const.Fehlermeldungtypen.Sql
        });

        this.PushPage(this.Const.Pages.ErrorPage);
      }
    }
    catch (error) {

      debugger;
    }
  }


  private PushPage(page: string): Promise<any> {

    try {

      return new Promise<any>(resolve => {

        this.nav.navigateForward(page, {animated:false, }).then(() => {

          // this.NavParameter.AddPage(page);

          resolve(true);

        }).catch((error: any) => {

          console.log(error);
        });
      });
    }
    catch (error) {

      debugger;
    }
  }

}
