export type Urlauzeitspannenstruktur = {

  ZeitspannenID:     string;
  Startstempel:      number;
  Endestempel:       number;
  VertreterID:       string;
  Startstring:       string;
  Endestring:        string;
  Status:            string;
  Planungmeldung:    string;
  Vertretungmeldung: string;
  Freigabemeldung:   string;
  Vertretunganfragezeitstempel: number;
  Vertretungantwortzeitstempel: number;
  Freigabeantwortzeitstempel: number;
  FreigabeantwortOfficezeitstempel: number;
  Tageanzahl:    number;
  VertreteranfrageSended: boolean;
  VertreterantwortSended: boolean;
  FreigabeanfrageSended: boolean;
  FreigabeantwortSended: boolean;
  FreigabeantwortOfficeSended: boolean;

};
