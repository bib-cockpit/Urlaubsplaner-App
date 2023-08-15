import { Injectable } from '@angular/core';
import {Kostengruppenstruktur} from "../../dataclasses/kostengruppenstruktur";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {DebugProvider} from "../debug/debug";
import * as lodash from 'lodash-es';
import {Projektestruktur} from "../../dataclasses/projektestruktur";

@Injectable({
  providedIn: 'root'
})
export class KostengruppenService {

    public Kostengruppentypen = {

      Obergruppe:  'Obergruppe',
      Hauptgruppe: 'Hauptgruppe',
      Untergruppe: 'Untergruppe'
    };

    public Kostengruppen: Kostengruppenstruktur[] = [
    {
      Typ: "Obergruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 100,
      Hauptgruppennummer: null,
      Bezeichnung: "Grundstück"
    },
    {
      Typ: "Hauptgruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 110,
      Hauptgruppennummer: null,
      Bezeichnung: "Grundstückswert"
    },
    {
      Typ: "Hauptgruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 120,
      Hauptgruppennummer: null,
      Bezeichnung: "Grundstücksnebenkosten"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 121,
      Hauptgruppennummer: 120,
      Bezeichnung: "Vermessungsgebühren"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 122,
      Hauptgruppennummer: 120,
      Bezeichnung: "Gerichtsgebühren"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 123,
      Hauptgruppennummer: 120,
      Bezeichnung: "Notargebühren"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 124,
      Hauptgruppennummer: 120,
      Bezeichnung: "Grunderwerbsteuer"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 125,
      Hauptgruppennummer: 120,
      Bezeichnung: "Untersuchungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 126,
      Hauptgruppennummer: 120,
      Bezeichnung: "Wertermittlungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 127,
      Hauptgruppennummer: 120,
      Bezeichnung: "Genehmigungsgebühren"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 128,
      Hauptgruppennummer: 120,
      Bezeichnung: "Bodenordnung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 129,
      Hauptgruppennummer: 120,
      Bezeichnung: "Sonstiges zur KG 120"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 130,
      Hauptgruppennummer: null,
      Bezeichnung: "Rechte Dritter"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 131,
      Hauptgruppennummer: 130,
      Bezeichnung: "Abfindungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 132,
      Hauptgruppennummer: 130,
      Bezeichnung: "Ablösen dringlicher Rechte"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 100,
      Kostengruppennummer: 139,
      Hauptgruppennummer: 130,
      Bezeichnung: "Sonstiges zur KG 130"
    },
    {Typ: "Obergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 200,
      Hauptgruppennummer: null,
      Bezeichnung: "Vorbereitende Maßnahmen (Herrichten + Erschließen)"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 210,
      Hauptgruppennummer: null,
      Bezeichnung: "Herrichten"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 211,
      Hauptgruppennummer: 210,
      Bezeichnung: "Sicherungsmaßnahmen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 212,
      Hauptgruppennummer: 210,
      Bezeichnung: "Abbruchmaßnahmen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 213,
      Hauptgruppennummer: 210,
      Bezeichnung: "Altlastenbeseitigung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 214,
      Hauptgruppennummer: 210,
      Bezeichnung: "Herrichten der Geländeoberfläche"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 215,
      Hauptgruppennummer: 210,
      Bezeichnung: "Kampfmittelräumung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 216,
      Hauptgruppennummer: 210,
      Bezeichnung: "Kulturhistorische Funde"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 219,
      Hauptgruppennummer: 210,
      Bezeichnung: "Sonstiges zu KG 210"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 220,
      Hauptgruppennummer: null,
      Bezeichnung: "Öffentliche Erschließung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 221,
      Hauptgruppennummer: 220,
      Bezeichnung: "Abwasserentsorgung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 222,
      Hauptgruppennummer: 220,
      Bezeichnung: "Wasserversorgung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 223,
      Hauptgruppennummer: 220,
      Bezeichnung: "Gasversorgung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 224,
      Hauptgruppennummer: 220,
      Bezeichnung: "Fernwärmeversorgung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 225,
      Hauptgruppennummer: 220,
      Bezeichnung: "Stromversorgung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 226,
      Hauptgruppennummer: 220,
      Bezeichnung: "Telekommunikation"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 227,
      Hauptgruppennummer: 220,
      Bezeichnung: "Verkehrserschließung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 228,
      Hauptgruppennummer: 220,
      Bezeichnung: "Abfallentsorgung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 229,
      Hauptgruppennummer: 220,
      Bezeichnung: "Sonstiges zu KG 220"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 230,
      Hauptgruppennummer: null,
      Bezeichnung: "Nichtöffentliche Erschließung"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 240,
      Hauptgruppennummer: null,
      Bezeichnung: "Ausgleichsabgaben"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 241,
      Hauptgruppennummer: 240,
      Bezeichnung: "Ausgleichsmaßnahmen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 241,
      Hauptgruppennummer: 240,
      Bezeichnung: "Ausgmeichsabgaben"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 249,
      Hauptgruppennummer: 240,
      Bezeichnung: "Sonstiges zur KG 240"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 250,
      Hauptgruppennummer: null,
      Bezeichnung: "Übergangsmaßnahmen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 251,
      Hauptgruppennummer: 250,
      Bezeichnung: "Provisorien"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 252,
      Hauptgruppennummer: 250,
      Bezeichnung: "Auslagerungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 200,
      Kostengruppennummer: 259,
      Hauptgruppennummer: 250,
      Bezeichnung: "Sonstiges zur KG 240"
    },
    {Typ: "Obergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 300,
      Hauptgruppennummer: null,
      Bezeichnung: "Bauwerk – Baukonstruktionen"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 310,
      Hauptgruppennummer: null,
      Bezeichnung: "Baugrube"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 311,
      Hauptgruppennummer: 310,
      Bezeichnung: "Baugrubenherstellung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 312,
      Hauptgruppennummer: 310,
      Bezeichnung: "Baugrubenumschließung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 313,
      Hauptgruppennummer: 310,
      Bezeichnung: "Wasserhaltung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 314,
      Hauptgruppennummer: 310,
      Bezeichnung: "Vortrieb"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 319,
      Hauptgruppennummer: 310,
      Bezeichnung: "Sonstiges zu KG 310"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 320,
      Hauptgruppennummer: null,
      Bezeichnung: "Gründung, Unterbau"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 321,
      Hauptgruppennummer: 320,
      Bezeichnung: "Baugrundverbesserung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 322,
      Hauptgruppennummer: 320,
      Bezeichnung: "Flachgründungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 323,
      Hauptgruppennummer: null,
      Bezeichnung: "Tiefgründungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 324,
      Hauptgruppennummer: 320,
      Bezeichnung: "Gründungsbeläge"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 325,
      Hauptgruppennummer: 320,
      Bezeichnung: "Abdichtungen und Bekleidungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 326,
      Hauptgruppennummer: 320,
      Bezeichnung: "Dränagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 329,
      Hauptgruppennummer: 320,
      Bezeichnung: "Sonstiges zu KG 320"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 330,
      Hauptgruppennummer: null,
      Bezeichnung: "Außenwände"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 331,
      Hauptgruppennummer: 330,
      Bezeichnung: "Tragende Außenwände"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 332,
      Hauptgruppennummer: 330,
      Bezeichnung: "Nichttragende Außenwände"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 333,
      Hauptgruppennummer: 330,
      Bezeichnung: "Außenstützen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 334,
      Hauptgruppennummer: 330,
      Bezeichnung: "Außentüren und –fenster"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 335,
      Hauptgruppennummer: 330,
      Bezeichnung: "Außenwandbekleidungen, außen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 336,
      Hauptgruppennummer: 330,
      Bezeichnung: "Außenwandbekleidungen, innen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 337,
      Hauptgruppennummer: 330,
      Bezeichnung: "Elementierte Außenwände"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 338,
      Hauptgruppennummer: 330,
      Bezeichnung: "Lichtschutz"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 339,
      Hauptgruppennummer: 330,
      Bezeichnung: "Sonstiges zu KG 330"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 340,
      Hauptgruppennummer: null,
      Bezeichnung: "Innenwände"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 341,
      Hauptgruppennummer: 340,
      Bezeichnung: "Nichttragende Innenwände"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 342,
      Hauptgruppennummer: 340,
      Bezeichnung: "Tragende Innenwände"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 343,
      Hauptgruppennummer: 340,
      Bezeichnung: "Innenstützen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 344,
      Hauptgruppennummer: 340,
      Bezeichnung: "Innentüren und –fenster"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 345,
      Hauptgruppennummer: 340,
      Bezeichnung: "Innenwandbekleidungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 346,
      Hauptgruppennummer: 340,
      Bezeichnung: "Elementierte Innenwände"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 347,
      Hauptgruppennummer: 340,
      Bezeichnung: "Lichtschutz"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 349,
      Hauptgruppennummer: 340,
      Bezeichnung: "Sonstiges zu KG 340"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 350,
      Hauptgruppennummer: null,
      Bezeichnung: "Decken"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 351,
      Hauptgruppennummer: 350,
      Bezeichnung: "Deckenkonstruktionen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 352,
      Hauptgruppennummer: 350,
      Bezeichnung: "Deckenöffnungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 353,
      Hauptgruppennummer: 350,
      Bezeichnung: "Deckenbeläge"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 354,
      Hauptgruppennummer: 350,
      Bezeichnung: "Deckenbekleidungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 355,
      Hauptgruppennummer: 350,
      Bezeichnung: "Elementierte Deckenkonstruktionen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 359,
      Hauptgruppennummer: 350,
      Bezeichnung: "Sonstiges zu KG 350"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 360,
      Hauptgruppennummer: null,
      Bezeichnung: "Dächer"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 361,
      Hauptgruppennummer: 360,
      Bezeichnung: "Dachkonstruktionen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 362,
      Hauptgruppennummer: 360,
      Bezeichnung: "Dachfenster, Dachöffnungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 363,
      Hauptgruppennummer: 360,
      Bezeichnung: "Dachbeläge"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 364,
      Hauptgruppennummer: 360,
      Bezeichnung: "Dachbekleidungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 365,
      Hauptgruppennummer: 360,
      Bezeichnung: "Elementierte Dachkonstruktionen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 366,
      Hauptgruppennummer: 360,
      Bezeichnung: "Lichtschutz"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 369,
      Hauptgruppennummer: 360,
      Bezeichnung: "Sonstiges zu KG 360"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 370,
      Hauptgruppennummer: null,
      Bezeichnung: "Infrastrukturanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 371,
      Hauptgruppennummer: 370,
      Bezeichnung: "Anlagen für den Straßenverkehr"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 372,
      Hauptgruppennummer: 370,
      Bezeichnung: "Anlagen für den Schienenverkehr"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 373,
      Hauptgruppennummer: 370,
      Bezeichnung: "Anlagen für den Flugverkehr"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 374,
      Hauptgruppennummer: 370,
      Bezeichnung: "Anlagen des Wasserbaus"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 375,
      Hauptgruppennummer: 370,
      Bezeichnung: "Anlagen der Abwasserentsorgung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 376,
      Hauptgruppennummer: 370,
      Bezeichnung: "Anlagen der Wasserversorgung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 377,
      Hauptgruppennummer: 370,
      Bezeichnung: "Anlagen der Energie- und Informationsversorgung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 378,
      Hauptgruppennummer: 370,
      Bezeichnung: "Anlagen der Abfallentsorgung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 379,
      Hauptgruppennummer: 370,
      Bezeichnung: "Sonstiges zu KG 370"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 380,
      Hauptgruppennummer: null,
      Bezeichnung: "Baukonstruktive Einbauten"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 381,
      Hauptgruppennummer: 380,
      Bezeichnung: "Allgemeine Einbauten"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 383,
      Hauptgruppennummer: 380,
      Bezeichnung: "Landschaftsgestalterische Einbauten"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 384,
      Hauptgruppennummer: 380,
      Bezeichnung: "Mechanische Einbauten"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 385,
      Hauptgruppennummer: 380,
      Bezeichnung: "Einbauten in Konstruktionen des Ingenieurbaus"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 386,
      Hauptgruppennummer: 380,
      Bezeichnung: "Orientierungs- und Informationssysteme"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 387,
      Hauptgruppennummer: 380,
      Bezeichnung: "Schutzeinbauten"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 388,
      Hauptgruppennummer: 380,
      Bezeichnung: "Sonstiges zur KG 380"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 390,
      Hauptgruppennummer: null,
      Bezeichnung: "Sonstige Maßnahmen für Baukonstruktionen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 391,
      Hauptgruppennummer: 390,
      Bezeichnung: "Baustelleneinrichtung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 392,
      Hauptgruppennummer: 390,
      Bezeichnung: "Gerüste"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 393,
      Hauptgruppennummer: 390,
      Bezeichnung: "Sicherungsmaßnahmen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 394,
      Hauptgruppennummer: 390,
      Bezeichnung: "Abbruchmaßnahmen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 395,
      Hauptgruppennummer: 390,
      Bezeichnung: "Instandsetzungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 396,
      Hauptgruppennummer: 390,
      Bezeichnung: "Materialentsorgung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 397,
      Hauptgruppennummer: 390,
      Bezeichnung: "Zusätzliche Maßnahmen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 398,
      Hauptgruppennummer: 390,
      Bezeichnung: "Provisorische Baukonstruktionen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 300,
      Kostengruppennummer: 399,
      Hauptgruppennummer: 390,
      Bezeichnung: "Sonstiges zu KG 390"
    },
    {Typ: "Obergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 400,
      Hauptgruppennummer: null,
      Bezeichnung: "Bauwerk – Technische Anlagen"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 410,
      Hauptgruppennummer: null,
      Bezeichnung: "Abwasser-, Wasser-, Gasanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 411,
      Hauptgruppennummer: 410,
      Bezeichnung: "Abwasseranlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 412,
      Hauptgruppennummer: 410,
      Bezeichnung: "Wasseranlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 413,
      Hauptgruppennummer: 410,
      Bezeichnung: "Gasanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 419,
      Hauptgruppennummer: 410,
      Bezeichnung: "Sonstiges zu KG 410"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 420,
      Hauptgruppennummer: null,
      Bezeichnung: "Wärmeversorgungsanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 421,
      Hauptgruppennummer: 420,
      Bezeichnung: "Wärmeerzeugungsanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 422,
      Hauptgruppennummer: 420,
      Bezeichnung: "Wärmeverteilnetze"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 423,
      Hauptgruppennummer: 420,
      Bezeichnung: "Raumheizflächen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 424,
      Hauptgruppennummer: 420,
      Bezeichnung: "Verkehrsheizflächen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 429,
      Hauptgruppennummer: 420,
      Bezeichnung: "Sonstiges zu KG 420"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 430,
      Hauptgruppennummer: null,
      Bezeichnung: "Raumlufttechnische Anlagen"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 431,
      Hauptgruppennummer: 430,
      Bezeichnung: "Lüftungsanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 432,
      Hauptgruppennummer: 430,
      Bezeichnung: "Teilklimaanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 433,
      Hauptgruppennummer: 430,
      Bezeichnung: "Klimaanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 434,
      Hauptgruppennummer: 430,
      Bezeichnung: "Kälteanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 439,
      Hauptgruppennummer: 430,
      Bezeichnung: "Sonstiges zu KG 430"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 440,
      Hauptgruppennummer: null,
      Bezeichnung: "Elektrische Anlagen"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 441,
      Hauptgruppennummer: 440,
      Bezeichnung: "Hoch- und Mittelspannungsanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 442,
      Hauptgruppennummer: 440,
      Bezeichnung: "Eigenstromversorgungsanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 443,
      Hauptgruppennummer: 440,
      Bezeichnung: "Niederspannungsschaltanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 444,
      Hauptgruppennummer: 440,
      Bezeichnung: "Niederspannungsinstallationsanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 445,
      Hauptgruppennummer: 440,
      Bezeichnung: "Beleuchtungsanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 446,
      Hauptgruppennummer: 440,
      Bezeichnung: "Blitzschutz- und Erdungsanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 447,
      Hauptgruppennummer: 440,
      Bezeichnung: "Fahrleitungssysteme"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 449,
      Hauptgruppennummer: 440,
      Bezeichnung: "Sonstiges zu KG 440"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 450,
      Hauptgruppennummer: null,
      Bezeichnung: "Kommunikations-, sicherheits- und informationstechnische Anlagen"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 451,
      Hauptgruppennummer: 450,
      Bezeichnung: "Telekommunikationsanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 452,
      Hauptgruppennummer: 450,
      Bezeichnung: "Such- und Signalanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 453,
      Hauptgruppennummer: 450,
      Bezeichnung: "Zeitdienstanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 454,
      Hauptgruppennummer: 450,
      Bezeichnung: "Elektroakustische Anlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 455,
      Hauptgruppennummer: 450,
      Bezeichnung: "Fernseh- und Antennenanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 456,
      Hauptgruppennummer: 450,
      Bezeichnung: "Gefahrenmelde- und Alarmanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 457,
      Hauptgruppennummer: 450,
      Bezeichnung: "Übertragungsnetze"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 458,
      Hauptgruppennummer: 450,
      Bezeichnung: "Verkehrsbeeinflussungsanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 459,
      Hauptgruppennummer: 450,
      Bezeichnung: "Sonstiges zu KG 450"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 460,
      Hauptgruppennummer: null,
      Bezeichnung: "Förderanlagen"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 461,
      Hauptgruppennummer: 460,
      Bezeichnung: "Aufzugsanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 462,
      Hauptgruppennummer: 460,
      Bezeichnung: "Fahrtreppen, Fahrsteige"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 463,
      Hauptgruppennummer: 460,
      Bezeichnung: "Befahranlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 464,
      Hauptgruppennummer: 460,
      Bezeichnung: "Transportanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 465,
      Hauptgruppennummer: 460,
      Bezeichnung: "Krananlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 467,
      Hauptgruppennummer: 460,
      Bezeichnung: "Hydraulikanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 469,
      Hauptgruppennummer: 460,
      Bezeichnung: "Sonstiges zu KG 460"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 470,
      Hauptgruppennummer: null,
      Bezeichnung: "Nutzungsspezifische Anlagen"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 471,
      Hauptgruppennummer: 470,
      Bezeichnung: "Küchentechnische Anlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 472,
      Hauptgruppennummer: 470,
      Bezeichnung: "Wäscherei-, Reinigungs- und badetechnische Anlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 473,
      Hauptgruppennummer: 470,
      Bezeichnung: "Medienversorgungsanlagen, Medizin- und labortechnische Anlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 474,
      Hauptgruppennummer: 470,
      Bezeichnung: "Feuerlöschanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 475,
      Hauptgruppennummer: 470,
      Bezeichnung: "Prozesswärme-, kälte- und -luftanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 476,
      Hauptgruppennummer: 470,
      Bezeichnung: "Weitere nutzungsspezifische Anlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 477,
      Hauptgruppennummer: 470,
      Bezeichnung: "Verfahrenstechnische Anlagen, Wasser, Abwasser und Gase"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 478,
      Hauptgruppennummer: 470,
      Bezeichnung: "Verfahrenstechnische Anlagen, Feststoffe, Wertstoffe und Abfälle"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 479,
      Hauptgruppennummer: 470,
      Bezeichnung: "Sonstiges zu KG 470"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 480,
      Hauptgruppennummer: null,
      Bezeichnung: "Gebäudeautomation"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 481,
      Hauptgruppennummer: 480,
      Bezeichnung: "Automationseinrichtungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 482,
      Hauptgruppennummer: 480,
      Bezeichnung: "Schaltschränke, Automationsschwerpunkte"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 483,
      Hauptgruppennummer: 480,
      Bezeichnung: "Automationsmanagement"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 484,
      Hauptgruppennummer: 480,
      Bezeichnung: "Kabel, Leitungen und Verlegesysteme"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 485,
      Hauptgruppennummer: 480,
      Bezeichnung: "Datenübertragungsnetze"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 489,
      Hauptgruppennummer: 480,
      Bezeichnung: "Sonstiges zu KG 480"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 490,
      Hauptgruppennummer: null,
      Bezeichnung: "Sonstige Maßnahmen für technische Anlagen"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 491,
      Hauptgruppennummer: 490,
      Bezeichnung: "Baustelleneinrichtung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 492,
      Hauptgruppennummer: 490,
      Bezeichnung: "Gerüste"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 493,
      Hauptgruppennummer: 490,
      Bezeichnung: "Sicherungsmaßnahmen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 494,
      Hauptgruppennummer: 490,
      Bezeichnung: "Abbruchmaßnahmen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 495,
      Hauptgruppennummer: 490,
      Bezeichnung: "Instandsetzungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 496,
      Hauptgruppennummer: 490,
      Bezeichnung: "Materialentsorgung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 497,
      Hauptgruppennummer: 490,
      Bezeichnung: "Zusätzliche Maßnahmen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 498,
      Hauptgruppennummer: 490,
      Bezeichnung: "Provisorische technische Anlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 400,
      Kostengruppennummer: 499,
      Hauptgruppennummer: 490,
      Bezeichnung: "Sonstiges zu KG 490"
    },
    {Typ: "Obergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 500,
      Hauptgruppennummer: null,
      Bezeichnung: "Außenanlagen"

    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 510,
      Hauptgruppennummer: null,
      Bezeichnung: "Erdbau"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 511,
      Hauptgruppennummer: 510,
      Bezeichnung: "Herstellung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 512,
      Hauptgruppennummer: 510,
      Bezeichnung: "Umschließung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 513,
      Hauptgruppennummer: 510,
      Bezeichnung: "Wasserhaltung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 514,
      Hauptgruppennummer: 510,
      Bezeichnung: "Vortrieb"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 519,
      Hauptgruppennummer: 510,
      Bezeichnung: "Sonstiges zu KG 510"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 520,
      Hauptgruppennummer: null,
      Bezeichnung: "Gründung, Unterbau"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 521,
      Hauptgruppennummer: 520,
      Bezeichnung: "Baugrundverbesserung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 522,
      Hauptgruppennummer: 520,
      Bezeichnung: "Gründungen und Bodenplatten"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 523,
      Hauptgruppennummer: 520,
      Bezeichnung: "Gründungsbeläge"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 524,
      Hauptgruppennummer: 520,
      Bezeichnung: "Abdichtungen und Bekleidungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 525,
      Hauptgruppennummer: 520,
      Bezeichnung: "Dränagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 529,
      Hauptgruppennummer: 520,
      Bezeichnung: "Sonstiges zu KG 520"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 530,
      Hauptgruppennummer: null,
      Bezeichnung: "Oberbau, Deckschichten"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 531,
      Hauptgruppennummer: 530,
      Bezeichnung: "Wege"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 532,
      Hauptgruppennummer: 530,
      Bezeichnung: "Straßen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 533,
      Hauptgruppennummer: 530,
      Bezeichnung: "Plätze, Höfe, Terrassen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 534,
      Hauptgruppennummer: 530,
      Bezeichnung: "Stellplätze"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 535,
      Hauptgruppennummer: 530,
      Bezeichnung: "Sportplatzflächen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 536,
      Hauptgruppennummer: 530,
      Bezeichnung: "Spielplatzflächen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 537,
      Hauptgruppennummer: 530,
      Bezeichnung: "Gleisanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 538,
      Hauptgruppennummer: 530,
      Bezeichnung: "Flugplatzflächen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 539,
      Hauptgruppennummer: 530,
      Bezeichnung: "Sonstiges zu KG 530"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 540,
      Hauptgruppennummer: null,
      Bezeichnung: "Baukonstruktionen"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 541,
      Hauptgruppennummer: 540,
      Bezeichnung: "Einfriedungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 542,
      Hauptgruppennummer: 540,
      Bezeichnung: "Schutzkonstruktionen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 543,
      Hauptgruppennummer: 540,
      Bezeichnung: "Wandkonstruktionen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 544,
      Hauptgruppennummer: 540,
      Bezeichnung: "Rampen, Treppen, Tribünen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 545,
      Hauptgruppennummer: 540,
      Bezeichnung: "Überdachungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 546,
      Hauptgruppennummer: 540,
      Bezeichnung: "Stege"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 547,
      Hauptgruppennummer: 540,
      Bezeichnung: "Kanal- und Schachtkonstruktionen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 548,
      Hauptgruppennummer: 540,
      Bezeichnung: "Wasserbecken"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 549,
      Hauptgruppennummer: 540,
      Bezeichnung: "Sonstiges zu KG 540"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 550,
      Hauptgruppennummer: null,
      Bezeichnung: "Technische Anlagen"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 551,
      Hauptgruppennummer: 550,
      Bezeichnung: "Abwasseranlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 552,
      Hauptgruppennummer: 550,
      Bezeichnung: "Wasseranlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 553,
      Hauptgruppennummer: 550,
      Bezeichnung: "Anlagen für Gase und Flüssigkeiten"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 554,
      Hauptgruppennummer: 550,
      Bezeichnung: "Wärmeversorgungsanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 555,
      Hauptgruppennummer: 550,
      Bezeichnung: "Raumlufttechnische Anlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 556,
      Hauptgruppennummer: 550,
      Bezeichnung: "Elektrische Anlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 557,
      Hauptgruppennummer: 550,
      Bezeichnung: "Kommunikations-, sicherheits- und informationstechnische Anlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 558,
      Hauptgruppennummer: 550,
      Bezeichnung: "Nutzungsspezifische Anlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 559,
      Hauptgruppennummer: 550,
      Bezeichnung: "Sonstiges zu KG 550"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 560,
      Hauptgruppennummer: null,
      Bezeichnung: "Einbauten in Außenanlagen und Freiflächen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 561,
      Hauptgruppennummer: 560,
      Bezeichnung: "Allgemeine Einbauten"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 562,
      Hauptgruppennummer: 560,
      Bezeichnung: "Besondere Einbauten"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 563,
      Hauptgruppennummer: 560,
      Bezeichnung: "Orientierungs- und Informationssysteme"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 569,
      Hauptgruppennummer: 560,
      Bezeichnung: "Sonstiges zu KG 560"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 570,
      Hauptgruppennummer: null,
      Bezeichnung: "Vegetationsflächen"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 571,
      Hauptgruppennummer: 570,
      Bezeichnung: "Vegetationstechnische Bodenbearbeitung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 572,
      Hauptgruppennummer: 570,
      Bezeichnung: "Sicherungsbauweisen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 573,
      Hauptgruppennummer: 570,
      Bezeichnung: "Pflanzflächen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 574,
      Hauptgruppennummer: 570,
      Bezeichnung: "Rasen- und Saatflächen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 579,
      Hauptgruppennummer: 570,
      Bezeichnung: "Sonstiges zu KG 570"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 590,
      Hauptgruppennummer: null,
      Bezeichnung: "Sonstige Außenanlagen"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 591,
      Hauptgruppennummer: 590,
      Bezeichnung: "Baustelleneinrichtung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 592,
      Hauptgruppennummer: 590,
      Bezeichnung: "Gerüste"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 593,
      Hauptgruppennummer: 590,
      Bezeichnung: "Sicherungsmaßnahmen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 594,
      Hauptgruppennummer: 590,
      Bezeichnung: "Abbruchmaßnahmen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 595,
      Hauptgruppennummer: 590,
      Bezeichnung: "Instandsetzungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 596,
      Hauptgruppennummer: 590,
      Bezeichnung: "Materialentsorgung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 597,
      Hauptgruppennummer: 590,
      Bezeichnung: "Zusätzliche Maßnahmen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 598,
      Hauptgruppennummer: 590,
      Bezeichnung: "Provisorische Außenanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 500,
      Kostengruppennummer: 599,
      Hauptgruppennummer: 590,
      Bezeichnung: "Sonstiges zu KG 590"
    },
    {Typ: "Obergruppe",
      Obergruppennummer: 600,
      Kostengruppennummer: 600,
      Hauptgruppennummer: null,
      Bezeichnung: "Ausstattung und Kunstwerke"

    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 600,
      Kostengruppennummer: 610,
      Hauptgruppennummer: null,
      Bezeichnung: "Allgemeine Ausstattung"

    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 600,
      Kostengruppennummer: 620,
      Hauptgruppennummer: null,
      Bezeichnung: "Besondere Ausstattung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 600,
      Kostengruppennummer: 629,
      Hauptgruppennummer: 620,
      Bezeichnung: "Sonstiges zu KG 620"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 600,
      Kostengruppennummer: 630,
      Hauptgruppennummer: null,
      Bezeichnung: "Informationstechnische Ausstattung"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 600,
      Kostengruppennummer: 640,
      Hauptgruppennummer: null,
      Bezeichnung: "Kunstobjekte"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 600,
      Kostengruppennummer: 641,
      Hauptgruppennummer: 640,
      Bezeichnung: "Kunstobjekte"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 600,
      Kostengruppennummer: 642,
      Hauptgruppennummer: 640,
      Bezeichnung: "Künstlerische Gestaltung des Bauwerks"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 600,
      Kostengruppennummer: 643,
      Hauptgruppennummer: 640,
      Bezeichnung: "Künstlerische Gestaltung der Außenanlagen und Freiflächen"
    },

    {Typ: "Hauptgruppe",
      Obergruppennummer: 600,
      Kostengruppennummer: 690,
      Hauptgruppennummer: null,
      Bezeichnung: "Sonstige Ausstattung"

    },
    {Typ: "Obergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 700,
      Hauptgruppennummer: null,
      Bezeichnung: "Baunebenkosten"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 710,
      Hauptgruppennummer: null,
      Bezeichnung: "Bauherrenaufgaben"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 711,
      Hauptgruppennummer: 710,
      Bezeichnung: "Projektleitung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 712,
      Hauptgruppennummer: 710,
      Bezeichnung: "Bedarfsplanung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 713,
      Hauptgruppennummer: 710,
      Bezeichnung: "Projektsteuerung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 714,
      Hauptgruppennummer: 710,
      Bezeichnung: "Sicherheits- und Gesundheitsschutzkoordination"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 715,
      Hauptgruppennummer: 710,
      Bezeichnung: "Vergabeverfahren"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 719,
      Hauptgruppennummer: 710,
      Bezeichnung: "Sonstiges zu KG 710"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 720,
      Hauptgruppennummer: null,
      Bezeichnung: "Vorbereitung der Objektplanung"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 721,
      Hauptgruppennummer: 720,
      Bezeichnung: "Untersuchungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 722,
      Hauptgruppennummer: 720,
      Bezeichnung: "Wertermittlungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 723,
      Hauptgruppennummer: 720,
      Bezeichnung: "Städtebauliche Leistungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 724,
      Hauptgruppennummer: 720,
      Bezeichnung: "Landschaftsplanerische Leistungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 725,
      Hauptgruppennummer: 720,
      Bezeichnung: "Wettbewerbe"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 729,
      Hauptgruppennummer: 720,
      Bezeichnung: "Sonstiges zu KG 720"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 730,
      Hauptgruppennummer: null,
      Bezeichnung: "Objektplanung"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 731,
      Hauptgruppennummer: 730,
      Bezeichnung: "Gebäude und Innenräume"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 732,
      Hauptgruppennummer: 730,
      Bezeichnung: "Freianlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 733,
      Hauptgruppennummer: 730,
      Bezeichnung: "Ingenieurbauwerke"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 734,
      Hauptgruppennummer: 730,
      Bezeichnung: "Verkehrsanlagen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 735,
      Hauptgruppennummer: 730,
      Bezeichnung: "Tragwerksplanung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 736,
      Hauptgruppennummer: 730,
      Bezeichnung: "Technische Ausrüstung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 739,
      Hauptgruppennummer: 730,
      Bezeichnung: "Sonstiges zu KG 730"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 740,
      Hauptgruppennummer: null,
      Bezeichnung: "Fachplanung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 743,
      Hauptgruppennummer: 740,
      Bezeichnung: "Bauphysik"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 744,
      Hauptgruppennummer: 740,
      Bezeichnung: "Geotechnik"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 745,
      Hauptgruppennummer: 740,
      Bezeichnung: "Ingenieurvermessungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 746,
      Hauptgruppennummer: 740,
      Bezeichnung: "Lichttechnik, Tageslichttechnik"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 747,
      Hauptgruppennummer: 740,
      Bezeichnung: "Brandschutz"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 748,
      Hauptgruppennummer: 740,
      Bezeichnung: "Altlasten, Kampfmittel, kulturhistorische Funde"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 749,
      Hauptgruppennummer: 740,
      Bezeichnung: "Sonstiges zu KG 740"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 750,
      Hauptgruppennummer: null,
      Bezeichnung: "Künstlerische Leistungen"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 751,
      Hauptgruppennummer: 750,
      Bezeichnung: "Kunstwettbewerbe"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 752,
      Hauptgruppennummer: 750,
      Bezeichnung: "Honorare"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 759,
      Hauptgruppennummer: 750,
      Bezeichnung: "Sonstiges zu KG 750"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 760,
      Hauptgruppennummer: null,
      Bezeichnung: "Allgemeine Baunebenkosten"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 761,
      Hauptgruppennummer: 760,
      Bezeichnung: "Gutachten und Beratung"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 762,
      Hauptgruppennummer: 760,
      Bezeichnung: "Prüfungen, Genehmigungen, Abnahmen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 763,
      Hauptgruppennummer: 760,
      Bezeichnung: "Bewirtschaftungskoten"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 764,
      Hauptgruppennummer: 760,
      Bezeichnung: "Bemusterungskosten"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 766,
      Hauptgruppennummer: 760,
      Bezeichnung: "Versicherungen"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 769,
      Hauptgruppennummer: null,
      Bezeichnung: "Sonstiges zu KG 760"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 790,
      Hauptgruppennummer: null,
      Bezeichnung: "Sonstige Baunebenkosten"

    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 791,
      Hauptgruppennummer: 790,
      Bezeichnung: "Bestandsdokumentation"
    },
    {Typ: "Untergruppe",
      Obergruppennummer: 700,
      Kostengruppennummer: 799,
      Hauptgruppennummer: 790,
      Bezeichnung: "Sonstiges zur KG 790"
    },
    {Typ: "Obergruppe",
      Obergruppennummer: 800,
      Kostengruppennummer: 800,
      Hauptgruppennummer: null,
      Bezeichnung: "Finanzierung"

    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 800,
      Kostengruppennummer: 810,
      Hauptgruppennummer: null,
      Bezeichnung: "Finanzierungsnebenkosten"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 800,
      Kostengruppennummer: 820,
      Hauptgruppennummer: null,
      Bezeichnung: "Fremdkapitalzinsen"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 800,
      Kostengruppennummer: 830,
      Hauptgruppennummer: null,
      Bezeichnung: "Eigenkapitalzinsen"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 800,
      Kostengruppennummer: 840,
      Hauptgruppennummer: null,
      Bezeichnung: "Bürgschaften"
    },
    {Typ: "Hauptgruppe",
      Obergruppennummer: 800,
      Kostengruppennummer: 890,
      Hauptgruppennummer: null,
      Bezeichnung: "Sonstige Finanzierungskosten"
    }
  ];


