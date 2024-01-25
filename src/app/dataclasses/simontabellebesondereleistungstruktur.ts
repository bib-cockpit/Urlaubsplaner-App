import {Rechnungseintragstruktur} from "./rechnungseintragstruktur";


export type Simontabellebesondereleistungstruktur = {

  LeistungID:   string;
  Nummer:       string;
  Titel:        string;
  Beschreibung: string;
  Honorar:      number;
  Rechnungseintraege: Rechnungseintragstruktur[];
};
