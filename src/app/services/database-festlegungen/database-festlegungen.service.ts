import {EventEmitter, Inject, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService} from "@azure/msal-angular";
import {AccountInfo} from "@azure/msal-browser";
import {ConstProvider} from "../const/const";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";


@Injectable({
  providedIn: 'root'
})
export class DatabaseFestlegungenService {

  public EmpfaengerInternIDListe: string[];
  public CcEmpfaengerInternIDListe: string[];
  public EmpfaengerExternIDListe: string[];
  public CcEmpfaengerExternIDListe: string[];
  public Betreff: string;
  public Filename: string;
  public FileID: string;
  public Nachricht: string;
  public Displayliste: Projektpunktestruktur[][];
  public Kostengruppenliste: Projektpunktestruktur[];
  public CcEmpfaengerliste: {
    Name:  string;
    Email: string;
  }[];
  public Empfaengerliste: {
    Name:  string;
    Email: string;
  }[];

  constructor(
              @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
              private Debug: DebugProvider,
              private authService: MsalService,
              private Const: ConstProvider,
  ) {
    try {

      this.EmpfaengerInternIDListe   = [];
      this.CcEmpfaengerInternIDListe = [];
      this.EmpfaengerExternIDListe   = [];
      this.CcEmpfaengerExternIDListe = [];
      this.Displayliste              = [];
      this.Kostengruppenliste        = [];
      this.Empfaengerliste           = [];
      this.CcEmpfaengerliste         = [];
      this.Betreff   = '';
      this.Filename  = '';
      this.FileID    = '';
      this.Nachricht = '';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Authentication', 'constructor', this.Debug.Typen.Service);
    }
  }
}
