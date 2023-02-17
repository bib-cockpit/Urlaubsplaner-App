import { Injectable } from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {Fehlermeldungparameterstruktur} from "../../dataclasses/fehlermeldungstruktur";
import {ConstProvider} from "../const/const";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  // public Fehlerparameter: Fehlermeldungparameterstruktur;
  public Fehlermeldung: Fehlermeldungparameterstruktur[];
  public CanGoBack: boolean;

  constructor(private Const: ConstProvider) {

    try {

      this.Fehlermeldung = [];
      this.CanGoBack     = true;

    } catch (error) {


    }
  }
}
