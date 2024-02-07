import {Verfasserstruktur} from "./verfasserstruktur";

export type Rechnungstruktur = {

  RechnungID:  string;
  Nummer: number;
  Zeitstempel: number;
  DownloadURL: string;
  Verfasser: Verfasserstruktur;
  BeteiligExternIDListe:  string[];
  BeteiligtInternIDListe: string[];
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

  CanDelete?: boolean;
};
