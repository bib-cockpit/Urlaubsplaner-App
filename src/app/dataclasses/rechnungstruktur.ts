import {Verfasserstruktur} from "./verfasserstruktur";

export type Rechnungstruktur = {

  RechnungID:  string;
  Nummer: number;
  Zeitstempel: number;
  Verfasser: Verfasserstruktur;
  CanDelete?: boolean;

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

  Empfaengerliste?: {
    Name:  string;
    Firma: string;
    Email: string;
  }[];
};
