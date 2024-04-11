export type Homeofficezeitspannenstruktur = {

  ZeitspannenID:     string;
  Startstempel:      number;
  Endestempel:       number;
  Startstring:       string;
  Endestring:        string;
  Status:            string;
  Planungmeldung:    string;
  Vertretungmeldung: string;
  Freigabemeldung:   string;
  Freigabeantwortzeitstempel: number;
  Tageanzahl:    number;
  FreigabeanfrageSended: boolean;
  FreigabeantwortSended: boolean;
  Checked?: boolean;

};
