import {Simontabelleeintragstruktur} from "./simontabelleeintragstruktur";
import {Verfasserstruktur} from "./verfasserstruktur";
import {Simontabellebesondereleistungstruktur} from "./simontabellebesondereleistungstruktur";
import {Rechnungstruktur} from "./rechnungstruktur";


export type Simontabellestruktur = {

  _id: string;
  Projektkey: string;
  Leistungsphase: string;
  Anlagengruppe:  number;
  Durchschnittswert: number;
  Verfasser: Verfasserstruktur;
  Eintraegeliste: Simontabelleeintragstruktur[];
  Deleted: boolean;
  Kosten: number;
  Honorar: number;
  Umbauzuschlag: number;
  Nebenkosten: number;
  Besondereleistungenliste: Simontabellebesondereleistungstruktur[];
  Rechnungen: Rechnungstruktur[];
  Nettonebenkosten?: number;
  Bruttonebenkosten?: number;
  __v?: any;
};
