import {Verfasserstruktur} from "./verfasserstruktur";
import {Projektpunktanmerkungstruktur} from "./projektpunktanmerkungstruktur";

export type Projektpunktestruktur = {

  _id:                 string;
  ProjektID:           string;
  ProjektleiterID:     string;
  ProtokollID:         string;
  Projektkey:          string;
  NotizenID:           string;
  FestlegungskategorieID: string;
  Listenposition:      number;
  Nummer:              string;
  Aufgabe:             string;

  Startzeitsptempel:   number;
  Startzeitstring:     string;

  Endezeitstempel:     number;
  Endezeitstring:      string;

  EndeKalenderwoche:   number;

  Geschlossenzeitstempel: number;
  Geschlossenzeitstring:  string;

  Status:              string;
  DataChanged:         boolean;
  ProtokollOnly:       boolean;
  ProtokollPublic:     boolean;
  LiveEditor:          boolean;
  Meilenstein:         boolean;
  Meilensteinstatus:   string;
  BemerkungMouseOver:  boolean;
  EndeMouseOver:       boolean;
  Zeitansatz:          number;
  Zeitansatzeinheit:   string;
  FileDownloadURL:     string;
  Filename:            string;
  Filezoom:            number;
  Bildbreite:          number;
  Bildhoehe:           number;
  Querdarstellung:     boolean;
  Anmerkungenliste:    Projektpunktanmerkungstruktur[];
  Fortschritt:         number;
  OpenFestlegung:      boolean;
  Fachbereich:         string;

  Verfasser: Verfasserstruktur;

  BauteilID:         string;
  GeschossID:        string;
  RaumID:            string;
  Oberkostengruppe:  number;
  Hauptkostengruppe: number;
  Unterkostengruppe: number;
  Deleted:           boolean;

  ZustaendigeExternIDListe: string[];
  ZustaendigeInternIDListe: string[];
  Zustaendigkeitsliste?:    string[];
  __v?: any;
  Minuten?: number;
};
