import {Moment} from "moment/moment";

export type Kalendertagestruktur = {

  Tagnummer:  number;
  Tag:        string;
  Kalenderwoche: number;
  Hauptmonat: boolean;
  Tagstempel: number;
  Datum?: Moment;
  Datumstring?: string;
  IsFeiertag_DE?: boolean;
  IsFeiertag_BG?: boolean;
  IsFerientag_DE? : boolean;
  IsFerientag_BG? : boolean;
  IsUrlaub?: boolean;
  Feiertagname_DE?: string;
  Feiertagname_BG?: string;
  Ferienname_DE?: string;
  Ferienname_BG?: string;
  Background?: string;
  Color?: string;
  Kuerzel?: string;
};
