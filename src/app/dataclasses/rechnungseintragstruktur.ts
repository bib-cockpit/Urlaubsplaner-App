export type Rechnungseintragstruktur = {

  RechnungID:    string;
  Honoraranteil: number;

  Valid?: boolean;
  Nettohonorar?: number;
  Nettoumbauzuschlag?: number;
  Nettozwischensumme?: number;
  Bruttoumbauzuschlag?: number;
  Nettonebenkosten?: number;
  Nettogesamthonorar?: number;
  Mehrwertsteuer?: number;
  Bruttogesamthonorar?: number;
};
