
export interface Standortestruktur  {

    _id: string;
    // StandortID: string;
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
    Filtered?: boolean;
    Text_A?: string;
    Text_B?: string;
    Text_C?: string;
};
