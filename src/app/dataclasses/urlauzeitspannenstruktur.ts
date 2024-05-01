import {Urlaubsvertretungkonversationstruktur} from "./urlaubsvertretungkonversationstruktur";

export type Urlauzeitspannenstruktur = {

  ZeitspannenID:      string;
  Startstempel:       number;
  Endestempel:        number;
  UrlaubsvertreterID: string;  // deprecated
  UrlaubsvertreterIDListe: string[];
  UrlaubsfreigeberID: string; // depricated
  Startstring:       string;
  Endestring:        string;
  Status:            string;
  Planungmeldung:    string;
  Freigabemeldung:   string;

  Vertretungskonversationliste: Urlaubsvertretungkonversationstruktur[];

  // Vertretungmeldung:            string;
  // VertreterantwortSended:       boolean;
  // VertreteranfrageSended:       boolean;
  // Vertretunganfragezeitstempel: number;
  // Vertretungantwortzeitstempel: number;

  Freigabeantwortzeitstempel: number;
  FreigabeantwortOfficezeitstempel: number;
  Tageanzahl:    number;
  Halbertag: boolean;
  Betriebsurlaub: boolean;
  FreigabeanfrageSended: boolean;
  FreigabeantwortSended: boolean;
  FreigabeantwortOfficeSended: boolean;
  Checked?: boolean;

};
