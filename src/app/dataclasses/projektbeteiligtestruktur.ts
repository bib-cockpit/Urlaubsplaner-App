import {Verfasserstruktur} from "./verfasserstruktur";

export type Projektbeteiligtestruktur = {

    BeteiligtenID: string;
    Name: string;
    Anrede: string;
    Vorname: string;
    Possition: string;
    FirmaID: string;
    Strasse: string;
    PLZ: string;
    Ort: string;
    Telefon: string;
    Mobil: string;
    Email: string;
    Verfasser: Verfasserstruktur;
    Filtered?: boolean;
    Text_A?: string;
    Text_B?: string;
    Text_C?: string;
    Selected?: boolean;
    Color?: string;
    Sortvalue?: string;
};
