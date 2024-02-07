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
  Nettonebenkosten?: number;
  Nettoumbauzuschlag?: number;
  Bruttoumbauzuschlag?: number;
  Nettogesamthonorar?: number;
  Mehrwertsteuer?: number;
  Bruttogesamthonorar?: number;
};
