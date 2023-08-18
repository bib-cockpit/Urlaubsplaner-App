import {Injectable, SimpleChange} from '@angular/core';
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {DebugProvider} from "../debug/debug";
import {Projektpunktstatustypenstruktur} from "../../dataclasses/projektpunktestatustypenstruktur";
import {ConstProvider} from "../const/const";
import {BasicsProvider} from "../basics/basics";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import MyMoment, {Moment} from "moment";
import {DatabaseMitarbeiterService} from "../database-mitarbeiter/database-mitarbeiter.service";
import {Protokollstruktur} from "../../dataclasses/protokollstruktur";
import {DatabaseProjekteService} from "../database-projekte/database-projekte.service";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Mitarbeitersettingsstruktur} from "../../dataclasses/mitarbeitersettingsstruktur";
import {Projektpunktanmerkungstruktur} from "../../dataclasses/projektpunktanmerkungstruktur";
import {DatabaseProtokolleService} from "../database-protokolle/database-protokolle.service";
import {Meintagstruktur} from "../../dataclasses/meintagstruktur";
import {Meinewochestruktur} from "../../dataclasses/meinewochestruktur";
import {Projektfarbenstruktur} from "../../dataclasses/projektfarbenstruktur";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {LOPListestruktur} from "../../dataclasses/loplistestruktur";
import {DatabaseLoplisteService} from "../database-lopliste/database-lopliste.service";
import {settings} from "ionicons/icons";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";
import {DatabaseAuthenticationService} from "../database-authentication/database-authentication.service";
import {Graphservice} from "../graph/graph";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {Projektbeteiligtestruktur} from "../../dataclasses/projektbeteiligtestruktur";
import {DatabaseFestlegungenService} from "../database-festlegungen/database-festlegungen.service";

@Injectable({
  providedIn: 'root'
})
export class DatabaseProjektpunkteService {

  public CurrentProjektpunkt: Projektpunktestruktur;
  public CurrentProjektpunkteliste: Projektpunktestruktur[];
  public Statustypenliste: Projektpunktstatustypenstruktur[];
  private ServerProjektpunkteUrl: string;
  public LiveEditorOpen: boolean;
  public Heute: moment.Moment;
  public Wochenpunkteliste: Projektpunktestruktur[][];
  private ServerSendFestlegungenToTeamsUrl: string;
  private ServerSaveFestlegungenToTeamsUrl: string;

  constructor(private Debug: DebugProvider,
              private Basics: BasicsProvider,
              private http: HttpClient,
              private Pool: DatabasePoolService,
              private DBMitarbeiter: DatabaseMitarbeiterService,
              private DBProjekt: DatabaseProjekteService,
              private DBProtokoll: DatabaseProtokolleService,
              private DBFestlegungen: DatabaseFestlegungenService,
              private AuthService: DatabaseAuthenticationService,
              private GraphService: Graphservice,
              private DBLOPListe: DatabaseLoplisteService,
              private Const: ConstProvider) {

    try {

      this.CurrentProjektpunkt       = null;
      this.Statustypenliste          = [];
      this.ServerProjektpunkteUrl    = this.Pool.CockpitserverURL + '/projektpunkte';
      this.Heute                     = moment().locale('de');
      this.LiveEditorOpen            = false;
      this.Wochenpunkteliste         = [];
      this.CurrentProjektpunkteliste = [];

      this.ServerSendFestlegungenToTeamsUrl = this.Pool.CockpitserverURL + '/sendfestlegungen';
      this.ServerSaveFestlegungenToTeamsUrl = this.Pool.CockpitserverURL + '/savefestlegungen';

      this.InitStatustypen();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projektpunkte', 'constructor', this.Debug.Typen.Service);
    }
  }

  private InitStatustypen() {

    try
    {
      let Eintrag: Projektpunktstatustypenstruktur;

      this.Statustypenliste = [];

      for(const key of Object.keys(this.Const.Projektpunktstatustypen)) {

        Eintrag = this.Const.Projektpunktstatustypen[key];

        this.Statustypenliste.push(Eintrag);
      }
    }
    catch(error)
    {
      this.Debug.ShowErrorMessage(error.message, 'Database Projektpunkte', 'InitStatustypen', this.Debug.Typen.Service);
    }
  }

  public GetStatuscolor(Projektpunkt: Projektpunktestruktur): string {

    try {

      if(Projektpunkt !== null) {

        return this.GetProjektpunktstusByName(Projektpunkt.Status).Color;
      }
      else return 'red';


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projektpunkte', 'GetStatuscolor', this.Debug.Typen.Service);
    }
  }

  public GetProjektpunktstusByName(name: string): Projektpunktstatustypenstruktur {

    try {

      let Eintrag: Projektpunktstatustypenstruktur;

      for(const key of Object.keys(this.Const.Projektpunktstatustypen)) {

        Eintrag = this.Const.Projektpunktstatustypen[key];

        if(name === Eintrag.Name) return Eintrag;
      }

      return null;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projektpunkte', 'GetProjektpunktstusByName', this.Debug.Typen.Service);
    }
  }

  public GetProjektpunktPrioritaetByName(name: string): Projektpunktstatustypenstruktur {

    try {

      let Eintrag: Projektpunktstatustypenstruktur;

      for(const key of Object.keys(this.Const.Projektpunktprioritaetstypen)) {

        Eintrag = this.Const.Projektpunktprioritaetstypen[key];

        if(name === Eintrag.Name) return Eintrag;
      }

      return null;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projektpunkte', 'GetProjektpunktPrioritaetByName', this.Debug.Typen.Service);
    }
  }

