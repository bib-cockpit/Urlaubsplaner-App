import { Injectable } from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {ConstProvider} from "../const/const";
import {BasicsProvider} from "../basics/basics";
import {Simontabellestruktur} from "../../dataclasses/simontabellestruktur";
import {Simontabelleeintragstruktur} from "../../dataclasses/simontabelleeintragstruktur";
import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {DatabaseProjekteService} from "../database-projekte/database-projekte.service";
import * as lodash from "lodash-es";
import {Simontabellebesondereleistungstruktur} from "../../dataclasses/simontabellebesondereleistungstruktur";
import {Rechnungstruktur} from "../../dataclasses/rechnungstruktur";
import {Rechnungseintragstruktur} from "../../dataclasses/rechnungseintragstruktur";
import moment, {Moment} from "moment";
import {Honorarsummenstruktur} from "../../dataclasses/honorarsummenstruktur";
import {ToolsProvider} from "../tools/tools";
import {Projektbeteiligtestruktur} from "../../dataclasses/projektbeteiligtestruktur";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {Projektfirmenstruktur} from "../../dataclasses/projektfirmenstruktur";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";
import {DatabaseAuthenticationService} from "../database-authentication/database-authentication.service";
import {Graphservice} from "../graph/graph";


@Injectable({
  providedIn: 'root'
})
export class DatabaseSimontabelleService {

  public CurrentSimontabelle: Simontabellestruktur;
  private ServerSimontabelleUrl: string;
  public readonly Steuersatz: number = 19;
  public CurrentBesondereleistung: Simontabellebesondereleistungstruktur;
  public CurrentRechnung: Rechnungstruktur;
  public LastRechnung: Rechnungstruktur;
  public CurrrentRechnungseintrag: Rechnungseintragstruktur;
  public CurrentRechnungsindex: number;
  public LastRechnungsindex: number;
  public Leistungsphasenliste: string[];
  public CurrentLeistungsphase: string;
  public CurrentLeistungsphaseindex: number;
  public Summenliste: Honorarsummenstruktur[];
  public Leistungsphasenanzahlliste: number[][];
  public CurrentSimontabellenliste: Simontabellestruktur[];
  public AuswahlIDliste: string[];
  private ServerSaveSimontabelleToSitesUrl: string;
  private ServerSendSimontabelleToSitesUrl: string;

