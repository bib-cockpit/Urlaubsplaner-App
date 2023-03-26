import {Verfasserstruktur} from "./verfasserstruktur";

export type Projektbeteiligtestruktur = {

    BeteiligtenID: string;
    Beteiligtentyp: number;
    Fachfirmentyp: number;
    Beteiligteneintragtyp: string;
    Name: string;
    Anrede: string;
    Vorname: string;
    Firma: string;
    Kuerzel: string;
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
