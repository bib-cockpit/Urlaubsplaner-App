export type Protokollsendeberichtstruktur = {

  ProtokollsendeberichtID:  string;
  ProjektID:                string;
  ProtokollID:              string;
  INNERHEAD:                string;
  INNERBODY:                string;
  Gesendet:                 boolean;
  Zeitstempel:              number;
  Zeitpunkt:                string;
  Sendezeitstempel:         number;
  Sendezeitpunkt:           string;
  TeambeteiligtenIDListe:   string[];
  ProjektbeteiligteIDListe: string[];
};
