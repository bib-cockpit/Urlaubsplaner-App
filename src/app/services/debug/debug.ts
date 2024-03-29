import { Injectable } from '@angular/core';
import { BasicsProvider } from '../basics/basics';
import {ConstProvider} from '../const/const';
import {NavController} from '@ionic/angular';
import {ErrorService} from "../error/error.service";
import {Debugmmessagestruktur} from "../../dataclasses/Debummessagestruktur";

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

  public Debugmessageliste: Debugmmessagestruktur[];

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


  public ShowErrorMessage(message, script, funktion, typ)
  {
    try {

      console.log('File: ' + script + ' | Function: ' + funktion + ' | Message: ' + message);

      this.Debugmessageliste.push({

        Skript: script,
        Message: message,
        Function: funktion,
        Color: 'red'
      });
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

      console.log('File: ' + script + ' | Function: ' + funktion + ' | Message: ' + message);

      this.Debugmessageliste.push({

        Skript: script,
        Message: message,
        Function: funktion,
        Color: 'blue'
      });
    }
    catch (error) {

      debugger;
    }
  }
}
