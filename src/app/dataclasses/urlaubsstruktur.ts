import {Urlauzeitspannenstruktur} from "./urlauzeitspannenstruktur";

export type Urlaubsstruktur = {

  Jahr:         number;
  Resturlaub:   number;
  FreigeberID:  string;
  Mitarbeiterliste: string[];
  Stellvertreterliste: string[];
  Ferienblockerliste: number[];
  Feiertageblockerliste: number[];
  Zeitspannen:  Urlauzeitspannenstruktur[];
  NameExtern?:  string;
  MitarbeiterIDExtern?: string;
  NameKuerzel?: string;
  DisplayExtern?: boolean;
};
