import {Projektbeteiligtestruktur} from "./projektbeteiligtestruktur";
import {Verfasserstruktur} from "./verfasserstruktur";
import {Bauteilstruktur} from "./bauteilstruktur";

export type Projektestruktur = {

  _id:                  string;
  ProjektleiterID:      string;
  StellvertreterID:     string;
  Projektkey:           string;
  StandortID:           string;
  Zeitstempel:          number;
  Zeitpunkt:            string;
  Strasse:              string;
  PLZ:                  string;
  Ort:                  string;
  Projektname:          string;
  Projektfarbe:         string;
  Projektkurzname:      string;
  Projektnummer:        string;
  Status:               string;
  Deleted:              boolean;
  Beteiligtenliste:     Projektbeteiligtestruktur[];
  Verfasser:            Verfasserstruktur;
  Bauteilliste:         Bauteilstruktur[];

  Selected?: boolean;
  Filtered?: boolean;
  Text_A?: string;
  Text_B?: string;
  Text_C?: string;
  __v?: any;
};
