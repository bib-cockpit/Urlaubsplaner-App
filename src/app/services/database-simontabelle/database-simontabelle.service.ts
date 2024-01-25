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

@Injectable({
  providedIn: 'root'
})
export class DatabaseSimontabelleService {

  public CurrentSimontabelle: Simontabellestruktur;
  private ServerSimontabelleUrl: string;
  public readonly Steuersatz: number = 19;
  public CurrentBesondereleistung: Simontabellebesondereleistungstruktur;
  public CurrentRechnung: Rechnungstruktur;
  public CurrrentRechnungseintrag: Rechnungseintragstruktur;
  public CurrentRechnungsindex: number;

  constructor(private Debug: DebugProvider,
              private Const: ConstProvider,
              private http: HttpClient,
              private Pool: DatabasePoolService,
              private DBProjekte: DatabaseProjekteService) {
    try {

      this.CurrentSimontabelle      = null;
      this.CurrentBesondereleistung = null;
      this.CurrentRechnung          = null;
      this.CurrrentRechnungseintrag = null;
      this.CurrentRechnungsindex    = null;
      this.ServerSimontabelleUrl    = this.Pool.CockpitserverURL + '/simontabellen';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'constructor', this.Debug.Typen.Service);
    }
  }

  public async AddNewRechnung() {

    try {

      let Rechnung: Rechnungstruktur;
      let RechnungID: string;
      let Heute: Moment = moment();

      if(this.CurrentSimontabelle !== null) {

        RechnungID = this.Pool.GetNewUniqueID();

        Rechnung = {

          RechnungID: RechnungID,
          Zeitstempel: Heute.valueOf()
        };

        debugger;

        for(let Eintrag of this.CurrentSimontabelle.Eintraegeliste) {

          Eintrag.Rechnungseintraege.push({

            RechnungID: RechnungID,
            Honoraranteil: 0
          });
        }

        for(let Leistung of this.CurrentSimontabelle.Besondereleistungenliste) {

          Leistung.Rechnungseintraege.push({

            RechnungID: RechnungID,
            Honoraranteil: 0
          });
        }

        this.CurrentSimontabelle.Rechnungen.push(Rechnung);

        await this.UpdateSimontabelle(this.CurrentSimontabelle);

        this.CurrentRechnungsindex = this.CurrentSimontabelle.Rechnungen.length - 1;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Simontabelle', 'AddNewRechnung', this.Debug.Typen.Service);
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

      // Gelöscht markierte Einträge entfernen
      /*

      this.Pool.Simontabellenliste[this.CurrentSimontabelle.Projektkey] = lodash.filter(this.Pool.Simontabellenliste[this.CurrentSimontabelle.Projektkey], (simontabelle: Simontabellestruktur) => {

        return simontabelle.Deleted === false;
      });
       */

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Simontabellen', 'UpdateSimontabellenliste', this.Debug.Typen.Service);
    }
  }

  public GetAnlagengruppeByNummer(Nummer: number): { Nummer: number; Name: string } {

    return this.Const.Anlagengruppen['Anlagengruppe_' + Nummer.toString()];
  }

  public UpdateSimontabelle(simontabelle: Simontabellestruktur): Promise<Simontabellestruktur> {

    try {

      let Observer: Observable<any>;
      let Merker: Simontabellestruktur;

      delete simontabelle.__v;

      return new Promise<any>((resove, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerSimontabelleUrl, { Simontabelle: simontabelle, Delete: false });

        Observer.subscribe({

          next: (ne) => {

            Merker = ne.Simontabelle;

          },
          complete: () => {

            resove(Merker);

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

  public DeleteSimontabelle(simontabelle: Simontabellestruktur): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Merker: Simontabellestruktur;

      delete simontabelle.__v;

      return new Promise<any>((resove, reject) => {

        // PUT für delete

        Observer = this.http.put(this.ServerSimontabelleUrl, { Simontabelle: simontabelle, Delete: true });

        Observer.subscribe({

          next: (ne) => {

            Merker = ne.Simontabelle;

          },
          complete: () => {

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
