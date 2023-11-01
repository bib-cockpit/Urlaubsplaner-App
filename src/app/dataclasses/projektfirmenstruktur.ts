import {Verfasserstruktur} from "./verfasserstruktur";

export type Projektfirmenstruktur = {

    FirmenID: string;
    Fachfirmentyp: number;
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
