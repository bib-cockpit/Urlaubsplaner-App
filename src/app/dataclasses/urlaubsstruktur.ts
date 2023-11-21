import {Urlauzeitspannenstruktur} from "./urlauzeitspannenstruktur";

export type Urlaubsstruktur = {

  Jahr:         number;
  Resturlaub:   number;
  Zeitspannen:  Urlauzeitspannenstruktur[];
};
