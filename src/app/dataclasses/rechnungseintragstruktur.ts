import {Honorarsummenstruktur} from "./honorarsummenstruktur";

export type Rechnungseintragstruktur = {

  RechnungID:    string;
  Honoraranteil: number;

  Valid?:             boolean;
  Honorarberechnung?: Honorarsummenstruktur;
};
