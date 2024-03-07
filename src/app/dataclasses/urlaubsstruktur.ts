import {Urlauzeitspannenstruktur} from "./urlauzeitspannenstruktur";
import {Urlaubprojektbeteiligtestruktur} from "./urlaubprojektbeteiligtestruktur";
import {Homeofficezeitspannenstruktur} from "./homeofficezeitspannenstruktur";

export type Urlaubsstruktur = {

  Jahr:                  number;
  Resturlaub:            number;
  UrlaubsfreigeberID:    string;
  HomeofficefreigeberID: string;
  Projektbeteiligteliste: Urlaubprojektbeteiligtestruktur[];
  Ferienblockerliste: number[];
  Feiertageblockerliste: number[];
  Urlaubzeitspannen:      Urlauzeitspannenstruktur[];
  Homeofficezeitspannen:  Homeofficezeitspannenstruktur[];
  NameExtern?:  string;
  MitarbeiterIDExtern?: string;
  NameKuerzel?: string;
  Text?: string;
};
