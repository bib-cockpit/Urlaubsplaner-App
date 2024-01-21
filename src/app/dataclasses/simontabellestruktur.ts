import {Simontabelleeintragstruktur} from "./simontabelleeintragstruktur";
import {Verfasserstruktur} from "./verfasserstruktur";
import {Simontabellebesondereleistungstruktur} from "./simontabellebesondereleistungstruktur";


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
  __v?: any;
};
