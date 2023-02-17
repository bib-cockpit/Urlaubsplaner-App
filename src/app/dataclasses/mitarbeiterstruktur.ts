import {Favoritenstruktur} from "./favoritenstruktur";
import {Meintagstruktur} from "./meintagstruktur";
import {Meinewochestruktur} from "./meinewochestruktur";

export interface Mitarbeiterstruktur  {

    _id: string;
    StandortID:     string;
    Vorname: string;
    Name: string;
    Kuerzel: string;
    Telefon: string;
    Mobil: string;
    Email: string;
    SettingsID: string;
    Zeitstring: string;
    Zeitstempel: number;
    Fachbereich: string;
    Deleted: boolean;
    Meintagliste:    Meintagstruktur[];
    Meinewocheliste: Meinewochestruktur[];
    Favoritenliste:  Favoritenstruktur[];

    Filtered?: boolean;
    Text_A?: string;
    Text_B?: string;
    Text_C?: string;
    Selected?: boolean;
    Color?:    string;
    __v?: any;
};
