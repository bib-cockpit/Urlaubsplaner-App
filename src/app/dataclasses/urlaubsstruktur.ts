import {Urlauzeitspannenstruktur} from "./urlauzeitspannenstruktur";
import {Urlaubprojektbeteiligtestruktur} from "./urlaubprojektbeteiligtestruktur";

export type Urlaubsstruktur = {

  Jahr:         number;
  Resturlaub:   number;
  FreigeberID:  string;
  Projektbeteiligteliste: Urlaubprojektbeteiligtestruktur[];
  Ferienblockerliste: number[];
  Feiertageblockerliste: number[];
  Zeitspannen:  Urlauzeitspannenstruktur[];
  NameExtern?:  string;
  MitarbeiterIDExtern?: string;
  NameKuerzel?: string;
  Text?: string;
};