  constructor(private Debug: DebugProvider) {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen', 'constructor', this.Debug.Typen.Service);
    }
  }

  public GetKostengruppeByProjektpunkt(projektpunkt: Projektpunktestruktur): Kostengruppenstruktur {

    try {

      let Kostengruppe: Kostengruppenstruktur;

      if(projektpunkt !== null) {

        if(projektpunkt.Unterkostengruppe !== null) {

          Kostengruppe = lodash.find(this.Kostengruppen, (gruppe: Kostengruppenstruktur) => {

            return gruppe.Typ === this.Kostengruppentypen.Untergruppe && gruppe.Kostengruppennummer === projektpunkt.Unterkostengruppe;
          });

           if(!lodash.isUndefined(!Kostengruppe)) return Kostengruppe;
        }
        else if(projektpunkt.Hauptkostengruppe !== null) {

          Kostengruppe = lodash.find(this.Kostengruppen, (gruppe: Kostengruppenstruktur) => {

            return gruppe.Typ === this.Kostengruppentypen.Hauptgruppe && gruppe.Kostengruppennummer === projektpunkt.Hauptkostengruppe;
          });

          if(!lodash.isUndefined(!Kostengruppe)) return Kostengruppe;
        }
        else if(projektpunkt.Oberkostengruppe !== null) {

          Kostengruppe = lodash.find(this.Kostengruppen, (gruppe: Kostengruppenstruktur) => {

            return gruppe.Typ === this.Kostengruppentypen.Obergruppe && gruppe.Kostengruppennummer === projektpunkt.Oberkostengruppe;
          });

          if(!lodash.isUndefined(!Kostengruppe)) return Kostengruppe;
        }
      }

      return null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen', 'GetKostengruppeByProjektpunkt', this.Debug.Typen.Service);
    }
  }

  public GetKostengruppeByGruppennummern(Unterkostengruppe: number,  Hauptkostengruppe: number, Oberkostengruppe: number ): Kostengruppenstruktur {

    try {

      let Kostengruppe: Kostengruppenstruktur;

        if(Unterkostengruppe !== null) {

          Kostengruppe = lodash.find(this.Kostengruppen, (gruppe: Kostengruppenstruktur) => {

            return gruppe.Typ === this.Kostengruppentypen.Untergruppe && gruppe.Kostengruppennummer === Unterkostengruppe;
          });

           if(!lodash.isUndefined(!Kostengruppe)) return Kostengruppe;
        }
        else if(Hauptkostengruppe !== null) {

          Kostengruppe = lodash.find(this.Kostengruppen, (gruppe: Kostengruppenstruktur) => {

            return gruppe.Typ === this.Kostengruppentypen.Hauptgruppe && gruppe.Kostengruppennummer === Hauptkostengruppe;
          });

          if(!lodash.isUndefined(!Kostengruppe)) return Kostengruppe;
        }
        else if(Oberkostengruppe !== null) {

          Kostengruppe = lodash.find(this.Kostengruppen, (gruppe: Kostengruppenstruktur) => {

            return gruppe.Typ === this.Kostengruppentypen.Obergruppe && gruppe.Kostengruppennummer === Oberkostengruppe;
          });

          if(!lodash.isUndefined(!Kostengruppe)) return Kostengruppe;
        }

      return null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen', 'GetKostengruppeByProjektpunkt', this.Debug.Typen.Service);
    }
  }

  public GetKostengruppennameByProjektpunkt(projektpunkt: Projektpunktestruktur): string {

    try {

      let Kostengruppe: Kostengruppenstruktur = this.GetKostengruppeByProjektpunkt(projektpunkt);

      return Kostengruppe !== null ? Kostengruppe.Kostengruppennummer + ' ' + Kostengruppe.Bezeichnung : 'Unbekannt';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen', 'GetKostengruppennameByProjektpunkt', this.Debug.Typen.Service);
    }
  }

  public GetKostengruppennameByGruppennummern(Unterkostengruppe: number,  Hauptkostengruppe: number, Oberkostengruppe: number ): string {

    try {

      let Kostengruppe: Kostengruppenstruktur = this.GetKostengruppeByGruppennummern(Unterkostengruppe, Hauptkostengruppe, Oberkostengruppe);
      let Gruppennummer: string;

      if(Kostengruppe !== null) {

        Gruppennummer = Kostengruppe.Kostengruppennummer.toString();

        switch (Kostengruppe.Typ) {

          case this.Kostengruppentypen.Obergruppe:

            Gruppennummer = Gruppennummer.substring(0, 1) + 'xx';

            break;

          case this.Kostengruppentypen.Hauptgruppe:

            Gruppennummer = Gruppennummer.substring(0, 2) + 'x';

            break;

          case this.Kostengruppentypen.Untergruppe:

            Gruppennummer = Gruppennummer.substring(0, 3);

            break;

        }
      }
      return Kostengruppe !== null ? Gruppennummer + ' ' + Kostengruppe.Bezeichnung : null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen', 'GetKostengruppennameByProjektpunkt', this.Debug.Typen.Service);
    }
  }
}
