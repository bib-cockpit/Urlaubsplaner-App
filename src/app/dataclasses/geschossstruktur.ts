import {Raumstruktur} from "./raumstruktur";
import {Planlistenstruktur} from "./planlistenstruktur";

export type Geschossstruktur = {

  GeschossID:      string;
  Geschossname:    string;
  Kurzbezeichnung: string;
  Listenposition:  number;
  Raumliste:       Raumstruktur[];

  /*
  Plananzahlwaagrecht: number;
  Plananzahlsenkrecht: number;
  Planliste: Planlistenstruktur[];

   */
};