  DeleteProjektpunkt(punkt: Projektpunktestruktur): Promise<any> {

    try {

      punkt.Deleted = true;

      return new Promise((resolve, reject) => {

        this.UpdateProjektpunkt(punkt).then(() => {

          if(punkt.ProtokollID !== null && this.DBProtokoll.CurrentProtokoll !== null) {

            this.DBProtokoll.CurrentProtokoll.ProjektpunkteIDListe = lodash.filter(this.DBProtokoll.CurrentProtokoll.ProjektpunkteIDListe, (istid: string) => {

              return istid !== punkt._id;
            });

            this.DBProtokoll.SaveProtokoll().then(() => {

              resolve(true);

            }).catch((errorb: HttpErrorResponse) => {

              reject(errorb);
            });
          }

          else if(punkt.LOPListeID !== null && this.DBLOPListe.CurrentLOPListe !== null) {

            this.DBLOPListe.CurrentLOPListe.ProjektpunkteIDListe = lodash.filter(this.DBLOPListe.CurrentLOPListe.ProjektpunkteIDListe, (istid: string) => {

              return istid !== punkt._id;
            });

            this.DBLOPListe.SaveLOPListe().then(() => {

              resolve(true);

            }).catch((errorb: HttpErrorResponse) => {

              reject(errorb);
            });
          }
          else {

            resolve(true);
          }
        }).catch((errora: HttpErrorResponse) => {

          reject(errora);
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projektpunkte', 'DeleteProjektpunkt', this.Debug.Typen.Service);
    }
  }

  public AddProjektpunkt(projektpunkt: Projektpunktestruktur) {

    try {

      let Observer: Observable<any>;

      return new Promise((resolve, reject) => {

        // POST für neuen Eintrag

        Observer = this.http.post(this.ServerProjektpunkteUrl, projektpunkt);

        Observer.subscribe({

          next: (result) => {

            this.CurrentProjektpunkt = result.Projektpunkt;
          },
          complete: () => {

            this.UpdateProjektpunkteliste(this.CurrentProjektpunkt);

            this.Pool.ProjektpunktelisteChanged.emit();
            this.Pool.ProjektpunktChanged.emit();

            resolve(this.CurrentProjektpunkt);
          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projektpunkte', 'AddProjektpunkt', this.Debug.Typen.Service);
    }
  }

  UpdateProjektpunkt(punkt: Projektpunktestruktur): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams();
      let Merker: Projektpunktestruktur;

      return new Promise((resolve, reject) => {

        Params.set('id', punkt._id);

        // PUT für update

        delete punkt.__v;

        Observer = this.http.put(this.ServerProjektpunkteUrl, punkt);

        Observer.subscribe({

          next: (ne) => {

            Merker = ne.Projektpunkt;

          },
          complete: () => {

            if(Merker !== null) {

              this.CurrentProjektpunkt = Merker;

              this.UpdateProjektpunkteliste(this.CurrentProjektpunkt);

              this.Pool.ProjektpunktelisteChanged.emit();
              this.Pool.ProjektpunktChanged.emit();

              resolve(true);
            }
            else {

              reject(new Error('Projektpunkt auf Server nicht gefunden.'));
            }
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projektpunkte', 'UpdateProjektpunkt', this.Debug.Typen.Service);
    }
  }

  DeleteProjektpunkteliste(liste: Projektpunktestruktur[], projekt: Projektestruktur): Promise<any> {


    try {

      return new Promise((resolve, reject) => {

        resolve(true);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projektpunkte', 'DeleteProjektpunkteliste', this.Debug.Typen.Service);
    }
  }

  CountProjektpunkte(Liste: Projektpunktestruktur[], ShowMeintag: boolean): number {

    try {

      let Anzahl: number = 0;

      if(lodash.isUndefined(Liste) === false) {

        for(let Punkt of Liste) {

          if(this.CheckFilter(Punkt, ShowMeintag) === true) Anzahl++;
        }
      }

      return Anzahl;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projektpunkte', 'CountPunkte', this.Debug.Typen.Service);
    }
  }

  public GetNewProjektpunkt(Projekt: Projektestruktur, Nummer): Projektpunktestruktur {

    try {

      let Heute: Moment  = MyMoment();
      let Termin: Moment = Heute.clone().add(7, 'days');
      let Startzeitstempel: number = Heute.valueOf();
      let Startzeitpunkt: string = Heute.format('DD.MM.YYYY');
      let Endezeitstempel: number = Termin.valueOf();
      let Endezeitpunkt: string = Termin.format('DD.MM.YYYY');
      let Vorname: string = this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Vorname : '';
      let Name: string  = this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Name    : '';
      let Email: string = this.Pool.Mitarbeiterdaten   !== null ? this.Pool.Mitarbeiterdaten.Email   : '';


      /*
      let Kommentarliste: Projektpunktkommentarstruktur[] = [];

      Kommentarliste.push({
        Kommentar: "Das ist der erste Kommentar zum testen der Editoren mit einem längeren Text damit mehrere Zeilen angezeigt werden können.",
        Kommentartyptyp: "", LiveEditor: false, Nextstepdone: false, Nextstepdonezeitstempel: 0, Nummer: 0, ProjektpunktID: "", Verfasser: {Email: "", Name: ""},
        Zeitsptempel: Heute.valueOf(), Zeitstring: "", id: "001"
      });

      Kommentarliste.push({
        Kommentar: "Die ist noch ein Kommentar zum testen der Editoren mit einr längeren Beschreibung damit mehrere Zeilen angezeigt werden können.",
        Kommentartyptyp: "", LiveEditor: false, Nextstepdone: false, Nextstepdonezeitstempel: 0, Nummer: 0, ProjektpunktID: "", Verfasser: {Email: "", Name: ""},
        Zeitsptempel: Heute.valueOf(), Zeitstring: "", id: "002"
      });

       */


      let Punkt: Projektpunktestruktur = {

        _id:              null,
        ProjektID:       Projekt !== null ? Projekt._id : null,
        Projektkey:      this.DBProjekt.CurrentProjekt.Projektkey,
        ProjektleiterID: this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten._id : null,
        ProtokollID:     null,
        LOPListeID:      null,
        EmailID:         null,
        Prioritaet:      null,
        NotizenID:       null,
        FestlegungskategorieID: null,
        Leistungsphase:  this.DBProjekt.CurrentProjekt.Leistungsphase,
        Nummer:          Nummer.toString(),
        Listenposition:  Nummer,
        OutlookkatgorieID: this.Const.NONE,
        Aufgabe:         "",
        Thematik:        "",
        Status:          this.GetProjektpunktstusByName(this.Const.Projektpunktstatustypen.Offen.Name).Name,
        Deleted:         false,
        Endezeitstempel:   Endezeitstempel,
        Endezeitstring:    Endezeitpunkt,
        EndeKalenderwoche: null,
        Startzeitsptempel: Startzeitstempel,
        Startzeitstring:   Startzeitpunkt,
        Geschlossenzeitstempel: null,
        Geschlossenzeitstring: null,
        FileDownloadURL:   this.Const.NONE,
        Filename:          this.Const.NONE,
        Filezoom:          1,
        Bildbreite:        0,
        Bildhoehe:         0,
        Querdarstellung:   false,
        Meilenstein:       false,
        Meilensteinstatus: 'OFF',
        Anmerkungenliste:   [], // Kommentarliste,
        DataChanged:        false,
        ProtokollOnly:      true,
        ProtokollPublic:    true,
        LiveEditor:         false,
        BemerkungMouseOver: false,
        EndeMouseOver:      false,
        Zeitansatz:         30,
        Zeitansatzeinheit:  this.Const.Zeitansatzeinheitvarianten.Minuten,
        Fortschritt:        0,
        ZustaendigeInternIDListe: [this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten._id : ''],
        ZustaendigeExternIDListe: [],
        BauteilID:          null,
        GeschossID:         null,
        RaumID:             null,
        OpenFestlegung:     false,
        Fachbereich:        this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Fachbereich : null,
        Oberkostengruppe:   null,
        Hauptkostengruppe:  null,
        Unterkostengruppe:  null,

        Verfasser: {

          Vorname: Vorname,
          Name: Name,
          Email: Email
        }
      };

      return Punkt;

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'GetNewProjektpunkt', this.Debug.Typen.Service);
    }
  }

  public GetNewFestlegung(): Projektpunktestruktur {

    try {

      let Heute: Moment  = MyMoment();
      let Startzeitstempel: number = Heute.valueOf();
      let Startzeitpunkt: string = Heute.format('DD.MM.YYYY');
      let Vorname: string = this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Vorname : '';
      let Name: string  = this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Name    : '';
      let Email: string = this.Pool.Mitarbeiterdaten   !== null ? this.Pool.Mitarbeiterdaten.Email   : '';





      let Punkt: Projektpunktestruktur = {

        _id:              null,
        ProjektID:       this.DBProjekt.CurrentProjekt !== null ? this.DBProjekt.CurrentProjekt._id : null,
        Projektkey:      this.DBProjekt.CurrentProjekt !== null ? this.DBProjekt.CurrentProjekt.Projektkey : null,
        ProjektleiterID: this.Pool.Mitarbeiterdaten    !== null ? this.Pool.Mitarbeiterdaten._id : null,
        ProtokollID:     null,
        LOPListeID:      null,
        EmailID:         null,
        Prioritaet:      null,
        NotizenID:       null,
        OutlookkatgorieID: this.Const.NONE,
        Leistungsphase:  this.DBProjekt.CurrentProjekt !== null ? this.DBProjekt.CurrentProjekt.Leistungsphase : 'unbekannt',
        FestlegungskategorieID: null,
        Nummer:          null,
        Listenposition:  null,
        Aufgabe:         "",
        Thematik:        "",
        Status:          this.GetProjektpunktstusByName(this.Const.Projektpunktstatustypen.Festlegung.Name).Name,
        Deleted:         false,
        Endezeitstempel:   null,
        Endezeitstring:    null,
        EndeKalenderwoche: null,
        Startzeitsptempel: Startzeitstempel,
        Startzeitstring:   Startzeitpunkt,
        Geschlossenzeitstempel: null,
        Geschlossenzeitstring: null,
        FileDownloadURL:   this.Const.NONE,
        Filename:          this.Const.NONE,
        Filezoom:          1,
        Bildbreite:        0,
        Bildhoehe:         0,
        Querdarstellung:   false,
        Meilenstein:       false,
        Meilensteinstatus: 'OFF',
        Anmerkungenliste:   [], // Kommentarliste,
        DataChanged:        false,
        ProtokollOnly:      true,
        ProtokollPublic:    true,
        LiveEditor:         false,
        BemerkungMouseOver: false,
        EndeMouseOver:      false,
        Zeitansatz:         30,
        Zeitansatzeinheit:  this.Const.Zeitansatzeinheitvarianten.Minuten,
        Fortschritt:        0,
        ZustaendigeInternIDListe: [this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten._id : ''],
        ZustaendigeExternIDListe: [],
        BauteilID:          null,
        GeschossID:         null,
        RaumID:             null,
        OpenFestlegung:     false,
        Fachbereich:        this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Fachbereich : null,
        Oberkostengruppe:   null,
        Hauptkostengruppe:  null,
        Unterkostengruppe:  null,

        Verfasser: {

          Vorname: Vorname,
          Name: Name,
          Email: Email
        }
      };

      return Punkt;

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'GetNewFestlegung', this.Debug.Typen.Service);
    }
  }

  public GetNewProtokollpunkt(Protokoll: Protokollstruktur): Projektpunktestruktur {

    try {

      let Nummer: string = Protokoll !== null ? (Protokoll.ProjektpunkteIDListe.length + 1).toString() : 'unbekannt';
      let Tag: Moment;

      if(Protokoll !== null) Tag = MyMoment(Protokoll.Startstempel);
      else                   Tag = MyMoment();

      let Termin: Moment = Tag.clone().add(7, 'days');
      let Startzeitpunkt: string = Tag.format('DD.MM.YYYY');

      let Endezeitstempel: number = Termin.valueOf();
      let Endezeitpunkt: string = Termin.format('DD.MM.YYYY');
      let Vorname: string  = this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Vorname : '';
      let Name: string  = this.Pool.Mitarbeiterdaten    !== null ? this.Pool.Mitarbeiterdaten.Name    : '';
      let Email: string = this.Pool.Mitarbeiterdaten    !== null ? this.Pool.Mitarbeiterdaten.Email   : '';
      let Anmerkungenliste: Projektpunktanmerkungstruktur[] = [];


      let Punkt: Projektpunktestruktur = {

        _id:              null,
        Projektkey:      this.DBProjekt.CurrentProjekt.Projektkey,
        ProjektID:       Protokoll !== null ? Protokoll.ProjektID : null,
        ProjektleiterID: this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten._id : null,
        ProtokollID:     Protokoll !== null ? Protokoll._id : null,
        LOPListeID:      null,
        EmailID:         null,
        Prioritaet:      this.Const.NONE,
        NotizenID:       null,
        FestlegungskategorieID: null,
        Nummer:          Nummer,
        OutlookkatgorieID: this.Const.NONE,
        Leistungsphase:  this.DBProjekt.CurrentProjekt !== null ? this.DBProjekt.CurrentProjekt.Leistungsphase : 'unbekannt',
        Listenposition:  parseInt(Nummer) - 1,
        Aufgabe:         "",
        Thematik:        "",
        Status:          this.Const.Projektpunktstatustypen.Protokollpunkt.Name, // this.GetProjektpunktstusByName().Name,
        Deleted:         false,
        Endezeitstempel:   Endezeitstempel,
        Endezeitstring:    Endezeitpunkt,
        EndeKalenderwoche: null,
        Startzeitsptempel: Protokoll !== null ? Protokoll.Startstempel : null,
        Startzeitstring:   Startzeitpunkt,
        Geschlossenzeitstempel: null,
        Geschlossenzeitstring: null,
        FileDownloadURL:   this.Const.NONE,
        Filename:          this.Const.NONE,
        Filezoom:          1,
        Bildbreite:        0,
        Bildhoehe:         0,
        Querdarstellung:   false,
        Meilenstein:       false,
        Meilensteinstatus: 'OFF',
        Anmerkungenliste:   Anmerkungenliste,
        DataChanged:        false,
        ProtokollOnly:      true,
        ProtokollPublic:    true,
        LiveEditor:         false,
        BemerkungMouseOver: false,
        EndeMouseOver:      false,
        Zeitansatz:         30,
        Zeitansatzeinheit:  this.Const.Zeitansatzeinheitvarianten.Minuten,
        Fortschritt:        0,
        ZustaendigeInternIDListe: [this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten._id : ''],
        ZustaendigeExternIDListe: [],
        BauteilID:          null,
        GeschossID:         null,
        RaumID:             null,
        OpenFestlegung:     false,
        Fachbereich:        this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Fachbereich : null,
        Oberkostengruppe:   null,
        Hauptkostengruppe:  null,
        Unterkostengruppe:  null,

        Verfasser: {

          Vorname: Vorname,
          Name: Name,
          Email: Email
        }
      };

      return Punkt;

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'GetNewProtokollpunkt', this.Debug.Typen.Service);
    }
  }

  public SaveFestlegungenInTeams(

    teamsid: string,
    directoryid: string,
    projekt: Projektestruktur,
    standort: Standortestruktur,
    mitarbeiter: Mitarbeiterstruktur,
    showmailinformations: boolean
  ): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Teamsfile: Teamsfilesstruktur;
      let Beteiligter: Projektbeteiligtestruktur;
      let Mitarbeiter: Mitarbeiterstruktur;
      let Name: string;

      let Daten: {

        TeamsID:     string;
        DirectoryID: string;
        Filename:    string;
        Projekt:     Projektestruktur;
        Displayliste: Projektpunktestruktur[][];
        Kostengruppenliste: Projektpunktestruktur[];
        Standort:    Standortestruktur;
        Mitarbeiter: Mitarbeiterstruktur;
        ShowMailinformations: boolean;
        CcEmpfaengerliste: {
          Name:  string;
          Email: string;
        }[];
        Empfaengerliste: {
          Name:  string;
          Email: string;
        }[];
      } = {

        TeamsID:     teamsid,
        DirectoryID: directoryid,
        Projekt:     projekt,
        Displayliste: this.DBFestlegungen.Displayliste,
        Kostengruppenliste: this.DBFestlegungen.Kostengruppenliste,
        Filename:    this.DBFestlegungen.Filename,
        Standort:    standort,
        Mitarbeiter: mitarbeiter,
        ShowMailinformations: showmailinformations,
        Empfaengerliste:   [],
        CcEmpfaengerliste: []
      };

      // Empfaenger bestimmen

      this.DBFestlegungen.Empfaengerliste   = [];
      this.DBFestlegungen.CcEmpfaengerliste = [];

      debugger;


      for(let ExternEmpfaengerID of this.DBFestlegungen.EmpfaengerExternIDListe) {

        Beteiligter = lodash.find(this.DBProjekt.CurrentProjekt.Beteiligtenliste, {BeteiligtenID: ExternEmpfaengerID});

        if(!lodash.isUndefined(Beteiligter)) {

          Name = Beteiligter.Beteiligteneintragtyp === this.Const.Beteiligteneintragtypen.Person ? Beteiligter.Vorname + ' ' + Beteiligter.Name : Beteiligter.Firma;

          this.DBFestlegungen.Empfaengerliste.push({

            Name: Name,
            Email: Beteiligter.Email
          });
        }
      }

      for(let InternEmpfaengerID of this.DBFestlegungen.EmpfaengerInternIDListe) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: InternEmpfaengerID});

        if(!lodash.isUndefined(Mitarbeiter)) this.DBFestlegungen.Empfaengerliste.push({

          Name: Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name,
          Email: Mitarbeiter.Email
        });
      }

      for(let CcExternEmpfaengerID of this.DBFestlegungen.CcEmpfaengerExternIDListe) {

        Beteiligter = lodash.find(this.DBProjekt.CurrentProjekt.Beteiligtenliste, {BeteiligtenID: CcExternEmpfaengerID});

        if(!lodash.isUndefined(Beteiligter)) {

          Name = Beteiligter.Beteiligteneintragtyp === this.Const.Beteiligteneintragtypen.Person ? Beteiligter.Vorname + ' ' + Beteiligter.Name : Beteiligter.Firma;

          this.DBFestlegungen.CcEmpfaengerliste.push({

            Name: Name,
            Email: Beteiligter.Email
          });
        }
      }

      for(let CcInternEmpfaengerID of this.DBFestlegungen.CcEmpfaengerInternIDListe) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: CcInternEmpfaengerID});

        if(!lodash.isUndefined(Mitarbeiter)) this.DBFestlegungen.CcEmpfaengerliste.push({

          Name: Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name,
          Email: Mitarbeiter.Email
        });
      }

      Daten.Empfaengerliste   = this.DBFestlegungen.Empfaengerliste;
      Daten.CcEmpfaengerliste = this.DBFestlegungen.CcEmpfaengerliste;

      // Festlegungsliste versenden

      return new Promise((resolve, reject) => {

        // PUT für update -> Datei neu erstellen oder überschreiben

        Observer = this.http.put(this.ServerSaveFestlegungenToTeamsUrl, Daten);

        Observer.subscribe({

          next: (ne) => {

            Teamsfile = ne;
          },
          complete: () => {

            this.DBFestlegungen.FileID = Teamsfile.id;

            resolve(Daten);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'SaveProtokollInTeams', this.Debug.Typen.Service);
    }
  }

  public async SendFestlegungenFromTeams(teamsid: string): Promise<any> {

    try {

      let token = await this.AuthService.RequestToken('Mail.Send');

      let Observer: Observable<any>;
      let Merker: Teamsfilesstruktur;
      let Daten: {

        Betreff:     string;
        Nachricht:   string;
        TeamsID:     string;
        UserID:      string;
        Token:       string;
        Filename:    string;
        FileID:      string;
        Displayliste: Projektpunktestruktur[][];
        Kostengruppenliste: Projektpunktestruktur[];
        Empfaengerliste:   any[];
        CcEmpfaengerliste: any[];
      };

      if(this.Basics.DebugNoExternalEmail) {

        this.DBFestlegungen.Empfaengerliste   = lodash.filter(this.DBFestlegungen.Empfaengerliste,   { Email : 'p.hornburger@gmail.com' });
        this.DBFestlegungen.CcEmpfaengerliste = lodash.filter(this.DBFestlegungen.CcEmpfaengerliste, { Email : 'p.hornburger@gmail.com' });

        if(this.DBFestlegungen.Empfaengerliste.length === 0) {

          this.DBFestlegungen.Empfaengerliste.push({
            Email: 'p.hornburger@gmail.com',
            Name:  'Peter Hornburger'
          });
        }
      }

      Daten = {

        Betreff:     this.DBFestlegungen.Betreff,
        Nachricht:   this.DBFestlegungen.Nachricht,
        TeamsID:     teamsid,
        UserID:      this.GraphService.Graphuser.id,
        Token:       token,
        Filename:           this.DBFestlegungen.Filename,
        FileID:             this.DBFestlegungen.FileID,
        Displayliste:       this.DBFestlegungen.Displayliste,
        Kostengruppenliste: this.DBFestlegungen.Kostengruppenliste,
        Empfaengerliste:    this.DBFestlegungen.Empfaengerliste,
        CcEmpfaengerliste:  this.DBFestlegungen.CcEmpfaengerliste
      };

      return new Promise((resolve, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerSendFestlegungenToTeamsUrl, Daten);

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

      this.Debug.ShowErrorMessage(error.message, 'Database Protokolle', 'SaveProtokollInTeams', this.Debug.Typen.Service);
    }
  }

  public GetNewLOPListepunkt(lopliste: LOPListestruktur): Projektpunktestruktur {

    try {

      let Nummer;
      let Tag: Moment;
      let Liste: Projektpunktestruktur[];



      if(lopliste !== null) Tag  = MyMoment(lopliste.Zeitstempel);
      else                   Tag = MyMoment();

      let Termin: Moment = Tag.clone().add(7, 'days');
      let Startzeitpunkt: string = Tag.format('DD.MM.YYYY');

      let Endezeitstempel: number = Termin.valueOf();
      let Endezeitpunkt: string = Termin.format('DD.MM.YYYY');
      let Vorname: string  = this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Vorname : '';
      let Name: string  = this.Pool.Mitarbeiterdaten    !== null ? this.Pool.Mitarbeiterdaten.Name    : '';
      let Email: string = this.Pool.Mitarbeiterdaten    !== null ? this.Pool.Mitarbeiterdaten.Email   : '';
      let Anmerkungenliste: Projektpunktanmerkungstruktur[] = [];

      if(this.DBProjekt.CurrentProjekt !== null) {

        Liste = lodash.filter(this.Pool.Projektpunkteliste[this.DBProjekt.CurrentProjekt.Projektkey], (eintag: Projektpunktestruktur) => {

            return eintag.LOPListeID !== null;

        });

        Nummer = Liste.length + 1;

      }
      else Nummer = 1;

      let Punkt: Projektpunktestruktur = {

        _id:              null,
        Projektkey:      this.DBProjekt.CurrentProjekt.Projektkey,
        ProjektID:       lopliste !== null ? lopliste.ProjektID : null,
        ProjektleiterID: this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten._id : null,
        ProtokollID:     null,
        LOPListeID:      lopliste !== null ? lopliste._id : null,
        Prioritaet:      this.Const.Projektpunktprioritaetstypen.Niedrig.Name,
        NotizenID:       null,
        EmailID:         null,
        Leistungsphase:  this.Const.Leistungsphasenvarianten.LPH3,
        FestlegungskategorieID: null,
        Nummer:          Nummer.toString(),
        Listenposition:  null,
        Aufgabe:         "",
        Thematik:        "",
        OutlookkatgorieID: this.Const.NONE,
        Status:          this.Const.Projektpunktstatustypen.Offen.Name, // this.GetProjektpunktstusByName().Name,
        Deleted:         false,
        Endezeitstempel:   Endezeitstempel,
        Endezeitstring:    Endezeitpunkt,
        EndeKalenderwoche: null,
        Startzeitsptempel: lopliste !== null ? lopliste.Zeitstempel : null,
        Startzeitstring:   Startzeitpunkt,
        Geschlossenzeitstempel: null,
        Geschlossenzeitstring: null,
        FileDownloadURL:   this.Const.NONE,
        Filename:          this.Const.NONE,
        Filezoom:          1,
        Bildbreite:        0,
        Bildhoehe:         0,
        Querdarstellung:   false,
        Meilenstein:       false,
        Meilensteinstatus: 'OFF',
        Anmerkungenliste:   Anmerkungenliste,
        DataChanged:        false,
        ProtokollOnly:      true,
        ProtokollPublic:    true,
        LiveEditor:         false,
        BemerkungMouseOver: false,
        EndeMouseOver:      false,
        Zeitansatz:         30,
        Zeitansatzeinheit:  this.Const.Zeitansatzeinheitvarianten.Minuten,
        Fortschritt:        0,
        ZustaendigeInternIDListe: [],
        ZustaendigeExternIDListe: [],
        BauteilID:          null,
        GeschossID:         null,
        RaumID:             null,
        OpenFestlegung:     false,
        Fachbereich:        this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Fachbereich : null,
        Oberkostengruppe:   null,
        Hauptkostengruppe:  null,
        Unterkostengruppe:  null,

        Verfasser: {

          Vorname: Vorname,
          Name: Name,
          Email: Email
        }
      };

      return Punkt;

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'GetNewLOPListepunkt', this.Debug.Typen.Service);
    }
  }

  public GetNewAnmerkung(): Projektpunktanmerkungstruktur {

    try {

      let Heute: Moment = moment();
      let id = uuidv4();

      return {

        Anmerkung: "",
        LiveEditor: false,
        Nummer: this.CurrentProjektpunkt.Anmerkungenliste.length + 1,
        Verfasser: {

          Vorname: this.Pool.Mitarbeiterdaten.Vorname,
          Name: this.Pool.Mitarbeiterdaten.Name,
          Email: this.Pool.Mitarbeiterdaten.Email
        },
        Zeitstempel: Heute.valueOf(),
        Zeitstring:   Heute.format('DD.MM.YYYY'),
        AnmerkungID: id
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'GetNewAnmerkung', this.Debug.Typen.Service);
    }

  }

  public BerechneArbeitstage(startDate: Moment, endDate: Moment) {

    try {

      const day = startDate.clone();

      let businessDays: number = 0;
      let Wochentag: number;


      while (day.isSameOrBefore(endDate, 'day')) {

        Wochentag = day.isoWeekday();

        // 1 = Montag -> 7 = Sonntag

        if (Wochentag < 6) { // Das bedeutet Montag bis Freitag
          businessDays++;
        }

        day.add(1, 'day');
      }

      return businessDays;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'BerechneArbeitstage', this.Debug.Typen.Service);
    }
  }

  CheckProjektpunktFaellig(Projektpunkt: Projektpunktestruktur): string {

    try {

      let Heute: Moment = MyMoment().locale('de');
      let IstKW: number = Heute.isoWeek();
      let TerminKW: number = Projektpunkt.EndeKalenderwoche;
      let Termin: Moment = MyMoment(Projektpunkt.Endezeitstempel).locale('de');

      if(Projektpunkt.Status === this.Const.Projektpunktstatustypen.Geschlossen.Name) {

        return this.Const.Faelligkeitsstatus.Nicht_faellig;
      }
      else {

        if(Projektpunkt.EndeKalenderwoche === null) {

          // Termin prüfen

          if(Termin.isSame(Heute, 'day')) {

            return this.Const.Faelligkeitsstatus.Faellig;
          }
          else if(Termin.isBefore(Heute, 'day')) {

            return this.Const.Faelligkeitsstatus.Ueberfaellig;
          }
          else {

            return this.Const.Faelligkeitsstatus.Nicht_faellig;

          }
        }
        else {

          // Kalenderwoche prüfen

          if(TerminKW === IstKW) {

            return this.Const.Faelligkeitsstatus.Faellig;
          }
          else if(TerminKW < IstKW) {

            return this.Const.Faelligkeitsstatus.Ueberfaellig;
          }
          else {

              return this.Const.Faelligkeitsstatus.Nicht_faellig;
          }
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'CheckProjektpunktFaellig', this.Debug.Typen.Service);
    }
  }


  GetRestageanzahl(Projektpunkt: Projektpunktestruktur): string {

    try {

      let Heute: Moment = MyMoment().locale('de');
      let Stichtag: Moment = MyMoment(Projektpunkt.Endezeitstempel).locale('de');
      let Tageanzahl: number;

      if(Projektpunkt.Status === this.Const.Projektpunktstatustypen.Geschlossen.Name) {

        return '';
      }
      else {

        Tageanzahl = this.BerechneArbeitstage(Heute, Stichtag);

        switch(Tageanzahl) {

          case 0:

            return 'Heute';

            break;

          case 1:

            return '1 Tag';

            break;

          default:

            return  Tageanzahl + ' Tage';

            break;
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'GetRestageanzahl', this.Debug.Typen.Service);
    }
  }


  public GetFaelligBackground(Projektpunkt: Projektpunktestruktur): string {

    try {

      let Status: string = this.CheckProjektpunktFaellig(Projektpunkt);

      switch (Status) {

        case this.Const.Faelligkeitsstatus.Faellig:

          if(Projektpunkt.Status === this.Const.Projektpunktstatustypen.Ruecklauf.Name) return this.GetProjektpunktstusByName(Projektpunkt.Status).Color;
          else return 'red';

          break;

        case this.Const.Faelligkeitsstatus.Ueberfaellig:

          if(Projektpunkt.Status === this.Const.Projektpunktstatustypen.Ruecklauf.Name) return this.GetProjektpunktstusByName(Projektpunkt.Status).Color;
          else return 'darkred';

          break;

        default:

          return 'white';

          break;
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'GetFaelligBackground', this.Debug.Typen.Service);
    }
  }

  private UpdateProjektpunkteliste(Projektpunkt: Projektpunktestruktur) {

    try {

      let Index: number;

      Index = lodash.findIndex(this.Pool.Projektpunkteliste[this.DBProjekt.CurrentProjekt.Projektkey], {_id : Projektpunkt._id});

      if(Index !== -1) {

        this.Pool.Projektpunkteliste[this.DBProjekt.CurrentProjekt.Projektkey][Index] = Projektpunkt; // aktualisieren

        this.Debug.ShowMessage('Projektpunktliste updated: "' + Projektpunkt.Aufgabe + '"', 'Projektpunkte', 'UpdateProjektpunkteliste', this.Debug.Typen.Service);
      }
      else {

        this.Debug.ShowMessage('Projektpunkt nicht gefunden -> neuen Projektpunkt hinzufügen', 'Projektpunkte', 'UpdateProjektpunkteliste', this.Debug.Typen.Service);

        this.Pool.Projektpunkteliste[this.DBProjekt.CurrentProjekt.Projektkey].push(Projektpunkt); // neuen
      }

      // Gelöscht markierte Einträge entfernen


      this.Pool.Projektpunkteliste[this.DBProjekt.CurrentProjekt.Projektkey] = lodash.filter(this.Pool.Projektpunkteliste[this.DBProjekt.CurrentProjekt.Projektkey], (currentpunkt: Projektpunktestruktur) => {

        return currentpunkt.Deleted === false;
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'UpdateProjektpunkteliste', this.Debug.Typen.Service);
    }
  }

  public CheckIsMeintag(projektpunkt: Projektpunktestruktur): boolean {

    try {

      let Meintag: Meintagstruktur;

      if(this.Pool.Mitarbeiterdaten !== null) {


      Meintag = lodash.find(this.Pool.Mitarbeiterdaten.Meintagliste, (meintag: Meintagstruktur) => {

        return meintag.ProjektID === projektpunkt.ProjektID && meintag.ProjektpunktID === projektpunkt._id;
      });

      return !lodash.isUndefined(Meintag);

      }

      return false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'CheckIsMeintag', this.Debug.Typen.Service);
    }
  }

  public GetMeintagCheckstatus(projektpunkt: Projektpunktestruktur): string {

    try {

      let Meintag: Meintagstruktur;

      if(this.Pool.Mitarbeiterdaten !== null) {

        Meintag = lodash.find(this.Pool.Mitarbeiterdaten.Meintagliste, (meintag: Meintagstruktur) => {

          return meintag.ProjektID === projektpunkt.ProjektID && meintag.ProjektpunktID === projektpunkt._id;
        });

        if(!lodash.isUndefined(Meintag)) {

          return Meintag.Checkedstatus;
        }
        else {

          return 'OFF';
        }

      }
      else return 'OFF';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'GetMeintagCheckstatus', this.Debug.Typen.Service);
    }
  }


  public CheckFilter(Projektpunkt: Projektpunktestruktur, ShowMeintag: boolean): boolean {

    try {

      let MeintagGoOn: boolean = false;
      let GoOn: boolean = true;
      let Stichtag: Moment;
      let Settings: Mitarbeitersettingsstruktur = (this.Pool.Mitarbeitersettings === null || lodash.isUndefined(this.Pool.Mitarbeitersettings) === true) ? this.Pool.GetNewMitarbeitersettings() : this.Pool.Mitarbeitersettings;

      // let Vergleichstag: Moment = MyMoment(Projektpunkt.Endezeitstempel).locale('de');
      //  let VergleichsKW: number  = Vergleichstag.isoWeek();
      let Starttag: Moment;
      let Endetag: Moment;
      let ResultA: boolean;
      let ResultB: boolean;

      // let Wocheanzahl: number = MyMoment().isoWeeksInYear();
      // let NaechsteWoche: number       = this.Heute.isoWeek();
      //  let Faellig: boolean = this.CheckProjektpunktFaellig(Projektpunkt) !== this.Const.Faelligkeitsstatus.Nicht_faellig ? true : false;

      MeintagGoOn = true;

      if(this.CheckIsMeintag(Projektpunkt) === false) {

        // nicht in Meintagliste
      }
      else {

        // in Meintagliste

        if(ShowMeintag === true) MeintagGoOn = true;
        else                     MeintagGoOn = false;
      }

      if(MeintagGoOn === true) {

          switch (Projektpunkt.Status) {

            case this.Const.Projektpunktstatustypen.Offen.Name:

              GoOn = Settings.AufgabenShowOffen;

              break;

            case this.Const.Projektpunktstatustypen.Geschlossen.Name:

              GoOn = Settings.AufgabenShowGeschlossen;

              break;

            case this.Const.Projektpunktstatustypen.Bearbeitung.Name:

              GoOn = Settings.AufgabenShowBearbeitung;

              break;

            case this.Const.Projektpunktstatustypen.Ruecklauf.Name:

              GoOn = Settings.AufgabenShowRuecklauf;

              break;

            case this.Const.Projektpunktstatustypen.Protokollpunkt.Name:

              return false;

              break;

            case this.Const.Projektpunktstatustypen.Festlegung.Name:

              return false;

              break;
          }

          if(Settings.AufgabenShowMeilensteinOnly === true && GoOn === true) {

            GoOn = Projektpunkt.Meilenstein === true;
          }

          // Aufgaben / Protokolle und LOP Liste filtern

          if(Settings.AufgabenShowPlanung === false) {

            if(Projektpunkt.LOPListeID == null) GoOn = false; // Wenn es kein LOP Liste Punkt ist ist es eine Aufgabe oder ein Protokolleintrag
          }

          if(Settings.AufgabenShowAusfuehrung === false) {

            if(Projektpunkt.LOPListeID !== null) GoOn = false;
          }


          if(GoOn === true) {

            if(Settings.AufgabenTerminfiltervariante === null) {

              return true;

            }
            else {

              // Zeitfilter einbauen

              Stichtag = moment(Projektpunkt.Endezeitstempel);

              switch (Settings.AufgabenTerminfiltervariante) {

                case this.Const.Faelligkeitsterminfiltervarianten.Zeitspanne:

                  Starttag = moment(Settings.AufgabenTerminfilterStartwert);
                  Endetag  = moment(Settings.AufgabenTerminfilterEndewert);

                  ResultA = Stichtag.isSameOrAfter(Starttag, 'day');
                  ResultB = Stichtag.isSameOrBefore(Endetag, 'day');

                  return  ResultA === true && ResultB === true;

                  break;
              }
            }
          }
          else {

            return false;
          }
      }
      else {

        return false;
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'CheckFilter', this.Debug.Typen.Service);
    }
  }

  public SetStatus(projektpunkt: Projektpunktestruktur, status: string) {

    try {

      let Heute: Moment = moment();

      projektpunkt.Status = status;

      switch(projektpunkt.Status) {

        case this.Const.Projektpunktstatustypen.Geschlossen.Name:

          if(projektpunkt.Geschlossenzeitstempel === null) {

            projektpunkt.Geschlossenzeitstempel = Heute.valueOf();
            projektpunkt.Geschlossenzeitstring  = Heute.format('DD.MM.YYYY');
          }

          break;

        default:

          projektpunkt.Geschlossenzeitstempel = null;
          projektpunkt.Geschlossenzeitstring  = null;

          break;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'SetStatus', this.Debug.Typen.Service);
    }
  }

  CheckFilterMeilenstein(projektpunkt: Projektpunktestruktur): boolean {

    try {

      let Heute: Moment = moment();
      let Fertigdatum: Moment;
      let Stichtag: Moment;

      if(projektpunkt.Meilenstein === true) {

        if(projektpunkt.Status === this.Const.Projektpunktstatustypen.Geschlossen.Name) {

          if(projektpunkt.Geschlossenzeitstempel === null) projektpunkt.Geschlossenzeitstempel = Heute.valueOf();

          Fertigdatum = moment(projektpunkt.Geschlossenzeitstempel); // .subtract(2, 'week');
          Stichtag    = Fertigdatum.clone().add(this.Pool.Mitarbeitersettings.AufgabenMeilensteineNachlauf, 'week');

          return Heute.isSameOrBefore(Stichtag, 'day');
        }
        else {

          return true;
        }
      }
      else {

        return false;
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'CheckFilterMeilenstein', this.Debug.Typen.Service);
    }
  }

  public PrepareWochenpunkteliste() {

    try {

      let Projektpunkt: Projektpunktestruktur;
      let Wochentagliste: string[] = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
      this.Wochenpunkteliste               = [];
      this.Wochenpunkteliste['Montag']     = [];
      this.Wochenpunkteliste['Dienstag']   = [];
      this.Wochenpunkteliste['Mittwoch']   = [];
      this.Wochenpunkteliste['Donnerstag'] = [];
      this.Wochenpunkteliste['Freitag']    = [];

      if(this.Pool.Mitarbeiterdaten !== null) {

        for(let Wocheneintrag of this.Pool.Mitarbeiterdaten.Meinewocheliste) {

          Projektpunkt = lodash.find(this.Pool.Projektpunkteliste[Wocheneintrag.Projektkey], {_id: Wocheneintrag.ProjektpunktID});


          if(lodash.isUndefined(Projektpunkt) === false) { //  && Projektpunkt.Status !== this.Const.Projektpunktstatustypen.Geschlossen.Name

            for(let Tag of Wochentagliste) {

              if(Wocheneintrag.Montagseinsatz === true && Tag === 'Montag') {

                Projektpunkt.Minuten = Wocheneintrag.Montagsminuten + 60 * Wocheneintrag.Montagsstunden;
                this.Wochenpunkteliste['Montag'].push(lodash.cloneDeep(Projektpunkt));
              }
              if(Wocheneintrag.Dienstagseinsatz === true && Tag === 'Dienstag') {

                Projektpunkt.Minuten = Wocheneintrag.Dienstagsminuten + 60 * Wocheneintrag.Dienstagsstunden;
                this.Wochenpunkteliste['Dienstag'].push(lodash.cloneDeep(Projektpunkt));
              }
              if(Wocheneintrag.Mittwochseinsatz  === true && Tag === 'Mittwoch') {

                Projektpunkt.Minuten = Wocheneintrag.Mittwochsminuten + 60 * Wocheneintrag.Mittwochsstunden;
                this.Wochenpunkteliste['Mittwoch'].push(lodash.cloneDeep(Projektpunkt));
              }
              if(Wocheneintrag.Donnerstagseinsatz === true && Tag === 'Donnerstag') {

                Projektpunkt.Minuten = Wocheneintrag.Donnerstagsminuten + 60 * Wocheneintrag.Donnerstagsstunden;
                this.Wochenpunkteliste['Donnerstag'].push(lodash.cloneDeep(Projektpunkt));
              }
              if(Wocheneintrag.Freitagseinsatz    === true && Tag === 'Freitag') {

                Projektpunkt.Minuten = Wocheneintrag.Freitagsminuten + 60 * Wocheneintrag.Freitagsstunden;
                this.Wochenpunkteliste['Freitag'].push(lodash.cloneDeep(Projektpunkt));
              }
            }
          }
        }
      }




      this.Wochenpunkteliste['Montag']     = this.SortWochenpunkteliste(this.Wochenpunkteliste['Montag']);
      this.Wochenpunkteliste['Dienstag']   = this.SortWochenpunkteliste(this.Wochenpunkteliste['Dienstag']);
      this.Wochenpunkteliste['Mittwoch']   = this.SortWochenpunkteliste(this.Wochenpunkteliste['Mittwoch']);
      this.Wochenpunkteliste['Donnerstag'] = this.SortWochenpunkteliste(this.Wochenpunkteliste['Donnerstag']);
      this.Wochenpunkteliste['Freitag']    = this.SortWochenpunkteliste(this.Wochenpunkteliste['Freitag']);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'PrepareWochenpunkteliste', this.Debug.Typen.Component);
    }
  }

  private SortWochenpunkteliste(wochenliste: Meinewochestruktur[]): Meinewochestruktur[] {

    try {

      return wochenliste.sort((a: Meinewochestruktur, b: Meinewochestruktur) => {

        if (a.Projektkey < b.Projektkey) return -1;
        if (a.Projektkey > b.Projektkey) return 1;
        return 0;
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'SortWochenpunkteliste', this.Debug.Typen.Component);
    }
  }

  CheckIsMeinewoche(Projektpunkt: Projektpunktestruktur): boolean {

    try {

      let Eintrag: Meinewochestruktur;

      if(this.Pool.Mitarbeiterdaten !== null) {

        Eintrag = lodash.find(this.Pool.Mitarbeiterdaten.Meinewocheliste, (eintrag: Meinewochestruktur) => {

          return eintrag.ProjektpunktID === Projektpunkt._id;
        });

        // eintrag.ProjektID === Projektpunkt.ProjektID &&

        return !lodash.isUndefined(Eintrag);
      }
      else {

        return false;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'CheckIsMeinewoche', this.Debug.Typen.Service);
    }
  }

  public GetEndedatumString(Projektpunkt: Projektpunktestruktur): string {

    try {

      if(Projektpunkt.EndeKalenderwoche === null) {

        return moment(Projektpunkt.Endezeitstempel).format('DD.MM.YY');
      }
      else {

        return 'KW ' + Projektpunkt.EndeKalenderwoche;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkte', 'GetEndedatumString', this.Debug.Typen.Service);
    }
  }

  GetPrioritaetcolor(punkt: Projektpunktestruktur): string {

    try {

      if(punkt !== null && punkt.Prioritaet !== null) {

        return this.GetProjektpunktPrioritaetByName(punkt.Prioritaet).Color;
      }
      else return 'green';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projektpunkte', 'GetPrioritaetcolor', this.Debug.Typen.Service);
    }
  }
}
