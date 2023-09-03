import {Verfasserstruktur} from "./verfasserstruktur";
import {Notizenkapitelabschnittstruktur} from "./notizenkapitelabschnittstruktur";


export type Notizenkapitelstruktur = {

  _id:   string;
  Titel: string;
  ProjektID: string;
  Projektkey: string;
  Zeitstring: string;
  Zeitstempel: number;
  Verfasser: Verfasserstruktur;
  Deleted: boolean;
  Abschnittliste: Notizenkapitelabschnittstruktur[];
  __v?: any;
};
