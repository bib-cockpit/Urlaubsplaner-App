
export interface Standortestruktur  {

    _id: string;
    Standort: string;
    Kuerzel: string;
    Strasse: string;
    PLZ: string;
    Ort: string;
    Telefon: string;
    Email: string;
    Deleted: boolean;
    Zeitstempel: number;
    Zeitpunkt: string;
    Land: string;
    Bundesland: string;
    Konfession: string;
    Homeofficefreigabepersonen: string[];
    Urlaubfreigabepersonen: string[];
    Filtered?: boolean;
    Text_A?: string;
    Text_B?: string;
    Text_C?: string;
};
