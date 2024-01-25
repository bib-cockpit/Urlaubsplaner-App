import {Rechnungseintragstruktur} from "./rechnungseintragstruktur";


export type Simontabelleeintragstruktur = {

  Buchstabe:    string;
  Beschreibung: string;
  Von: number;
  Bis: number;
  Vertrag:  number;
  Rechnungseintraege: Rechnungseintragstruktur[];
};
