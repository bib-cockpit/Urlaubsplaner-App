import {Rechnungseintragstruktur} from "./rechnungseintragstruktur";


export type Simontabelleeintragstruktur = {

  Buchstabe:    string;
  Beschreibung: string;
  Von: number;
  Bis: number;
  Vertrag:  number;
  Rechnungseintraege: Rechnungseintragstruktur[];

  Honorarsumme?: number;
  Honorarsummeprozent?: number;
  Nettohonorar?: number;
  Nettoumbauzuschlag?: number;
  Bruttoumbauzuschlag?: number;
  Nettoleistungen?: number;
  Nettozwischensumme?: number;
  Nettonebenkosten?: number;
  Nettogesamthonorar?: number;
  Mehrwertsteuer?: number;
  Bruttogesamthonorar?: number;
};
