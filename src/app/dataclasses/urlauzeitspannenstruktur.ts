export type Urlauzeitspannenstruktur = {

  ZeitspannenID:      string;
  Startstempel:       number;
  Endestempel:        number;
  UrlaubsvertreterID: string;
  UrlaubsfreigeberID: string;
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
  Halbertag: boolean;
  Betriebsurlaub: boolean;
  VertreteranfrageSended: boolean;
  VertreterantwortSended: boolean;
  FreigabeanfrageSended: boolean;
  FreigabeantwortSended: boolean;
  FreigabeantwortOfficeSended: boolean;
  Checked?: boolean;

};
