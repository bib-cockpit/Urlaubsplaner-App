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

  Tageanzahl:    number;
  VertreterantwortSended: boolean;
  FreigabeantwortSended: boolean;

};
