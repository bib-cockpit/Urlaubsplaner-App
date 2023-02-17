import {Verfasserstruktur} from "./verfasserstruktur";

export type Projektpunktanmerkungstruktur = {

  AnmerkungID:               string;
  Nummer:                    number;
  Anmerkung:                 string;
  Zeitstempel:               number;
  Zeitstring:                string;
  Verfasser:                 Verfasserstruktur;
  LiveEditor?:               boolean;
};
