import {Projektbeteiligtestruktur} from "./projektbeteiligtestruktur";
import {Verfasserstruktur} from "./verfasserstruktur";
import {Bauteilstruktur} from "./bauteilstruktur";
import {Projektfirmenstruktur} from "./projektfirmenstruktur";

export type Projektestruktur = {

  _id:                  string;
  ProjektleiterID:      string;
  StellvertreterID:     string;
  Projektkey:           string;
  StandortID:           string;
  Zeitstempel:          number;
  Zeitpunkt:            string;
  Strasse:              string;
  PLZ:                  string;
  Ort:                  string;
  Projektname:          string;
  OutlookkategorieID:   string;
  Projektkurzname:      string;
  Projektmailadresse:   string;
  Projektnummer:        string;
  Leistungsphase:       string;
  Status:               string;
  Deleted:              boolean;
  Beteiligtenliste:     Projektbeteiligtestruktur[];
  Firmenliste:          Projektfirmenstruktur[];
  MitarbeiterIDListe:   string[];
  Verfasser:            Verfasserstruktur;
  Bauteilliste:         Bauteilstruktur[];

  ProjektIsReal:        boolean;

  TeamsID:              string;
  TeamsDescription:     string;
  TeamsName:            string;
  ProjektFolderID:       string;
  ProtokolleFolderID:    string;
  BautagebuchFolderID:   string;
  BaustellenLOPFolderID: string;
  RechnungListefolderID: string;
  LastLOPEintragnummer:  number;

  DisplayKG410: boolean;
  DisplayKG475: boolean;
  DisplayKG420: boolean;
  DisplayKG430: boolean;
  DisplayKG434: boolean;
  DisplayKG440: boolean;
  DisplayKG450: boolean;
  DisplayKG460: boolean;
  DisplayKG480: boolean;
  DisplayBeschreibungen: boolean;
  DisplayUngenutzte: boolean;

  Selected?: boolean;
  Filtered?: boolean;
  Text_A?:  string;
  Text_B?:  string;
  Text_C?:  string;
  __v?:     any;

};
