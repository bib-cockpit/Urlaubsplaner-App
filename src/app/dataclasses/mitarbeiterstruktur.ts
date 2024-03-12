import {Favoritenstruktur} from "./favoritenstruktur";
import {Meintagstruktur} from "./meintagstruktur";
import {Meinewochestruktur} from "./meinewochestruktur";
import {Urlaubsstruktur} from "./urlaubsstruktur";

export interface Mitarbeiterstruktur  {

    _id: string;
    UserID: string;
    StandortID:  string;
    PositionID: string;
    Resturlaub: number;
    Anrede: string;
    Urlaub: number;
    Jobtitel:   string;
    Location: string;
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

    Planeradministrator: boolean;
    Urlaubsfreigaben:    boolean;
    Homeofficefreigaben: boolean;
    Homeofficefreigabestandorte: string[];
    Urlaubsfreigabeorte:         string[];


    Meintagliste:    Meintagstruktur[];
    Meinewocheliste: Meinewochestruktur[];
    Favoritenliste:  Favoritenstruktur[];
    Urlaubsliste:    Urlaubsstruktur[];
    Archiviert: boolean;
    Filtered?: boolean;
    Text_A?: string;
    Text_B?: string;
    Text_C?: string;
    Selected?: boolean;
    Color?:    string;
    ShowInGesamtuebersicht?: boolean;
    __v?: any;
};
