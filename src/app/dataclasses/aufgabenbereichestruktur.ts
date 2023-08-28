import {Teilaufgabeestruktur} from "./teilaufgabeestruktur";

export type Aufgabenbereichestruktur = {

  id:               string;
  Leistungsphasen:  number[];
  Bezeichnung:      string;
  Beschreibung:     string;
  Nummer:           number[];
  Teilaufgabenbereiche: Teilaufgabeestruktur[][][];
};
