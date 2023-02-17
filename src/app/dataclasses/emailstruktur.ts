export type Emailstruktur = {

  EmailID:        string;
  ProjektID:      string;
  ProtokollID:    string;
  ProjektpunktID: string;
  Emailmodus:     string;
  Zeitstempel: number;
  Zeitpunkt:   string;
  Betreff:     string;
  Nachricht:   string;
  Dateiname:   string;
  EmpfaengerIDListe: string[];
  Empfengerliste?:   string[];
  KopienIDListe:     string[];
  Kopienliste?:      string[];
  Verfasser: {

    Name: string;
    Email: string;
  }
};
