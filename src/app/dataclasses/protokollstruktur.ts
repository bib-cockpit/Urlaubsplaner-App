import {Verfasserstruktur} from "./verfasserstruktur";

export type Protokollstruktur = {

  _id: string;
  Projektkey: string;
  ProjektID: string;
  Titel: string;
  Protokollnummer: string;
  BeteiligExternIDListe:    string[];
  BeteiligtInternIDListe:   string[];
  ProjektpunkteIDListe:     string[];
  Notizen: string;
  Zeitstempel: number;
  Zeitstring: string;
  Startstempel: number;
  Endestempel:  number;
  Besprechungsort: string;
  Leistungsphase: string;
  ShowDetails: boolean;
  DownloadURL: string;
  Verfasser: Verfasserstruktur;
  Deleted: boolean;
  Filtered?: boolean;
  Text_A?: string;
  Text_B?: string;
  Text_C?: string;
  Punkteanzahl?: number;
  __v?: any;
};
