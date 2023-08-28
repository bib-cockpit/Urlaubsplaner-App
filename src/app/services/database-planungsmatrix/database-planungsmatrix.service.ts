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
  public Leistungsphase: number;
  public MusterprojektAktiv: boolean;
  public Zielvorgabentextliste: string[][];
  public Berechnungentextliste: string[][];
  public Bemessungentextliste: string[][];
  public Schematatextliste: string[][];
  public Plaenetextliste: string[][];
  public Koordinationtextliste: string[][];
  public Erlaeuterungtextliste: string[][];
  public Kostentextliste: string[][];
  public ShowBeschreibungen: boolean;
  public Musterprojekt: Projektestruktur;

  public DisplayKostengruppenChanged = new EventEmitter<any>();

  constructor(private Debug: DebugProvider,
              private Pool: DatabasePoolService,
              private Const: ConstProvider) {
    try {

      this.Leistungsphase     = 2;
      this.MusterprojektAktiv = true;
      this.ShowBeschreibungen = true;
      this.Musterprojekt      = null;

      this.InitAufgabenbereicheliste();
      this.InitZielvorgabentextliste();
      this.InitBerechnungentextliste();
      this.InitBemessungentextliste();
      this.InitSchematatextliste();
      this.InitPlaenetextliste();
      this.InitKoordinationtextliste();
      this.InitErlaeuterungtextliste();
      this.InitKostentextliste();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Planungsmatrix', 'constructor', this.Debug.Typen.Service);
    }
  }


  private InitKoordinationtextliste() {

    try {

      this.Koordinationtextliste = [];
      this.Koordinationtextliste[1] = [];

      let Text = `Abstimmung des technischen Gesamtkonzepts für eine passende technische und wirtschaftliche Gesamtlösung unter Beachtung der Zielvorgaben
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

      this.Koordinationtextliste[3] = [];
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

    this.Erlaeuterungtextliste = [];
    this.Erlaeuterungtextliste[1] = [];

    let Text = `Fazit aus der Grundlagenermittlung bzw. Stellungsnahme, falls diese durch Dritte erstellt wurde. Der Erläuterungsbericht enthält alle
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

    this.Erlaeuterungtextliste[3] = [];
    this.Erlaeuterungtextliste[4] = [];
    this.Erlaeuterungtextliste[5] = [];
    this.Erlaeuterungtextliste[6] = [];
    this.Erlaeuterungtextliste[7] = [];
    this.Erlaeuterungtextliste[8] = [];

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'InitErlaeuterungtextliste', this.Debug.Typen.Service);
    }
  }
  private InitKostentextliste() {

    try {

      this.Kostentextliste = [];
      this.Kostentextliste[1] = [];

      let Text = `Anlagenspezifisch getrennt nach Zonen, Bauteilen oder Funktionsbereichen nach Vorgaben des AG bzw. des Architekten bis zur 2.
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

      this.Kostentextliste[3] = [];
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

      this.Bemessungentextliste = [];
      this.Bemessungentextliste[1] = [];

      let Text = `Grobbemessung`;

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

      this.Bemessungentextliste[3] = [];
      this.Bemessungentextliste[4] = [];
      this.Bemessungentextliste[5] = [];
      this.Bemessungentextliste[6] = [];
      this.Bemessungentextliste[7] = [];
      this.Bemessungentextliste[8] = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'InitBemessungentextliste', this.Debug.Typen.Service);
    }
  }

  private InitPlaenetextliste() {

    try {

      this.Plaenetextliste = [];
      this.Plaenetextliste[1] = [];

      let Text = `Einstrichdarstellung`;

      this.Plaenetextliste[2]   = [];
      this.Plaenetextliste[2][410] = Text;
      this.Plaenetextliste[2][475] = Text;
      this.Plaenetextliste[2][420] = Text;
      this.Plaenetextliste[2][430] = Text;
      this.Plaenetextliste[2][434] = Text;
      this.Plaenetextliste[2][440] = Text;
      this.Plaenetextliste[2][450] = Text;
      this.Plaenetextliste[2][460] = Text;
      this.Plaenetextliste[2][480] = Text;

      this.Plaenetextliste[3] = [];
      this.Plaenetextliste[4] = [];
      this.Plaenetextliste[5] = [];
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

      this.Berechnungentextliste[3] = [];
      this.Berechnungentextliste[4] = [];
      this.Berechnungentextliste[5] = [];
      this.Berechnungentextliste[6] = [];
      this.Berechnungentextliste[7] = [];
      this.Berechnungentextliste[8] = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'InitBerechnungentextliste', this.Debug.Typen.Service);
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

      this.Zielvorgabentextliste[3] = [];
      this.Zielvorgabentextliste[4] = [];
      this.Zielvorgabentextliste[5] = [];
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
      let Koordinationteilaufgabenliste: Teilaufgabeestruktur[][][];
      let Erlaeuterungteilaufgabenliste: Teilaufgabeestruktur[][][];
      let Kostenteilaufgabenliste:       Teilaufgabeestruktur[][][];

      this.Aufgabenbereicheliste  = [];
      this.Aufgabenbereicheliste  = [];
      Zielvorgabenteilaufgaben    = [];
      Zielvorgabenteilaufgaben[1] = [];

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

      Zielvorgabenteilaufgaben[2] = [];
      Zielvorgabenteilaufgaben[3] = [];
      Zielvorgabenteilaufgaben[4] = [];
      Zielvorgabenteilaufgaben[5] = [];
      Zielvorgabenteilaufgaben[6] = [];
      Zielvorgabenteilaufgaben[7] = [];
      Zielvorgabenteilaufgaben[8] = [];

      this.Aufgabenbereicheliste.push({
        id:              'ziel',
        Bezeichnung:     "Zielvorgaben",
        Beschreibung:    '',
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
      Berechnungenteilaufgaben[2][0][0]   = { AufgabenbereichID: "berech", Beschreibung: "",   Bezeichnung: "Auslegung", id: "berech_ausegung" };
      Berechnungenteilaufgaben[2][0][410] = { AufgabenbereichID: "berech", Beschreibung: "Verbrauchsmengen, Entsorgungsmengen", Bezeichnung: "",          id: "berech_ausegung" };
      Berechnungenteilaufgaben[2][0][475] = { AufgabenbereichID: "berech", Beschreibung: "Verbrauchsmengen, Entsorgungsmengen", Bezeichnung: "",          id: "berech_ausegung" };
      Berechnungenteilaufgaben[2][0][420] = { AufgabenbereichID: "berech", Beschreibung: "Heizlast, Gleichzeitigkeitsfaktoren", Bezeichnung: "",          id: "berech_ausegung" };
      Berechnungenteilaufgaben[2][0][430] = { AufgabenbereichID: "berech", Beschreibung: "Luftwechsel Volumenströme für einzelne Anlagen. Heiz-, Kühl-, Befeuchtungs- und Elektroleistungen", Bezeichnung: "",          id: "berech_ausegung" };
      Berechnungenteilaufgaben[2][0][434] = { AufgabenbereichID: "berech", Beschreibung: "stat. Kältebedarf, dyn. Kältebedarf, Gleichzeitigkeitsfaktoren", Bezeichnung: "",          id: "berech_ausegung" };
      Berechnungenteilaufgaben[2][0][440] = { AufgabenbereichID: "berech", Beschreibung: "Leistungsbedarf. Aufgeschlüsselte Leistungsbilanz für Netz- und NEA dto. Hauptverbraucher (RLT, Kälte, Aufzüge, Beleuchtung). Gleichzeitigkeitsfaktoren", Bezeichnung: "",          id: "berech_ausegung" };
      Berechnungenteilaufgaben[2][0][450] = { AufgabenbereichID: "berech", Beschreibung: "Leistungsbedarf", Bezeichnung: "",          id: "berech_ausegung" };
      Berechnungenteilaufgaben[2][0][460] = { AufgabenbereichID: "berech", Beschreibung: "Förderleistungsberechnung", Bezeichnung: "",          id: "berech_ausegung" };
      Berechnungenteilaufgaben[2][0][480] = { AufgabenbereichID: "berech", Beschreibung: "", Bezeichnung: "",          id: this.Const.NONE };


      this.Aufgabenbereicheliste.push(
        {
          id:                   'berech',
          Bezeichnung:          "Berechnungen",
          Beschreibung:         '',
          Leistungsphasen:      [1, 2, 3, 4, 5, 6, 7, 8],
          Nummer:               [2, 2, 1, 1, 1, 1, 1, 1],
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

      this.Aufgabenbereicheliste.push({
        id:                   'bemess',
        Bezeichnung:          "Bemessungen",
        Beschreibung:         '',
        Leistungsphasen:      [   2, 3, 4, 5, 6, 7, 8],
        Nummer:               [0, 3, 1, 1, 1, 1, 1, 1],
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

      Text = `Erläuterungsbericht`;

      Schematateilaufgabenliste[2][0]      = [];
      Schematateilaufgabenliste[2][0][0]   = { AufgabenbereichID: "schema", Beschreibung: "",   Bezeichnung: "Anlagen",   id: "erbe_anlagen" };
      Schematateilaufgabenliste[2][0][410] = { AufgabenbereichID: "schema", Beschreibung: "TWK, TWW VErsorgung, SW, RW Entsorgung", Bezeichnung: "", id: "erbe_anlagen" };
      Schematateilaufgabenliste[2][0][475] = { AufgabenbereichID: "schema", Beschreibung: "TWK, TWW VErsorgung, SW, RW Entsorgung", Bezeichnung: "", id: "erbe_anlagen" };
      Schematateilaufgabenliste[2][0][420] = { AufgabenbereichID: "schema", Beschreibung: "Wärmeversorgung",                        Bezeichnung: "", id: "erbe_anlagen" };
      Schematateilaufgabenliste[2][0][430] = { AufgabenbereichID: "schema", Beschreibung: "charakteristische Anlagen",              Bezeichnung: "", id: "erbe_anlagen" };
      Schematateilaufgabenliste[2][0][434] = { AufgabenbereichID: "schema", Beschreibung: "Kälteversorgung",                        Bezeichnung: "", id: "erbe_anlagen" };
      Schematateilaufgabenliste[2][0][440] = { AufgabenbereichID: "schema", Beschreibung: "Stromversorgung",                        Bezeichnung: "", id: "erbe_anlagen" };
      Schematateilaufgabenliste[2][0][450] = { AufgabenbereichID: "schema", Beschreibung: "BMA, SiBe, TK, etc. ",                   Bezeichnung: "", id: "erbe_anlagen" };
      Schematateilaufgabenliste[2][0][460] = { AufgabenbereichID: "schema", Beschreibung: "Förderhöhe, Haltestellen, Antriebsart",  Bezeichnung: "", id: "erbe_anlagen" };
      Schematateilaufgabenliste[2][0][480] = { AufgabenbereichID: "schema", Beschreibung: "Übersichtsschema",                       Bezeichnung: "", id: "erbe_anlagen" };


      this.Aufgabenbereicheliste.push({
        id:                   'schema',
        Bezeichnung:          "Schemata",
        Beschreibung:         '',
        Leistungsphasen:      [   2, 3, 4, 5, 6, 7, 8],
        Nummer:               [0, 4, 1, 1, 1, 1, 1, 1],
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

      this.Aufgabenbereicheliste.push({
        id:                   'plaene',
        Bezeichnung:          "Pläne",
        Beschreibung:         '',
        Leistungsphasen:      [   2, 3, 4, 5, 6, 7, 8],
        Nummer:               [0, 5, 1, 1, 1, 1, 1, 1],
        Teilaufgabenbereiche: Plaeneteilaufgabenliste
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


      this.Aufgabenbereicheliste.push({
        id:                     'koord',
        Bezeichnung:          "Koordination",
        Beschreibung:         '',
        Leistungsphasen:      [   2, 3, 4, 5, 6, 7, 8],
        Nummer:               [0, 6, 1, 1, 1, 1, 1, 1],
        Teilaufgabenbereiche: Koordinationteilaufgabenliste
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

      this.Aufgabenbereicheliste.push({
        id: 'erbe',
        Bezeichnung: "Erläuterung",
        Beschreibung: '',
        Leistungsphasen: [   2, 3, 4, 5, 6, 7, 8],
        Nummer: [0, 7, 1, 1, 1, 1, 1, 1],
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


      this.Aufgabenbereicheliste.push({
        id:                   'kosten',
        Bezeichnung:          "Kosten",
        Beschreibung:         '',
        Leistungsphasen:      [   2, 3, 4, 5, 6, 7, 8],
        Nummer:               [0, 8, 1, 1, 1, 1, 1, 1],
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

      this.Schematatextliste[3] = [];
      this.Schematatextliste[4] = [];
      this.Schematatextliste[5] = [];
      this.Schematatextliste[6] = [];
      this.Schematatextliste[7] = [];
      this.Schematatextliste[8] = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Planungsmatrix', 'InitSchematatextliste', this.Debug.Typen.Service);
    }
  }
}
