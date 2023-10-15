import {Verfasserstruktur} from "./verfasserstruktur";

export type Festlegungskategoriestruktur = {

  _id:               string;
  Projektkey:        string;
  Beschreibung:      string;
  Oberkostengruppe:  number;
  Hauptkostengruppe: number;
  Unterkostengruppe: number;
  Verfasser:         Verfasserstruktur;
  Startzeitsptempel:   number;
  Startzeitstring:     string;
  Deleted: boolean;
  Kostengruppennummer?: number;
  DisplayKostengruppe?: boolean;
  Kostengruppecolor?: string;
};
