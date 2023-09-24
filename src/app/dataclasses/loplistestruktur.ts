import {Verfasserstruktur} from "./verfasserstruktur";
import {Projektpunktestruktur} from "./projektpunktestruktur";
import {Projektbeteiligtestruktur} from "./projektbeteiligtestruktur";
import {Mitarbeiterstruktur} from "./mitarbeiterstruktur";

export type LOPListestruktur = {

  _id: string;
  Projektkey: string;
  ProjektID: string;
  Titel: string;
  LOPListenummer: string;
  BeteiligExternIDListe:  string[];
  BeteiligtInternIDListe: string[];
  ProjektpunkteIDListe:   string[];
  Notizen: string;
  Zeitstempel: number;
  Zeitstring: string;
  Besprechungsort: string;
  ShowDetails: boolean;
  DownloadURL: string;
  Verfasser: Verfasserstruktur;
  EmpfaengerExternIDListe: string[];
  EmpfaengerInternIDListe: string[];
  CcEmpfaengerExternIDListe: string[];
  CcEmpfaengerInternIDListe: string[];
  Betreff: string;
  Nachricht: string;
  Filename: string;
  FileID: string;
  GesendetZeitstring:  string;
  GesendetZeitstempel: number;
  Deleted: boolean;
  Filtered?: boolean;
  Text_A?: string;
  Text_B?: string;
  Text_C?: string;
  __v?: any;
  Projektpunkteliste?: Projektpunktestruktur[];
  Infopunkteliste?: Projektpunktestruktur[];
  ExternZustaendigListe?: string[][];
  InternZustaendigListe?: string[][];
  ExterneTeilnehmerliste?: string[];
  InterneTeilnehmerliste?: string[];
  CcEmpfaengerliste?: {
    Name:  string;
    Email: string;
  }[];
  Empfaengerliste?: {
    Name:  string;
    Email: string;
  }[];
};
