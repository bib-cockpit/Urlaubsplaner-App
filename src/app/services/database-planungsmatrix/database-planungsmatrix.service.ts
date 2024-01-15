 import {EventEmitter, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {ConstProvider} from "../const/const";
 import {Kostengruppenstruktur} from "../../dataclasses/kostengruppenstruktur";
 import {Aufgabenbereichestruktur} from "../../dataclasses/aufgabenbereichestruktur";
 import {Teilaufgabeestruktur} from "../../dataclasses/teilaufgabeestruktur";
 import {Projektestruktur} from "../../dataclasses/projektestruktur";

@Injectable({
  providedIn: 'root'
})
export class DatabasePlanungsmatrixService {

  public Kostengruppenliste: Kostengruppenstruktur[];
  public Aufgabenbereicheliste: Aufgabenbereichestruktur[];
  public Zielvorgabentextliste: string[][];
  public Berechnungentextliste: string[][];
  public Bemessungentextliste: string[][];
  public Schematatextliste: string[][];
  public Plaenetextliste: string[][];
  public Koordinationtextliste: string[][];
  public Bauangabentextliste: string[][];
  public Erlaeuterungtextliste: string[][];
  public Fortschreibungtextliste: string[][];
  public Kostentextliste: string[][];

  public DisplayKostengruppenChanged = new EventEmitter<any>();

  constructor(private Debug: DebugProvider,
              private Pool: DatabasePoolService,
              private Const: ConstProvider) {
    try {

      this.InitZielvorgabentextliste();
      this.InitAufgabenbereicheliste();
      this.InitBerechnungentextliste();
      this.InitBemessungentextliste();
      this.InitSchematatextliste();
      this.InitPlaenetextliste();
      this.InitKoordinationtextliste();
      this.InitBauangabentextliste();
      this.InitErlaeuterungtextliste();
      this.InitKostentextliste();
      this.InitFortschreibungtextliste();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Planungsmatrix', 'constructor', this.Debug.Typen.Service);
    }
  }

  private InitFortschreibungtextliste() {

    try {

      let Text: string;

      this.Fortschreibungtextliste    = [];
      this.Fortschreibungtextliste[1] = [];
      this.Fortschreibungtextliste[2] = [];
      this.Fortschreibungtextliste[3] = [];
      this.Fortschreibungtextliste[4] = [];

      Text = `Sollte das Ergebnis der Ausschreibung Konstruktionsänderungen erforderlich machen,
so ist die Ausführungsplanung auf diese Ergebnisse hin fortzuschreiben.`;

      this.Fortschreibungtextliste[5] = [];
      this.Fortschreibungtextliste[5][410] = Text;
      this.Fortschreibungtextliste[5][475] = Text;
      this.Fortschreibungtextliste[5][420] = Text;
      this.Fortschreibungtextliste[5][430] = Text;
      this.Fortschreibungtextliste[5][434] = Text;
      this.Fortschreibungtextliste[5][440] = Text;
      this.Fortschreibungtextliste[5][450] = Text;
      this.Fortschreibungtextliste[5][460] = Text;
      this.Fortschreibungtextliste[5][480] = Text;

      this.Fortschreibungtextliste[6] = [];
      this.Fortschreibungtextliste[7] = [];
      this.Fortschreibungtextliste[8] = [];



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Planungsmatrix', 'constructor', this.Debug.Typen.Service);
    }
  }

  private InitKoordinationtextliste() {

    try {

      let Text: string;

      this.Koordinationtextliste = [];
      this.Koordinationtextliste[1] = [];

      Text = `Abstimmung des technischen Gesamtkonzepts für eine passende technische und wirtschaftliche Gesamtlösung unter Beachtung der Zielvorgaben
                  Abstimmen des Raumbedarfs aller Gewerke (z.B. VDI 2050) und Mitwirkung bei der Koordinierung zu einem Ganzen`;

      this.Koordinationtextliste[2]   = [];
      this.Koordinationtextliste[2][410] = Text;
      this.Koordinationtextliste[2][475] = Text;
      this.Koordinationtextliste[2][420] = Text;
      this.Koordinationtextliste[2][430] = Text;
      this.Koordinationtextliste[2][434] = Text;
      this.Koordinationtextliste[2][440] = Text;
      this.Koordinationtextliste[2][450] = Text;
      this.Koordinationtextliste[2][460] = Text;
      this.Koordinationtextliste[2][480] = Text;

      Text = `gemeinsame Schnittstellendefinition zwischen den Gewerken der KG 400,
nutzer- bzw. bauherrenseitigen oder bauseitigen Leistungen (Listen)
Die Koordination erstreckt sich in dieser Phase bereits auf die Ausführbarkeit der Planung.
Dazu sind eventuell Schnitte und Schachtausfädelungen erforderlich.`;

      this.Koordinationtextliste[3]   = [];
      this.Koordinationtextliste[3][410] = Text;
      this.Koordinationtextliste[3][475] = Text;
      this.Koordinationtextliste[3][420] = Text;
      this.Koordinationtextliste[3][430] = Text;
      this.Koordinationtextliste[3][434] = Text;
      this.Koordinationtextliste[3][440] = Text;
      this.Koordinationtextliste[3][450] = Text;
      this.Koordinationtextliste[3][460] = Text;
      this.Koordinationtextliste[3][480] = Text;

      this.Koordinationtextliste[4] = [];
      this.Koordinationtextliste[5] = [];
      this.Koordinationtextliste[6] = [];
      this.Koordinationtextliste[7] = [];
      this.Koordinationtextliste[8] = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'InitKoordinationtextliste', this.Debug.Typen.Service);
    }
  }
  private InitErlaeuterungtextliste() {

    try {

      let Text: string;

      this.Erlaeuterungtextliste = [];
      this.Erlaeuterungtextliste[1] = [];

      Text = `Fazit aus der Grundlagenermittlung bzw. Stellungsnahme, falls diese durch Dritte erstellt wurde. Der Erläuterungsbericht enthält alle
      Angaben, Anlagenbeschreibungen und Daten zur Darstellung der Planung sowie der Variantenbetrachtungen, inklusive eines Vorschlags zum technischen
      Gesamtkonzept oder einer Empfehlung.`;

      this.Erlaeuterungtextliste[2]   = [];
      this.Erlaeuterungtextliste[2][410] = Text;
      this.Erlaeuterungtextliste[2][475] = Text;
      this.Erlaeuterungtextliste[2][420] = Text;
      this.Erlaeuterungtextliste[2][430] = Text;
      this.Erlaeuterungtextliste[2][434] = Text;
      this.Erlaeuterungtextliste[2][440] = Text;
      this.Erlaeuterungtextliste[2][450] = Text;
      this.Erlaeuterungtextliste[2][460] = Text;
      this.Erlaeuterungtextliste[2][480] = Text;

      Text = `Fazit aus der Vorplanung bzw. Stellungnahme, falls diese durch Dritte erstellt wurde.
Der Erläuterungsbericht enthält alle Angaben, Beschreibungen, Daten und
Zusammenstellungen, um die Planung nachvollziehen und beurteilen zu können.`;

      this.Erlaeuterungtextliste[3]      = [];
      this.Erlaeuterungtextliste[3][410] = Text;
      this.Erlaeuterungtextliste[3][475] = Text;
      this.Erlaeuterungtextliste[3][420] = Text;
      this.Erlaeuterungtextliste[3][430] = Text;
      this.Erlaeuterungtextliste[3][434] = Text;
      this.Erlaeuterungtextliste[3][440] = Text;
      this.Erlaeuterungtextliste[3][450] = Text;
      this.Erlaeuterungtextliste[3][460] = Text;
      this.Erlaeuterungtextliste[3][480] = Text;

      Text = `Der Erläuterungsbericht enthält alle Angaben, Beschreibungen, Daten und Zusammenstellungen,
um die Planung nachvollziehen, beurteilen und genehmigen zu können.`;

      this.Erlaeuterungtextliste[4]      = [];
      this.Erlaeuterungtextliste[4][410] = Text;
      this.Erlaeuterungtextliste[4][475] = Text;
      this.Erlaeuterungtextliste[4][420] = Text;
      this.Erlaeuterungtextliste[4][430] = Text;
      this.Erlaeuterungtextliste[4][434] = Text;
      this.Erlaeuterungtextliste[4][440] = Text;
      this.Erlaeuterungtextliste[4][450] = Text;
      this.Erlaeuterungtextliste[4][460] = Text;
      this.Erlaeuterungtextliste[4][480] = Text;

      Text = `Beschreibung der funktionalen Wirkungsweise der einzelnen Anlagen
mit Angaben aller notwendigen Kenn-, Betrieb- und Auslegungsdaten`;

      this.Erlaeuterungtextliste[5]      = [];
      this.Erlaeuterungtextliste[5][410] = Text;
      this.Erlaeuterungtextliste[5][475] = Text;
      this.Erlaeuterungtextliste[5][420] = Text;
      this.Erlaeuterungtextliste[5][430] = Text;
      this.Erlaeuterungtextliste[5][434] = Text;
      this.Erlaeuterungtextliste[5][440] = Text;
      this.Erlaeuterungtextliste[5][450] = Text;
      this.Erlaeuterungtextliste[5][460] = Text;
      this.Erlaeuterungtextliste[5][480] = Text;

      this.Erlaeuterungtextliste[6] = [];
      this.Erlaeuterungtextliste[7] = [];
      this.Erlaeuterungtextliste[8] = [];
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'InitErlaeuterungtextliste', this.Debug.Typen.Service);
    }
  }
  private InitKostentextliste() {

    try {

      let Text: string;

      this.Kostentextliste = [];
      this.Kostentextliste[1] = [];

      Text = `Anlagenspezifisch getrennt nach Zonen, Bauteilen oder Funktionsbereichen nach Vorgaben des AG bzw. des Architekten bis zur 2.
      Stufe der DIN 276`;

      this.Kostentextliste[2]      = [];
      this.Kostentextliste[2][410] = Text;
      this.Kostentextliste[2][475] = Text;
      this.Kostentextliste[2][420] = Text;
      this.Kostentextliste[2][430] = Text;
      this.Kostentextliste[2][434] = Text;
      this.Kostentextliste[2][440] = Text;
      this.Kostentextliste[2][450] = Text;
      this.Kostentextliste[2][460] = Text;
      this.Kostentextliste[2][480] = Text;

      Text = `Grundlage: Berechnung der Mengen von Bezugseinheiten der Kostengruppe und Multiplikation mit Kostenansatz bis zur 2. Stufe der DIN 276`;

      this.Kostentextliste[3]      = [];
      this.Kostentextliste[3][410] = Text;
      this.Kostentextliste[3][475] = Text;
      this.Kostentextliste[3][420] = Text;
      this.Kostentextliste[3][430] = Text;
      this.Kostentextliste[3][434] = Text;
      this.Kostentextliste[3][440] = Text;
      this.Kostentextliste[3][450] = Text;
      this.Kostentextliste[3][460] = Text;
      this.Kostentextliste[3][480] = Text;

      this.Kostentextliste[4] = [];
      this.Kostentextliste[5] = [];
      this.Kostentextliste[6] = [];
      this.Kostentextliste[7] = [];
      this.Kostentextliste[8] = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'InitKostentextliste', this.Debug.Typen.Service);
    }
  }

  private InitBemessungentextliste() {

    try {

      let Text: string;

      this.Bemessungentextliste = [];
      this.Bemessungentextliste[1] = [];

      Text = `Grobbemessung`;

      this.Bemessungentextliste[2]   = [];
      this.Bemessungentextliste[2][410] = Text;
      this.Bemessungentextliste[2][475] = Text;
      this.Bemessungentextliste[2][420] = Text;
      this.Bemessungentextliste[2][430] = Text;
      this.Bemessungentextliste[2][434] = Text;
      this.Bemessungentextliste[2][440] = Text;
      this.Bemessungentextliste[2][450] = Text;
      this.Bemessungentextliste[2][460] = Text;
      this.Bemessungentextliste[2][480] = Text;

      Text = `Die Bemessung erfolgt auf der Grundlage der vorliegenden Berechnungen.
Die Bemessung hat so zu erfolgen, dass grundsätzliche Änderungen in der
Ausführungsplanung bei unveränderten Planungsgrundlagen vermieden werden.\nAlle für das Brandschutzkonzept
      notwendigen Dimensionierungen.`;

      this.Bemessungentextliste[3]   = [];
      this.Bemessungentextliste[3][410] = Text;
      this.Bemessungentextliste[3][475] = Text;
      this.Bemessungentextliste[3][420] = Text;
      this.Bemessungentextliste[3][430] = Text;
      this.Bemessungentextliste[3][434] = Text;
      this.Bemessungentextliste[3][440] = Text;
      this.Bemessungentextliste[3][450] = Text;
      this.Bemessungentextliste[3][460] = Text;
      this.Bemessungentextliste[3][480] = Text;

      Text = `Die Bemessung erfolgt auf der Grundlage der vorliegenden Berechnungen des Entwurfs;
hierbei sind alle für das Brandschutzkonzept notwendigen Bemessungen zu berücksichtigen.`;

      this.Bemessungentextliste[4]   = [];
      this.Bemessungentextliste[4][410] = Text;
      this.Bemessungentextliste[4][475] = Text;
      this.Bemessungentextliste[4][420] = Text;
      this.Bemessungentextliste[4][430] = Text;
      this.Bemessungentextliste[4][434] = Text;
      this.Bemessungentextliste[4][440] = Text;
      this.Bemessungentextliste[4][450] = Text;
      this.Bemessungentextliste[4][460] = Text;
      this.Bemessungentextliste[4][480] = Text;

      Text = `Die Bemessung erfolgt auf der Grundlage der abschließenden Berechnungen.`;

      this.Bemessungentextliste[5]   = [];
      this.Bemessungentextliste[5][410] = Text;
      this.Bemessungentextliste[5][475] = Text;
      this.Bemessungentextliste[5][420] = Text;
      this.Bemessungentextliste[5][430] = Text;
      this.Bemessungentextliste[5][434] = Text;
      this.Bemessungentextliste[5][440] = Text;
      this.Bemessungentextliste[5][450] = Text;
      this.Bemessungentextliste[5][460] = Text;
      this.Bemessungentextliste[5][480] = Text;

      this.Bemessungentextliste[6] = [];
      this.Bemessungentextliste[7] = [];
      this.Bemessungentextliste[8] = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'InitBemessungentextliste', this.Debug.Typen.Service);
    }
  }

  private InitPlaenetextliste() {

    try {

      let Text: string;

      this.Plaenetextliste = [];
      this.Plaenetextliste[1] = [];

      Text = `Einstrichdarstellung`;

      this.Plaenetextliste[2]   = [];
      this.Plaenetextliste[2][410] = Text;
      this.Plaenetextliste[2][475] = Text;
      this.Plaenetextliste[2][420] = Text;
      this.Plaenetextliste[2][430] = Text;
      this.Plaenetextliste[2][434] = Text;
      this.Plaenetextliste[2][440] = Text;
      this.Plaenetextliste[2][450] = Text;
      this.Plaenetextliste[2][460] = 'Schacht und Kabinenabmessungen';
      this.Plaenetextliste[2][480] = '';

      Text = `Darstellung aller Ver- und Entsorgungsnetze mit den wesentlichen Funktionsgruppen und Funktionselementen`;

      this.Plaenetextliste[3]   = [];
      this.Plaenetextliste[3][410] = Text;
      this.Plaenetextliste[3][475] = Text;
      this.Plaenetextliste[3][420] = Text;
      this.Plaenetextliste[3][430] = Text;
      this.Plaenetextliste[3][434] = Text;
      this.Plaenetextliste[3][440] = Text;
      this.Plaenetextliste[3][450] = Text;
      this.Plaenetextliste[3][460] = Text;
      this.Plaenetextliste[3][480] = Text;

      Text = `Darstellung aller Ver- und Entsorgungsnetze mit den wesentlichen Funktionsgruppen und
Funktionselementen sowie alle für das Brandschutzkonzept notwendigen Einbauteile`;

      this.Plaenetextliste[4]   = [];
      this.Plaenetextliste[4][410] = Text;
      this.Plaenetextliste[4][475] = Text;
      this.Plaenetextliste[4][420] = Text;
      this.Plaenetextliste[4][430] = Text;
      this.Plaenetextliste[4][434] = Text;
      this.Plaenetextliste[4][440] = Text;
      this.Plaenetextliste[4][450] = Text;
      this.Plaenetextliste[4][460] = Text;
      this.Plaenetextliste[4][480] = Text;

      Text = `Ausführungsreife Darstellung inklusive der Koordination mit Dimensionen und Komponenten;
wenn sinnvoll, in Mehrstrichdarstellung
Es sind sämtliche Komponenten darzustellen,
die zur ordnungsgemäßen Funktion der Anlage erforderlich sind.
Platzvorhaltungen, Flächen zur Bedienung und Instandhaltung sowie Einbringungswege
sind darzustellen, z.B. gemäß VDI 2050.
Vollständige Bemaßung (inkl. Höhenangaben) von Trassen (Kanäle, Rohrleitungen, Elektro),
Apparaten, Komponenten (z.B. Kessel, RLT-Geräte, Behälter, Schaltschränke, Verteiler etc.)
mit genauen Bezugsmaßen zum Bauwerk und anderen Gewerken ist einzutragen.
Art und Umfang der erforderlichen Dämmung und des Brandschutzes sind anzugeben.`;

      this.Plaenetextliste[5]   = [];
      this.Plaenetextliste[5][410] = Text;
      this.Plaenetextliste[5][475] = Text;
      this.Plaenetextliste[5][420] = Text;
      this.Plaenetextliste[5][430] = Text;
      this.Plaenetextliste[5][434] = Text;
      this.Plaenetextliste[5][440] = Text;
      this.Plaenetextliste[5][450] = Text;
      this.Plaenetextliste[5][460] = Text;
      this.Plaenetextliste[5][480] = Text;

      this.Plaenetextliste[6] = [];
      this.Plaenetextliste[7] = [];
      this.Plaenetextliste[8] = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'InitPlaenetextliste', this.Debug.Typen.Service);
    }
  }

  private InitBerechnungentextliste() {

    try {

      let Text: string;

      this.Berechnungentextliste = [];

      Text = `überschlägig`;

      this.Berechnungentextliste[1]      = [];
      this.Berechnungentextliste[1][410] = Text;
      this.Berechnungentextliste[1][475] = Text;
      this.Berechnungentextliste[1][420] = Text;
      this.Berechnungentextliste[1][430] = Text;
      this.Berechnungentextliste[1][434] = Text;
      this.Berechnungentextliste[1][440] = Text;
      this.Berechnungentextliste[1][450] = Text;
      this.Berechnungentextliste[1][460] = Text;
      this.Berechnungentextliste[1][480] = Text;

      Text = `überschlägig`;

      this.Berechnungentextliste[2]      = [];
      this.Berechnungentextliste[2][410] = Text;
      this.Berechnungentextliste[2][475] = Text;
      this.Berechnungentextliste[2][420] = Text;
      this.Berechnungentextliste[2][430] = Text;
      this.Berechnungentextliste[2][434] = Text;
      this.Berechnungentextliste[2][440] = Text;
      this.Berechnungentextliste[2][450] = Text;
      this.Berechnungentextliste[2][460] = Text;
      this.Berechnungentextliste[2][480] = '';

      Text = `Es dürfen aus der Tiefe der Berechnungen später keine grundsätzlichen Änderungen mehr resultieren.\nAlle für das Brandschutzkonzept
      notwendigen Berechnungen.`;

      this.Berechnungentextliste[3]      = [];
      this.Berechnungentextliste[3][410] = Text;
      this.Berechnungentextliste[3][475] = Text;
      this.Berechnungentextliste[3][420] = Text;
      this.Berechnungentextliste[3][430] = Text;
      this.Berechnungentextliste[3][434] = Text;
      this.Berechnungentextliste[3][440] = Text;
      this.Berechnungentextliste[3][450] = Text;
      this.Berechnungentextliste[3][460] = Text;
      this.Berechnungentextliste[3][480] = '';

      Text = `Die Festlegungen der Entwurfsplanung sind berücksichtigt, in die Genehmigungspläne überführt
und beinhalten die Dimensionierung der Zentralen, Versorgungsanschlüsse und Trassen.
Umfang der beizufügenden Berechnungen ist mit der genehmigenden Stelle abzustimmen.`;

      this.Berechnungentextliste[4]      = [];
      this.Berechnungentextliste[4][410] = Text;
      this.Berechnungentextliste[4][475] = Text;
      this.Berechnungentextliste[4][420] = Text;
      this.Berechnungentextliste[4][430] = Text;
      this.Berechnungentextliste[4][434] = Text;
      this.Berechnungentextliste[4][440] = Text;
      this.Berechnungentextliste[4][450] = Text;
      this.Berechnungentextliste[4][460] = Text;
      this.Berechnungentextliste[4][480] = '';


      Text = `Die in der Entwurfsplanung erstellten Berechnungen sind in der Ausführungsplanung
zu überprüfen und fortzuschreiben und gegebenenfalls sind auch Simulationen zu erstellen.
Grundlegende Veränderungen und Abweichungen zur Entwurfsplanung
sind zu dokumentieren und zu begründen.
Vollständige Berechnung aller Anlagen/-teile unter Berücksichtigung aller Schnittstellen
zum Schallschutz, Brandschutz, Wärmeschutz
Angaben zum Schallschutz, Wärmeschutz, Brandschutz`;

      this.Berechnungentextliste[5]      = [];
      this.Berechnungentextliste[5][410] = Text;
      this.Berechnungentextliste[5][475] = Text;
      this.Berechnungentextliste[5][420] = Text;
      this.Berechnungentextliste[5][430] = Text;
      this.Berechnungentextliste[5][434] = Text;
      this.Berechnungentextliste[5][440] = Text;
      this.Berechnungentextliste[5][450] = Text;
      this.Berechnungentextliste[5][460] = Text;
      this.Berechnungentextliste[5][480] = '';

      this.Berechnungentextliste[6] = [];
      this.Berechnungentextliste[7] = [];
      this.Berechnungentextliste[8] = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'InitBerechnungentextliste', this.Debug.Typen.Service);
    }
  }

  private InitBauangabentextliste() {

    try {

      let Text: string;

      this.Bauangabentextliste = [];

      this.Bauangabentextliste[1]      = [];
      this.Bauangabentextliste[2]      = [];

      Text = `statisch relevante Durchbruchsgrößen und Lasten`;

      this.Bauangabentextliste[3]      = [];
      this.Bauangabentextliste[3][410] = Text;
      this.Bauangabentextliste[3][475] = Text;
      this.Bauangabentextliste[3][420] = Text;
      this.Bauangabentextliste[3][430] = Text;
      this.Bauangabentextliste[3][434] = Text;
      this.Bauangabentextliste[3][440] = Text;
      this.Bauangabentextliste[3][450] = Text;
      this.Bauangabentextliste[3][460] = Text;
      this.Bauangabentextliste[3][480] = Text;

      this.Bauangabentextliste[4] = [];

      Text = `Sollte das Ergebnis der Ausschreibung Konstruktionsänderungen erforderlich machen,
so ist die Ausführungsplanung auf diese Ergebnisse hin fortzuschreiben.`;

      this.Bauangabentextliste[5]      = [];
      this.Bauangabentextliste[5][410] = Text;
      this.Bauangabentextliste[5][475] = Text;
      this.Bauangabentextliste[5][420] = Text;
      this.Bauangabentextliste[5][430] = Text;
      this.Bauangabentextliste[5][434] = Text;
      this.Bauangabentextliste[5][440] = Text;
      this.Bauangabentextliste[5][450] = Text;
      this.Bauangabentextliste[5][460] = Text;
      this.Bauangabentextliste[5][480] = Text;

      this.Bauangabentextliste[6] = [];
      this.Bauangabentextliste[7] = [];
      this.Bauangabentextliste[8] = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'InitBauangabentextliste', this.Debug.Typen.Service);
    }
  }

  private InitZielvorgabentextliste() {

    try {

      let Text: string;


      this.Zielvorgabentextliste = [];


      Text = `eventuell Ermittlung und Abstimmung der Nutzervorgaben unter Berücksichtigung
        der anerkannten Regeln der Technik, unter Hinzuziehung von Spezialisten z.B. Brandschutzsachverständiger
        Kontaktaufnahme mit Versorgern zur Ermittlung der Versorgungsmöglichkeiten`;

      this.Zielvorgabentextliste[1]      = [];
      this.Zielvorgabentextliste[1][410] = Text;
      this.Zielvorgabentextliste[1][475] = Text;
      this.Zielvorgabentextliste[1][420] = Text;
      this.Zielvorgabentextliste[1][430] = Text;
      this.Zielvorgabentextliste[1][434] = Text;
      this.Zielvorgabentextliste[1][440] = Text;
      this.Zielvorgabentextliste[1][450] = Text;
      this.Zielvorgabentextliste[1][460] = Text;
      this.Zielvorgabentextliste[1][480] = Text;

      Text = `Darstellung der Nutzervorgaben, Annahmen bzw. Vorgaben aus den anerkannten Regeln der Technik`;

      this.Zielvorgabentextliste[2]      = [];
      this.Zielvorgabentextliste[2][410] = Text;
      this.Zielvorgabentextliste[2][475] = Text;
      this.Zielvorgabentextliste[2][420] = Text;
      this.Zielvorgabentextliste[2][430] = Text;
      this.Zielvorgabentextliste[2][434] = Text;
      this.Zielvorgabentextliste[2][440] = Text;
      this.Zielvorgabentextliste[2][450] = Text;
      this.Zielvorgabentextliste[2][460] = Text;
      this.Zielvorgabentextliste[2][480] = Text;

      Text = `Darstellung der Nutzervorgaben, Berechnungen bzw. Vorgaben aus den anerkannten Regeln der Technik = Grundlagen\n
Die Entwurfsplanung ist durch den Auftraggeber auf Übereinstimmung mit seinen funktionalen
Planungsvorgaben zu prüfen, zu genehmigen und die Planungsleistung abzunehmen.`;

      this.Zielvorgabentextliste[3]      = [];
      this.Zielvorgabentextliste[3][410] = Text;
      this.Zielvorgabentextliste[3][475] = Text;
      this.Zielvorgabentextliste[3][420] = Text;
      this.Zielvorgabentextliste[3][430] = Text;
      this.Zielvorgabentextliste[3][434] = Text;
      this.Zielvorgabentextliste[3][440] = Text;
      this.Zielvorgabentextliste[3][450] = Text;
      this.Zielvorgabentextliste[3][460] = Text;
      this.Zielvorgabentextliste[3][480] = Text;

      Text = `Darstellung der im Entwurf abgestimmten Nutzervorgaben zur Vorlage bei den
Genehmigungsstellen; Darstellung, Berechnungen etc. nach den Vorgaben der
Genehmigungsstellen (in der Regel Wasserbehörden, Baubehörden, Feuerwehr etc.)
sowie anderer Stellen (EVU, VdS etc.)
Die Genehmigungsplanung wird durch die Genehmigungsstelle geprüft und genehmigt.`;

      this.Zielvorgabentextliste[4]      = [];
      this.Zielvorgabentextliste[4][410] = Text;
      this.Zielvorgabentextliste[4][475] = Text;
      this.Zielvorgabentextliste[4][420] = Text;
      this.Zielvorgabentextliste[4][430] = Text;
      this.Zielvorgabentextliste[4][434] = Text;
      this.Zielvorgabentextliste[4][440] = Text;
      this.Zielvorgabentextliste[4][450] = Text;
      this.Zielvorgabentextliste[4][460] = Text;
      this.Zielvorgabentextliste[4][480] = Text;

      Text = `Eine ausführungsreife Planungslösung,
in der die funktionalen Vorgaben des AG (Bausoll) umgesetzt wurden.
Diese ist mit allen Gewerken koordiniert, technisch und terminlich ausführbar.`;

      this.Zielvorgabentextliste[5]      = [];
      this.Zielvorgabentextliste[5][410] = Text;
      this.Zielvorgabentextliste[5][475] = Text;
      this.Zielvorgabentextliste[5][420] = Text;
      this.Zielvorgabentextliste[5][430] = Text;
      this.Zielvorgabentextliste[5][434] = Text;
      this.Zielvorgabentextliste[5][440] = Text;
      this.Zielvorgabentextliste[5][450] = Text;
      this.Zielvorgabentextliste[5][460] = Text;
      this.Zielvorgabentextliste[5][480] = Text;

      this.Zielvorgabentextliste[6] = [];
      this.Zielvorgabentextliste[7] = [];
      this.Zielvorgabentextliste[8] = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'InitZielvorgabentextliste', this.Debug.Typen.Service);
    }
  }


  public SetuoKostengruppendisplay(projekt: Projektestruktur) {

    try {

      this.Kostengruppenliste = [];

      this.Kostengruppenliste.push({Typ: this.Const.NONE, Kostengruppennummer: 410, Obergruppennummer: 0, Hauptgruppennummer: 0,
        Bezeichnung: 'Abwasser-, Wasser-, Gasanlagen/Feuerlöschanlagen', Display: projekt.DisplayKG410
      });
      this.Kostengruppenliste.push({Typ: this.Const.NONE, Kostengruppennummer: 420, Obergruppennummer: 0, Hauptgruppennummer: 0,
        Bezeichnung: 'Wärmeversorgungsanlagen',  Display: projekt.DisplayKG420
      });
      this.Kostengruppenliste.push({Typ: this.Const.NONE, Kostengruppennummer: 430, Obergruppennummer: 0, Hauptgruppennummer: 0,
        Bezeichnung: 'Raumlufttechnische Anlagen',  Display: projekt.DisplayKG430
      });
      this.Kostengruppenliste.push({Typ: this.Const.NONE, Kostengruppennummer: 434, Obergruppennummer: 0, Hauptgruppennummer: 0,
        Bezeichnung: 'Kälteanlagen für RLT-Anlagen',  Display: projekt.DisplayKG434
      });
      this.Kostengruppenliste.push({Typ: this.Const.NONE, Kostengruppennummer: 440, Obergruppennummer: 0, Hauptgruppennummer: 0,
        Bezeichnung: 'Starkstromanlagen',  Display: projekt.DisplayKG440
      });
      this.Kostengruppenliste.push({Typ: this.Const.NONE, Kostengruppennummer: 450, Obergruppennummer: 0, Hauptgruppennummer: 0,
        Bezeichnung: 'Fernmelde- und informationstechnische Anlagen', Display: projekt.DisplayKG450
      });
      this.Kostengruppenliste.push({Typ: this.Const.NONE, Kostengruppennummer: 460, Obergruppennummer: 0, Hauptgruppennummer: 0,
        Bezeichnung: 'Förderanlagen', Display: projekt.DisplayKG460
      });
      this.Kostengruppenliste.push({Typ: this.Const.NONE, Kostengruppennummer: 475, Obergruppennummer: 0, Hauptgruppennummer: 0,
        Bezeichnung: 'Prozesswärme-, kälte- und -luftanlagen', Display: projekt.DisplayKG475
      });
      this.Kostengruppenliste.push({Typ: this.Const.NONE, Kostengruppennummer: 480, Obergruppennummer: 0, Hauptgruppennummer: 0,
        Bezeichnung: 'Gebäudeautomation',  Display: projekt.DisplayKG480
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'SetuoKostengruppendisplay', this.Debug.Typen.Service);
    }
  }

  private InitAufgabenbereicheliste() {

    try {

      let Text: string;
      let Zielvorgabenteilaufgaben:      Teilaufgabeestruktur[][][];
      let Berechnungenteilaufgaben:      Teilaufgabeestruktur[][][];
      let Bemessungenteilaufgaben:       Teilaufgabeestruktur[][][];
      let Schematateilaufgabenliste:     Teilaufgabeestruktur[][][];
      let Plaeneteilaufgabenliste:       Teilaufgabeestruktur[][][];
      let Bauangabenteilaufgabenliste:   Teilaufgabeestruktur[][][];
      let Koordinationteilaufgabenliste: Teilaufgabeestruktur[][][];
      let Erlaeuterungteilaufgabenliste: Teilaufgabeestruktur[][][];
      let Kostenteilaufgabenliste:       Teilaufgabeestruktur[][][];
      let Fortschreibungteilaufgabenliste:  Teilaufgabeestruktur[][][];

      this.Aufgabenbereicheliste  = [];
      Zielvorgabenteilaufgaben    = [];
      Zielvorgabenteilaufgaben[1] = [];
      Zielvorgabenteilaufgaben[2] = [];
      Zielvorgabenteilaufgaben[3] = [];
      Zielvorgabenteilaufgaben[4] = [];
      Zielvorgabenteilaufgaben[5] = [];
      Zielvorgabenteilaufgaben[6] = [];
      Zielvorgabenteilaufgaben[7] = [];
      Zielvorgabenteilaufgaben[8] = [];

      Text = 'Kontaktaufnahme mit Versorgungsunternehmen';

      Zielvorgabenteilaufgaben[1][0]      = [];
      Zielvorgabenteilaufgaben[1][0][0]   = { AufgabenbereichID: "ziel", Beschreibung: "",   Bezeichnung: "Kontaktaufnahme", id: "ziel_kontakt" };
      Zielvorgabenteilaufgaben[1][0][410] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_kontakt" };
      Zielvorgabenteilaufgaben[1][0][475] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_kontakt" };
      Zielvorgabenteilaufgaben[1][0][420] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_kontakt" };
      Zielvorgabenteilaufgaben[1][0][430] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_kontakt" };
      Zielvorgabenteilaufgaben[1][0][434] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_kontakt" };
      Zielvorgabenteilaufgaben[1][0][440] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_kontakt" };
      Zielvorgabenteilaufgaben[1][0][450] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_kontakt" };
      Zielvorgabenteilaufgaben[1][0][460] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_kontakt" };
      Zielvorgabenteilaufgaben[1][0][480] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_kontakt" };


      Text = 'Prüfung und Abnahme der Planungsleistung';

      Zielvorgabenteilaufgaben[3][0]      = [];
      Zielvorgabenteilaufgaben[3][0][0]   = { AufgabenbereichID: "ziel", Beschreibung: "",   Bezeichnung: "Abnahme",     id: "ziel_abnahme" };
      Zielvorgabenteilaufgaben[3][0][410] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_abnahme" };
      Zielvorgabenteilaufgaben[3][0][475] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_abnahme" };
      Zielvorgabenteilaufgaben[3][0][420] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_abnahme" };
      Zielvorgabenteilaufgaben[3][0][430] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_abnahme" };
      Zielvorgabenteilaufgaben[3][0][434] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_abnahme" };
      Zielvorgabenteilaufgaben[3][0][440] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_abnahme" };
      Zielvorgabenteilaufgaben[3][0][450] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_abnahme" };
      Zielvorgabenteilaufgaben[3][0][460] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_abnahme" };
      Zielvorgabenteilaufgaben[3][0][480] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_abnahme" };

      Text = 'Geprüfte Genehmigungsplanung';

      Zielvorgabenteilaufgaben[4][0]      = [];
      Zielvorgabenteilaufgaben[4][0][0]   = { AufgabenbereichID: "ziel", Beschreibung: "",   Bezeichnung: "Prüfung",     id: "ziel_pruefung" };
      Zielvorgabenteilaufgaben[4][0][410] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_pruefung" };
      Zielvorgabenteilaufgaben[4][0][475] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_pruefung" };
      Zielvorgabenteilaufgaben[4][0][420] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_pruefung" };
      Zielvorgabenteilaufgaben[4][0][430] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_pruefung" };
      Zielvorgabenteilaufgaben[4][0][434] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_pruefung" };
      Zielvorgabenteilaufgaben[4][0][440] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_pruefung" };
      Zielvorgabenteilaufgaben[4][0][450] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_pruefung" };
      Zielvorgabenteilaufgaben[4][0][460] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_pruefung" };
      Zielvorgabenteilaufgaben[4][0][480] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_pruefung" };

      Text = 'Umsetzen der von der Behörde genehmigten und dem Auftraggeber freigegebenen Planungsunterlagen.';

      Zielvorgabenteilaufgaben[5][0]      = [];
      Zielvorgabenteilaufgaben[5][0][0]   = { AufgabenbereichID: "ziel", Beschreibung: "",   Bezeichnung: "Allgemein",   id: "ziel_umsetzung" };
      Zielvorgabenteilaufgaben[5][0][410] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_umsetzung" };
      Zielvorgabenteilaufgaben[5][0][475] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_umsetzung" };
      Zielvorgabenteilaufgaben[5][0][420] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_umsetzung" };
      Zielvorgabenteilaufgaben[5][0][430] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_umsetzung" };
      Zielvorgabenteilaufgaben[5][0][434] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_umsetzung" };
      Zielvorgabenteilaufgaben[5][0][440] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_umsetzung" };
      Zielvorgabenteilaufgaben[5][0][450] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_umsetzung" };
      Zielvorgabenteilaufgaben[5][0][460] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_umsetzung" };
      Zielvorgabenteilaufgaben[5][0][480] = { AufgabenbereichID: "ziel", Beschreibung: Text, Bezeichnung: "",            id: "ziel_umsetzung" };

      this.Aufgabenbereicheliste.push({
        id:              'ziel',
        Bezeichnung:     "Zielvorgaben",
        Information:     ['', '', '', '', '', '', '', ''],
        Leistungsphasen: [1, 2, 3, 4, 5, 6, 7, 8],
        Nummer:          [1, 1, 1, 1, 1, 1, 1, 1],
        Teilaufgabenbereiche: Zielvorgabenteilaufgaben
      });

      Berechnungenteilaufgaben    = [];
      Berechnungenteilaufgaben[1] = [];
      Berechnungenteilaufgaben[2] = [];
      Berechnungenteilaufgaben[3] = [];
      Berechnungenteilaufgaben[4] = [];
      Berechnungenteilaufgaben[5] = [];
      Berechnungenteilaufgaben[6] = [];
      Berechnungenteilaufgaben[7] = [];
      Berechnungenteilaufgaben[8] = [];

      Text = 'überschlägige Abschätzung des Primärenergieeinsatzes anhand von Flächenansätzen';

      Berechnungenteilaufgaben[1][0]      = [];
      Berechnungenteilaufgaben[1][0][0]   = { AufgabenbereichID: "berech", Beschreibung: "",   Bezeichnung: "Abschätzung", id: "berech_abschaetzung" };
      Berechnungenteilaufgaben[1][0][410] = { AufgabenbereichID: "berech", Beschreibung: Text, Bezeichnung: "",            id: "berech_abschaetzung" };
      Berechnungenteilaufgaben[1][0][475] = { AufgabenbereichID: "berech", Beschreibung: Text, Bezeichnung: "",            id: "berech_abschaetzung" };
      Berechnungenteilaufgaben[1][0][420] = { AufgabenbereichID: "berech", Beschreibung: Text, Bezeichnung: "",            id: "berech_abschaetzung" };
      Berechnungenteilaufgaben[1][0][430] = { AufgabenbereichID: "berech", Beschreibung: Text, Bezeichnung: "",            id: "berech_abschaetzung" };
      Berechnungenteilaufgaben[1][0][434] = { AufgabenbereichID: "berech", Beschreibung: Text, Bezeichnung: "",            id: "berech_abschaetzung" };
      Berechnungenteilaufgaben[1][0][440] = { AufgabenbereichID: "berech", Beschreibung: Text, Bezeichnung: "",            id: "berech_abschaetzung" };
      Berechnungenteilaufgaben[1][0][450] = { AufgabenbereichID: "berech", Beschreibung: Text, Bezeichnung: "",            id: "berech_abschaetzung" };
      Berechnungenteilaufgaben[1][0][460] = { AufgabenbereichID: "berech", Beschreibung: Text, Bezeichnung: "",            id: "berech_abschaetzung" };
      Berechnungenteilaufgaben[1][0][480] = { AufgabenbereichID: "berech", Beschreibung: Text, Bezeichnung: "",            id: "berech_abschaetzung" };

      Berechnungenteilaufgaben[2][0]      = [];
      Berechnungenteilaufgaben[2][0][0]   = { AufgabenbereichID: "berech", Beschreibung: "",   Bezeichnung: "Auslegung", id: "berech_auslegung" };
      Berechnungenteilaufgaben[2][0][410] = { AufgabenbereichID: "berech", Beschreibung: "Verbrauchsmengen, Entsorgungsmengen", Bezeichnung: "",          id: "berech_auslegung" };
      Berechnungenteilaufgaben[2][0][475] = { AufgabenbereichID: "berech", Beschreibung: "Verbrauchsmengen, Entsorgungsmengen", Bezeichnung: "",          id: "berech_auslegung" };
      Berechnungenteilaufgaben[2][0][420] = { AufgabenbereichID: "berech", Beschreibung: "Heizlast, Gleichzeitigkeitsfaktoren", Bezeichnung: "",          id: "berech_auslegung" };
      Berechnungenteilaufgaben[2][0][430] = { AufgabenbereichID: "berech", Beschreibung: "Luftwechsel Volumenströme für einzelne Anlagen. Heiz-, Kühl-, Befeuchtungs- und Elektroleistungen", Bezeichnung: "",          id: "berech_auslegung" };
      Berechnungenteilaufgaben[2][0][434] = { AufgabenbereichID: "berech", Beschreibung: "stat. Kältebedarf, dyn. Kältebedarf, Gleichzeitigkeitsfaktoren", Bezeichnung: "",          id: "berech_auslegung" };
      Berechnungenteilaufgaben[2][0][440] = { AufgabenbereichID: "berech", Beschreibung: "Leistungsbedarf. Aufgeschlüsselte Leistungsbilanz für Netz- und NEA dto. Hauptverbraucher (RLT, Kälte, Aufzüge, Beleuchtung). Gleichzeitigkeitsfaktoren", Bezeichnung: "",          id: "berech_auslegung" };
      Berechnungenteilaufgaben[2][0][450] = { AufgabenbereichID: "berech", Beschreibung: "Leistungsbedarf", Bezeichnung: "",          id: "berech_auslegung" };
      Berechnungenteilaufgaben[2][0][460] = { AufgabenbereichID: "berech", Beschreibung: "Förderleistungsberechnung", Bezeichnung: "",          id: "berech_auslegung" };
      Berechnungenteilaufgaben[2][0][480] = { AufgabenbereichID: "berech", Beschreibung: "", Bezeichnung: "",          id: this.Const.NONE };

      Berechnungenteilaufgaben[3][0]      = [];
      Berechnungenteilaufgaben[3][0][0]   = { AufgabenbereichID: "berech", Beschreibung: "", Bezeichnung: "Allgemein", id: "berech_allgemein" };
      Berechnungenteilaufgaben[3][0][410] = { AufgabenbereichID: "berech", Beschreibung: "Medienbedarf", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[3][0][475] = { AufgabenbereichID: "berech", Beschreibung: "Medienbedarf", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[3][0][420] = { AufgabenbereichID: "berech", Beschreibung: "Heizlast<br>Leistungsbilanz<br>thermische Gebäudesimulation für relevante Bereiche falls erforderlich", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[3][0][430] = { AufgabenbereichID: "berech", Beschreibung: "Volumenströme<br>Kühllast<br>Heizlast<br>Thermische Gebäudesimulation<br>bzw. Strömungssimulationen<br>sind ggf. projektspezifisch mit Zielsetzung<br>der Untersuchung<br>zu vereinbaren.", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[3][0][434] = { AufgabenbereichID: "berech", Beschreibung: "Kühlflächenauslegung<br>Leistungsbilanz<br>thermische Gebäudesimulation<br>für relevante Bereiche<br>falls erforderlich", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[3][0][440] = { AufgabenbereichID: "berech", Beschreibung: "Beleuchtungsberech<br>Leistungsbilanz", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[3][0][450] = { AufgabenbereichID: "berech", Beschreibung: "", Bezeichnung: "",          id: this.Const.NONE };
      Berechnungenteilaufgaben[3][0][460] = { AufgabenbereichID: "berech", Beschreibung: "Förderleistungsberechnung in Vorplanung<br>Nachberechnung in Entwurf", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[3][0][480] = { AufgabenbereichID: "berech", Beschreibung: "", Bezeichnung: "",          id: this.Const.NONE };

      Berechnungenteilaufgaben[4][0]      = [];
      Berechnungenteilaufgaben[4][0][0]   = { AufgabenbereichID: "berech", Beschreibung: "", Bezeichnung: "Allgemein", id: "berech_allgemein" };
      Berechnungenteilaufgaben[4][0][410] = { AufgabenbereichID: "berech", Beschreibung: "Medienbedarf<br>Anschlussleistung<br>Geräte der Zentralen<br>Rohrnetzberechnung<br>Abwasser", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[4][0][475] = { AufgabenbereichID: "berech", Beschreibung: "Leistungsbilanz<br>Geräte der Zentralen", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[4][0][420] = { AufgabenbereichID: "berech", Beschreibung: "Heizlast<br>Leistungsbilanz<br>thermische Gebäudesimulation für relevante Bereiche falls erforderlich", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[4][0][430] = { AufgabenbereichID: "berech", Beschreibung: "Volumenströme<br>Geräte der Zentralen<br>Heizlast", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[4][0][434] = { AufgabenbereichID: "berech", Beschreibung: "Leistungsbilanz<br>Geräte der Zentralen", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[4][0][440] = { AufgabenbereichID: "berech", Beschreibung: "Leistungsbilanz nach Netzarten getrennt<br>Gesamtenergiebedarf<br>Geräte der Zentralen", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[4][0][450] = { AufgabenbereichID: "berech", Beschreibung: "Medienbedarf<br>Geräte der Zentralen", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[4][0][460] = { AufgabenbereichID: "berech", Beschreibung: "Entleerungsberechnung<br>Förderleistungsberechnung", Bezeichnung: "",          id: "berech_allgemein" };
      Berechnungenteilaufgaben[4][0][480] = { AufgabenbereichID: "berech", Beschreibung: "", Bezeichnung: "",          id: this.Const.NONE };

      Berechnungenteilaufgaben[5][0]      = [];
      Berechnungenteilaufgaben[5][0][0]   = { AufgabenbereichID: "berech", Beschreibung: "", Bezeichnung: "abschließende Berechnungen", id: "berech_abschliessend" };
      Berechnungenteilaufgaben[5][0][410] = { AufgabenbereichID: "berech", Beschreibung: "vollständige Rohrnetzberechnung<br>für sämtliche Medien<br>Auslegung Zentralgeräte", Bezeichnung: "", id: "berech_abschliessend" };
      Berechnungenteilaufgaben[5][0][475] = { AufgabenbereichID: "berech", Beschreibung: "vollständige Rohrnetzberechnung<br>für sämtliche Medien<br>Auslegung Zentralgeräte", Bezeichnung: "", id: "berech_abschliessend" };
      Berechnungenteilaufgaben[5][0][420] = { AufgabenbereichID: "berech", Beschreibung: "Heizlast<br>vollständige Rohrnetzberechnung<br>Heizflächenauslegung nach<br>vereinbarten Kriterien<br>Leistungsbilanz<br>Auslegung Zentralgeräte", Bezeichnung: "",          id: "berech_abschliessend" };
      Berechnungenteilaufgaben[5][0][430] = { AufgabenbereichID: "berech", Beschreibung: "Kühllast<br>Heizlast<br>vollständige Kanalnetzberechnung<br>Volumenströme<br>Leistungsbilanz\<br>Auslegung Zentralgeräte", Bezeichnung: "",          id: "berech_abschliessend" };
      Berechnungenteilaufgaben[5][0][434] = { AufgabenbereichID: "berech", Beschreibung: "Kühllast<br>vollständige Rohrnetzberechnung<br>Kühlflächenauslegung<br>Leistungsbilanz<br>Auslegung Zentralgeräte", Bezeichnung: "",          id: "berech_abschliessend" };
      Berechnungenteilaufgaben[5][0][440] = { AufgabenbereichID: "berech", Beschreibung: "Kabelquerschnittsberechnung<br>Beleuchtungsberechnung<br>exemplarisch Leistungsbilanz nach<br>Netzarten und Lastverhältnissen<br>getrennt<br>Kurzschlussstromberechnung<br>der ungünstigen Netzstränge<br>unter Berücksichtigung<br>der unterschiedlichen<br>Netzverhältnisse<br>Selektivitätsberechnung<br>Auslegung Zentralgeräte<br>Sicherheitsbeleuchtung", Bezeichnung: "",          id: "berech_abschliessend" };
      Berechnungenteilaufgaben[5][0][450] = { AufgabenbereichID: "berech", Beschreibung: "Kabelquerschnittsberechnung<br>Leistungsbilanzen<br>Lichtruf-, Brandmelde,<br>Beschallungs-,<br>Antennenanlage<br>Übertragungsnetze etc.<br>Auslegung Zentralgeräte", Bezeichnung: "",          id: "berech_abschliessend" };
      Berechnungenteilaufgaben[5][0][460] = { AufgabenbereichID: "berech", Beschreibung: "Förderleistungsberechnung<br>Förderhöhe<br>Geschwindigkeit,", Bezeichnung: "",          id: "berech_abschliessend" };
      Berechnungenteilaufgaben[5][0][480] = { AufgabenbereichID: "berech", Beschreibung: "", Bezeichnung: "",          id: this.Const.NONE };


      this.Aufgabenbereicheliste.push(
        {
          id:                   'berech',
          Bezeichnung:          "Berechnungen",
          Information:     ['', '', '', '', '', '', '', ''],
          Leistungsphasen:      [1, 2, 3, 4, 5, 6, 7, 8],
          Nummer:               [2, 2, 2, 2, 2, 0, 0, 0],
          Teilaufgabenbereiche: Berechnungenteilaufgaben
        });

      Bemessungenteilaufgaben    = [];
      Bemessungenteilaufgaben[1] = [];
      Bemessungenteilaufgaben[2] = [];
      Bemessungenteilaufgaben[3] = [];
      Bemessungenteilaufgaben[4] = [];
      Bemessungenteilaufgaben[5] = [];
      Bemessungenteilaufgaben[6] = [];
      Bemessungenteilaufgaben[7] = [];
      Bemessungenteilaufgaben[8] = [];

      Text = `Flächenbedarf in Zentralen, Schächten und abgehängten Decken auch im Vergleich zu alternativen Lösungsmöglichkeiten`;

      Bemessungenteilaufgaben[2][0]      = [];
      Bemessungenteilaufgaben[2][0][0]   = { AufgabenbereichID: "bemess", Beschreibung: "",   Bezeichnung: "Flächen", id: "bemess_flaechen" };
      Bemessungenteilaufgaben[2][0][410] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",        id: "bemess_flaechen" };
      Bemessungenteilaufgaben[2][0][475] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",        id: "bemess_flaechen" };
      Bemessungenteilaufgaben[2][0][420] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",        id: "bemess_flaechen" };
      Bemessungenteilaufgaben[2][0][430] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",        id: "bemess_flaechen" };
      Bemessungenteilaufgaben[2][0][434] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",        id: "bemess_flaechen" };
      Bemessungenteilaufgaben[2][0][440] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",        id: "bemess_flaechen" };
      Bemessungenteilaufgaben[2][0][450] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",        id: "bemess_flaechen" };
      Bemessungenteilaufgaben[2][0][460] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",        id: "bemess_flaechen" };
      Bemessungenteilaufgaben[2][0][480] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",        id: "bemess_flaechen" };

      Text = `Verbrauchsdaten für die einzelnen alternativen Lösungsmöglichkeiten aufgrund von Erfahrungswerten`;

      Bemessungenteilaufgaben[2][1]      = [];
      Bemessungenteilaufgaben[2][1][0]   = { AufgabenbereichID: "bemess", Beschreibung: "",   Bezeichnung: "Wirtschaftlichkeit", id: "bemess_wirtschaft" };
      Bemessungenteilaufgaben[2][1][410] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",                   id: "bemess_wirtschaft" };
      Bemessungenteilaufgaben[2][1][475] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",                   id: "bemess_wirtschaft" };
      Bemessungenteilaufgaben[2][1][420] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",                   id: "bemess_wirtschaft" };
      Bemessungenteilaufgaben[2][1][430] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",                   id: "bemess_wirtschaft" };
      Bemessungenteilaufgaben[2][1][434] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",                   id: "bemess_wirtschaft" };
      Bemessungenteilaufgaben[2][1][440] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",                   id: "bemess_wirtschaft" };
      Bemessungenteilaufgaben[2][1][450] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",                   id: "bemess_wirtschaft" };
      Bemessungenteilaufgaben[2][1][460] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",                   id: "bemess_wirtschaft" };
      Bemessungenteilaufgaben[2][1][480] = { AufgabenbereichID: "bemess", Beschreibung: Text, Bezeichnung: "",                   id: "bemess_wirtschaft" };

      Bemessungenteilaufgaben[2][2]      = [];
      Bemessungenteilaufgaben[2][2][0]   = { AufgabenbereichID: "bemess", Beschreibung: "", Bezeichnung: "Anschlüsse", id: "bemess_anschluesse" };
      Bemessungenteilaufgaben[2][2][410] = { AufgabenbereichID: "bemess", Beschreibung: `TWK, SW, RW Behälter, Anschlüsse, Sprinklertank`,                   Bezeichnung: "", id: "bemess_anschluesse" };
      Bemessungenteilaufgaben[2][2][475] = { AufgabenbereichID: "bemess", Beschreibung: `TWK, SW, RW Behälter, Anschlüsse, Sprinklertank`,                   Bezeichnung: "", id: "bemess_anschluesse" };
      Bemessungenteilaufgaben[2][2][420] = { AufgabenbereichID: "bemess", Beschreibung: `Gas, FWKessel, Anschlüsse, Wärmetauscher, Pumpen`,                  Bezeichnung: "", id: "bemess_anschluesse" };
      Bemessungenteilaufgaben[2][2][430] = { AufgabenbereichID: "bemess", Beschreibung: `Lüftungsgeräte,Lüftungsdecken, Ablufthauben`,                       Bezeichnung: "", id: "bemess_anschluesse" };
      Bemessungenteilaufgaben[2][2][434] = { AufgabenbereichID: "bemess", Beschreibung: `Kältemaschine`,                                                     Bezeichnung: "", id: "bemess_anschluesse" };
      Bemessungenteilaufgaben[2][2][440] = { AufgabenbereichID: "bemess", Beschreibung: `Trafo, NS Trafo, Schaltanlagen, Zentralbatterie, Netzersatzanlage`, Bezeichnung: "", id: "bemess_anschluesse" };
      Bemessungenteilaufgaben[2][2][450] = { AufgabenbereichID: "bemess", Beschreibung: ``,         Bezeichnung: "",   id: this.Const.NONE };
      Bemessungenteilaufgaben[2][2][460] = { AufgabenbereichID: "bemess", Beschreibung: `Maschine`, Bezeichnung: "",   id: "bemess_anschluesse" };
      Bemessungenteilaufgaben[2][2][480] = { AufgabenbereichID: "bemess", Beschreibung: ``,         Bezeichnung: "",   id: this.Const.NONE };

      Bemessungenteilaufgaben[3][0]      = [];
      Bemessungenteilaufgaben[3][0][0]   = { AufgabenbereichID: "bemess", Beschreibung: "", Bezeichnung: "Allgemein", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[3][0][410] = { AufgabenbereichID: "bemess", Beschreibung: `Löschwasserbehälter<br>Pumpen<br>Hebeanlagen<br>Wärmetauscher`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[3][0][475] = { AufgabenbereichID: "bemess", Beschreibung: `Löschwasserbehälter<br>Pumpen<br>Hebeanlagen<br>Wärmetauscher`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[3][0][420] = { AufgabenbereichID: "bemess", Beschreibung: `Kessel<br>Wämetauscher<br>Pumpen<br>Behälter<br>überschlägige<br>Heizflächenauslegung`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[3][0][430] = { AufgabenbereichID: "bemess", Beschreibung: `RLT-Geräte<br>Wärmetauscher<br>Luftdurchlässe`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[3][0][434] = { AufgabenbereichID: "bemess", Beschreibung: `Kältemaschine<br>Rückkühlung<br>Wärmetauscher<br>Pumpen<br>Behälter`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[3][0][440] = { AufgabenbereichID: "bemess", Beschreibung: `Trafo, NEA<br>Zentralbatterie<br>NSHV, Zähler- und Unterverteilungen<br>Kompensationsanlagen<br>Blitzschutz, Erdung`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[3][0][450] = { AufgabenbereichID: "bemess", Beschreibung: `Zentrale Einrichtungen<br>Antenne, BMZ, ELA, Lichtruf, Datenverteiler, Antennenanlage`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[3][0][460] = { AufgabenbereichID: "bemess", Beschreibung: `Förderhöhe<br>Geschwindigkeit<br>Tragfähigkeit<br>Haltestellen<br>Antriebsart, Steuerung<br>Anzeigen`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[3][0][480] = { AufgabenbereichID: "bemess", Beschreibung: "", Bezeichnung: "", id: this.Const.NONE };

      Bemessungenteilaufgaben[4][0]      = [];
      Bemessungenteilaufgaben[4][0][0]   = { AufgabenbereichID: "bemess", Beschreibung: "", Bezeichnung: "Allgemein", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[4][0][410] = { AufgabenbereichID: "bemess", Beschreibung: `Medienbedarf<br>Anschlussleistung<br>Geräte der Zentralen<br>Rohrnetzberechnung<br>Abwasser`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[4][0][475] = { AufgabenbereichID: "bemess", Beschreibung: `Leistungsbilanz<br>Geräte der Zentralen`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[4][0][420] = { AufgabenbereichID: "bemess", Beschreibung: `Volumenströme<br>Geräte der Zentralen<br></br>Heizlast`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[4][0][430] = { AufgabenbereichID: "bemess", Beschreibung: `RLT-Geräte<br>Wärmetauscher<br>Luftdurchlässe`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[4][0][434] = { AufgabenbereichID: "bemess", Beschreibung: `Kältemaschine<br>Rückkühlung<br>Wämeübertrager<br>Pumpen<br>Behälter<br>Rohrleitungen`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[4][0][440] = { AufgabenbereichID: "bemess", Beschreibung: `Trafo, NEA<br>Zentralbatterie, USV,<br>Sicherheitsbeleuchtung<br>HS, MS, NSHV, Zählerund<br>Unterverteilungen<br>Kompensationsanlage<br>Blitzschutzanlage<br>Erdung<br>Kabel`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[4][0][450] = { AufgabenbereichID: "bemess", Beschreibung: `Zentrale Einrichtungen<br>Antenne, BMZ, ELA<br></br>Lichtruf, Datenverteiler<br>Kabel`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[4][0][460] = { AufgabenbereichID: "bemess", Beschreibung: `Förderhöhe<br>Geschwindigkeit<br>Tragfähigkeit<br>Haltestellen<br>Antriebsart, Steuerung<br>Anzeigen`, Bezeichnung: "", id: "bemess_allgemein" };
      Bemessungenteilaufgaben[4][0][480] = { AufgabenbereichID: "bemess", Beschreibung: "", Bezeichnung: "", id: this.Const.NONE };

      Bemessungenteilaufgaben[5][0]      = [];
      Bemessungenteilaufgaben[5][0][0]   = { AufgabenbereichID: "bemess", Beschreibung: "", Bezeichnung: "Ver-/Entsorgung", id: "bemess_versorgung" };
      Bemessungenteilaufgaben[5][0][410] = { AufgabenbereichID: "bemess", Beschreibung: `Löschwasser<br>Wärmeübertrager<br>Hebe-, Abscheideranlagen<br>Flaschenstationen<br>(Gaslöschanlagen)`, Bezeichnung: "", id: "bemess_versorgung" };
      Bemessungenteilaufgaben[5][0][475] = { AufgabenbereichID: "bemess", Beschreibung: `Löschwasser<br>Wärmeübertrager<br>Hebe-, Abscheideranlagen<br>Flaschenstationen<br>(Gaslöschanlagen)`, Bezeichnung: "", id: "bemess_versorgung" };
      Bemessungenteilaufgaben[5][0][420] = { AufgabenbereichID: "bemess", Beschreibung: `Wärmeerzeuger<br>Wärmeübertrager`, Bezeichnung: "", id: "bemess_versorgung" };
      Bemessungenteilaufgaben[5][0][430] = { AufgabenbereichID: "bemess", Beschreibung: `RLT-Geräte<br>Wärmeübertrager<br>Befeuchter, Entfeuchter`, Bezeichnung: "", id: "bemess_versorgung" };
      Bemessungenteilaufgaben[5][0][434] = { AufgabenbereichID: "bemess", Beschreibung: `Kältemaschine<br>Wärmeübertrager<br>Rückkühlung`, Bezeichnung: "", id: "bemess_versorgung" };
      Bemessungenteilaufgaben[5][0][440] = { AufgabenbereichID: "bemess", Beschreibung: `Trafo, NEA, USV,<br>Sicherheitsbeleuchtung<br>Zentralbatterie<br>NSHV, Zähler- und<br>Kompensationsanlage`, Bezeichnung: "", id: "bemess_versorgung" };
      Bemessungenteilaufgaben[5][0][450] = { AufgabenbereichID: "bemess", Beschreibung: `Zentrale Einrichtungen<br>Antenne, BMZ, ELA,<br>Lichtruf, Datenverteiler`, Bezeichnung: "", id: "bemess_versorgung" };
      Bemessungenteilaufgaben[5][0][460] = { AufgabenbereichID: "bemess", Beschreibung: ``, Bezeichnung: "", id: this.Const.NONE };
      Bemessungenteilaufgaben[5][0][480] = { AufgabenbereichID: "bemess", Beschreibung: `Festlegung der Regelkreise<br>Auslegung Zentralgeräte<br>Schalt-, Steueranlagen<br>Informationsschwerpunkte (ISP) GA`, Bezeichnung: "", id: "bemess_versorgung" };

      Bemessungenteilaufgaben[5][1]      = [];
      Bemessungenteilaufgaben[5][1][0]   = { AufgabenbereichID: "bemess", Beschreibung: "", Bezeichnung: "Ver-/Entsorgung", id: "bemess_verteilung" };
      Bemessungenteilaufgaben[5][1][410] = { AufgabenbereichID: "bemess", Beschreibung: `Pumpen und Verdichter<br>Behälter<br>Regelorgane<br>Rohrnetze<br>Armaturen`, Bezeichnung: "", id: "bemess_verteilung" };
      Bemessungenteilaufgaben[5][1][475] = { AufgabenbereichID: "bemess", Beschreibung: `Pumpen und Verdichter<br>Behälter<br>Regelorgane<br>Rohrnetze<br>Armaturen`, Bezeichnung: "", id: "bemess_verteilung" };
      Bemessungenteilaufgaben[5][1][420] = { AufgabenbereichID: "bemess", Beschreibung: `Pumpen<br>Behälter<br>Regelorgane<br>Rohrnetze<br>Armaturenr`, Bezeichnung: "", id: "bemess_verteilung" };
      Bemessungenteilaufgaben[5][1][430] = { AufgabenbereichID: "bemess", Beschreibung: `Schalldämpfer<br>Regelorgane<br>Kanäle, Rohre<br>Luftdurchlässe`, Bezeichnung: "", id: "bemess_verteilung" };
      Bemessungenteilaufgaben[5][1][434] = { AufgabenbereichID: "bemess", Beschreibung: `Pumpen<br>Behälter<br>Regelorgane<br>Rohrnetze<br>Armaturen`, Bezeichnung: "", id: "bemess_verteilung" };
      Bemessungenteilaufgaben[5][1][440] = { AufgabenbereichID: "bemess", Beschreibung: `Kabel mit Tragsystemen<br>Blitzschutz, Erdung<br>Energieoptimierung<br>Schienensysteme<br>Schutzorgane`, Bezeichnung: "", id: "bemess_verteilung" };
      Bemessungenteilaufgaben[5][1][450] = { AufgabenbereichID: "bemess", Beschreibung: `Kabel mit Tragsystemen<br>Schutzorgane`, Bezeichnung: "", id: "bemess_verteilung" };
      Bemessungenteilaufgaben[5][1][460] = { AufgabenbereichID: "bemess", Beschreibung: `Haltestellen<br>Antriebe<br>Steuerung<br>Anzeigen`, Bezeichnung: "", id: "bemess_verteilung" };
      Bemessungenteilaufgaben[5][1][480] = { AufgabenbereichID: "bemess", Beschreibung: `Parametrieren der Steuer- und Regelkreise<br>Kabel mit Tragsystemen<br>Schutzorgane<br>Energieoptimierung<br>Steuermatrix<br>auf Grundlage der<br>Brandschutzmatrix`, Bezeichnung: "", id: "bemess_verteilung" };

      this.Aufgabenbereicheliste.push({
        id:                   'bemess',
        Bezeichnung:          "Bemessungen",
        Information:          ['', '', '', '', '', '', '', ''],
        Leistungsphasen:      [   2, 3, 4, 5, 6, 7, 8],
        Nummer:               [0, 3, 3, 3, 3, 0, 0, 0],
        Teilaufgabenbereiche: Bemessungenteilaufgaben
      });

      Schematateilaufgabenliste    = [];
      Schematateilaufgabenliste[1] = [];
      Schematateilaufgabenliste[2] = [];
      Schematateilaufgabenliste[3] = [];
      Schematateilaufgabenliste[4] = [];
      Schematateilaufgabenliste[5] = [];
      Schematateilaufgabenliste[6] = [];
      Schematateilaufgabenliste[7] = [];
      Schematateilaufgabenliste[8] = [];

      Schematateilaufgabenliste[2][0]      = [];
      Schematateilaufgabenliste[2][0][0]   = { AufgabenbereichID: "schema", Beschreibung: "",   Bezeichnung: "Anlagen",   id: "schema_anlagen" };
      Schematateilaufgabenliste[2][0][410] = { AufgabenbereichID: "schema", Beschreibung: "TWK, TWW VErsorgung, SW, RW Entsorgung", Bezeichnung: "", id: "schema_anlagen" };
      Schematateilaufgabenliste[2][0][475] = { AufgabenbereichID: "schema", Beschreibung: "TWK, TWW VErsorgung, SW, RW Entsorgung", Bezeichnung: "", id: "schema_anlagen" };
      Schematateilaufgabenliste[2][0][420] = { AufgabenbereichID: "schema", Beschreibung: "Wärmeversorgung",                        Bezeichnung: "", id: "schema_anlagen" };
      Schematateilaufgabenliste[2][0][430] = { AufgabenbereichID: "schema", Beschreibung: "charakteristische Anlagen",              Bezeichnung: "", id: "schema_anlagen" };
      Schematateilaufgabenliste[2][0][434] = { AufgabenbereichID: "schema", Beschreibung: "Kälteversorgung",                        Bezeichnung: "", id: "schema_anlagen" };
      Schematateilaufgabenliste[2][0][440] = { AufgabenbereichID: "schema", Beschreibung: "Stromversorgung",                        Bezeichnung: "", id: "schema_anlagen" };
      Schematateilaufgabenliste[2][0][450] = { AufgabenbereichID: "schema", Beschreibung: "BMA, SiBe, TK, etc. ",                   Bezeichnung: "", id: "schema_anlagen" };
      Schematateilaufgabenliste[2][0][460] = { AufgabenbereichID: "schema", Beschreibung: "Förderhöhe, Haltestellen, Antriebsart",  Bezeichnung: "", id: "schema_anlagen" };
      Schematateilaufgabenliste[2][0][480] = { AufgabenbereichID: "schema", Beschreibung: "Übersichtsschema",                       Bezeichnung: "", id: "schema_anlagen" };

      Schematateilaufgabenliste[3][0]      = [];
      Schematateilaufgabenliste[3][0][0]   = { AufgabenbereichID: "schema", Beschreibung: "", Bezeichnung: "Funktionsschema",   id: "schema_funktion" };
      Schematateilaufgabenliste[3][0][410] = { AufgabenbereichID: "schema", Beschreibung: "Versorgung TWK<br>Versorgung TWW<br>Entsorgung SW<br>Entsorgung RW<br>Funktions- und Strangschema", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[3][0][420] = { AufgabenbereichID: "schema", Beschreibung: "Wärmeversorgung<br>Wasseraufbereitung<br>Wärmeverteilung<br>Wärmeverbrauchseinrichtungen<br>kein Strangschema<br>Regelventile", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[3][0][430] = { AufgabenbereichID: "schema", Beschreibung: "für jede Anlage mit Funktion<br>Gerät und Prinzip der<br>Luftverteilung<br>alle Komponenten für einen<br>sicheren Betrieb aufzeigen", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[3][0][434] = { AufgabenbereichID: "schema", Beschreibung: "Kälteversorgung<br>Wasseraufbereitung<br>Kälteverteilung<br>kein Strangschema", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[3][0][440] = { AufgabenbereichID: "schema", Beschreibung: "Mittelspannung<br>Niederspannung<br>Netzersatzanlage<br>Energiereverteilung<br>bis Unterverteilung<br>Sicherheitsbeleucht.", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[3][0][450] = { AufgabenbereichID: "schema", Beschreibung: "für alle Anlagen, z.B.<br>ELA-Anlage,<br>BM-Anlagen,<br>TK-Anlagen,<br>Such- und Signalanlagen<br>EM-Anlagen etc.", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[3][0][460] = { AufgabenbereichID: "schema", Beschreibung: "Übersichtschema für Förderhöhe<br>Bericht<br>Haltestellen<br>Antriebsart", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[3][0][475] = { AufgabenbereichID: "schema", Beschreibung: "Versorgung TWK<br>Versorgung TWW<br>Entsorgung SW<br>Entsorgung RW<br>Funktions- und Strangschema", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[3][0][480] = { AufgabenbereichID: "schema", Beschreibung: "Regelschema<br>GA-Schema<br>Datenpunktlisten", Bezeichnung: "", id: "schema_funktion" };

      Schematateilaufgabenliste[4][0]      = [];
      Schematateilaufgabenliste[4][0][0]   = { AufgabenbereichID: "schema", Beschreibung: "", Bezeichnung: "Strangschema",   id: "schema_funktion" };
      Schematateilaufgabenliste[4][0][410] = { AufgabenbereichID: "schema", Beschreibung: "Versorgung TWK<br>Versorgung TWW<br>Entsorgung SW<br>Entsorgung RW<br>Funktions- und Strangschema<br>Messstellen<br>Feuerlöschanlagen<br>Sprinkler, Gaslöschanlagen<br>Hydrantenanlagen", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[4][0][475] = { AufgabenbereichID: "schema", Beschreibung: "Versorgung TWK<br>Versorgung TWW<br>Entsorgung SW<br>Entsorgung RW<br>Funktions- und Strangschema<br>Messstellen<br>Feuerlöschanlagen<br>Sprinkler, Gaslöschanlagen<br>Hydrantenanlagen", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[4][0][420] = { AufgabenbereichID: "schema", Beschreibung: "Wärmeversorgung<br>Wasseraufbereitung<br>Wärmeverteilung<br>Wärmeverbrauchseinrichtungen<br>kein Strangschema<br>Regelventile<br>Messstellen", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[4][0][430] = { AufgabenbereichID: "schema", Beschreibung: "für jede Anlage mit Funktion<br>Gerät und Prinzip der<br>Luftverteilung<br>alle Komponenten für einen<br>sicheren Betrieb aufzeigen<br>Messstellen", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[4][0][434] = { AufgabenbereichID: "schema", Beschreibung: "Kälteversorgung<br>Wasseraufbereitung<br>Kälteverteilung<br>kein Strangschema", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[4][0][440] = { AufgabenbereichID: "schema", Beschreibung: "Mittelspannung<br>Niederspannung<br>Netzersatzanlage<br>Energiereverteilung<br>bis Unterverteilung<br>Sicherheitsbeleuchtung<br>Messtellen<br>Netzschema", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[4][0][450] = { AufgabenbereichID: "schema", Beschreibung: "für alle Anlagen, z.B.<br>ELA-Anlage,<br>BM-Anlagen,<br>TK-Anlagen,<br>Such- und Signalanlagen<br>EM-Anlagen<br>BOS-Funkanlagen", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[4][0][460] = { AufgabenbereichID: "schema", Beschreibung: "Übersichtschema für Förderhöhe<br>Bericht<br>Haltestellen<br>Antriebsart", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[4][0][480] = { AufgabenbereichID: "schema", Beschreibung: "Regelschema<br>GA-Schema<br>Datenpunktlisten<br>Steuermatrix auf<br>Grundlage der<br>Brandschutzmatrix", Bezeichnung: "", id: "schema_funktion" };

      Schematateilaufgabenliste[5][0]      = [];
      Schematateilaufgabenliste[5][0][0]   = { AufgabenbereichID: "schema", Beschreibung: "", Bezeichnung: "Funktionsschema",   id: "schema_funktion" };
      Schematateilaufgabenliste[5][0][410] = { AufgabenbereichID: "schema", Beschreibung: "für jede Anlage mit<br>Funktionskomponente<br>und Prinzip der<br>Verteilung", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[5][0][475] = { AufgabenbereichID: "schema", Beschreibung: "für jede Anlage mit<br>Funktionskomponente<br>und Prinzip der<br>Verteilung", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[5][0][420] = { AufgabenbereichID: "schema", Beschreibung: "für jede Anlage mit<br>Funktionskomponente<br>und Prinzip der Wärmeverteilung<br>Wärmeverbrauchseinrichtungen", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[5][0][430] = { AufgabenbereichID: "schema", Beschreibung: "für jede Anlage mit<br>Funktionskomponente<br>und Prinzip der Luftverteilung", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[5][0][434] = { AufgabenbereichID: "schema", Beschreibung: "für jede Anlage mit<br>Funktionskomponente<br>und Prinzip der<br>Kälteverteilung", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[5][0][440] = { AufgabenbereichID: "schema", Beschreibung: "für jede Anlage mit<br>Funktionskomponente<br>und Prinzip der<br>Verteilung<br>Schaltanlagen<br>-verteilungen in 1-pol.<br>Darstellung oder in<br>Listenform mit Schalt-,<br>Mess- und Steuereinrichtungena", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[5][0][450] = { AufgabenbereichID: "schema", Beschreibung: "für jede Anlage mit<br>Funktionskomponente<br>und Prinzip der<br>Verteilung", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[5][0][460] = { AufgabenbereichID: "schema", Beschreibung: "Übersichtschema<br>für Förderhöhe<br>Geschwindigkeit<br>Tragfähigkeit<br>Haltestellen<br>Antriebsart<br>Antriebsdaten/-leistung<br>Wärmelasten", Bezeichnung: "", id: "schema_funktion" };
      Schematateilaufgabenliste[5][0][480] = { AufgabenbereichID: "schema", Beschreibung: "Regelschema<br>GA-Schema<br>GA-Funktionsliste<br>Übernahme der<br>Auslegungsdaten<br>Parameter aller<br>Gewerke<br>Art u. Topologie der<br>Übertragungsnetze<br>Funktionsbeschreibg.<br>Angaben zur<br>Anbindung von<br>Fremdsystemen<br>Datenpunktstruktur", Bezeichnung: "", id: "schema_funktion" };

      Schematateilaufgabenliste[5][1]      = [];
      Schematateilaufgabenliste[5][1][0]   = { AufgabenbereichID: "schema", Beschreibung: "", Bezeichnung: "Stangschema",   id: "schema_strang" };
      Schematateilaufgabenliste[5][1][410] = { AufgabenbereichID: "schema", Beschreibung: "für alle Medien<br>mit Auslegungsdaten/Parametern", Bezeichnung: "", id: "schema_strang" };
      Schematateilaufgabenliste[5][1][475] = { AufgabenbereichID: "schema", Beschreibung: "für alle Medien<br>mit Auslegungsdaten/Parametern", Bezeichnung: "", id: "schema_strang" };
      Schematateilaufgabenliste[5][1][420] = { AufgabenbereichID: "schema", Beschreibung: "mit Auslegungsdaten/Parametern", Bezeichnung: "", id: "schema_strang" };
      Schematateilaufgabenliste[5][1][430] = { AufgabenbereichID: "schema", Beschreibung: "mit Auslegungsdaten/Parametern", Bezeichnung: "", id: "schema_strang" };
      Schematateilaufgabenliste[5][1][434] = { AufgabenbereichID: "schema", Beschreibung: "mit Auslegungsdaten/Parametern", Bezeichnung: "", id: "schema_strang" };
      Schematateilaufgabenliste[5][1][440] = { AufgabenbereichID: "schema", Beschreibung: "Energieerzeugung<br>-verteilung bis Schaltanlagen<br>Verteiler<br>für alle Netzarten mit<br>Auslegungsdaten<br>Parametern", Bezeichnung: "", id: "schema_strang" };
      Schematateilaufgabenliste[5][1][450] = { AufgabenbereichID: "schema", Beschreibung: "mit Auslegungsdaten/Parametern", Bezeichnung: "", id: "schema_strang" };
      Schematateilaufgabenliste[5][1][460] = { AufgabenbereichID: "schema", Beschreibung: "Kommunikations-<br>Meldeeinrichtungen", Bezeichnung: "", id: "schema_strang" };
      Schematateilaufgabenliste[5][1][480] = { AufgabenbereichID: "schema", Beschreibung: "Kennzeichnungssysteme", Bezeichnung: "", id: "schema_strang" };

      this.Aufgabenbereicheliste.push({
        id:                   'schema',
        Bezeichnung:          "Schemata",
        Information:          ['', '', '', '', '', '', '', ''],
        Leistungsphasen:      [   2, 3, 4, 5, 6, 7, 8],
        Nummer:               [0, 4, 4, 4, 4, 0, 0, 0],
        Teilaufgabenbereiche: Schematateilaufgabenliste
      });

      Plaeneteilaufgabenliste    = [];
      Plaeneteilaufgabenliste[1] = [];
      Plaeneteilaufgabenliste[2] = [];
      Plaeneteilaufgabenliste[3] = [];
      Plaeneteilaufgabenliste[4] = [];
      Plaeneteilaufgabenliste[5] = [];
      Plaeneteilaufgabenliste[6] = [];
      Plaeneteilaufgabenliste[7] = [];
      Plaeneteilaufgabenliste[8] = [];


      Plaeneteilaufgabenliste[2][0]      = [];
      Plaeneteilaufgabenliste[2][0][0]   = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "Allgemein", id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[2][0][410] = { AufgabenbereichID: "plaene", Beschreibung: "Trassen<br>Möblierung", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[2][0][475] = { AufgabenbereichID: "plaene", Beschreibung: "Trassen<br>Möblierung", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[2][0][420] = { AufgabenbereichID: "plaene", Beschreibung: "Trassen<br>Möblierung<br>Heizflächen", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[2][0][430] = { AufgabenbereichID: "plaene", Beschreibung: "Möblierung/Schnitte<br>Luftdurchlässe", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[2][0][434] = { AufgabenbereichID: "plaene", Beschreibung: "Trassen<br>Möblierung<br>Kühldecken", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[2][0][440] = { AufgabenbereichID: "plaene", Beschreibung: "Trassen<br>Möblierung<brSystemdarstellung<br>für UV/Leuchten<br>(nicht vollflächig)", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[2][0][450] = { AufgabenbereichID: "plaene", Beschreibung: "Trassen<br>Möblierung", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[2][0][460] = { AufgabenbereichID: "plaene", Beschreibung: "Möblierung", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[2][0][480] = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "",          id: this.Const.NONE };

      Plaeneteilaufgabenliste[3][0]      = [];
      Plaeneteilaufgabenliste[3][0][0]   = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "Allgemein", id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[3][0][410] = { AufgabenbereichID: "plaene", Beschreibung: "Darstellung mit Haupt-<br>Dimensionen", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[3][0][475] = { AufgabenbereichID: "plaene", Beschreibung: "Trassen<br>Möblierung", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[3][0][420] = { AufgabenbereichID: "plaene", Beschreibung: "Darstellung mit Haupt-<br>Dimensionen<br>Heizflächen", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[3][0][430] = { AufgabenbereichID: "plaene", Beschreibung: "Darstellung mit Haupt-<br>Dimensionen<br>BSK, VSR, DK<br>Luftdurchlässe", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[3][0][434] = { AufgabenbereichID: "plaene", Beschreibung: "Darstellung mit Haupt-<br>Dimensionen<br>Kühlflächen", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[3][0][440] = { AufgabenbereichID: "plaene", Beschreibung: "Darstellung mit Haupt-<br>Dimensionen<br>der Kabelbahnen<br>Unterverteilungen<br>Brüstungskanäl<br>Unterflurtrassen", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[3][0][450] = { AufgabenbereichID: "plaene", Beschreibung: "Darstellung mit Haupt-<br>Dimensionen<br>der Kabelbahnen<br>sichtbare Einbauteile<br>Lautsprecher<br>Brandmelder", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[3][0][460] = { AufgabenbereichID: "plaene", Beschreibung: "Schachtzeichnung<br>Kabinenabmessungen<br>Schachttüren<br>Zargenausbildung<br>Kabinenabwicklung<br>Tableauzeichnung", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[3][0][480] = { AufgabenbereichID: "plaene", Beschreibung: "Darstellung mit<br>Dimensionen der\n<br>Kabelbahnen", Bezeichnung: "",          id: "plaene_allgemein" };

      Plaeneteilaufgabenliste[3][1]      = [];
      Plaeneteilaufgabenliste[3][1][0]   = { AufgabenbereichID: "plaene", Beschreibung: "",           Bezeichnung: "Zentralen", id: "plaene_zentralen" };
      Plaeneteilaufgabenliste[3][1][410] = { AufgabenbereichID: "plaene", Beschreibung: "Möblierung", Bezeichnung: "",          id: "plaene_zentralen" };
      Plaeneteilaufgabenliste[3][1][475] = { AufgabenbereichID: "plaene", Beschreibung: "Möblierung", Bezeichnung: "",          id: "plaene_zentralen" };
      Plaeneteilaufgabenliste[3][1][420] = { AufgabenbereichID: "plaene", Beschreibung: "Möblierung", Bezeichnung: "",          id: "plaene_zentralen" };
      Plaeneteilaufgabenliste[3][1][430] = { AufgabenbereichID: "plaene", Beschreibung: "Möblierung", Bezeichnung: "",          id: "plaene_zentralen" };
      Plaeneteilaufgabenliste[3][1][434] = { AufgabenbereichID: "plaene", Beschreibung: "Möblierung", Bezeichnung: "",          id: "plaene_zentralen" };
      Plaeneteilaufgabenliste[3][1][440] = { AufgabenbereichID: "plaene", Beschreibung: "Möblierung", Bezeichnung: "",          id: "plaene_zentralen" };
      Plaeneteilaufgabenliste[3][1][450] = { AufgabenbereichID: "plaene", Beschreibung: "Möblierung", Bezeichnung: "",          id: "plaene_zentralen" };
      Plaeneteilaufgabenliste[3][1][460] = { AufgabenbereichID: "plaene", Beschreibung: "Möblierung", Bezeichnung: "",          id: "plaene_zentralen" };
      Plaeneteilaufgabenliste[3][1][480] = { AufgabenbereichID: "plaene", Beschreibung: "Möblierung", Bezeichnung: "",          id: "plaene_zentralen" };

      Text = `Für Installationsschwerpunkte sind Schnitte zu liefern. Ein Installationsschwerpunkt liegt vor,
wenn mehrere Gewerke kreuzen, übereinander liegen oder gemeinsam ausfädeln.
Die Schnitte haben alle Gewerke zu berücksichtigen. Der Planer soll mit ihnen prüfen und zeigen,
dass der angenommene Installationsraum ausreichend ist und benötigt wird.`;

      Plaeneteilaufgabenliste[3][2]      = [];
      Plaeneteilaufgabenliste[3][2][0]   = { AufgabenbereichID: "plaene", Beschreibung: "",   Bezeichnung: "Schnitte",  id: "plaene_schnitte" };
      Plaeneteilaufgabenliste[3][2][410] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schnitte" };
      Plaeneteilaufgabenliste[3][2][475] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schnitte" };
      Plaeneteilaufgabenliste[3][2][420] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schnitte" };
      Plaeneteilaufgabenliste[3][2][430] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schnitte" };
      Plaeneteilaufgabenliste[3][2][434] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schnitte" };
      Plaeneteilaufgabenliste[3][2][440] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schnitte" };
      Plaeneteilaufgabenliste[3][2][450] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schnitte" };
      Plaeneteilaufgabenliste[3][2][460] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schnitte" };
      Plaeneteilaufgabenliste[3][2][480] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schnitte" };

      Text = `Belegung der Schächte an der Stelle der jeweils größten Installationsdichte,
inklusive Hinweis auf die Art des Brandschutzes`;

      Plaeneteilaufgabenliste[3][3]      = [];
      Plaeneteilaufgabenliste[3][3][0]   = { AufgabenbereichID: "plaene", Beschreibung: "",   Bezeichnung: "Schächte",  id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[3][3][410] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[3][3][475] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[3][3][420] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[3][3][430] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[3][3][434] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[3][3][440] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[3][3][450] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[3][3][460] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[3][3][480] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };


      Plaeneteilaufgabenliste[4][0]      = [];
      Plaeneteilaufgabenliste[4][0][0]   = { AufgabenbereichID: "plaene", Beschreibung: "",   Bezeichnung: "Grundrisse", id: "plaene_grundrisse" };
      Plaeneteilaufgabenliste[4][0][410] = { AufgabenbereichID: "plaene", Beschreibung: "Darstellung mit Haupt-<br>imensionen<br>Objekte, Anschlusspunkte<br>Feuerlöscheinrichtungen<br>Hydranten, Sprinkler<br>Gaslöschdüsen", Bezeichnung: "",          id: "plaene_grundrisse" };
      Plaeneteilaufgabenliste[4][0][475] = { AufgabenbereichID: "plaene", Beschreibung: "Darstellung mit Haupt-<br>imensionen<br>Objekte, Anschlusspunkte<br>Feuerlöscheinrichtungen<br>Hydranten, Sprinkler<br>Gaslöschdüsen", Bezeichnung: "",          id: "plaene_grundrisse" };
      Plaeneteilaufgabenliste[4][0][420] = { AufgabenbereichID: "plaene", Beschreibung: "Darstellung mit Haupt-<br>Dimensionen<br>Heizflächen<br>Absperr- u.<br>Regeleinrichtungen", Bezeichnung: "",          id: "plaene_grundrisse" };
      Plaeneteilaufgabenliste[4][0][430] = { AufgabenbereichID: "plaene", Beschreibung: "Darstellung mit Haupt-<br>Dimensionen<br>BSK, VSR, DK<br>Luftdurchlässe", Bezeichnung: "",          id: "plaene_grundrisse" };
      Plaeneteilaufgabenliste[4][0][434] = { AufgabenbereichID: "plaene", Beschreibung: "Darstellung mit Haupt-<br>Dimensionen<br>Kühlflächen<br>Absperr- u.<br>Regeleinrichtungen", Bezeichnung: "",          id: "plaene_grundrisse" };
      Plaeneteilaufgabenliste[4][0][440] = { AufgabenbereichID: "plaene", Beschreibung: "Darstellung mit Haupt-<br>Dimensionen<br>der Trassen- und<br>Schienensysteme<br>Schaltanlagen/-verteiler<br>Installationsgeräte<br>Beleuchtungskörper", Bezeichnung: "",          id: "plaene_grundrisse" };
      Plaeneteilaufgabenliste[4][0][450] = { AufgabenbereichID: "plaene", Beschreibung: "Darstellung mit Haupt-<br>Dimensionen<br>der Trassen<br>Installationsgeräte\<br>Einbauteile<br>z.B. Lautsprecher,<br>Brandmelder etc.", Bezeichnung: "",          id: "plaene_grundrisse" };
      Plaeneteilaufgabenliste[4][0][460] = { AufgabenbereichID: "plaene", Beschreibung: "Schachtzeichnung<br>Kabinenabmessungen", Bezeichnung: "",          id: "plaene_grundrisse" };
      Plaeneteilaufgabenliste[4][0][480] = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "",          id: this.Const.NONE     };

      Text = 'Möblierung<br>Hinweis auf die Art des Brandschutzes';

      Plaeneteilaufgabenliste[4][1]      = [];
      Plaeneteilaufgabenliste[4][1][0]   = { AufgabenbereichID: "plaene", Beschreibung: "",   Bezeichnung: "Schächte",  id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[4][1][410] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[4][1][475] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[4][1][420] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[4][1][430] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[4][1][434] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[4][1][440] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[4][1][450] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[4][1][460] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[4][1][480] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "",          id: this.Const.NONE };

      Plaeneteilaufgabenliste[5][0]      = [];
      Plaeneteilaufgabenliste[5][0][0]   = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "Allgemein", id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[5][0][410] = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "",          id: this.Const.NONE };
      Plaeneteilaufgabenliste[5][0][475] = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "",          id: this.Const.NONE };
      Plaeneteilaufgabenliste[5][0][420] = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "",          id: this.Const.NONE };
      Plaeneteilaufgabenliste[5][0][430] = { AufgabenbereichID: "plaene", Beschreibung: "Vorgaben für Nachund<br>Überströmungen", Bezeichnung: "", id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[5][0][434] = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "",          id: this.Const.NONE };
      Plaeneteilaufgabenliste[5][0][440] = { AufgabenbereichID: "plaene", Beschreibung: "symbolhafte Darstellung<br>der Bauteile<br>(Installationsgeräte,<br>Schalter, Steckdosen, etc.<br>; maßstabsgerecht<br>z.B. bei Leuchten etc.", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[5][0][450] = { AufgabenbereichID: "plaene", Beschreibung: "symbolhafte Darstellung<br>der Bauteile<br>(Lautsprecher, Brandmelder,<br>Sprechstellen<br>Antennen, Tableaus,<br>Datenanschlüsse etc.<br>maßstabsgerecht<br>z.B. bei Zentralgeräten", Bezeichnung: "",       id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[5][0][460] = { AufgabenbereichID: "plaene", Beschreibung: "Schachtzeichnung mit<br>Angaben zu Gerüstankern löchern,<br>Befestigungsschienen<br>der Fahrschienen,<br>Lasthaken, Rauchabzugsöffnungen etc.<br>Schachttüren<br>Zargenausbildung", Bezeichnung: "",          id: "plaene_allgemein" };
      Plaeneteilaufgabenliste[5][0][480] = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "",          id: this.Const.NONE     };

      Text = `Für Installationsschwerpunkte und Zentralen mit allen Gewerken
und der erforderlichen Bemaßung
Der Maßstab ist so zu wählen, dass Übersichtlichkeit und Verständnis gegeben sind.
Ein Installationsschwerpunkt liegt vor, wenn Gewerke kreuzen, übereinander liegen
oder gemeinsam ausfädeln.`;

      Plaeneteilaufgabenliste[5][1]      = [];
      Plaeneteilaufgabenliste[5][1][0]   = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "Schnitte/Details<br>min. 1:50", id: "plaene_details" };
      Plaeneteilaufgabenliste[5][1][410] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_details" };
      Plaeneteilaufgabenliste[5][1][475] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_details" };
      Plaeneteilaufgabenliste[5][1][420] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_details" };
      Plaeneteilaufgabenliste[5][1][430] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_details" };
      Plaeneteilaufgabenliste[5][1][434] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_details"};
      Plaeneteilaufgabenliste[5][1][440] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_details" };
      Plaeneteilaufgabenliste[5][1][450] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_details" };
      Plaeneteilaufgabenliste[5][1][460] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_details" };
      Plaeneteilaufgabenliste[5][1][480] = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "",   id: this.Const.NONE  };

      Text = `Schachtbelegung und Schachtausfädelung mit allen darin geplanten Gewerken inklusive der Brandschutzausführung.
      Die Zentralen und Schächte sind im Detail mit allen erforderlichen Schnitten darzustellen.
      Nach Bedarf sind die Zeichnungen im angemessenen Maßstab darzustellen.`;

      Plaeneteilaufgabenliste[5][2]      = [];
      Plaeneteilaufgabenliste[5][2][0]   = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "Schächte/Trassen", id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[5][2][410] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[5][2][475] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[5][2][420] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[5][2][430] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[5][2][434] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_schaechte"};
      Plaeneteilaufgabenliste[5][2][440] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[5][2][450] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[5][2][460] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_schaechte" };
      Plaeneteilaufgabenliste[5][2][480] = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "",   id: this.Const.NONE  };

      Text = `Eindeutige Darstellung von Schnittstellen einander tangierender Gewerke,
nutzer- bzw. bauherren- oder bauseitiger Leistungen
Darzustellen sind Anforderungen und Leistungsumfang z.B.`;

      Plaeneteilaufgabenliste[5][3]      = [];
      Plaeneteilaufgabenliste[5][3][0]   = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "Schnittstellen", id: "plaene_schnittstellen" };
      Plaeneteilaufgabenliste[5][3][410] = { AufgabenbereichID: "plaene", Beschreibung: Text + '<br><br>Anschlüsse an Sanitärzellen etc.', Bezeichnung: "", id: "plaene_schnittstellen" };
      Plaeneteilaufgabenliste[5][3][475] = { AufgabenbereichID: "plaene", Beschreibung: Text + '<br><br>Anschlüsse an Sanitärzellen etc.', Bezeichnung: "", id: "plaene_schnittstellen" };
      Plaeneteilaufgabenliste[5][3][420] = { AufgabenbereichID: "plaene", Beschreibung: Text + '<br><br>Anschlüsse an WWB<br>Anschlüsse RLT-Geräte etc.', Bezeichnung: "", id: "plaene_schnittstellen" };
      Plaeneteilaufgabenliste[5][3][430] = { AufgabenbereichID: "plaene", Beschreibung: Text + '<br><br>freier Querschnitt<br>bauseitiger WSG etc.', Bezeichnung: "", id: "plaene_schnittstellen" };
      Plaeneteilaufgabenliste[5][3][434] = { AufgabenbereichID: "plaene", Beschreibung: Text + '<br><br>Anschlüsse an<br>Kühldecken<br>oder Bauteilkühlung etc.', Bezeichnung: "", id: "plaene_schnittstellen"};
      Plaeneteilaufgabenliste[5][3][440] = { AufgabenbereichID: "plaene", Beschreibung: Text + '<br><br>Leerrohrinstallation etc.', Bezeichnung: "", id: "plaene_schnittstellen" };
      Plaeneteilaufgabenliste[5][3][450] = { AufgabenbereichID: "plaene", Beschreibung: Text + '<br><br>Leerrohrinstallation etc.', Bezeichnung: "", id: "plaene_schnittstellen" };
      Plaeneteilaufgabenliste[5][3][460] = { AufgabenbereichID: "plaene", Beschreibung: Text + '<br><br>Kommunikationseinrichtungen<br>Störmeldesysteme etc.', Bezeichnung: "", id: "plaene_schnittstellen" };
      Plaeneteilaufgabenliste[5][3][480] = { AufgabenbereichID: "plaene", Beschreibung: Text + '<br><br>Kabelbahnen<br>und Kabel<br>Schaltschrankansichten<br>und Dimensionen etc.', Bezeichnung: "", id: "plaene_schnittstellen" };

      Text = `z.B. für Deckenspiegel, Wandabwicklungen, Fliesenspiegel, Revisionsöffnungen
Schlitz- und Durchbruchangaben sowie Einbauten und Montageöffnungen
mit genauer Positionierung
Bemaßung mit eindeutigen Bezugsmaßen zum Gebäude`;

      Plaeneteilaufgabenliste[5][4]      = [];
      Plaeneteilaufgabenliste[5][4][0]   = { AufgabenbereichID: "plaene", Beschreibung: "", Bezeichnung: "Relevante Angaben für<br>andere Planungsbeteiligte", id: "plaene_angaben" };
      Plaeneteilaufgabenliste[5][4][410] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_angaben" };
      Plaeneteilaufgabenliste[5][4][475] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_angaben" };
      Plaeneteilaufgabenliste[5][4][420] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_angaben" };
      Plaeneteilaufgabenliste[5][4][430] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_angaben" };
      Plaeneteilaufgabenliste[5][4][434] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_angaben" };
      Plaeneteilaufgabenliste[5][4][440] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_angaben" };
      Plaeneteilaufgabenliste[5][4][450] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_angaben" };
      Plaeneteilaufgabenliste[5][4][460] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_angaben" };
      Plaeneteilaufgabenliste[5][4][480] = { AufgabenbereichID: "plaene", Beschreibung: Text, Bezeichnung: "", id: "plaene_angaben" };


      this.Aufgabenbereicheliste.push({
        id:                   'plaene',
        Bezeichnung:          "Pläne",
        Information:          ['', 'Maßstab 1:200', 'Maßstab 1:100', '', '', '', '', ''],
        Leistungsphasen:      [   2, 3, 4, 5, 6, 7, 8],
        Nummer:               [0, 5, 5, 5, 5, 0, 0, 0],
        Teilaufgabenbereiche: Plaeneteilaufgabenliste
      });

      Fortschreibungteilaufgabenliste    = [];
      Fortschreibungteilaufgabenliste[1] = [];
      Fortschreibungteilaufgabenliste[2] = [];
      Fortschreibungteilaufgabenliste[3] = [];
      Fortschreibungteilaufgabenliste[4] = [];
      Fortschreibungteilaufgabenliste[5] = [];
      Fortschreibungteilaufgabenliste[6] = [];
      Fortschreibungteilaufgabenliste[7] = [];
      Fortschreibungteilaufgabenliste[8] = [];

      Text = `Planung fortschreiben`;

      Fortschreibungteilaufgabenliste[5][0]      = [];
      Fortschreibungteilaufgabenliste[5][0][0]   = { AufgabenbereichID: "fort", Beschreibung: "",   Bezeichnung: "Allgemein", id: "fort_allgemein" };
      Fortschreibungteilaufgabenliste[5][0][410] = { AufgabenbereichID: "fort", Beschreibung: Text, Bezeichnung: "",          id: "fort_allgemein" };
      Fortschreibungteilaufgabenliste[5][0][475] = { AufgabenbereichID: "fort", Beschreibung: Text, Bezeichnung: "",          id: "fort_allgemein" };
      Fortschreibungteilaufgabenliste[5][0][420] = { AufgabenbereichID: "fort", Beschreibung: Text, Bezeichnung: "",          id: "fort_allgemein" };
      Fortschreibungteilaufgabenliste[5][0][430] = { AufgabenbereichID: "fort", Beschreibung: Text, Bezeichnung: "",          id: "fort_allgemein" };
      Fortschreibungteilaufgabenliste[5][0][434] = { AufgabenbereichID: "fort", Beschreibung: Text, Bezeichnung: "",          id: "fort_allgemein" };
      Fortschreibungteilaufgabenliste[5][0][440] = { AufgabenbereichID: "fort", Beschreibung: Text, Bezeichnung: "",          id: "fort_allgemein" };
      Fortschreibungteilaufgabenliste[5][0][450] = { AufgabenbereichID: "fort", Beschreibung: Text, Bezeichnung: "",          id: "fort_allgemein" };
      Fortschreibungteilaufgabenliste[5][0][460] = { AufgabenbereichID: "fort", Beschreibung: Text, Bezeichnung: "",          id: "fort_allgemein" };
      Fortschreibungteilaufgabenliste[5][0][480] = { AufgabenbereichID: "fort", Beschreibung: Text, Bezeichnung: "",          id: "fort_allgemein" };


      this.Aufgabenbereicheliste.push({
        id:                     'fort',
        Bezeichnung:          "Fortschreibung",
        Information:          ['', '', '', '', '', '', '', ''],
        Leistungsphasen:      [            5         ],
        Nummer:               [0, 0, 0, 0, 6, 0, 0, 0],
        Teilaufgabenbereiche: Fortschreibungteilaufgabenliste
      });


      Koordinationteilaufgabenliste    = [];
      Koordinationteilaufgabenliste[1] = [];
      Koordinationteilaufgabenliste[2] = [];
      Koordinationteilaufgabenliste[3] = [];
      Koordinationteilaufgabenliste[4] = [];
      Koordinationteilaufgabenliste[5] = [];
      Koordinationteilaufgabenliste[6] = [];
      Koordinationteilaufgabenliste[7] = [];
      Koordinationteilaufgabenliste[8] = [];

      Text = `Koordination`;

      Koordinationteilaufgabenliste[2][0]      = [];
      Koordinationteilaufgabenliste[2][0][0]   = { AufgabenbereichID: "koord", Beschreibung: "",   Bezeichnung: "Allgemein", id: "koord_allgemein" };
      Koordinationteilaufgabenliste[2][0][410] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[2][0][475] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[2][0][420] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[2][0][430] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[2][0][434] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[2][0][440] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[2][0][450] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[2][0][460] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[2][0][480] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };

      Text = `Schnittstellen`;

      Koordinationteilaufgabenliste[3][0]      = [];
      Koordinationteilaufgabenliste[3][0][0]   = { AufgabenbereichID: "koord", Beschreibung: "",   Bezeichnung: "Allgemein", id: "koord_allgemein" };
      Koordinationteilaufgabenliste[3][0][410] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[3][0][475] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[3][0][420] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[3][0][430] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[3][0][434] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[3][0][440] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[3][0][450] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[3][0][460] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };
      Koordinationteilaufgabenliste[3][0][480] = { AufgabenbereichID: "koord", Beschreibung: Text, Bezeichnung: "",          id: "koord_allgemein" };


      this.Aufgabenbereicheliste.push({
        id:                     'koord',
        Bezeichnung:          "Koordination",
        Information:          ['', '', '', '', '', '', '', ''],
        Leistungsphasen:      [   2, 3,     , 6, 7, 8],
        Nummer:               [0, 6, 6, 0, 0, 0, 0, 0],
        Teilaufgabenbereiche: Koordinationteilaufgabenliste
      });


      Bauangabenteilaufgabenliste    = [];
      Bauangabenteilaufgabenliste[1] = [];
      Bauangabenteilaufgabenliste[2] = [];
      Bauangabenteilaufgabenliste[3] = [];
      Bauangabenteilaufgabenliste[4] = [];
      Bauangabenteilaufgabenliste[5] = [];
      Bauangabenteilaufgabenliste[6] = [];
      Bauangabenteilaufgabenliste[7] = [];
      Bauangabenteilaufgabenliste[8] = [];

      Text = `In diesem Stadium der Planung brauchen diese Informationen nicht durch S+D-Pläne
gemacht werden. Die Angaben müssen jedoch eindeutig sein.`;

      Bauangabenteilaufgabenliste[3][0]      = [];
      Bauangabenteilaufgabenliste[3][0][0]   = { AufgabenbereichID: "bauangaben", Beschreibung: "",   Bezeichnung: "Allgemein", id: "bauangaben_allgemein" };
      Bauangabenteilaufgabenliste[3][0][410] = { AufgabenbereichID: "bauangaben", Beschreibung: Text, Bezeichnung: "",          id: "bauangaben_allgemein" };
      Bauangabenteilaufgabenliste[3][0][475] = { AufgabenbereichID: "bauangaben", Beschreibung: Text, Bezeichnung: "",          id: "bauangaben_allgemein" };
      Bauangabenteilaufgabenliste[3][0][420] = { AufgabenbereichID: "bauangaben", Beschreibung: Text, Bezeichnung: "",          id: "bauangaben_allgemein" };
      Bauangabenteilaufgabenliste[3][0][430] = { AufgabenbereichID: "bauangaben", Beschreibung: Text, Bezeichnung: "",          id: "bauangaben_allgemein" };
      Bauangabenteilaufgabenliste[3][0][434] = { AufgabenbereichID: "bauangaben", Beschreibung: Text, Bezeichnung: "",          id: "bauangaben_allgemein" };
      Bauangabenteilaufgabenliste[3][0][440] = { AufgabenbereichID: "bauangaben", Beschreibung: Text, Bezeichnung: "",          id: "bauangaben_allgemein" };
      Bauangabenteilaufgabenliste[3][0][450] = { AufgabenbereichID: "bauangaben", Beschreibung: Text, Bezeichnung: "",          id: "bauangaben_allgemein" };
      Bauangabenteilaufgabenliste[3][0][460] = { AufgabenbereichID: "bauangaben", Beschreibung: Text, Bezeichnung: "",          id: "bauangaben_allgemein" };
      Bauangabenteilaufgabenliste[3][0][480] = { AufgabenbereichID: "bauangaben", Beschreibung: Text, Bezeichnung: "",          id: "bauangaben_allgemein" };

      this.Aufgabenbereicheliste.push({
        id:                     'bauangaben',
        Bezeichnung:          "Bauangaben",
        Information:          ['', '', '', '', '', '', '', ''],
        Leistungsphasen:      [      3 ],
        Nummer:               [0, 0, 7, 0, 0, 0, 0, 0],
        Teilaufgabenbereiche: Bauangabenteilaufgabenliste
      });

      Erlaeuterungteilaufgabenliste    = [];
      Erlaeuterungteilaufgabenliste[1] = [];
      Erlaeuterungteilaufgabenliste[2] = [];
      Erlaeuterungteilaufgabenliste[3] = [];
      Erlaeuterungteilaufgabenliste[4] = [];
      Erlaeuterungteilaufgabenliste[5] = [];
      Erlaeuterungteilaufgabenliste[6] = [];
      Erlaeuterungteilaufgabenliste[7] = [];
      Erlaeuterungteilaufgabenliste[8] = [];

      Text = `Erläuterungsbericht`;

      Erlaeuterungteilaufgabenliste[2][0]      = [];
      Erlaeuterungteilaufgabenliste[2][0][0]   = { AufgabenbereichID: "erbe", Beschreibung: "",   Bezeichnung: "Allgemein", id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[2][0][410] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[2][0][475] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[2][0][420] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[2][0][430] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[2][0][434] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[2][0][440] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[2][0][450] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[2][0][460] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[2][0][480] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };

      Text = `Erläuterungsbericht`;

      Erlaeuterungteilaufgabenliste[3][0]      = [];
      Erlaeuterungteilaufgabenliste[3][0][0]   = { AufgabenbereichID: "erbe", Beschreibung: "",   Bezeichnung: "Allgemein", id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[3][0][410] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[3][0][475] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[3][0][420] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[3][0][430] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[3][0][434] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[3][0][440] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[3][0][450] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[3][0][460] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[3][0][480] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };


      Text = `Erläuterungsbericht`;

      Erlaeuterungteilaufgabenliste[4][0]      = [];
      Erlaeuterungteilaufgabenliste[4][0][0]   = { AufgabenbereichID: "erbe", Beschreibung: "",   Bezeichnung: "Allgemein", id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[4][0][410] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[4][0][475] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[4][0][420] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[4][0][430] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[4][0][434] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[4][0][440] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[4][0][450] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[4][0][460] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };
      Erlaeuterungteilaufgabenliste[4][0][480] = { AufgabenbereichID: "erbe", Beschreibung: Text, Bezeichnung: "",          id: "erbe_allgemein" };



      this.Aufgabenbereicheliste.push({
        id: 'erbe',
        Bezeichnung: "Erläuterung",
        Information:     ['', '', '', '', '', '', '', ''],
        Leistungsphasen: [   2, 3, 4,  , 6, 7, 8],
        Nummer:          [0, 7, 8, 6, 0, 0, 0, 0],
        Teilaufgabenbereiche: Erlaeuterungteilaufgabenliste
      });

      Kostenteilaufgabenliste    = [];
      Kostenteilaufgabenliste[1] = [];
      Kostenteilaufgabenliste[2] = [];
      Kostenteilaufgabenliste[3] = [];
      Kostenteilaufgabenliste[4] = [];
      Kostenteilaufgabenliste[5] = [];
      Kostenteilaufgabenliste[6] = [];
      Kostenteilaufgabenliste[7] = [];
      Kostenteilaufgabenliste[8] = [];

      Text = `Kostenschätzung`;

      Kostenteilaufgabenliste[2][0]      = [];
      Kostenteilaufgabenliste[2][0][0]   = { AufgabenbereichID: "kosten", Beschreibung: "",   Bezeichnung: "Allgemein", id: "kosten_allgemein" };
      Kostenteilaufgabenliste[2][0][410] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[2][0][475] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[2][0][420] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[2][0][430] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[2][0][434] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[2][0][440] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[2][0][450] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[2][0][460] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[2][0][480] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };

      Text = `Kostenberechnung`;

      Kostenteilaufgabenliste[3][0]      = [];
      Kostenteilaufgabenliste[3][0][0]   = { AufgabenbereichID: "kosten", Beschreibung: "",   Bezeichnung: "Allgemein", id: "kosten_allgemein" };
      Kostenteilaufgabenliste[3][0][410] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[3][0][475] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[3][0][420] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[3][0][430] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[3][0][434] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[3][0][440] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[3][0][450] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[3][0][460] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };
      Kostenteilaufgabenliste[3][0][480] = { AufgabenbereichID: "kosten", Beschreibung: Text, Bezeichnung: "",          id: "kosten_allgemein" };


      this.Aufgabenbereicheliste.push({
        id:                   'kosten',
        Bezeichnung:          "Kosten",
        Information:          ['', '', '', '', '', '', '', ''],
        Leistungsphasen:      [   2, 3,     , 6, 7, 8],
        Nummer:               [0, 8, 9, 0, 0, 0, 0, 0],
        Teilaufgabenbereiche: Kostenteilaufgabenliste
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'InitAufgabenbereicheliste', this.Debug.Typen.Service);
    }
  }

  public CountVisisbleKosten(): number {

    try {

      let VisibleKosten = 0;

      for(let Kosten of this.Kostengruppenliste) {

        if(Kosten.Display) VisibleKosten++;
      }

      return VisibleKosten;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'CountVisisbleKosten', this.Debug.Typen.Service);
    }
  }

  private InitSchematatextliste() {

    try {

      let Text: string;

      this.Schematatextliste = [];
      this.Schematatextliste[1] = [];

      Text = `Funktions- bzw. Prinzipschemata zur Darstellung der Grundfunktionen der geplanten Anlagen mit den wesentlichen Komponenten`;

      this.Schematatextliste[2]   = [];
      this.Schematatextliste[2][410] = Text;
      this.Schematatextliste[2][475] = Text;
      this.Schematatextliste[2][420] = Text;
      this.Schematatextliste[2][430] = Text;
      this.Schematatextliste[2][434] = Text;
      this.Schematatextliste[2][440] = Text;
      this.Schematatextliste[2][450] = Text;
      this.Schematatextliste[2][460] = Text;
      this.Schematatextliste[2][480] = Text;

      Text = `Funktionsschemata zur Darstellung der Funktionen der geplanten Anlagen falls erforderlich.\nAlle für das Brandschutzkonzept
      notwendigen Zeichnungen.`;

      this.Schematatextliste[3]   = [];
      this.Schematatextliste[3][410] = Text;
      this.Schematatextliste[3][475] = Text;
      this.Schematatextliste[3][420] = Text;
      this.Schematatextliste[3][430] = Text;
      this.Schematatextliste[3][434] = Text;
      this.Schematatextliste[3][440] = Text;
      this.Schematatextliste[3][450] = Text;
      this.Schematatextliste[3][460] = Text;
      this.Schematatextliste[3][480] = Text;

      Text = `Funktionsschemata zur Darstellung der Funktionen der geplanten Anlagen
mit den relevanten Anlagenbauteilen sowie alle für das Brandschutzkonzept
notwendigen Darstellungen falls erforderlich`;

      this.Schematatextliste[4]   = [];
      this.Schematatextliste[4][410] = Text;
      this.Schematatextliste[4][475] = Text;
      this.Schematatextliste[4][420] = Text;
      this.Schematatextliste[4][430] = Text;
      this.Schematatextliste[4][434] = Text;
      this.Schematatextliste[4][440] = Text;
      this.Schematatextliste[4][450] = Text;
      this.Schematatextliste[4][460] = Text;
      this.Schematatextliste[4][480] = Text;

      Text = `Schemata mit zugehörigen Leistungsdaten, Dimensionen, Voreinstellungen
und Komponenten inklusive Gebäudeautomationskomponenten,
die für eine Funktion der Anlage erforderlich sind`;

      this.Schematatextliste[5]   = [];
      this.Schematatextliste[5][410] = Text;
      this.Schematatextliste[5][475] = Text;
      this.Schematatextliste[5][420] = Text;
      this.Schematatextliste[5][430] = Text;
      this.Schematatextliste[5][434] = Text;
      this.Schematatextliste[5][440] = Text;
      this.Schematatextliste[5][450] = Text;
      this.Schematatextliste[5][460] = Text;
      this.Schematatextliste[5][480] = Text;

      this.Schematatextliste[6] = [];
      this.Schematatextliste[7] = [];
      this.Schematatextliste[8] = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'InitSchematatextliste', this.Debug.Typen.Service);
    }
  }
}
