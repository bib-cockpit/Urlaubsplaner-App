import {EventEmitter, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import moment, {Moment} from "moment";
import {ConstProvider} from "../const/const";
import {Bautagebuchstruktur} from "../../dataclasses/bautagebuchstruktur";
import {DatabaseProjekteService} from "../database-projekte/database-projekte.service";
import {Bautagebucheintragstruktur} from "../../dataclasses/bautagebucheintragstruktur";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {Protokollstruktur} from "../../dataclasses/protokollstruktur";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {Projektbeteiligtestruktur} from "../../dataclasses/projektbeteiligtestruktur";
import {Graphservice} from "../graph/graph";
import {BasicsProvider} from "../basics/basics";
import {DatabaseAuthenticationService} from "../database-authentication/database-authentication.service";

@Injectable({
  providedIn: 'root'
})
export class DatabaseBautagebuchService {

  public CurrentTagebuch: Bautagebuchstruktur;
  public CurrentTagebucheintrag: Bautagebucheintragstruktur;

  private ServerSaveBautagebuchToTeamsUrl: string;
  private ServerSendBautagebuchToTeamsUrl: string;
  private ServerUrl: string;

  constructor(private Debug: DebugProvider,
              private Pool: DatabasePoolService,
              private Const: ConstProvider,
              private ProjektDB: DatabaseProjekteService,
              private DBProjekt: DatabaseProjekteService,
              private GraphService: Graphservice,
              private Basics: BasicsProvider,
              private AuthService: DatabaseAuthenticationService,
              private http: HttpClient) {
    try {

      this.CurrentTagebuch = null;
      this.CurrentTagebucheintrag = null;
      this.ServerUrl                       = this.Pool.CockpitserverURL + '/bautagebuch/';
      this.ServerSaveBautagebuchToTeamsUrl = this.Pool.CockpitserverURL + '/savebautagebuch';
      this.ServerSendBautagebuchToTeamsUrl = this.Pool.CockpitserverURL + '/sendbautagebuch';


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Bautagebuch', 'constructor', this.Debug.Typen.Service);
    }
  }

  public GetEmptyBautagebucheintrag() : Bautagebucheintragstruktur {

    try {

      return {

        BautagebucheintragID: null,
        Arbeitszeit: 1.0,
        Taetigkeit: ''
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Bautagebuch', 'GetEmptyBautagebucheintrag', this.Debug.Typen.Service);
    }
  }

  public GetEmptyBautagebuch(): Bautagebuchstruktur {

    try {

      let Heute: Moment = moment();
      let Nummer: number;
      let Bautagebuch: Bautagebuchstruktur;
      let LastBautagebuch: Bautagebuchstruktur;

      if(this.ProjektDB.CurrentProjekt !== null && !lodash.isUndefined(this.Pool.Bautagebuchliste[this.ProjektDB.CurrentProjekt.Projektkey])) {

        Nummer = this.Pool.Bautagebuchliste[this.ProjektDB.CurrentProjekt.Projektkey].length;
        Nummer++;
      }
      else {

        Nummer = 1;
      }

      Bautagebuch = {
        _id: null,
        Facharbeiter: '0',
        Helfer: '0',
        Lehrling: '0',
        Vorarbeiter: '0',
        Auftraggeber: "",
        Gewerk: this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Fachbereich : 'unbekannt',
        Verfasser: {
          Name:    this.Pool.Mitarbeiterdaten      !== null ? this.Pool.Mitarbeiterdaten.Name : 'unbekannt',
          Vorname: this.Pool.Mitarbeiterdaten      !== null ? this.Pool.Mitarbeiterdaten.Vorname : 'unbekannt',
          Email:   this.Pool.Mitarbeiterdaten      !== null ? this.Pool.Mitarbeiterdaten.Email : 'unbekannt',
        },
        Behinderungen: "",
        Bezeichnung: this.ProjektDB.CurrentProjekt !== null ? this.ProjektDB.CurrentProjekt.Projektname : 'unbekannt',
        Eintraegeliste: [],
        Leistung: "Objektüberwachung - Bauüberwachung und Dokumentation",
        Nummer: Nummer.toString(),
        ProjektID:  this.ProjektDB.CurrentProjekt !== null ? this.ProjektDB.CurrentProjekt._id : 'unbekannt',
        Projektkey: this.ProjektDB.CurrentProjekt !== null ? this.ProjektDB.CurrentProjekt.Projektkey : 'unbekannt',
        Temperatur: "20",
        Vorkommnisse: "",
        Bedeckt:  false,
        Bewoelkt: false,
        Frost:    false,
        Regen:    false,
        Schnee:   false,
        Sonnig:   false,
        Wind:     false,
        Zeitstempel: Heute.valueOf(),
        Zeitstring:  Heute.format('DD.MM.YYYY'),
        Deleted: false,

        Betreff: "",
        Nachricht: "",
        CcEmpfaengerExternIDListe: [],
        CcEmpfaengerInternIDListe: [],
        EmpfaengerExternIDListe: this.Pool.Mitarbeiterdaten !== null ? [this.Pool.Mitarbeiterdaten._id] : [],
        EmpfaengerInternIDListe: [],
        Filename: "",
        FileID: "",
        GesendetZeitstempel: null,
        GesendetZeitstring: this.Const.NONE,
      };

      debugger;

      if(this.ProjektDB.CurrentProjekt !== null &&
        !lodash.isUndefined(this.Pool.Bautagebuchliste[this.ProjektDB.CurrentProjekt.Projektkey]) &&
        !lodash.isUndefined(this.Pool.Bautagebuchliste[this.ProjektDB.CurrentProjekt.Projektkey][0]))
      {

        LastBautagebuch = this.Pool.Bautagebuchliste[this.ProjektDB.CurrentProjekt.Projektkey][0];

        Bautagebuch.EmpfaengerExternIDListe   = LastBautagebuch.EmpfaengerExternIDListe;
        Bautagebuch.CcEmpfaengerExternIDListe = LastBautagebuch.CcEmpfaengerExternIDListe;
        Bautagebuch.EmpfaengerInternIDListe   = LastBautagebuch.EmpfaengerInternIDListe;
        Bautagebuch.CcEmpfaengerInternIDListe = LastBautagebuch.CcEmpfaengerInternIDListe;

        Bautagebuch.Auftraggeber              = LastBautagebuch.Auftraggeber;

        Bautagebuch.Vorarbeiter               = LastBautagebuch.Vorarbeiter;
        Bautagebuch.Facharbeiter              = LastBautagebuch.Facharbeiter;
        Bautagebuch.Helfer                    = LastBautagebuch.Helfer;
        Bautagebuch.Lehrling                  = LastBautagebuch.Lehrling;
      }

      return Bautagebuch;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Bautagebuch', 'GetEmptyBautagebuch', this.Debug.Typen.Service);
    }
  }


  public AddBautagebuch(): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Bautagebuch: Bautagebuchstruktur;

      return new Promise<any>((resove, reject) => {

        // POST für neuen Eintrag

        Observer = this.http.post(this.ServerUrl, this.CurrentTagebuch);

        Observer.subscribe({

          next: (result) => {

            debugger;

            Bautagebuch = result.data;

          },
          complete: () => {

            this.UpdateBautagebuchliste(Bautagebuch);
            this.Pool.BautagebuchlisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Bautagebuch', 'AddBautagebuch', this.Debug.Typen.Service);
    }
  }

  private UpdateBautagebuchliste(Bautagebuch: Bautagebuchstruktur) {

    try {

      let Index: number;

      Index = lodash.findIndex(this.Pool.Bautagebuchliste[this.ProjektDB.CurrentProjekt.Projektkey], {_id : Bautagebuch._id});

      if(Index !== -1) {

        this.Pool.Bautagebuchliste[this.ProjektDB.CurrentProjekt.Projektkey][Index] = Bautagebuch;

        this.Debug.ShowMessage('Bautagebuchliste updated: ' + Bautagebuch.Bezeichnung, 'Database Bautagebuch', 'UpdateBautagebuchliste', this.Debug.Typen.Service);

      }
      else {

        this.Debug.ShowMessage('Bautagebuch nicht gefunden -> neuen Bautagebuch hinzufügen', 'Database Bautagebuch', 'UpdateBautagebuchliste', this.Debug.Typen.Service);

        this.Pool.Bautagebuchliste[this.ProjektDB.CurrentProjekt.Projektkey].push(Bautagebuch); // neuen
      }

      // Gelöscht markiert Einträge entfernen

      this.Pool.Bautagebuchliste[this.ProjektDB.CurrentProjekt.Projektkey] = lodash.filter(this.Pool.Bautagebuchliste[this.ProjektDB.CurrentProjekt.Projektkey], (currentbautagebuch: Bautagebuchstruktur) => {

        return currentbautagebuch.Deleted === false;
      });

      // Tagebücher absteigend mit letztem Eintrag zuerst sortieren

      this.Pool.Bautagebuchliste[this.ProjektDB.CurrentProjekt.Projektkey].sort((a: Bautagebuchstruktur, b: Bautagebuchstruktur) => {

        if (a.Zeitstempel > b.Zeitstempel) return -1;
        if (a.Zeitstempel < b.Zeitstempel) return 1;
        return 0;
      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Bautagebuch', 'UpdateBautagebuchliste', this.Debug.Typen.Service);
    }
  }


  public UpdateBautagebuch(): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams();

      delete this.CurrentTagebuch.__v;

      Params.set('id', this.CurrentTagebuch._id);

      return new Promise<any>((resove, reject) => {

          // PUT für update

        Observer = this.http.put(this.ServerUrl, this.CurrentTagebuch);

        Observer.subscribe({

          next: (ne) => {

            debugger;

          },
          complete: () => {

            debugger;

            this.UpdateBautagebuchliste(this.CurrentTagebuch);

            this.Pool.BautagebuchlisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Bautagebuch', 'UpdateBautagebuch', this.Debug.Typen.Service);
    }
  }
  public DeleteBautagebuch(): Promise<any> {

    try {

      let Observer: Observable<any>;

      this.CurrentTagebuch.Deleted = true;

      return new Promise<any>((resove, reject) => {

          // PUT für update

        debugger;

        Observer = this.http.put(this.ServerUrl, this.CurrentTagebuch);

        Observer.subscribe({

          next: (ne) => {

            debugger;

          },
          complete: () => {

            this.UpdateBautagebuchliste(this.CurrentTagebuch);
            this.Pool.BautagebuchlisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Bautagebuch', 'DeleteBautagebuch', this.Debug.Typen.Service);
    }
  }

  DeleteTagebucheintrag() {

    try {

      this.CurrentTagebuch.Eintraegeliste = lodash.filter(this.CurrentTagebuch.Eintraegeliste, (eintrag: Bautagebucheintragstruktur) => {

        return eintrag.BautagebucheintragID !== this.CurrentTagebucheintrag.BautagebucheintragID;
      });

      this.CurrentTagebucheintrag = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Bautagebuch', 'DeleteBautagebucheintrag', this.Debug.Typen.Service);
    }
  }


  public async SendBautagebuchFromSile(bautagebuch: Bautagebuchstruktur): Promise<any> {

    try {

      let token = await this.AuthService.RequestToken('Mail.Send');

      let Observer: Observable<any>;
      let Merker: Teamsfilesstruktur;
      let Daten: {

        Betreff:     string;
        Nachricht:   string;
        FileID:      string;
        Filename:    string;
        DirectoryID: string;
        UserID:      string;
        Token:       string;
        Empfaengerliste:   any[];
        CcEmpfaengerliste: any[];
      };

      if(this.Basics.DebugNoExternalEmail) {

        bautagebuch.Empfaengerliste   = lodash.filter(bautagebuch.Empfaengerliste,   { Email : 'p.hornburger@gmail.com' });
        bautagebuch.CcEmpfaengerliste = lodash.filter(bautagebuch.CcEmpfaengerliste, { Email : 'p.hornburger@gmail.com' });

        if(bautagebuch.Empfaengerliste.length === 0) {

          bautagebuch.Empfaengerliste.push({
            Email: 'p.hornburger@gmail.com',
            Name:  'Peter Hornburger'
          });
        }
      }

      Daten = {

        Betreff:     bautagebuch.Betreff,
        Nachricht:   bautagebuch.Nachricht,
        DirectoryID: this.DBProjekt.CurrentProjekt.BautagebuchFolderID,
        UserID:      this.GraphService.Graphuser.id,
        FileID:      bautagebuch.FileID,
        Filename:    bautagebuch.Filename,
        Token:       token,
        Empfaengerliste:   bautagebuch.Empfaengerliste,
        CcEmpfaengerliste: bautagebuch.CcEmpfaengerliste
      };

      return new Promise((resolve, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerSendBautagebuchToTeamsUrl, Daten);

        Observer.subscribe({

          next: (ne) => {

            Merker = ne;

          },
          complete: () => {

            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Bautagebuch', 'SaveProtokollInTeams', this.Debug.Typen.Service);
    }
  }

  public SaveBautagebuchInSite(

    filename: string,
    projekt: Projektestruktur,
    bautagebuch: Bautagebuchstruktur,
    standort: Standortestruktur, mitarbeiter: Mitarbeiterstruktur, showmailinformations: boolean): Promise<Bautagebuchstruktur> {

    try {

      let Observer: Observable<any>;
      let Teamsfile: Teamsfilesstruktur;
      let Beteiligter: Projektbeteiligtestruktur;
      let Mitarbeiter: Mitarbeiterstruktur;
      let Name: string;
      let CcEmpfaengerliste: {
        Name:  string;
        Email: string;
      }[];
      let Empfaengerliste: {
        Name:  string;
        Email: string;
      }[];
      let Daten: {

        DirectoryID: string;
        Filename:    string;
        Projekt:     Projektestruktur;
        Bautagebuch: Bautagebuchstruktur;
        Standort:    Standortestruktur;
        Mitarbeiter: Mitarbeiterstruktur;
        ShowMailinformations: boolean;
      } = {

        DirectoryID: this.DBProjekt.CurrentProjekt.BautagebuchFolderID,
        Projekt:     projekt,
        Bautagebuch: lodash.cloneDeep(bautagebuch),
        Filename:    filename,
        Standort:    standort,
        Mitarbeiter: mitarbeiter,
        ShowMailinformations: showmailinformations
      };

      debugger;

      // Empfaenger bestimmen

      Empfaengerliste   = [];
      CcEmpfaengerliste = [];

      for(let ExternEmpfaengerID of Daten.Bautagebuch.EmpfaengerExternIDListe) {

        Beteiligter = lodash.find(this.DBProjekt.CurrentProjekt.Beteiligtenliste, {BeteiligtenID: ExternEmpfaengerID});

        if(!lodash.isUndefined(Beteiligter)) {

          Name = Beteiligter.Beteiligteneintragtyp === this.Const.Beteiligteneintragtypen.Person ? Beteiligter.Vorname + ' ' + Beteiligter.Name : Beteiligter.Firma;

          Empfaengerliste.push({

            Name: Name,
            Email: Beteiligter.Email
          });
        }
      }

      for(let InternEmpfaengerID of Daten.Bautagebuch.EmpfaengerInternIDListe) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: InternEmpfaengerID});

        if(!lodash.isUndefined(Mitarbeiter)) Empfaengerliste.push({

          Name: Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name,
          Email: Mitarbeiter.Email
        });
      }

      for(let CcExternEmpfaengerID of Daten.Bautagebuch.CcEmpfaengerExternIDListe) {

        Beteiligter = lodash.find(this.DBProjekt.CurrentProjekt.Beteiligtenliste, {BeteiligtenID: CcExternEmpfaengerID});

        if(!lodash.isUndefined(Beteiligter)) {

          Name = Beteiligter.Beteiligteneintragtyp === this.Const.Beteiligteneintragtypen.Person ? Beteiligter.Vorname + ' ' + Beteiligter.Name : Beteiligter.Firma;

          CcEmpfaengerliste.push({

            Name: Name,
            Email: Beteiligter.Email
          });
        }
      }

      for(let CcInternEmpfaengerID of Daten.Bautagebuch.CcEmpfaengerInternIDListe) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: CcInternEmpfaengerID});

        if(!lodash.isUndefined(Mitarbeiter)) CcEmpfaengerliste.push({

          Name: Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name,
          Email: Mitarbeiter.Email
        });
      }

      Daten.Bautagebuch.Empfaengerliste   = Empfaengerliste;
      Daten.Bautagebuch.CcEmpfaengerliste = CcEmpfaengerliste;

      // Bautagebuch versenden

      return new Promise((resolve, reject) => {

        // PUT für update -> Datei neu erstellen oder überschreiben

        Observer = this.http.put(this.ServerSaveBautagebuchToTeamsUrl, Daten);

        Observer.subscribe({

          next: (ne) => {

            Teamsfile = ne;
          },
          complete: () => {

            Daten.Bautagebuch.FileID              = Teamsfile.id;
            Daten.Bautagebuch.GesendetZeitstempel = Teamsfile.GesendetZeitstempel;
            Daten.Bautagebuch.GesendetZeitstring  = Teamsfile.GesendetZeitstring;

            resolve(Daten.Bautagebuch);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Bautagebuch', 'SaveBautagebuchInSite', this.Debug.Typen.Service);
    }
  }
}
