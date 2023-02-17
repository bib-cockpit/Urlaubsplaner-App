export interface Fehlermeldungparameterstruktur  {

    Sql: string[];
    Errormessage: string;
    Errorcode: number;
    Commonscript: string;
    Callingscript: string;
    Callingfunction: string;
    Stack: string;
    Script: string;
    Error: any;
    Funktion: string;
    Scripttype: string;
    Type: string;
};
