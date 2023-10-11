import {Verfasserstruktur} from "./verfasserstruktur";

export type Ruecklaufreminderstruktur = {

  Zeitstempel: number;
  Zeitstring:  string;
  Verfasser:   Verfasserstruktur;

};
