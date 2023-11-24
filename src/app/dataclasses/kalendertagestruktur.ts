import {Moment} from "moment/moment";

export type Kalendertagestruktur = {

  Tagnummer:  number;
  Tag:        string;
  Kalenderwoche: number;
  Hauptmonat: boolean;
  Tagstempel: number;
  Datum?: Moment;
  Datumstring?: string;
  IsFeiertag?: boolean;
  IsFerientag? : boolean;
  IsUrlaub?: boolean;
  Feiertagname?: string;
  Ferienname?: string;
  Background?: string;
  Color?: string;
  Kuerzel?: string;
};
