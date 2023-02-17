import {Geschossstruktur} from "./geschossstruktur";

export type Bauteilstruktur = {

  BauteilID:      string;
  Bauteilname:    string;
  Listenposition: number;
  Geschossliste:  Geschossstruktur[];
};