  constructor(private Debug: DebugProvider,
              private Const: ConstProvider,
              private http: HttpClient,
              private Pool: DatabasePoolService,
              private Tools: ToolsProvider,
              private Basics: BasicsProvider,
              private GraphService: Graphservice,
              private AuthService: DatabaseAuthenticationService,
              private DBProjekte: DatabaseProjekteService) {
    try {

      this.CurrentSimontabelle        = null;
      this.CurrentBesondereleistung   = null;
      this.CurrentRechnung            = null;
      this.LastRechnung               = null;
      this.CurrrentRechnungseintrag   = null;
      this.CurrentRechnungsindex      = null;
      this.LastRechnungsindex         = null;
      this.Leistungsphasenanzahlliste = [];
      this.Leistungsphasenliste       = [];
      this.Summenliste                = [];
      this.CurrentLeistungsphase      = this.Const.NONE;
      this.CurrentLeistungsphaseindex = null;
      this.ServerSimontabelleUrl      = this.Pool.CockpitserverURL + '/simontabellen';
      this.ServerSaveSimontabelleToSitesUrl = this.Pool.CockpitdockerURL + '/savesimontabelle';
      this.ServerSendSimontabelleToSitesUrl = this.Pool.CockpitdockerURL + '/sendsimontabelle';
      this.CurrentSimontabellenliste  = [];
      this.AuswahlIDliste           = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'constructor', this.Debug.Typen.Service);
    }
  }
  public PrepareSimontabelleEmaildata() {

    try {

      // "Errors during JIT compilation of template for PjProjektpunktEditorComponent: Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"    <button-value [Buttontext]=\"'Kostengruppe'\"\n                                          [Wert_A]=\"[ERROR ->]KostenService.GetKos()GetKostengruppennamen()\" (ButtonClicked)=\"KostengruppeClicked.emit()\">\n        \"): ng:///PjProjektpunktEditorComponent/template.html@94:52, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                          [Wert_A]=\"KostenService.GetKos()GetKostengruppennamen()\" (ButtonClicked)=\"[ERROR ->]KostengruppeClicked.emit()\">\n                            </button-value>\n                          </\"): ng:///PjProjektpunktEditorComponent/template.html@94:116, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n\n                  </ion-row>\n                  <ion-row [ERROR ->]*ngIf=\"DB.CurrentProjektpunkt.Status === Const.Projektpunktstatustypen.Festlegung.Name\">\n            \"): ng:///PjProjektpunktEditorComponent/template.html@118:27, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"ung.Name\">\n                    <ion-col size=\"6\">\n                      <button-value [Buttontext]=\"[ERROR ->]'Gebäudeteil'\"\n                                    [Wert_A]=\"DBGebaeude.GetGebaeudeteilname(DBProjekt\"): ng:///PjProjektpunktEditorComponent/template.html@120:50, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"           <button-value [Buttontext]=\"'Gebäudeteil'\"\n                                    [Wert_A]=\"[ERROR ->]DBGebaeude.GetGebaeudeteilname(DBProjekt.CurrentProjekt, DB.CurrentProjektpunkt)\" (ButtonClicked)=\"Ge\"): ng:///PjProjektpunktEditorComponent/template.html@121:46, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\"DBGebaeude.GetGebaeudeteilname(DBProjekt.CurrentProjekt, DB.CurrentProjektpunkt)\" (ButtonClicked)=\"[ERROR ->]GebaeudeteilClicked.emit()\"></button-value>\n                    </ion-col>\n                  </ion-ro\"): ng:///PjProjektpunktEditorComponent/template.html@121:145, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n                  </ion-row>\n\n                  <ion-row [ERROR ->]*ngIf=\"DB.CurrentProjektpunkt.Status !== Const.Projektpunktstatustypen.Festlegung.Name\">\n            \"): ng:///PjProjektpunktEditorComponent/template.html@125:27, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n                          </td>\n                        </tr>\n                        <tr [ERROR ->]*ngFor=\"let Firma of DBProjekt.CurrentProjekt.Firmenliste\">\n                          <td>\n          \"): ng:///PjProjektpunktEditorComponent/template.html@134:28, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\".Firmenliste\">\n                          <td>\n                            <checkbox-clon [Checked]=\"[ERROR ->]FirmaIsChecked(Firma.FirmenID)\" (CheckChanged)=\"FirmaCheckChanged($event, Firma.FirmenID)\"></checkbox\"): ng:///PjProjektpunktEditorComponent/template.html@136:54, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                          <checkbox-clon [Checked]=\"FirmaIsChecked(Firma.FirmenID)\" (CheckChanged)=\"[ERROR ->]FirmaCheckChanged($event, Firma.FirmenID)\"></checkbox-clon>\n                          </td>\n         \"): ng:///PjProjektpunktEditorComponent/template.html@136:102, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n                          </td>\n                          <td>\n                            [ERROR ->]{{Firma.Firma}}\n                          </td>\n                        </tr>\n\"): ng:///PjProjektpunktEditorComponent/template.html@139:28, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n                          </td>\n                        </tr>\n                        <tr [ERROR ->]*ngFor=\"let MitarbeiterID of DBProjekt.CurrentProjekt.MitarbeiterIDListe\">\n                          \"): ng:///PjProjektpunktEditorComponent/template.html@155:28, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"eiterIDListe\">\n                          <td>\n                            <checkbox-clon [Checked]=\"[ERROR ->]MitarbeiterIsChecked(MitarbeiterID)\" (CheckChanged)=\"MitarbeiterCheckChanged($event, MitarbeiterID)\">\"): ng:///PjProjektpunktEditorComponent/template.html@157:54, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                     <checkbox-clon [Checked]=\"MitarbeiterIsChecked(MitarbeiterID)\" (CheckChanged)=\"[ERROR ->]MitarbeiterCheckChanged($event, MitarbeiterID)\"></checkbox-clon>\n                          </td>\n    \"): ng:///PjProjektpunktEditorComponent/template.html@157:107, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n                          </td>\n                          <td>\n                            [ERROR ->]{{GetMitarbeiterName(MitarbeiterID)}}\n                          </td>\n                        </tr>\n\"): ng:///PjProjektpunktEditorComponent/template.html@160:28, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n                    <ion-col size=\"6\">\n\n                        <ion-textarea [value]=\"[ERROR ->]DB.CurrentProjektpunkt.Aufgabe\" auto-grow style=\"border: 1px solid #444444; min-height: 140px\" (ionIn\"): ng:///PjProjektpunktEditorComponent/template.html@187:47, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"entProjektpunkt.Aufgabe\" auto-grow style=\"border: 1px solid #444444; min-height: 140px\" (ionInput)=\"[ERROR ->]AufgabeTextChangedHandler($event)\"></ion-textarea>\n\n                        <!--\n\"): ng:///PjProjektpunktEditorComponent/template.html@187:154, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n                  </ion-row>\n\n                  <ion-row  [ERROR ->]*ngIf=\"DB.CurrentProjektpunkt.Status !== Const.Projektpunktstatustypen.Festlegung.Name\">\n            \"): ng:///PjProjektpunktEditorComponent/template.html@206:28, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n                        <td>\n\n                          <checkbox-clon [Checked]=\"[ERROR ->]DB.CurrentProjektpunkt.Meilenstein\" (CheckChanged)=\"MeilensteinCheckChanged($event)\"></checkbox-clon>\"): ng:///PjProjektpunktEditorComponent/template.html@211:52, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                      <checkbox-clon [Checked]=\"DB.CurrentProjektpunkt.Meilenstein\" (CheckChanged)=\"[ERROR ->]MeilensteinCheckChanged($event)\"></checkbox-clon>\n\n                        </td><td>Meilenstein</td>\n\"): ng:///PjProjektpunktEditorComponent/template.html@211:104, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n                  -->\n\n                  <ion-row  [ERROR ->]*ngIf=\"DB.CurrentProjektpunkt.Status !== Const.Projektpunktstatustypen.Festlegung.Name\">\n            \"): ng:///PjProjektpunktEditorComponent/template.html@229:28, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"nkt.Status !== Const.Projektpunktstatustypen.Festlegung.Name\">\n                    <ion-col [size]=\"[ERROR ->]Tools.GetButtonvalueSize()\">\n                      <ion-radio-group [value]=\"DB.CurrentProjektpunkt.Z\"): ng:///PjProjektpunktEditorComponent/template.html@230:37, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"      <ion-col [size]=\"Tools.GetButtonvalueSize()\">\n                      <ion-radio-group [value]=\"[ERROR ->]DB.CurrentProjektpunkt.Zeitansatzeinheit\" (ionChange)=\"ZeitansatzeinheitChanged($event)\">\n           \"): ng:///PjProjektpunktEditorComponent/template.html@231:48, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                   <ion-radio-group [value]=\"DB.CurrentProjektpunkt.Zeitansatzeinheit\" (ionChange)=\"[ERROR ->]ZeitansatzeinheitChanged($event)\">\n                        <table>\n                          <tr>\n\"): ng:///PjProjektpunktEditorComponent/template.html@231:103, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                <input-clone Titel=\"Zeitansatz\"\n                                           [Value]=\"[ERROR ->]DB.CurrentProjektpunkt.Zeitansatz.toString()\" (TextChanged)=\"ZeitansatzChangedHandler($event)\">\n     \"): ng:///PjProjektpunktEditorComponent/template.html@236:52, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                              [Value]=\"DB.CurrentProjektpunkt.Zeitansatz.toString()\" (TextChanged)=\"[ERROR ->]ZeitansatzChangedHandler($event)\">\n                              </input-clone>\n                     \"): ng:///PjProjektpunktEditorComponent/template.html@236:113, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                   <td style=\"width: 8px\"></td>\n                            <td><ion-radio [value]=\"[ERROR ->]Const.Zeitansatzeinheitvarianten.Minuten\"></ion-radio></td><td style=\"padding-left: 6px\">Minuten</td>\"): ng:///PjProjektpunktEditorComponent/template.html@240:52, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                  <td style=\"width: 30px\"></td>\n                            <td><ion-radio [value]=\"[ERROR ->]Const.Zeitansatzeinheitvarianten.Stunden\"></ion-radio></td><td style=\"padding-left: 6px\">Stunden</td>\"): ng:///PjProjektpunktEditorComponent/template.html@242:52, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                  <td style=\"width: 30px\"></td>\n                            <td><ion-radio [value]=\"[ERROR ->]Const.Zeitansatzeinheitvarianten.Tage\"></ion-radio></td><td style=\"padding-left: 6px\">Tage</td>\n     \"): ng:///PjProjektpunktEditorComponent/template.html@244:52, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n                  </ion-row>\n\n                  <ion-row [ERROR ->]*ngIf=\"DB.CurrentProjektpunkt.Status === Const.Projektpunktstatustypen.Festlegung.Name\">\n            \"): ng:///PjProjektpunktEditorComponent/template.html@251:27, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"nkt.Status === Const.Projektpunktstatustypen.Festlegung.Name\">\n                    <ion-col [size]=\"[ERROR ->]Tools.GetButtonvalueSize()\">\n                      <table class=\"paddingtable\">\n                     \"): ng:///PjProjektpunktEditorComponent/template.html@252:37, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"          <tr>\n                          <td>\n                            <checkbox-clon [Checked]=\"[ERROR ->]DB.CurrentProjektpunkt.OpenFestlegung\" (CheckChanged)=\"OpenFestlegungCheckChanged($event)\"></checkbox\"): ng:///PjProjektpunktEditorComponent/template.html@256:54, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                   <checkbox-clon [Checked]=\"DB.CurrentProjektpunkt.OpenFestlegung\" (CheckChanged)=\"[ERROR ->]OpenFestlegungCheckChanged($event)\"></checkbox-clon>\n                          </td><td>Festlegung of\"): ng:///PjProjektpunktEditorComponent/template.html@256:109, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n\n                <ion-grid>\n                  <ion-row [ERROR ->]*ngIf=\"DB.CurrentProjektpunkt.Status === Const.Projektpunktstatustypen.Festlegung.Name\">\n            \"): ng:///PjProjektpunktEditorComponent/template.html@268:27, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n            <ion-row>\n              <ion-col>\n                <ion-text color=\"burnicklgruen\"><b>[ERROR ->]{{DB.CurrentProjektpunkt.Anmerkungenliste.length > 1 ? 'Anmerkungen' : 'Anmerkung'}}</b></ion-text>\n \"): ng:///PjProjektpunktEditorComponent/template.html@289:51, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n\n                <table class=\"paddingsmalltable\" width=\"100%\">\n                  <tr [ERROR ->]*ngFor=\"let Eintrag of DB.CurrentProjektpunkt.Anmerkungenliste; let i = index\">\n                    <\"): ng:///PjProjektpunktEditorComponent/template.html@296:22, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"width: 120px\">\n                      <button-value-date-small\n                        [Buttontext]=\"[ERROR ->]GetAnmerkungDatumString(Eintrag.Zeitstempel)\" [Datum]=\"GetAnmerkungDatum(Eintrag)\" [ElementID]=\"'anme\"): ng:///PjProjektpunktEditorComponent/template.html@299:38, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"-small\n                        [Buttontext]=\"GetAnmerkungDatumString(Eintrag.Zeitstempel)\" [Datum]=\"[ERROR ->]GetAnmerkungDatum(Eintrag)\" [ElementID]=\"'anmerkungdatum_' + i.toString()\" (TimeChanged)=\"AnmerkungTi\"): ng:///PjProjektpunktEditorComponent/template.html@299:93, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"t]=\"GetAnmerkungDatumString(Eintrag.Zeitstempel)\" [Datum]=\"GetAnmerkungDatum(Eintrag)\" [ElementID]=\"[ERROR ->]'anmerkungdatum_' + i.toString()\" (TimeChanged)=\"AnmerkungTimeChanged($event, i)\">\n                  \"): ng:///PjProjektpunktEditorComponent/template.html@299:134, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\" [Datum]=\"GetAnmerkungDatum(Eintrag)\" [ElementID]=\"'anmerkungdatum_' + i.toString()\" (TimeChanged)=\"[ERROR ->]AnmerkungTimeChanged($event, i)\">\n                      </button-value-date-small>\n                  \"): ng:///PjProjektpunktEditorComponent/template.html@299:183, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"00px;\">\n                      <ion-button expand=\"full\" size=\"small\" color=\"burnicklbraun\" (click)=\"[ERROR ->]AnerkungVerfassernClicked.emit(Eintrag)\">{{GetAnmerkungVerfasser(Eintrag, i)}}</ion-button>\n         \"): ng:///PjProjektpunktEditorComponent/template.html@303:92, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\" expand=\"full\" size=\"small\" color=\"burnicklbraun\" (click)=\"AnerkungVerfassernClicked.emit(Eintrag)\">[ERROR ->]{{GetAnmerkungVerfasser(Eintrag, i)}}</ion-button>\n                    </td>\n                    <td \"): ng:///PjProjektpunktEditorComponent/template.html@303:133, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"</td>\n                    <td style=\"width: auto\">\n                      <ion-textarea  [autoGrow]=\"[ERROR ->]true\" style=\"border: 1px solid black; border-radius: 4px; margin: 0px\" (ionChange)=\"AnmerkungTextChan\"): ng:///PjProjektpunktEditorComponent/template.html@306:49, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"ea  [autoGrow]=\"true\" style=\"border: 1px solid black; border-radius: 4px; margin: 0px\" (ionChange)=\"[ERROR ->]AnmerkungTextChangedHandler($event, i)\" [value]=\"Eintrag.Anmerkung\"></ion-textarea>\n                 \"): ng:///PjProjektpunktEditorComponent/template.html@306:133, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"ack; border-radius: 4px; margin: 0px\" (ionChange)=\"AnmerkungTextChangedHandler($event, i)\" [value]=\"[ERROR ->]Eintrag.Anmerkung\"></ion-textarea>\n                    </td>\n                    <td style=\"width: 50\"): ng:///PjProjektpunktEditorComponent/template.html@306:182, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"extarea>\n                    </td>\n                    <td style=\"width: 50px\"><ion-button (click)=\"[ERROR ->]DeleteAnmerkungClicked(i)\" color=\"rot\" size=\"small\"><ion-icon name=\"trash\"></ion-icon></ion-button></\"): ng:///PjProjektpunktEditorComponent/template.html@308:65, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"     <td colspan=\"3\">\n                      <ion-button size=\"small\" color=\"burnicklgruen\" (click)=\"[ERROR ->]AddAnmerkungClicked()\">\n                        <ion-icon name=\"add-circle-outline\" slot=\"icon-only\">\"): ng:///PjProjektpunktEditorComponent/template.html@312:78, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n            <ion-row>\n              <ion-col>\n                <ion-text color=\"burnicklgruen\"><b>[ERROR ->]{{DB.CurrentProjektpunkt.Bilderliste.length > 1 ? 'Bilder' : 'Bild'}}</b></ion-text>\n              </\"): ng:///PjProjektpunktEditorComponent/template.html@349:51, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n              <ion-col>\n                <table>\n                  <tr [ERROR ->]*ngFor=\"let Zeilenliste of Thumbnailliste; let Zeilenindex = index\">\n                    <ng-containe\"): ng:///PjProjektpunktEditorComponent/template.html@355:22, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"For=\"let Zeilenliste of Thumbnailliste; let Zeilenindex = index\">\n                    <ng-container [ERROR ->]*ngFor=\"let Thumb of Zeilenliste; let Thumbnailindex = index\">\n                      <td style=\"curso\"): ng:///PjProjektpunktEditorComponent/template.html@356:34, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"= index\">\n                      <td style=\"cursor: pointer;\">\n                        <ng-container [ERROR ->]*ngIf=\"Thumb !== null\">\n\n                          <table *ngIf=\"Thumb.weburl !== null\">\n\"): ng:///PjProjektpunktEditorComponent/template.html@358:38, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n                        <ng-container *ngIf=\"Thumb !== null\">\n\n                          <table [ERROR ->]*ngIf=\"Thumb.weburl !== null\">\n                            <tr>\n                              <td sty\"): ng:///PjProjektpunktEditorComponent/template.html@360:33, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"  <tr>\n                              <td style=\"padding: 2px\">\n                                <img [ERROR ->]*ngIf=\"Thumb !== null\" [src]=\"Thumb.largeurl\" [style.width.px]=\"Thumbbreite\"/>\n                      \"): ng:///PjProjektpunktEditorComponent/template.html@363:37, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"       <td style=\"padding: 2px\">\n                                <img *ngIf=\"Thumb !== null\" [src]=\"[ERROR ->]Thumb.largeurl\" [style.width.px]=\"Thumbbreite\"/>\n                              </td>\n                \"): ng:///PjProjektpunktEditorComponent/template.html@363:67, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                               <img *ngIf=\"Thumb !== null\" [src]=\"Thumb.largeurl\" [style.width.px]=\"[ERROR ->]Thumbbreite\"/>\n                              </td>\n                            </tr>\n\"): ng:///PjProjektpunktEditorComponent/template.html@363:101, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"    </tr>\n                            <tr>\n                              <td style=\"font-size: 90%\">[ERROR ->]{{Thumb.filename}}</td>\n                            </tr>\n                          </table>\n\"): ng:///PjProjektpunktEditorComponent/template.html@367:57, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n                          </table>\n\n                          <table [ERROR ->]*ngIf=\"Thumb.weburl === null\">\n                            <tr>\n                              <td sty\"): ng:///PjProjektpunktEditorComponent/template.html@371:33, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"          <div style=\"border: 1px solid gray; font-size: 80%; min-height: 120px;\" [style.width.px]=\"[ERROR ->]Thumbbreite\">\n                                  <table width=\"100%\">\n                                \"): ng:///PjProjektpunktEditorComponent/template.html@374:122, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                     <td align=\"center\">\n                                        <ion-icon (click)=\"[ERROR ->]DeleteThumbnailClicked($event, Thumb, Zeilenindex, Thumbnailindex)\" name=\"trash\" color=\"rot\" slot=\"ic\"): ng:///PjProjektpunktEditorComponent/template.html@383:59, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"    <td colspan=\"30\">\n                      <ion-button size=\"small\" color=\"burnicklgruen\" (click)=\"[ERROR ->]AddBildClicked()\">\n                        <ion-icon name=\"add-circle-outline\" slot=\"icon-only\"></ion\"): ng:///PjProjektpunktEditorComponent/template.html@401:78, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n            </ion-row>\n\n            <ng-container [ERROR ->]*ngIf=\"DB.CurrentProjektpunkt.EmailID !== null && DBEmail.CurrentEmail !== null\">\n              <ion-\"): ng:///PjProjektpunktEditorComponent/template.html@410:26, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"r>\n                        <td style=\"width: 110px\"><b>Betreff</b></td>\n                        <td>[ERROR ->]{{this.DBEmail.CurrentEmail.subject}}</td>\n                      </tr>\n                      <tr>\n\"): ng:///PjProjektpunktEditorComponent/template.html@424:28, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                     <tr>\n                        <td><b>Datum</b></td>\n                        <td>[ERROR ->]{{GetMailDatum()}}</td>\n                      </tr>\n                      <tr>\n\"): ng:///PjProjektpunktEditorComponent/template.html@428:28, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                   <tr>\n                        <td><b>Uhrzeit</b></td>\n                        <td>[ERROR ->]{{GetMailUhrzeit()}}</td>\n                      </tr>\n                      <tr>\n\"): ng:///PjProjektpunktEditorComponent/template.html@432:28, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"bordertable\">\n                            <tr>\n                              <td style=\"width: 30%\">[ERROR ->]{{DBEmail.CurrentEmail.from.emailAddress.name}}</td>\n                              <td style=\"width: \"): ng:///PjProjektpunktEditorComponent/template.html@439:53, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"il.CurrentEmail.from.emailAddress.name}}</td>\n                              <td style=\"width: auto\">[ERROR ->]<{{DBEmail.CurrentEmail.from.emailAddress.address}}></td>\n                            </tr>\n         \"): ng:///PjProjektpunktEditorComponent/template.html@440:54, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                  <table style=\"width: 100%\" class=\"nobordertable\">\n                            <tr [ERROR ->]*ngFor=\"let Empfaenger of DBEmail.CurrentEmail.toRecipients\">\n                              <td style\"): ng:///PjProjektpunktEditorComponent/template.html@449:32, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"faenger of DBEmail.CurrentEmail.toRecipients\">\n                              <td style=\"width: 30%\">[ERROR ->]{{Empfaenger.emailAddress.name}}</td>\n                              <td style=\"width: auto\"><{{Empfae\"): ng:///PjProjektpunktEditorComponent/template.html@450:53, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"h: 30%\">{{Empfaenger.emailAddress.name}}</td>\n                              <td style=\"width: auto\">[ERROR ->]<{{Empfaenger.emailAddress.address}}></td>\n                            </tr>\n                        \"): ng:///PjProjektpunktEditorComponent/template.html@451:54, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"                  <table style=\"width: 100%\" class=\"nobordertable\">\n                            <tr [ERROR ->]*ngFor=\"let CcEmpfaenger of DBEmail.CurrentEmail.ccRecipients\">\n                              <td sty\"): ng:///PjProjektpunktEditorComponent/template.html@460:32, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"aenger of DBEmail.CurrentEmail.ccRecipients\">\n                              <td style=\"width: 30%;\">[ERROR ->]{{CcEmpfaenger.emailAddress.name}}</td>\n                              <td style=\"width: auto;\"><{{CcE\"): ng:///PjProjektpunktEditorComponent/template.html@461:54, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"0%;\">{{CcEmpfaenger.emailAddress.name}}</td>\n                              <td style=\"width: auto;\">[ERROR ->]<{{CcEmpfaenger.emailAddress.address}}></td>\n                            </tr>\n                      \"): ng:///PjProjektpunktEditorComponent/template.html@462:55, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"ertable\">\n                      <tr>\n                        <td class=\"nobordertable\" [innerHTML]=\"[ERROR ->]HTMLBody\"></td>\n                      </tr>\n                    </table>\n\"): ng:///PjProjektpunktEditorComponent/template.html@478:63, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n              </ion-row>\n            </ng-container>\n            <ion-row [ERROR ->]*ngIf=\"DB.CurrentProjektpunkt._id !== null\">\n              <ion-col>\n\n\"): ng:///PjProjektpunktEditorComponent/template.html@492:21, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n                <table>\n                  <tr>\n                    <td><checkbox-clon [Checked]=\"[ERROR ->]DeleteEnabled\" (CheckChanged)=\"CanDeleteCheckedChanged($event)\"></checkbox-clon></td>\n               \"): ng:///PjProjektpunktEditorComponent/template.html@497:50, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"              <tr>\n                    <td><checkbox-clon [Checked]=\"DeleteEnabled\" (CheckChanged)=\"[ERROR ->]CanDeleteCheckedChanged($event)\"></checkbox-clon></td>\n                    <td style=\"width: 6px\"></t\"): ng:///PjProjektpunktEditorComponent/template.html@497:81, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"td>\n                    <td>\n                      <ion-button size=\"small\" color=\"rot\" [disabled]=\"[ERROR ->]!DeleteEnabled\" (click)=\"DeleteButtonClicked()\">\n                        <ion-icon name=\"trash-outlin\"): ng:///PjProjektpunktEditorComponent/template.html@500:71, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"td>\n                      <ion-button size=\"small\" color=\"rot\" [disabled]=\"!DeleteEnabled\" (click)=\"[ERROR ->]DeleteButtonClicked()\">\n                        <ion-icon name=\"trash-outline\" style=\"font-size: 20px\"): ng:///PjProjektpunktEditorComponent/template.html@500:96, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n            <tr>\n              <td>\n                <div class=\"rootbuttonclass\" (click)=\"[ERROR ->]CancelButtonClicked()\">\n                  <ion-icon style=\"font-size: 28px\" color=\"weiss\" name=\"close\"): ng:///PjProjektpunktEditorComponent/template.html@519:54, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\"\n              <td>\n\n                <div class=\"rootbuttonclass\" (click)=\"[ERROR ->]Valid === true ? OkButtonClicked() : null\">\n                  <ion-icon style=\"font-size: 28px\" [colo\"): ng:///PjProjektpunktEditorComponent/template.html@525:54, Parser Error: Unexpected token 'GetKostengruppennamen' at column 23 in [KostenService.GetKos()GetKostengruppennamen()] in ng:///PjProjektpunktEditorComponent/template.html@94:52 (\" === true ? OkButtonClicked() : null\">\n                  <ion-icon style=\"font-size: 28px\" [color]=\"[ERROR ->]Valid === true ? 'weiss' : 'grau'\" name=\"save-outline\"></ion-icon>\n                </div>\n           \"): ng:///PjProjektpunktEditorComponent/template.html@526:61"

      let Beteiligter: Projektbeteiligtestruktur;
      let Mitarbeiter: Mitarbeiterstruktur;
      let Name: string;
      let Firma: Projektfirmenstruktur;
      let CcEmpfaengerliste: {
        Name:  string;
        Firma: string;
        Email: string;
      }[];
      let Empfaengerliste: {
        Name:  string;
        Firma: string;
        Email: string;
      }[];



      // Empfaenger bestimmen

      Empfaengerliste   = [];
      CcEmpfaengerliste = [];


      // Mitarbeiter zu Cc Liste hinzufügen

      for(let InternEmpfaengerID of this.CurrentRechnung.EmpfaengerInternIDListe) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: InternEmpfaengerID});

        if(!lodash.isUndefined(Mitarbeiter)) Empfaengerliste.push({

          Name: Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name,
          Email: Mitarbeiter.Email,
          Firma: 'BAE'
        });
      }

      this.CurrentRechnung.Empfaengerliste = Empfaengerliste;

      debugger;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle ', 'PrepareSimontabelleEmaildata', this.Debug.Typen.Service);
    }
  }

  public CalculateHonorar() {

    try {

      let Tabelle: Simontabellestruktur;
      let Index: number;
      let Leistungssumme: number;
      let Nettonebenkosten: number;
      let Nettozwischensumme: number;
      let Nettogesamthonorar: number;
      let Nettoumbauzuschlag: number;

      this.Leistungsphasenanzahlliste = [];
      this.Leistungsphasenliste       = [];
      this.Summenliste                = [];

      for(Tabelle of this.Pool.Simontabellenliste[this.DBProjekte.CurrentProjekt.Projektkey]) {

        Leistungssumme = 0;

        for(let Leistung of Tabelle.Besondereleistungenliste) {

          Leistungssumme += Leistung.Honorar;
        }

        Index = this.Leistungsphasenliste.indexOf(Tabelle.Leistungsphase);

        if( Index === -1) {

          this.Summenliste[Tabelle.Leistungsphase] = [];

          this.Leistungsphasenliste.push(Tabelle.Leistungsphase);

          this.Leistungsphasenanzahlliste[Tabelle.Leistungsphase] = 0;

          Index = this.Leistungsphasenliste.length - 1;

          Nettoumbauzuschlag = (Tabelle.Honorar * Tabelle.Umbauzuschlag) / 100;
          Nettozwischensumme = Tabelle.Honorar + Leistungssumme + Nettoumbauzuschlag;
          Nettonebenkosten   = Nettozwischensumme * Tabelle.Nebenkosten / 100;
          Nettogesamthonorar = Nettozwischensumme + Nettonebenkosten;

          Tabelle.Nettoumbauzuschlag  = Nettoumbauzuschlag;
          Tabelle.Bruttoumbauzuschlag = Nettoumbauzuschlag * (1 + this.Steuersatz / 100);
          Tabelle.Nettonebenkosten    = Nettonebenkosten;
          Tabelle.Bruttonebenkosten   = Nettonebenkosten * (1 + this.Steuersatz / 100);
          Tabelle.Nettozwischensumme  = Nettozwischensumme;
          Tabelle.Bruttozwischensumme = Nettozwischensumme * (1 + this.Steuersatz / 100);
          Tabelle.Nettogesamthonorar  = Nettogesamthonorar;
          Tabelle.Bruttogesamthonorar = Nettogesamthonorar * (1 + this.Steuersatz / 100);

          this.Summenliste[Tabelle.Leistungsphase][Index] = {

            Nettokostensumme:  Tabelle.Kosten,
            Bruttokostensumme: Tabelle.Kosten * (1 + this.Steuersatz / 100),


            Nettoumbauzuschlag:   Tabelle.Nettoumbauzuschlag,
            Bruttoumbauzuschlag:   Tabelle.Bruttoumbauzuschlag,

            Nettohonorar:         Tabelle.Honorar,
            Bruttohonorar:        Tabelle.Honorar * (1 + this.Steuersatz / 100),
            Nettoleistungssumme:  Leistungssumme,
            Bruttoleistungssumme: Leistungssumme * (1 + this.Steuersatz / 100),
            Nettozwischensumme:   Nettozwischensumme,
            Bruttozwischensumme:  Nettozwischensumme * (1 + this.Steuersatz / 100),
            Nettonebenkosten:     Nettonebenkosten,
            Bruttonebenkosten:    Nettonebenkosten  * (1 + this.Steuersatz / 100),
            Nettogesamthonorar:   Nettogesamthonorar,
            Bruttogesamthonorar:  Nettogesamthonorar * (1 + this.Steuersatz / 100),
          };
        }
        else {

          this.Leistungsphasenanzahlliste[Tabelle.Leistungsphase] += 1;

          Nettoumbauzuschlag = (Tabelle.Honorar * Tabelle.Umbauzuschlag) / 100;
          Nettozwischensumme = Tabelle.Honorar + Leistungssumme + Nettoumbauzuschlag;
          Nettonebenkosten   = Nettozwischensumme * Tabelle.Nebenkosten / 100;
          Nettogesamthonorar = Nettozwischensumme + Nettonebenkosten;

          Tabelle.Nettoumbauzuschlag  = Nettoumbauzuschlag;
          Tabelle.Bruttoumbauzuschlag = Nettoumbauzuschlag * (1 + this.Steuersatz / 100);
          Tabelle.Nettonebenkosten    = Nettonebenkosten;
          Tabelle.Bruttonebenkosten   = Nettonebenkosten * (1 + this.Steuersatz / 100);
          Tabelle.Nettozwischensumme  = Nettozwischensumme;
          Tabelle.Bruttozwischensumme = Nettozwischensumme * (1 + this.Steuersatz / 100);
          Tabelle.Nettogesamthonorar  = Nettogesamthonorar;
          Tabelle.Bruttogesamthonorar = Nettogesamthonorar * (1 + this.Steuersatz / 100);

          this.Summenliste[Tabelle.Leistungsphase][Index].Nettokostensumme     += Tabelle.Kosten;
          this.Summenliste[Tabelle.Leistungsphase][Index].Bruttokostensumme    += Tabelle.Kosten * (1 + this.Steuersatz / 100);

          this.Summenliste[Tabelle.Leistungsphase][Index].Nettoumbauzuschlag   += Tabelle.Nettoumbauzuschlag;
          this.Summenliste[Tabelle.Leistungsphase][Index].Bruttoumbauzuschlag  += Tabelle.Bruttoumbauzuschlag;


          this.Summenliste[Tabelle.Leistungsphase][Index].Nettohonorar         += Tabelle.Honorar;
          this.Summenliste[Tabelle.Leistungsphase][Index].Bruttohonorar        += Tabelle.Honorar * (1 + this.Steuersatz / 100);
          this.Summenliste[Tabelle.Leistungsphase][Index].Nettoleistungssumme  += Leistungssumme;
          this.Summenliste[Tabelle.Leistungsphase][Index].Bruttoleistungssumme += Leistungssumme * (1 + this.Steuersatz / 100);
          this.Summenliste[Tabelle.Leistungsphase][Index].Nettozwischensumme   += Nettozwischensumme;
          this.Summenliste[Tabelle.Leistungsphase][Index].Bruttozwischensumme  += Nettozwischensumme * (1 + this.Steuersatz / 100);
          this.Summenliste[Tabelle.Leistungsphase][Index].Nettonebenkosten     += Nettonebenkosten;
          this.Summenliste[Tabelle.Leistungsphase][Index].Bruttonebenkosten    += Nettonebenkosten * (1 + this.Steuersatz / 100);
          this.Summenliste[Tabelle.Leistungsphase][Index].Nettogesamthonorar   += Nettogesamthonorar;
          this.Summenliste[Tabelle.Leistungsphase][Index].Bruttogesamthonorar  += Nettogesamthonorar * (1 + this.Steuersatz / 100);
        }

        if(this.Leistungsphasenliste.length > 0) {

          this.CurrentLeistungsphaseindex = 0;
          this.CurrentLeistungsphase      = this.Leistungsphasenliste[this.CurrentLeistungsphaseindex];
        }
        else {

          this.CurrentLeistungsphaseindex = null;
          this.CurrentLeistungsphase      = this.Const.NONE;
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'CalculateHonorar', this.Debug.Typen.Service);
    }
  }

  public FixTabellenbetrag(Wert: number): string {

    try {

      if(!lodash.isUndefined(Wert)) return Wert.toFixed(2);
      else return '0,00';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'FixTabelleneintragbetrag', this.Debug.Typen.Service);
    }
  }

  public async AddNewRechnung() {

    try {

      let Rechnung: Rechnungstruktur;
      let RechnungID: string = this.Pool.GetNewUniqueID();
      let Heute: Moment = moment();
      let Tabelle: Simontabellestruktur;
      let Nummernliste: number[];
      let Nummer: number;

      if(this.CurrentSimontabelle !== null) {

        for(Tabelle of this.Pool.Simontabellenliste[this.DBProjekte.CurrentProjekt.Projektkey]) {

          if(Tabelle.Leistungsphase === this.CurrentSimontabelle.Leistungsphase) {

            Nummernliste = [];

            for(Rechnung of Tabelle.Rechnungen) {

              Nummernliste.push(Rechnung.Nummer);
            }

            if(Nummernliste.length > 0) {

              Nummer = Nummernliste.reduce((a, b) => Math.max(a, b), -Infinity);
              Nummer++;
            }
            else Nummer = 1;

            Rechnung = {
              Betreff: "",
              CcEmpfaengerExternIDListe: [],
              CcEmpfaengerInternIDListe: [],
              EmpfaengerExternIDListe: [],
              EmpfaengerInternIDListe: [],
              FileID:  this.Const.NONE,
              Filename: this.Const.NONE,
              GesendetZeitstempel: null,
              GesendetZeitstring: this.Const.NONE,
              Nachricht: this.Const.NONE,

              RechnungID:  RechnungID,
              Nummer:      Nummer,
              Zeitstempel: Heute.valueOf(),
              CanDelete:   false,
              Verfasser: {
                Name:    this.Pool.Mitarbeiterdaten.Name,
                Vorname: this.Pool.Mitarbeiterdaten.Vorname,
                Email:   this.Pool.Mitarbeiterdaten.Email
              }
            };

            for(let Eintrag of Tabelle.Eintraegeliste) {

              Eintrag.Rechnungseintraege.push({

                RechnungID:         RechnungID,
                Honoraranteil:       0,
                Valid:               true,
                Nettohonorar:        0,
                Nettonebenkosten:    0,
                Nettogesamthonorar:  0,
                Mehrwertsteuer:      0,
                Bruttogesamthonorar: 0
              });
            }

            for(let Leistung of Tabelle.Besondereleistungenliste) {

              Leistung.Rechnungseintraege.push({

                RechnungID:    RechnungID,
                Honoraranteil: 0
              });
            }

            Tabelle.Rechnungen.push(Rechnung);

            await this.UpdateSimontabelle(Tabelle);

            if(Tabelle._id === this.CurrentSimontabelle._id) {

              this.CurrentSimontabelle = Tabelle;
            }
          }
        }

        this.CurrentRechnungsindex = this.CurrentSimontabelle.Rechnungen.length - 1;
        this.CurrentRechnung       = this.CurrentSimontabelle.Rechnungen[this.CurrentRechnungsindex];
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'AddNewRechnung', this.Debug.Typen.Service);
    }
  }

  CheckRechnungswert(Rechnungseintrag: Rechnungseintragstruktur) {

    try {

      let Valid: boolean;
      let Wert: number;

      Rechnungseintrag.Valid = !isNaN(parseFloat(Rechnungseintrag.Honoraranteil.toString())) && isFinite(Rechnungseintrag.Honoraranteil);

      if(Rechnungseintrag.Valid) {

        Wert = parseFloat(Rechnungseintrag.Honoraranteil.toString());

        Rechnungseintrag.Honoraranteil = Wert;
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'CheckRechnungswert', this.Debug.Typen.Service);
    }
  }

  public CalculateRechnungseintrag(Tabelleneintrag: Simontabelleeintragstruktur, Rechnungseintrag: Rechnungseintragstruktur) {

    try {

      let Tabelleneintragindex: number;
      let Rechnungseintragindex: number;

      if(Rechnungseintrag.Valid === true) {

        Rechnungseintrag.Nettohonorar        = (this.CurrentSimontabelle.Nettozwischensumme * Rechnungseintrag.Honoraranteil) / 100;
        Rechnungseintrag.Nettoumbauzuschlag  = (this.CurrentSimontabelle.Honorar * this.CurrentSimontabelle.Umbauzuschlag) / 100;
        Rechnungseintrag.Bruttoumbauzuschlag = Rechnungseintrag.Nettoumbauzuschlag * (1 + this.Steuersatz / 100);
        Rechnungseintrag.Nettozwischensumme  = Rechnungseintrag.Nettohonorar + Rechnungseintrag.Nettoumbauzuschlag + Rechnungseintrag.Nettonebenkosten;
        Rechnungseintrag.Nettonebenkosten    = (Rechnungseintrag.Nettohonorar * this.CurrentSimontabelle.Nebenkosten) / 100;
        Rechnungseintrag.Mehrwertsteuer      = (Rechnungseintrag.Nettogesamthonorar * this.Steuersatz) / 100;
        Rechnungseintrag.Bruttogesamthonorar = Rechnungseintrag.Nettogesamthonorar + Rechnungseintrag.Mehrwertsteuer;
      }
      else {

        Rechnungseintrag.Mehrwertsteuer      = 0;
        Rechnungseintrag.Nettohonorar        = 0;
        Rechnungseintrag.Nettonebenkosten    = 0;
        Rechnungseintrag.Nettogesamthonorar  = 0;
        Rechnungseintrag.Bruttogesamthonorar = 0;
        Rechnungseintrag.Nettoumbauzuschlag  = 0;
        Rechnungseintrag.Bruttoumbauzuschlag = 0;
      }

      Tabelleneintrag.Honorarsummeprozent = 0;
      Tabelleneintrag.Honorarsumme        = 0;
      Tabelleneintrag.Nettohonorar        = 0;
      Tabelleneintrag.Nettonebenkosten    = 0;
      Tabelleneintrag.Nettoumbauzuschlag  = 0;
      Tabelleneintrag.Bruttoumbauzuschlag = 0;
      Tabelleneintrag.Nettogesamthonorar  = 0;
      Tabelleneintrag.Mehrwertsteuer      = 0;
      Tabelleneintrag.Bruttogesamthonorar = 0;
      Tabelleneintrag.Nettoumbauzuschlag  = 0;
      Tabelleneintrag.Bruttoumbauzuschlag = 0;

      for(let Rechnungseintrag2 of Tabelleneintrag.Rechnungseintraege) {

        if(lodash.isUndefined(Rechnungseintrag2.Honoraranteil))       Rechnungseintrag2.Honoraranteil       = 0;
        if(lodash.isUndefined(Rechnungseintrag2.Nettohonorar))        Rechnungseintrag2.Nettohonorar        = 0;
        if(lodash.isUndefined(Rechnungseintrag2.Nettonebenkosten))    Rechnungseintrag2.Nettonebenkosten    = 0;
        if(lodash.isUndefined(Rechnungseintrag2.Nettogesamthonorar))  Rechnungseintrag2.Nettogesamthonorar  = 0;
        if(lodash.isUndefined(Rechnungseintrag2.Mehrwertsteuer))      Rechnungseintrag2.Mehrwertsteuer      = 0;
        if(lodash.isUndefined(Rechnungseintrag2.Bruttogesamthonorar)) Rechnungseintrag2.Bruttogesamthonorar = 0;
        if(lodash.isUndefined(Rechnungseintrag2.Nettoumbauzuschlag))  Rechnungseintrag2.Nettoumbauzuschlag  = 0;
        if(lodash.isUndefined(Rechnungseintrag2.Bruttoumbauzuschlag)) Rechnungseintrag2.Bruttoumbauzuschlag = 0;

        Tabelleneintrag.Honorarsummeprozent += Rechnungseintrag2.Honoraranteil;
        Tabelleneintrag.Honorarsumme        += Rechnungseintrag2.Nettohonorar;
        Tabelleneintrag.Nettohonorar        += Rechnungseintrag2.Nettohonorar;
        Tabelleneintrag.Nettonebenkosten    += Rechnungseintrag2.Nettonebenkosten;
        Tabelleneintrag.Nettogesamthonorar  += Rechnungseintrag2.Nettogesamthonorar;
        Tabelleneintrag.Mehrwertsteuer      += Rechnungseintrag2.Mehrwertsteuer;
        Tabelleneintrag.Bruttogesamthonorar += Rechnungseintrag2.Bruttogesamthonorar;
        Tabelleneintrag.Nettoumbauzuschlag  += Rechnungseintrag2.Nettoumbauzuschlag;
        Tabelleneintrag.Bruttoumbauzuschlag += Rechnungseintrag2.Bruttoumbauzuschlag;
      }

      Tabelleneintragindex  = lodash.findIndex(this.CurrentSimontabelle.Eintraegeliste, { Buchstabe: Tabelleneintrag.Buchstabe });
      Rechnungseintragindex = lodash.findIndex(Tabelleneintrag.Rechnungseintraege,      {RechnungID: Rechnungseintrag.RechnungID});

      this.CurrentSimontabelle.Eintraegeliste[Tabelleneintragindex].Rechnungseintraege[Rechnungseintragindex] = Rechnungseintrag;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'CalculateRechnungseintrag', this.Debug.Typen.Service);
    }
  }

  public CalculateSammelrechung(Rechnungsindex: number): Honorarsummenstruktur {

    try {

      let Rechnung: Rechnungstruktur;
      let Zwischensumme: Honorarsummenstruktur;
      let Bruttozwischensumme: number;
      let Merker: Simontabellestruktur;
      let Summe: Honorarsummenstruktur = {

        Honorarprozente: 0,
        Bruttogesamthonorar: 0,
        Bruttohonorar: 0,
        Nettoumbauzuschlag: 0,
        Bruttoumbauzuschlag: 0,
        Bruttokostensumme: 0,
        Bruttoleistungssumme: 0,
        Bruttonebenkosten: 0,
        Bruttozwischensumme: 0,
        Nettogesamthonorar: 0,
        Nettohonorar: 0,
        Nettokostensumme: 0,
        Nettoleistungssumme: 0,
        Nettonebenkosten: 0,
        Nettozwischensumme: 0,
        Mehrwertsteuer: 0,
        Sicherheitseinbehalt: 0
      };

      Merker = this.CurrentSimontabelle;

      for(this.CurrentSimontabelle of this.Pool.Simontabellenliste[this.DBProjekte.CurrentProjekt.Projektkey]) {

        if (this.CurrentSimontabelle.Leistungsphase === this.CurrentLeistungsphase) {

          Rechnung            = this.CurrentSimontabelle.Rechnungen[Rechnungsindex];
          Zwischensumme       = this.CalculateRechnungssumme(Rechnung, this.CurrentSimontabelle);
          Bruttozwischensumme = (Zwischensumme.Nettohonorar + Zwischensumme.Nettonebenkosten) * (1 + this.Steuersatz / 100);

          Summe.Nettohonorar         += Zwischensumme.Nettohonorar;
          Summe.Bruttohonorar        += (Zwischensumme.Nettohonorar  * (1 + this.Steuersatz / 100));
          Summe.Nettonebenkosten     += Zwischensumme.Nettonebenkosten;
          Summe.Bruttonebenkosten    += (Zwischensumme.Nettonebenkosten  * (1 + this.Steuersatz / 100));
          Summe.Nettozwischensumme   += (Zwischensumme.Nettohonorar + Zwischensumme.Nettonebenkosten);
          Summe.Bruttozwischensumme  += Bruttozwischensumme;
          Summe.Nettogesamthonorar   += Zwischensumme.Nettogesamthonorar;
          Summe.Mehrwertsteuer       += Zwischensumme.Mehrwertsteuer;
        }
      }

      Summe.Sicherheitseinbehalt = (Summe.Bruttozwischensumme * this.CurrentSimontabelle.Sicherheitseinbehalt) / 100;
      Summe.Bruttogesamthonorar  = Summe.Bruttozwischensumme - Summe.Sicherheitseinbehalt;

      this.CurrentSimontabelle = Merker;

      return Summe;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'CalculateSammelrechung', this.Debug.Typen.Service);
    }
  }


  CalculateRechnungssumme(Rechnung: Rechnungstruktur, Tabelle: Simontabellestruktur): Honorarsummenstruktur {

    try {

      let Summe: Honorarsummenstruktur = {

        Honorarprozente: 0,
        Bruttogesamthonorar: 0,
        Nettoumbauzuschlag: 0,
        Bruttoumbauzuschlag: 0,
        Bruttohonorar: 0,
        Bruttokostensumme: 0,
        Bruttoleistungssumme: 0,
        Bruttonebenkosten: 0,
        Bruttozwischensumme: 0,
        Nettogesamthonorar: 0,
        Nettohonorar: 0,
        Nettokostensumme: 0,
        Nettoleistungssumme: 0,
        Nettonebenkosten: 0,
        Nettozwischensumme: 0,
        Mehrwertsteuer: 0,
        Sicherheitseinbehalt: 0
      };

      if(this.CurrentSimontabelle !== null) {

        for(let Eintrag of Tabelle.Eintraegeliste) {

          for(let Rechnungseintrag of Eintrag.Rechnungseintraege) {

            if(Rechnungseintrag.RechnungID === Rechnung.RechnungID) {

              Summe.Honorarprozente     += Rechnungseintrag.Honoraranteil;
              Summe.Nettohonorar        += Rechnungseintrag.Nettohonorar;
              Summe.Bruttohonorar       += (Rechnungseintrag.Nettohonorar * (1 + this.Steuersatz / 100));
              Summe.Nettonebenkosten    += Rechnungseintrag.Nettonebenkosten;
              Summe.Bruttonebenkosten   += (Rechnungseintrag.Nettonebenkosten * (1 + this.Steuersatz / 100));
              Summe.Nettogesamthonorar  += Rechnungseintrag.Nettogesamthonorar;
              Summe.Mehrwertsteuer      += Rechnungseintrag.Mehrwertsteuer;
              Summe.Bruttogesamthonorar += Rechnungseintrag.Bruttogesamthonorar;
            }
          }
        }
      }

      return Summe;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'CalculateRechnungssumme', this.Debug.Typen.Service);
    }
  }

  public CalculateRechnungssummen(): Honorarsummenstruktur  {

    try {

      let Summe: Honorarsummenstruktur;

      Summe = {

        Honorarprozente: 0,
        Bruttogesamthonorar: 0,
        Bruttohonorar: 0,
        Nettoumbauzuschlag: 0,
        Bruttoumbauzuschlag: 0,
        Bruttokostensumme: 0,
        Bruttoleistungssumme: 0,
        Bruttonebenkosten: 0,
        Bruttozwischensumme: 0,
        Nettogesamthonorar: 0,
        Nettohonorar: 0,
        Nettokostensumme: 0,
        Nettoleistungssumme: 0,
        Nettonebenkosten: 0,
        Nettozwischensumme: 0,
        Mehrwertsteuer: 0,
        Sicherheitseinbehalt: 0
      };

      for(let Tabelleneintrag of this.CurrentSimontabelle.Eintraegeliste) {

        Summe.Honorarprozente     += Tabelleneintrag.Honorarsummeprozent;
        Summe.Nettohonorar        += Tabelleneintrag.Nettohonorar;
        Summe.Nettonebenkosten    += Tabelleneintrag.Nettonebenkosten;
        Summe.Nettogesamthonorar  += Tabelleneintrag.Nettogesamthonorar;
        Summe.Mehrwertsteuer      += Tabelleneintrag.Mehrwertsteuer;
        Summe.Bruttogesamthonorar += Tabelleneintrag.Bruttogesamthonorar;
      }

      return Summe;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'CalculateRechnungssummen', this.Debug.Typen.Service);
    }
  }


  public GetNewBesondereleistung(): Simontabellebesondereleistungstruktur {

    try {

      return {

        LeistungID: null,
        Nummer: '',
        Titel: '',
        Beschreibung: '',
        Honorar: 0,
        Rechnungseintraege: [],
      };
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'GetNewBesondereleistung', this.Debug.Typen.Service);
    }
  }

  public GetNewSimontabelle(Leistungsphase: string, Anlagengruppe: number): Simontabellestruktur {

    try {

      let Liste: Simontabelleeintragstruktur[] = [];
      let Durchschnittswert: number = 0;

      switch (Leistungsphase) {

        case this.Const.Leistungsphasenvarianten.LPH5:

          Durchschnittswert = 22;

          Liste.push({ Buchstabe: 'A',
            Beschreibung: `Erarbeiten der Ausführungsplanung auf Grundlage der Ergebnisse der Leistungsphasen 3 und 4
            (stufenweise Erarbeitung und Darstellung der Lösung) unter Beachtung der durch die Objektplanung
            integrierten Fachplanungen bis zur ausführungsreifen Lösung`,
            Von: 4, Bis: 6, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'B',
            Beschreibung: `Fortschreiben der Berechnungen und Bemessungen zur Auslegung der technischen Anlagen und
            Anlagenteile Zeichnerische Darstellung der Anlagen in einem mit dem Objektplaner abgestimmten Ausgabemaßstab
            und Detaillierungsgrad einschließlich Dimensionen (keine Montage- oder Werkstattpläne) Anpassen und Detaillieren
            der Funktions- und Strangschemata der Anlagen bzw. der GA Funktionslisten, Abstimmen der Ausführungszeichnungen
            mit dem Objektplaner und den übrigen Fachplanern.`,
            Von: 8, Bis: 11, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'C',
            Beschreibung: `Anfertigen von Schlitz- und Durchbruchsplänen.`,
            Von: 2, Bis: 4, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'D',
            Beschreibung: `Fortschreibung des Terminplans.`,
            Von: 0.1, Bis: 0.5, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'E',
            Beschreibung: `Fortschreiben der Ausführungsplanung auf den Stand der Ausschreibungsergebnisse und der dann vorliegenden
            Ausführungsplanung des Objektplaners, Übergeben der fortgeschriebenen Ausführungsplanung an die ausführenden Unternehmen.`,
            Von: 0.5, Bis: 1, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'F',
            Beschreibung: `Prüfen und Anerkennen der Montage- und Werkstattpläne der ausführenden Unternehmen auf Übereinstimmung mit der Ausführungsplanung.`,
            Von: 2, Bis: 4, Vertrag: 0, Rechnungseintraege: [] });

          break;

        case this.Const.Leistungsphasenvarianten.LPH6:

          Durchschnittswert = 7;

          Liste.push({ Buchstabe: 'A',
            Beschreibung: `Ermitteln von Mengen als Grundlage für das Aufstellen von Leistungsverzeichnissen in Abstimmung
            mit Beiträgen anderer an der Planung fachlich Beteiligter.`,
            Von: 2.25, Bis: 3, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'B',
            Beschreibung: `Aufstellen der Vergabeunterlagen, insbesondere mit Leistungsverzeichnissen nach
            Leistungsbereichen, inklusive der Wartungsleistungen auf Grundlage bestehender Regelwerke.`,
            Von: 2.5, Bis: 3.5, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'C',
            Beschreibung: `Mitwirken beim Abstimmen der Schnittstellen zu den Leistungsbeschreibungen
            der anderen an der Planung fachlich Beteiligten.`,
            Von: 0, Bis: 1, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'D',
            Beschreibung: `Ermitteln der Kosten auf Grundlage der vom Planer bepreisten Leistungsverzeichnisse.`,
            Von: 0, Bis: 2, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'E',
            Beschreibung: `Kostenkontrolle durch Vergleich der vom Planer bepreisten Leistungsverzeichnisse mit der Kostenberechnung.`,
            Von: 0, Bis: 1, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'F',
            Beschreibung: `Zusammenstellen der Vergabeunterlagen.`,
            Von: 0, Bis: 1, Vertrag: 0, Rechnungseintraege: [] });

          break;

        case this.Const.Leistungsphasenvarianten.LPH7:

          Durchschnittswert = 5;

          Liste.push({ Buchstabe: 'A',
            Beschreibung: `Einholen von Angeboten.`,
            Von: 0, Bis: 0.1, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'B',
            Beschreibung: `Prüfen und Werten der Angebote, Aufstellen der Preisspiegel nach Einzelpositionen,
            Prüfen und Werten der Angebote für zusätzliche oder geänderte Leistungen der ausführenden Unternehmen
            und der Angemessenheit der Preise.`,
            Von: 0, Bis: 4.25, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'C',
            Beschreibung: `Führen von Bietergesprächen.`,
            Von: 0, Bis: 1, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'D',
            Beschreibung: `Vergleichen der Ausschreibungsergebnisse mit den vom Planer bepreisten Leistungsverzeichnissen und der Kostenberechnung.`,
            Von: 0, Bis: 1, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'E',
            Beschreibung: `Erstellen der Vergabevorschläge, Mitwirken bei der Dokumentation der Vergabeverfahren.`,
            Von: 0, Bis: 1, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'F',
            Beschreibung: `Zusammenstellen der Vertragsunterlagen und bei der Auftragserteilung.`,
            Von: 0, Bis: 0.25, Vertrag: 0, Rechnungseintraege: [] });

          break;

        case this.Const.Leistungsphasenvarianten.LPH8:

          Durchschnittswert = 35;

          Liste.push({ Buchstabe: 'A',
            Beschreibung: `Überwachen der Ausführung des Objekts auf Übereinstimmung mit der öffentlich-rechtlichen Genehmigung
            oder Zustimmung, den Verträgen mit den ausführenden Unternehmen, den Ausführungsunterlagen, den Montage- und
            Werkstattplänen, den einschlägigen Vorschriften und den allgemein anerkannten Regeln der Technik.`,
            Von: 16, Bis: 22, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'B',
            Beschreibung: `Mitwirken bei der Koordination der am Projekt Beteiligten.`,
            Von: 0.3, Bis: 1, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'C',
            Beschreibung: `Aufstellen, Fortschreiben und Überwachen des Terminplans (Balkendiagramm).`,
            Von: 0.25, Bis: 0.65, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'D',
            Beschreibung: `Dokumentation des Bauablaufs (Bautagebuch).`,
            Von: 0.25, Bis: 0.5, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'E',
            Beschreibung: `Prüfen und Bewerten der Notwendigkeit geänderter oder zusätzlicher Leistungen der Unternehmer und der Angemessenheit der Preise.`,
            Von: 0, Bis: 1, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'F',
            Beschreibung: `Gemeinsames Aufmaß mit den ausführenden Unternehmen.`,
            Von: 0, Bis: 3, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'G',
            Beschreibung: `Rechnungsprüfung in rechnerischer und fachlicher Hinsicht mit Prüfen und Bescheinigen des Leistungsstandes anhand nachvollziehbarer Leistungsnachweise.`,
            Von: 6.5, Bis: 10, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'H',
            Beschreibung: `Kostenkontrolle durch Überprüfen der Leistungsabrechnungen der ausführenden Unternehmen im Vergleich zu den Vertragspreisen und dem Kostenanschlag.`,
            Von: 0.75, Bis: 1.25, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'I',
            Beschreibung: ` Kostenfeststellung`,
            Von: 0, Bis: 1, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'J',
            Beschreibung: `Mitwirken bei Leistungs- u. Funktionsprüfungen`,
            Von: 0, Bis: 1, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'K',
            Beschreibung: `Fachtechnische Abnahme der Leistungen auf Grundlage der vorgelegten Dokumentation, Erstellung eines Abnahmeprotokolls,
            Feststellen von Mängeln und Erteilen einer Abnahmeempfehlung.`,
            Von: 2, Bis: 4, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'L',
            Beschreibung: ` Antrag auf behördliche Abnahmen und Teilnahme daran`,
            Von: 0, Bis: 1, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'M',
            Beschreibung: `Prüfung der übergebenen Revisionsunterlagen auf Vollzähligkeit, Vollständigkeit und stichprobenartige
            Prüfung auf Übereinstimmung mit dem Stand der Ausführung`,
            Von: 0.5, Bis: 0.75, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'N',
            Beschreibung: `Auflisten der Verjährungsfristen der Ansprüche auf Mängelbeseitigung.`,
            Von: 0, Bis: 1, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'O',
            Beschreibung: `Überwachen der Beseitigung der bei der Abnahme festgestellten Mängel.`,
            Von: 0.25, Bis: 1.5, Vertrag: 0, Rechnungseintraege: [] });

          Liste.push({ Buchstabe: 'P',
            Beschreibung: `Systematische Zusammenstellung der Dokumentation, der zeichnerischen Darstellungen und rechnerischen Ergebnisse des Objekts.`,
            Von: 0.1, Bis: 0.25, Vertrag: 0, Rechnungseintraege: [] });

          break;
      }

      return {

        _id: null,
        Projektkey: this.DBProjekte.CurrentProjekt !== null ? this.DBProjekte.CurrentProjekt.Projektkey : null,
        Anlagengruppe:  Anlagengruppe,
        Leistungsphase: Leistungsphase,
        Durchschnittswert: Durchschnittswert,
        Eintraegeliste: Liste,
        Honorar: 0,
        Kosten: 0,
        Nebenkosten: 0,
        Umbauzuschlag: 0,
        Sicherheitseinbehalt: 0,
        Besondereleistungenliste: [],
        Deleted: false,
        Rechnungen: [],
        Verfasser: {

          Email:    this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Email   : this.Const.NONE,
          Vorname: this.Pool.Mitarbeiterdaten  !== null ? this.Pool.Mitarbeiterdaten.Vorname : this.Const.NONE,
          Name:    this.Pool.Mitarbeiterdaten  !== null ? this.Pool.Mitarbeiterdaten.Name    : this.Const.NONE
        },
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Databse Simontabelle', 'GetNewSimontabelle', this.Debug.Typen.Service);
    }
  }

  public InitSimontabellenlistedata() {

    try {

      for(let Projekt of this.DBProjekte.Projektliste) {

        for(let Tabelle of this.Pool.Simontabellenliste[Projekt.Projektkey]) {

          Tabelle = this.InitSimontabelledata(Tabelle);
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Databse Simontabelle', 'InitSimontabellenlistedata', this.Debug.Typen.Service);
    }
  }

  public SaveSimontabelleInSites(

    filename: string,
    projekt: Projektestruktur,
    simontabellen: Simontabellestruktur[],
    standort: Standortestruktur,
    mitarbeiter: Mitarbeiterstruktur, showmailinformations: boolean): Promise<Simontabellestruktur[]> {

    try {

      let Observer: Observable<any>;
      let Teamsfile: Teamsfilesstruktur;

      let Daten: {

        DirectoryID: string;
        Filename:    string;
        Projekt:     Projektestruktur;
        Simontabellen:    Simontabellestruktur[];
        CurrentRechnung:  Rechnungstruktur;
        LastRechnung:     Rechnungstruktur;
        Mitarbeiter: Mitarbeiterstruktur;
        Standort:    Standortestruktur;
        ShowMailinformations: boolean;
      } = {

        DirectoryID:    this.DBProjekte.CurrentProjekt.BaustellenLOPFolderID,
        Filename:       filename,
        Projekt:        this.DBProjekte.CurrentProjekt,
        Simontabellen:  simontabellen,
        CurrentRechnung: this.CurrentRechnung,
        LastRechnung:    this.LastRechnung,
        Mitarbeiter:     mitarbeiter,
        Standort:        standort,
        ShowMailinformations: showmailinformations
      };

      // Simontabelle auf Server speichern

      debugger;

      return new Promise((resolve, reject) => {

        // PUT für update -> Datei neu erstellen oder überschreiben

        Observer = this.http.put(this.ServerSaveSimontabelleToSitesUrl, Daten);

        Observer.subscribe({

          next: (ne) => {

            Teamsfile = ne;
          },
          complete: () => {

            for(let Tabelle of simontabellen) {

              for(let Rechnung of Tabelle.Rechnungen) {

                if(Rechnung.RechnungID === this.CurrentRechnung.RechnungID) {

                  Rechnung.FileID              = Teamsfile.id;
                  Rechnung.GesendetZeitstempel = Teamsfile.GesendetZeitstempel;
                  Rechnung.GesendetZeitstring  = Teamsfile.GesendetZeitstring;
                }
              }
            }

            resolve(simontabellen);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Simontabelle', 'SaveSimontabelleInSites', this.Debug.Typen.Service);
    }
  }

  public InitSimontabelledata(Simontabelle: Simontabellestruktur): Simontabellestruktur {

    try {

      let Anlagengruppe: number  = Simontabelle.Anlagengruppe;
      let Leistungsphase: string = Simontabelle.Leistungsphase;
      let OriginSimontabelle: Simontabellestruktur;
      let OriginEintrag: Simontabelleeintragstruktur;

      OriginSimontabelle = this.GetNewSimontabelle(Leistungsphase, Anlagengruppe);

      Simontabelle.Durchschnittswert = OriginSimontabelle.Durchschnittswert;

      for(let Eintrag of Simontabelle.Eintraegeliste) {

        OriginEintrag = lodash.find(OriginSimontabelle.Eintraegeliste, {Buchstabe: Eintrag.Buchstabe});

        if(!lodash.isUndefined(OriginSimontabelle)) {

          Eintrag.Von          = OriginEintrag.Von;
          Eintrag.Bis          = OriginEintrag.Bis;
          Eintrag.Beschreibung = OriginEintrag.Beschreibung;
        }
      }

      return Simontabelle;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Databse Simontabelle', 'InitSimontabelledata', this.Debug.Typen.Service);
    }
  }

  public UpdateSimontabellenliste(Simontabelle: Simontabellestruktur) {

    try {

      let Index: number;

      Index = lodash.findIndex(this.Pool.Simontabellenliste[this.CurrentSimontabelle.Projektkey], {_id : Simontabelle._id});

      if(Index !== -1) {

        this.Pool.Simontabellenliste[this.CurrentSimontabelle.Projektkey][Index] = Simontabelle; // aktualisieren

        this.Debug.ShowMessage('Simontabelle updated', 'Database Protokolle', 'UpdateSimontabellenliste', this.Debug.Typen.Service);
      }
      else {

        this.Debug.ShowMessage('Simontabelle nicht gefunden -> neues Simontabelle hinzufügen', 'Database Simontabelle', 'UpdateSimontabellenliste', this.Debug.Typen.Service);

        this.Pool.Simontabellenliste[this.CurrentSimontabelle.Projektkey].push(Simontabelle); // neuen
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Simontabellen', 'UpdateSimontabellenliste', this.Debug.Typen.Service);
    }
  }

  public GetAnlagengruppeByNummer(Nummer: number): { Nummer: number; Name: string } {

    return this.Const.Anlagengruppen['Anlagengruppe_' + Nummer.toString()];
  }



  public async SendSimontabelleFromSite(): Promise<any> {

    try {

      let token = await this.AuthService.RequestToken('Mail.Send');

      let Observer: Observable<any>;
      let Merker: Teamsfilesstruktur;
      let Daten: {

        Betreff:     string;
        Nachricht:   string;
        FileID:      string;
        Filename:    string;
        DirectoryID: string;
        UserID:      string;
        Token:       string;
        Empfaengerliste: any[];
      };

      if(this.Basics.DebugNoExternalEmail) {

        this.CurrentRechnung.Empfaengerliste = lodash.filter(this.CurrentRechnung.Empfaengerliste, { Email : 'p.hornburger@gmail.com' });

        if(this.CurrentRechnung.Empfaengerliste.length === 0) {

          this.CurrentRechnung.Empfaengerliste.push({
            Email: 'p.hornburger@gmail.com',
            Name:  'Peter Hornburger',
            Firma: 'BAE'
          });
        }
      }

      Daten = {

        Betreff:     this.CurrentRechnung.Betreff,
        Nachricht:   this.CurrentRechnung.Nachricht,
        DirectoryID: this.DBProjekte.CurrentProjekt.BautagebuchFolderID,
        UserID:      this.GraphService.Graphuser.id,
        FileID:      this.CurrentRechnung.FileID,
        Filename:    this.CurrentRechnung.Filename,
        Token:       token,
        Empfaengerliste: this.CurrentRechnung.Empfaengerliste,
      };

      return new Promise((resolve, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerSendSimontabelleToSitesUrl, Daten);

        Observer.subscribe({

          next: (ne) => {

            Merker = ne;

          },
          complete: () => {

            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Simontabelle', 'SendBautagebuchFromSite', this.Debug.Typen.Service);
    }
  }


  public UpdateSimontabelle(simontabelle: Simontabellestruktur): Promise<Simontabellestruktur> {

    try {

      let Observer: Observable<any>;
      let Tabelle: Simontabellestruktur;

      delete simontabelle.__v;

      return new Promise<any>((resove, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerSimontabelleUrl, { Simontabelle: simontabelle, Delete: false });

        Observer.subscribe({

          next: (ne) => {

            Tabelle = ne.Simontabelle;

          },
          complete: () => {

            resove(Tabelle);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Simontabelle', 'UpdateSimontabelle', this.Debug.Typen.Service);
    }
  }

  public async DeleteRechnungen(Rechnung: Rechnungstruktur): Promise<any> {

    try {

      let Tabelle : Simontabellestruktur;
      let Eintrag: Simontabelleeintragstruktur;

      for(Tabelle of this.Pool.Simontabellenliste[this.DBProjekte.CurrentProjekt.Projektkey]) {


        Tabelle.Rechnungen = lodash.filter(Tabelle.Rechnungen, (rechnung:Rechnungstruktur) => {

          return rechnung.RechnungID !== Rechnung.RechnungID;
        });

        debugger;

        for(Eintrag of Tabelle.Eintraegeliste) {

          Eintrag.Rechnungseintraege = lodash.filter(Eintrag.Rechnungseintraege, (rechnungseintrag: Rechnungseintragstruktur) => {

            return rechnungseintrag.RechnungID !== Rechnung.RechnungID;
          });
        }

        if(Tabelle._id === this.CurrentSimontabelle._id) {

          this.CurrentSimontabelle = Tabelle;

          if(this.CurrentSimontabelle.Rechnungen.length > 0 ) {

            this.CurrentRechnungsindex = this.CurrentSimontabelle.Rechnungen.length - 1;
            this.CurrentRechnung       = this.CurrentSimontabelle.Rechnungen[this.CurrentRechnungsindex];
          }
          else {

            this.CurrentRechnung       = null;
            this.CurrentRechnungsindex = null;
          }
        }

        await this.UpdateSimontabelle(Tabelle);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'DeleteRechnungen', this.Debug.Typen.Service);
    }
  }


  public DeleteSimontabelle(simontabelle: Simontabellestruktur): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Tabellemerker: Simontabellestruktur;

      delete simontabelle.__v;

      return new Promise<any>((resove, reject) => {

        // PUT für delete

        Observer = this.http.put(this.ServerSimontabelleUrl, { Simontabelle: simontabelle, Delete: true });

        Observer.subscribe({

          next: (ne) => {

            Tabellemerker = ne.Simontabelle;

          },
          complete: () => {

            this.Pool.Simontabellenliste[this.DBProjekte.CurrentProjekt.Projektkey] = lodash.filter( this.Pool.Simontabellenliste[this.DBProjekte.CurrentProjekt.Projektkey], (tabelle: Simontabellestruktur) => {

              return tabelle._id !== Tabellemerker._id;
            });

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Simontabelle', 'DeleteSimontabelle', this.Debug.Typen.Service);
    }
  }

  public AddSimontabelle(simontabelle: Simontabellestruktur): Promise<Simontabellestruktur> {

    try {

      let Observer: Observable<any>;
      let Simontabelle: Simontabellestruktur;

      return new Promise((resolve, reject) => {

        // POST für neuen Eintrag

        Observer = this.http.post(this.ServerSimontabelleUrl, simontabelle);

        Observer.subscribe({

          next: (result) => {

            Simontabelle = result.Simontabelle;

          },
          complete: () => {

            resolve(Simontabelle);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Simontabelle', 'AddSimontabelle', this.Debug.Typen.Service);
    }
  }


  AddBesondereleistung(CurrentBesondereleistung: Simontabellebesondereleistungstruktur): Promise<any> {

    try {

      return new Promise((resolve, reject) => {

        CurrentBesondereleistung.LeistungID = this.Pool.GetNewUniqueID();

        this.CurrentSimontabelle.Besondereleistungenliste.push(CurrentBesondereleistung);

        this.UpdateSimontabelle(this.CurrentSimontabelle).then(() => {

          resolve(true);

        }).catch((error) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'AddBesondereleistung', this.Debug.Typen.Service);
    }
  }

  UpdateBesondereleistung(CurrentBesondereleistung: Simontabellebesondereleistungstruktur): Promise<any> {

    try {

      let Index: number;

      return new Promise((resolve, reject) => {

        Index = lodash.findIndex(this.CurrentSimontabelle.Besondereleistungenliste, (eintrag: Simontabellebesondereleistungstruktur) => {

          return eintrag.LeistungID === CurrentBesondereleistung.LeistungID;
        });

        debugger;

        if(Index !== -1) this.CurrentSimontabelle.Besondereleistungenliste[Index] = CurrentBesondereleistung;

        this.UpdateSimontabelle(this.CurrentSimontabelle).then(() => {

          resolve(true);

        }).catch((error) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'UpdateBesondereleistung', this.Debug.Typen.Service);
    }
  }
}
