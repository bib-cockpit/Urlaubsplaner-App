import {Teilaufgabeestruktur} from "./teilaufgabeestruktur";

export type Aufgabenbereichestruktur = {

  id:               string;
  Leistungsphasen:  number[];
  Bezeichnung:      string;
  Information:      string[];

  Nummer:           number[];
  Teilaufgabenbereiche: Teilaufgabeestruktur[][][];
};
