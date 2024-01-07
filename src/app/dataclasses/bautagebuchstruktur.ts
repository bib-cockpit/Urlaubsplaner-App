import {Bautagebucheintragstruktur} from "./bautagebucheintragstruktur";
import {Verfasserstruktur} from "./verfasserstruktur";

export type Bautagebuchstruktur = {

  _id: string;
  __v?: string;
  Projektkey: string;
  ProjektID: string;
  Nummer: string;
  Auftraggeber: string;
  Verfasser: Verfasserstruktur;
  BeteiligtInternIDListe: string[];
  BeteiligtExternIDListe: string[];
  Gewerk: string;
  Bezeichnung: string;
  Leistung: string;
  Regen: boolean;
  Frost: boolean;
  Schnee: boolean;
  Wind: boolean;
  Sonnig: boolean;
  Bewoelkt: boolean;
  Bedeckt: boolean;
  Vorarbeiter: string;
  Facharbeiter: string;
  Helfer: string;
  Lehrling: string;
  Temperatur: string;
  Behinderungen: string;
  Vorkommnisse: string;
  Eintraegeliste: Bautagebucheintragstruktur[];
  Zeitstempel: number;
  Zeitstring: string;
  Deleted: boolean;

  EmpfaengerExternIDListe: string[];
  EmpfaengerInternIDListe: string[];
  CcEmpfaengerExternIDListe: string[];
  CcEmpfaengerInternIDListe: string[];
  Betreff: string;
  Nachricht: string;
  Filename: string;
  FileID: string;
  GesendetZeitstempel: number;
  GesendetZeitstring: string;
  CcEmpfaengerliste?: {
    Name:  string;
    Email: string;
  }[];
  Empfaengerliste?: {
    Name:  string;
    Email: string;
  }[];
};
