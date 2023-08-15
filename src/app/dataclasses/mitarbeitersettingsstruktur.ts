// import {LOPListefelderSettingsstruktur} from "./loplistefeldersettingsstruktur";

export type Mitarbeitersettingsstruktur = {

  _id:                   string;
  MitarbeiterID:         string;
  FavoritenID:           string;
  ProjektID:             string;
  Favoritprojektindex:   number;
  StandortFilter:        string;
  LeistungsphaseFilter:  string;

  OberkostengruppeFilter:  number;
  HauptkostengruppeFilter: number;
  UnterkostengruppeFilter: number;

  AufgabenShowOffen:        boolean;
  AufgabenShowGeschlossen:  boolean;
  AufgabenShowBearbeitung:  boolean;
  AufgabenShowRuecklauf:    boolean;
  AufgabenShowMeilensteinOnly: boolean;

  AufgabenShowPlanung: boolean;
  AufgabenShowAusfuehrung: boolean;

  AufgabenTerminfiltervariante:  string;
  AufgabenTerminfilterStartwert: number;
  AufgabenTerminfilterEndewert:  number;

  AufgabenSortiermodus:  string;

  AufgabenMeilensteineNachlauf: number;

  Deleted:                  boolean;
  HeadermenueMaxFavoriten:  number;

  LOPListeGeschlossenZeitfilter: number;

  AufgabenShowMeilensteine:  boolean;
  AufgabenShowNummer:        boolean;
  AufgabenShowStartdatum:    boolean;
  AufgabenShowAufgabe:       boolean;
  AufgabenShowBemerkung:     boolean;
  AufgabenShowTage:          boolean;
  AufgabenShowTermin:        boolean;
  AufgabenShowStatus:        boolean;
  AufgabenShowFortschritt:   boolean;
  AufgabenShowZustaendig:    boolean;
  AufgabenShowMeintag:       boolean;
  AufgabenShowZeitansatz:    boolean;
  AufgabenShowMeinewoche:    boolean;

};
