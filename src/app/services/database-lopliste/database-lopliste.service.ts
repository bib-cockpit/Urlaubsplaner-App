import {EventEmitter, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import * as lodash from 'lodash-es';
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {DatabaseProjekteService} from "../database-projekte/database-projekte.service";
import {ConstProvider} from "../const/const";
import moment, {Moment} from "moment";
import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Graphservice} from "../graph/graph";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";
import {DatabaseAuthenticationService} from "../database-authentication/database-authentication.service";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {Projektbeteiligtestruktur} from "../../dataclasses/projektbeteiligtestruktur";
import {DatabaseProjektbeteiligteService} from "../database-projektbeteiligte/database-projektbeteiligte.service";
import {BasicsProvider} from "../basics/basics";
import {KostengruppenService} from "../kostengruppen/kostengruppen.service";
import {LOPListestruktur} from "../../dataclasses/loplistestruktur";
import {Protokollstruktur} from "../../dataclasses/protokollstruktur";

@Injectable({
  providedIn: 'root'
})
export class DatabaseLoplisteService {

  public Searchmodusvarianten = {

    Titelsuche: 'Titelsuche',
    Inhaltsuche: 'Inhaltsuche'
  };

  public Zeitfiltervarianten = {

    Dieser_Monat:       'Dieser Monat',
    Letzter_Monat:      'Letzter Monat',
    Vorletzter_Monat:   'Vorletzter Monat',
    Vor_drei_Monaten:   'Vor drei Monaten',
    Vor_vier_Monaten:   'Vor vier Monaten',
    Vor_fuenf_Monaten:  'Vor fünf Monaten',
    Vor_sechs_Monaten:  'Vor sechs Monaten',
    Seit_dem_Zeitpunkt: 'Seit_dem_Zeitpunkt',
    Bis_zum_Zeitpunkt:  'Bis_zum_Zeitpunkt',
    Zeitspanne:         'Zeitspanne',
  };

  public CurrentLOPListe: LOPListestruktur;
  public CurrentPunkteliste: Projektpunktestruktur[][];
  public CurrentInfoliste: Projektpunktestruktur[];
  public Searchmodus: string;
  public Zeitfiltervariante: string;
  public Monatsfilter: Moment;
  public Startdatumfilter: Moment;
  public Enddatumfilter: Moment;
  public MinDatum: Moment;
  public MaxDatum: Moment;
  public Leistungsphasenfilter: string;
  private ServerLOPListeUrl: string;
  private ServerSendLOPListeToSitesUrl: string;
  public LOPListeEditorViewModus: string;
  public ServerSaveLOPListeToSitesUrl: string;
  public LOPListeEditorViewModusvarianten = {

    Allgemein: 'Allgemein',
    Eintraege: 'Eintraege'
  };

  public ShowLOPListeInfoeintraege: boolean;


  constructor(private Debug: DebugProvider,
              private DBProjekt: DatabaseProjekteService,
              private DBBeteiligte: DatabaseProjektbeteiligteService,
              private Const: ConstProvider,
              private http: HttpClient,
              private Basics: BasicsProvider,
              private AuthService: DatabaseAuthenticationService,
              public KostenService: KostengruppenService,
              private GraphService: Graphservice,
              private Pool: DatabasePoolService) {
    try {


      this.Zeitfiltervariante      = this.Const.NONE;
      this.Leistungsphasenfilter   = this.Const.NONE;
      this.CurrentLOPListe         = null;
      this.Searchmodus             = this.Searchmodusvarianten.Titelsuche;
      this.Monatsfilter            = null;
      this.Startdatumfilter        = null;
      this.Enddatumfilter          = null;
      this.MinDatum                = null;
      this.MaxDatum                = null;
      this.LOPListeEditorViewModus = this.LOPListeEditorViewModusvarianten.Allgemein;

      this.ServerLOPListeUrl            = this.Pool.CockpitserverURL + '/lopliste';
      this.ServerSaveLOPListeToSitesUrl = this.Pool.CockpitserverURL + '/savelopliste';
      this.ServerSendLOPListeToSitesUrl = this.Pool.CockpitserverURL + '/sendlopliste';

      this.ShowLOPListeInfoeintraege = true;
      this.CurrentPunkteliste        = [];
      this.CurrentInfoliste          = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOPListe', 'cosntructor', this.Debug.Typen.Service);
    }
  }

  public SaveLOPListeInSites(

    filename: string,
    projekt: Projektestruktur,
    lopliste: LOPListestruktur,
    standort: Standortestruktur, mitarbeiter: Mitarbeiterstruktur, showmailinformations: boolean): Promise<LOPListestruktur> {

    try {

      let Observer: Observable<any>;
      let Teamsfile: Teamsfilesstruktur;
      let Punkteliste: Projektpunktestruktur[] = lopliste.Projektpunkteliste;
      let Projektpunkt: Projektpunktestruktur;
      let Punkteindex: number;
      let ExternZustaendigListe: string[][] = [];
      let InternZustaendigListe: string[][] = [];
      let Kostengruppenliste: string[];
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
        LOPListe:    LOPListestruktur;
        Standort:    Standortestruktur;
        Mitarbeiter: Mitarbeiterstruktur;
        ShowMailinformations: boolean;
      } = {

        DirectoryID: this.DBProjekt.CurrentProjekt.BaustellenLOPFolderID,
        Projekt:     projekt,
        LOPListe:    lodash.cloneDeep(lopliste),
        Filename:    filename,
        Standort:    standort,
        Mitarbeiter: mitarbeiter,
        ShowMailinformations: showmailinformations
      };

      // Zuständige Personen eintragen

      ExternZustaendigListe = [];
      InternZustaendigListe = [];
      Kostengruppenliste    = [];
      Punkteindex           = 0;

      for(Projektpunkt of Punkteliste) {

        ExternZustaendigListe[Punkteindex] = [];
        InternZustaendigListe[Punkteindex] = [];

        for(let ExternID of Projektpunkt.ZustaendigeExternIDListe) {

          ExternZustaendigListe[Punkteindex].push(this.GetZustaendigExternName(ExternID));
        }

        for(let InternID of Projektpunkt.ZustaendigeInternIDListe) {

          InternZustaendigListe[Punkteindex].push(this.GetZustaendigInternName(InternID));
        }

        Punkteindex++;
      }

      debugger;

      Daten.LOPListe.ExternZustaendigListe = ExternZustaendigListe;
      Daten.LOPListe.InternZustaendigListe = InternZustaendigListe;

      // Teilnehmer bestimmen

      Daten.LOPListe.ExterneTeilnehmerliste = this.GetExterneTeilnehmerliste(true);
      Daten.LOPListe.InterneTeilnehmerliste = this.GetInterneTeilnehmerliste(true);

      // Empfaenger bestimmen

      Empfaengerliste   = [];
      CcEmpfaengerliste = [];

      for(let ExternEmpfaengerID of Daten.LOPListe.EmpfaengerExternIDListe) {

        Beteiligter = lodash.find(this.DBProjekt.CurrentProjekt.Beteiligtenliste, {BeteiligtenID: ExternEmpfaengerID});

        if(!lodash.isUndefined(Beteiligter)) {

          Name = Beteiligter.Beteiligteneintragtyp === this.Const.Beteiligteneintragtypen.Person ? Beteiligter.Vorname + ' ' + Beteiligter.Name : Beteiligter.Firma;

          Empfaengerliste.push({

            Name: Name,
            Email: Beteiligter.Email
          });
        }
      }

      for(let InternEmpfaengerID of Daten.LOPListe.EmpfaengerInternIDListe) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: InternEmpfaengerID});

        if(!lodash.isUndefined(Mitarbeiter)) Empfaengerliste.push({

          Name: Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name,
          Email: Mitarbeiter.Email
        });
      }

      for(let CcExternEmpfaengerID of Daten.LOPListe.CcEmpfaengerExternIDListe) {

        Beteiligter = lodash.find(this.DBProjekt.CurrentProjekt.Beteiligtenliste, {BeteiligtenID: CcExternEmpfaengerID});

        if(!lodash.isUndefined(Beteiligter)) {

          Name = Beteiligter.Beteiligteneintragtyp === this.Const.Beteiligteneintragtypen.Person ? Beteiligter.Vorname + ' ' + Beteiligter.Name : Beteiligter.Firma;

          CcEmpfaengerliste.push({

            Name: Name,
            Email: Beteiligter.Email
          });
        }
      }

      for(let CcInternEmpfaengerID of Daten.LOPListe.CcEmpfaengerInternIDListe) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: CcInternEmpfaengerID});

        if(!lodash.isUndefined(Mitarbeiter)) CcEmpfaengerliste.push({

          Name: Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name,
          Email: Mitarbeiter.Email
        });
      }

      Daten.LOPListe.Empfaengerliste   = Empfaengerliste;
      Daten.LOPListe.CcEmpfaengerliste = CcEmpfaengerliste;

      // LOP Liste versenden

      return new Promise((resolve, reject) => {

        // PUT für update -> Datei neu erstellen oder überschreiben

        Observer = this.http.put(this.ServerSaveLOPListeToSitesUrl, Daten);

        Observer.subscribe({

          next: (ne) => {

            Teamsfile = ne;
          },
          complete: () => {

            Daten.LOPListe.FileID              = Teamsfile.id;
            Daten.LOPListe.GesendetZeitstempel = Teamsfile.GesendetZeitstempel;
            Daten.LOPListe.GesendetZeitstring  = Teamsfile.GesendetZeitstring;

            resolve(Daten.LOPListe);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Protokolle', 'SaveProtokollInSites', this.Debug.Typen.Service);
    }
  }

  GetEmptyLOPListe(): LOPListestruktur {

    try {

      let Heute: Moment = moment();

      return {
        _id: null,
        Projektkey: this.DBProjekt.CurrentProjekt.Projektkey,
        ProjektID: this.DBProjekt.CurrentProjekt._id,
        Titel: "Baustelle LOP - Liste",
        LOPListenummer: "",
        BeteiligExternIDListe: [],
        BeteiligtInternIDListe: [this.Pool.Mitarbeiterdaten._id],
        ProjektpunkteIDListe: [],
        Notizen: "",
        Besprechungsort: "Baustelle",
        DownloadURL: "",
        ShowDetails: true,
        Deleted: false,
        Verfasser:
          {
            Name:    this.Pool.Mitarbeiterdaten.Name,
            Vorname: this.Pool.Mitarbeiterdaten.Vorname,
            Email:   this.Pool.Mitarbeiterdaten.Email,
          },
        Zeitstempel: Heute.valueOf(),
        Zeitstring: Heute.format('DD.MM.YYYY'),

        Betreff: "",
        Nachricht: "",
        CcEmpfaengerExternIDListe: [],
        CcEmpfaengerInternIDListe: [],
        EmpfaengerExternIDListe: [],
        EmpfaengerInternIDListe: [],
        Filename: "",
        FileID: "",
        GesendetZeitstempel: null,
        GesendetZeitstring: this.Const.NONE
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'GetEmptyLOPListe', this.Debug.Typen.Service);
    }
  }

  public SaveLOPListe(): Promise<boolean> {

    try {

      return new Promise((resolve, reject) => {

        if(this.CurrentLOPListe._id === null) {

          this.AddLOPListe(this.CurrentLOPListe).then(() => {

            this.Pool.LOPListeChanged.emit();

            resolve(true);

          }).catch((errora) => {

            reject(errora);

            this.Debug.ShowErrorMessage(errora, 'Database LOP Liste', 'OkButtonClicked / AddProjektpunkt', this.Debug.Typen.Service);
          });
        }
        else {

          this.UpdateLOPListe(this.CurrentLOPListe).then(() => {

            this.Pool.LOPListeChanged.emit();

            resolve(true);

          }).catch((errorb) => {

            reject(errorb);

            this.Debug.ShowErrorMessage(errorb, 'Database LOP Liste', 'OkButtonClicked / UpdateProjektpunkt', this.Debug.Typen.Service);
          });
        }

        /*

          this.CurrentLOPListe.ProjektpunkteIDListe = [];

          this.Punkteliste = lodash.filter(this.Punkteliste, (Punkt: Projektpunktestruktur) => {

            return Punkt.Aufgabe !== '';
          });

          for(let Projektpunkt of this.Punkteliste) {

            this.DB.CurrentLOPListe.ProjektpunkteIDListe.push(Projektpunkt._id);
          }

          this.DBProjektpunkte.SaveProjektpunktliste(this.Punkteliste).then(() => {

          });

         */

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'SaveLOPListe', this.Debug.Typen.Service);
    }
  }

  DeleteLOPListe(protokoll: LOPListestruktur): Promise<any> {

    try {

      let Observer: Observable<any>;

      this.CurrentLOPListe.Deleted = true;

      return new Promise<any>((resove, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerLOPListeUrl, this.CurrentLOPListe);

        Observer.subscribe({

          next: (ne) => {


          },
          complete: () => {

            this.UpdateLOPListeliste(this.CurrentLOPListe);

            this.Pool.LOPListeChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'DeleteLOPListe', this.Debug.Typen.Service);
    }

  }

  public SetZeitspannenfilter(event: any) {

    try {

      let Heute: Moment = moment().locale('de');

      this.Zeitfiltervariante = event.detail.value;
      this.Startdatumfilter   = null;
      this.Enddatumfilter     = null;
      this.Monatsfilter       = null;
      this.MinDatum           = null;
      this.MaxDatum           = null;

      switch (this.Zeitfiltervariante) {

        case this.Const.NONE:

          this.Startdatumfilter  = null;
          this.Enddatumfilter    = null;
          this.MinDatum          = null;
          this.MaxDatum          = null;

          break;

        case this.Zeitfiltervarianten.Dieser_Monat:

          this.Monatsfilter      = Heute.clone();

          break;

        case this.Zeitfiltervarianten.Letzter_Monat:

          this.Monatsfilter      = Heute.clone().subtract(1, 'month');

          break;

        case this.Zeitfiltervarianten.Vorletzter_Monat:

          this.Monatsfilter      = Heute.clone().subtract(2, 'month');

          break;

        case this.Zeitfiltervarianten.Vor_drei_Monaten:

          this.Monatsfilter      = Heute.clone().subtract(3, 'month');

          break;

        case this.Zeitfiltervarianten.Vor_vier_Monaten:

          this.Monatsfilter      = Heute.clone().subtract(4, 'month');

          break;

        case this.Zeitfiltervarianten.Vor_fuenf_Monaten:

          this.Monatsfilter      = Heute.clone().subtract(5, 'month');

          break;

        case this.Zeitfiltervarianten.Vor_sechs_Monaten:

          this.Monatsfilter      = Heute.clone().subtract(6, 'month');

          break;

        case this.Zeitfiltervarianten.Seit_dem_Zeitpunkt:

          this.MinDatum          = Heute.clone().subtract(6, 'month');

          break;

        case this.Zeitfiltervarianten.Bis_zum_Zeitpunkt:

          this.MaxDatum          = Heute.clone().subtract(6, 'month');

          break;

        case this.Zeitfiltervarianten.Zeitspanne:

          this.Monatsfilter      = null;
          this.Enddatumfilter    = Heute.clone();
          this.Startdatumfilter  = Heute.clone().subtract(6, 'month');

          break;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'SetZeitspannenfilter', this.Debug.Typen.Service);
    }
  }

  GetLOPListeByID(LOPListeID: string): LOPListestruktur {

    try {

      let Protoll: LOPListestruktur = lodash.find(this.Pool.LOPListe[this.DBProjekt.CurrentProjektindex], {_id: LOPListeID});

      if(!lodash.isUndefined(Protoll)) return Protoll;
      else return null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'GetLOPListeByID', this.Debug.Typen.Service);
    }
  }

  GetLetzteLOPListenummer(): string {

    try {

      let Liste: LOPListestruktur[];

      if(!lodash.isUndefined(this.Pool.LOPListe[this.CurrentLOPListe.Projektkey])) {

        Liste = lodash.cloneDeep(this.Pool.LOPListe[this.CurrentLOPListe.Projektkey]);

        if(Liste.length === 0) {

          return ': kein vorhergende LOP - Liste vorhanden';
        }
        else {

          Liste.sort((punktA: LOPListestruktur, punktB: LOPListestruktur) => {

            if (punktA.Zeitstempel < punktB.Zeitstempel) return 1;
            if (punktA.Zeitstempel > punktB.Zeitstempel) return -1;
            return 0;
          });

          return Liste[0].LOPListenummer;
        }
      }
      return 'Unbekannt';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'GetLetzteLOPListenummer', this.Debug.Typen.Service);
    }
  }

  private UpdateLOPListe(lopliste: LOPListestruktur): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams();
      let Merker: LOPListestruktur;

      return new Promise((resolve, reject) => {

        Params.set('id', lopliste._id);

        // PUT für update

        delete lopliste.__v;

        Observer = this.http.put(this.ServerLOPListeUrl, lopliste);

        Observer.subscribe({

          next: (ne) => {

            Merker = ne.LOPListe;

          },
          complete: () => {

            if(Merker !== null) {

              this.CurrentLOPListe = Merker;

              this.UpdateLOPListeliste(this.CurrentLOPListe);

              resolve(true);
            }
            else {

              reject(new Error('LOPListe auf Server nicht gefunden.'));
            }
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'UpdateLOPListe', this.Debug.Typen.Service);
    }
  }

  public async SendLOPListeFromTeams(protokoll: LOPListestruktur, teamsid: string): Promise<any> {

    try {

      let token = await this.AuthService.RequestToken('Mail.Send');

      let Observer: Observable<any>;
      let Merker: Teamsfilesstruktur;
      let Daten: {

        Betreff:     string;
        Nachricht:   string;
        TeamsID:     string;
        FileID:      string;
        Filename:    string;
        UserID:      string;
        Token:       string;
        Empfaengerliste:   any[];
        CcEmpfaengerliste: any[];
      };

      if(this.Basics.DebugNoExternalEmail) {

        protokoll.Empfaengerliste   = lodash.filter(protokoll.Empfaengerliste,   { Email : 'p.hornburger@gmail.com' });
        protokoll.CcEmpfaengerliste = lodash.filter(protokoll.CcEmpfaengerliste, { Email : 'p.hornburger@gmail.com' });

        if(protokoll.Empfaengerliste.length === 0) {

          protokoll.Empfaengerliste.push({
            Email: 'p.hornburger@gmail.com',
            Name:  'Peter Hornburger'
          });
        }
      }

      Daten = {

        Betreff:     protokoll.Betreff,
        Nachricht:   protokoll.Nachricht,
        TeamsID:     teamsid,
        UserID:      this.GraphService.Graphuser.id,
        FileID:      protokoll.FileID,
        Filename:    protokoll.Filename,
        Token:       token,
        Empfaengerliste:   protokoll.Empfaengerliste,
        CcEmpfaengerliste: protokoll.CcEmpfaengerliste
      };

      return new Promise((resolve, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerSendLOPListeToSitesUrl, Daten);

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

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'SaveLOPListeInTeams', this.Debug.Typen.Service);
    }
  }



  public async SendLOPListeFromSite(protokoll: LOPListestruktur): Promise<any> {

    try {

      let token = await this.AuthService.RequestToken('Mail.Send');

      let Observer: Observable<any>;
      let Merker: Teamsfilesstruktur;
      let Daten: {

        Betreff:     string;
        Nachricht:   string;
        Signatur:    string;
        FileID:      string;
        Filename:    string;
        UserID:      string;
        Token:       string;
        Empfaengerliste:   any[];
        CcEmpfaengerliste: any[];
      };

      if(this.Basics.DebugNoExternalEmail) {

        protokoll.Empfaengerliste   = lodash.filter(protokoll.Empfaengerliste,   { Email : 'p.hornburger@gmail.com' });
        protokoll.CcEmpfaengerliste = lodash.filter(protokoll.CcEmpfaengerliste, { Email : 'p.hornburger@gmail.com' });

        if(protokoll.Empfaengerliste.length === 0) {

          protokoll.Empfaengerliste.push({
            Email: 'p.hornburger@gmail.com',
            Name:  'Peter Hornburger'
          });
        }
      }

      Daten = {

        Betreff:     protokoll.Betreff,
        Nachricht:   protokoll.Nachricht,
        Signatur:    this.Pool.GetFilledSignatur(false),
        UserID:      this.GraphService.Graphuser.id,
        FileID:      protokoll.FileID,
        Filename:    protokoll.Filename,
        Token:       token,
        Empfaengerliste:   protokoll.Empfaengerliste,
        CcEmpfaengerliste: protokoll.CcEmpfaengerliste
      };

      return new Promise((resolve, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerSendLOPListeToSitesUrl, Daten);

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

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'SaveLOPListeInTeams', this.Debug.Typen.Service);
    }
  }

  public SaveLOPListeInTeams(

    teamsid: string,
    directoryid: string,
    filename: string,
    projekt: Projektestruktur,
    lopliste: LOPListestruktur,
    standort: Standortestruktur, mitarbeiter: Mitarbeiterstruktur, showmailinformations: boolean): Promise<LOPListestruktur> {

    try {

      let Observer: Observable<any>;
      let Teamsfile: Teamsfilesstruktur;
      let Punkteliste: Projektpunktestruktur[];
      let Projektpunkt: Projektpunktestruktur;
      let Punkteindex: number;
      let ExternZustaendigListe: string[][];
      let InternZustaendigListe: string[][];
      let Kostengruppenliste: string[];
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

        TeamsID:     string;
        DirectoryID: string;
        Filename:    string;
        Projekt:     Projektestruktur;
        LOPListe:   LOPListestruktur;
        Standort:    Standortestruktur;
        Mitarbeiter: Mitarbeiterstruktur;
        ShowMailinformations: boolean;
      } = {

        TeamsID:     teamsid,
        DirectoryID: directoryid,
        Projekt:     projekt,
        LOPListe:   lodash.cloneDeep(lopliste),
        Filename:    filename,
        Standort:    standort,
        Mitarbeiter: mitarbeiter,
        ShowMailinformations: showmailinformations
      };

      // LOPListepunkte eintragen

      Punkteliste = [];

      /*

      for(let id of lopliste.ProjektpunkteIDListe) {

        Projektpunkt = lodash.find(this.Pool.Projektpunkteliste[lopliste.Projektkey], (punkt: Projektpunktestruktur) => {

          return punkt._id === id && punkt.LOPListeID === lopliste._id;
        });

        if(lodash.isUndefined(Projektpunkt) === false) {

          Punkteliste.push(Projektpunkt);
        }
      }

      Punkteliste.sort((a: Projektpunktestruktur, b: Projektpunktestruktur) => {

        if (a.Startzeitsptempel < b.Startzeitsptempel) return -1;
        if (a.Startzeitsptempel > b.Startzeitsptempel) return 1;
        return 0;
      });

       */

      Daten.LOPListe.Projektpunkteliste = Punkteliste;

      // Zuständige Personen eintragen

      ExternZustaendigListe = [];
      InternZustaendigListe = [];
      Kostengruppenliste    = [];
      Punkteindex           = 0;

      for(Projektpunkt of Punkteliste) {

        ExternZustaendigListe[Punkteindex] = [];
        InternZustaendigListe[Punkteindex] = [];

        for(let ExternID of Projektpunkt.ZustaendigeExternIDListe) {

          ExternZustaendigListe[Punkteindex].push(this.GetZustaendigExternName(ExternID));
        }

        for(let InternID of Projektpunkt.ZustaendigeInternIDListe) {

          InternZustaendigListe[Punkteindex].push(this.GetZustaendigInternName(InternID));
        }

        if(Projektpunkt.Status === this.Const.Projektpunktstatustypen.Festlegung.Name) {

          Kostengruppenliste.push(this.KostenService.GetKostengruppennameByProjektpunkt(Projektpunkt));
        }
        else {

          Kostengruppenliste.push(this.Const.NONE);
        }

        Punkteindex++;
      }

      Daten.LOPListe.ExternZustaendigListe = ExternZustaendigListe;
      Daten.LOPListe.InternZustaendigListe = InternZustaendigListe;

      // Teilnehmer bestimmen

      Daten.LOPListe.ExterneTeilnehmerliste = this.GetExterneTeilnehmerliste(true);
      Daten.LOPListe.InterneTeilnehmerliste = this.GetInterneTeilnehmerliste(true);

      // Empfaenger bestimmen

      Empfaengerliste   = [];
      CcEmpfaengerliste = [];

      for(let ExternEmpfaengerID of Daten.LOPListe.EmpfaengerExternIDListe) {

        Beteiligter = lodash.find(this.DBProjekt.CurrentProjekt.Beteiligtenliste, {BeteiligtenID: ExternEmpfaengerID});

        if(!lodash.isUndefined(Beteiligter)) {

          Name = Beteiligter.Beteiligteneintragtyp === this.Const.Beteiligteneintragtypen.Person ? Beteiligter.Vorname + ' ' + Beteiligter.Name : Beteiligter.Firma;

          Empfaengerliste.push({

            Name: Name,
            Email: Beteiligter.Email
          });
        }
      }

      for(let InternEmpfaengerID of Daten.LOPListe.EmpfaengerInternIDListe) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: InternEmpfaengerID});

        if(!lodash.isUndefined(Mitarbeiter)) Empfaengerliste.push({

          Name: Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name,
          Email: Mitarbeiter.Email
        });
      }

      for(let CcExternEmpfaengerID of Daten.LOPListe.CcEmpfaengerExternIDListe) {

        Beteiligter = lodash.find(this.DBProjekt.CurrentProjekt.Beteiligtenliste, {BeteiligtenID: CcExternEmpfaengerID});

        if(!lodash.isUndefined(Beteiligter)) {

          Name = Beteiligter.Beteiligteneintragtyp === this.Const.Beteiligteneintragtypen.Person ? Beteiligter.Vorname + ' ' + Beteiligter.Name : Beteiligter.Firma;

          CcEmpfaengerliste.push({

            Name: Name,
            Email: Beteiligter.Email
          });
        }
      }

      for(let CcInternEmpfaengerID of Daten.LOPListe.CcEmpfaengerInternIDListe) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: CcInternEmpfaengerID});

        if(!lodash.isUndefined(Mitarbeiter)) CcEmpfaengerliste.push({

          Name: Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name,
          Email: Mitarbeiter.Email
        });
      }

      Daten.LOPListe.Empfaengerliste   = Empfaengerliste;
      Daten.LOPListe.CcEmpfaengerliste = CcEmpfaengerliste;

      // LOPListe versenden

      return new Promise((resolve, reject) => {

        // PUT für update -> Datei neu erstellen oder überschreiben

        Observer = this.http.put('', Daten);

        Observer.subscribe({

          next: (ne) => {

            Teamsfile = ne;
          },
          complete: () => {

            Daten.LOPListe.FileID              = Teamsfile.id;
            Daten.LOPListe.GesendetZeitstempel = Teamsfile.GesendetZeitstempel;
            Daten.LOPListe.GesendetZeitstring  = Teamsfile.GesendetZeitstring;

            resolve(Daten.LOPListe);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'SaveLOPListeInTeams', this.Debug.Typen.Service);
    }
  }

  public GetZustaendigInternName(ZustaendigID: string): string {

    try {

      let Mitarbeiter: Mitarbeiterstruktur = lodash.find(this.Pool.Mitarbeiterliste, {_id: ZustaendigID});

      if(lodash.isUndefined(Mitarbeiter) === false) {

        return Mitarbeiter.Kuerzel;
      }
      else {

        return 'unbekannt';
      }

      return '';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'GetZustaendigInternName', this.Debug.Typen.Service);
    }
  }

  public GetZustaendigExternName(ZustaendigID: string): string {

    try {


      let Beteiligter: Projektbeteiligtestruktur = lodash.find(this.DBProjekt.CurrentProjekt.Beteiligtenliste, { BeteiligtenID: ZustaendigID});

      if(lodash.isUndefined(Beteiligter) === false) {

        if(Beteiligter.Beteiligteneintragtyp === this.Const.Beteiligteneintragtypen.Person) {

          return Beteiligter.Name;
        }
        else {

          return Beteiligter.Firma;
        }
      }
      else {

        return 'unbekannt';
      }

      return '';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'GetZustaendigExternName', this.Debug.Typen.Service);
    }
  }

  private AddLOPListe(protkoll: LOPListestruktur) {

    try {

      let Observer: Observable<any>;

      return new Promise((resolve, reject) => {

        // POST für neuen Eintrag

        Observer = this.http.post(this.ServerLOPListeUrl, protkoll);

        Observer.subscribe({

          next: (result) => {

            this.CurrentLOPListe = result.LOPListe;

            debugger;
          },
          complete: () => {

            debugger;

            this.UpdateLOPListeliste(this.CurrentLOPListe);

            resolve(this.CurrentLOPListe);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'AddLOPListe', this.Debug.Typen.Service);
    }
  }

  private UpdateLOPListeliste(LOPListe: LOPListestruktur) {

    try {

      let Index: number;

      Index = lodash.findIndex(this.Pool.LOPListe[this.DBProjekt.CurrentProjekt.Projektkey], {_id : LOPListe._id});

      if(Index !== -1) {

        this.Pool.LOPListe[this.DBProjekt.CurrentProjekt.Projektkey][Index] = LOPListe; // aktualisieren

        this.Debug.ShowMessage('LOPListeliste updated: "' + LOPListe.Titel + '"', 'Database LOP Liste', 'UpdateLOPListeliste', this.Debug.Typen.Service);
      }
      else {

        this.Debug.ShowMessage('LOPListe nicht gefunden -> neues LOPListe hinzufügen', 'Database LOP Liste', 'UpdateLOPListeliste', this.Debug.Typen.Service);

        this.Pool.LOPListe[this.DBProjekt.CurrentProjekt.Projektkey].push(LOPListe); // neuen
      }

      // Gelöscht markierte Einträge entfernen


      this.Pool.LOPListe[this.DBProjekt.CurrentProjekt.Projektkey] = lodash.filter(this.Pool.LOPListe[this.DBProjekt.CurrentProjekt.Projektkey], (protokoll: LOPListestruktur) => {

        return protokoll.Deleted === false;
      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'UpdateProjektpunkteliste', this.Debug.Typen.Service);
    }
  }

  public GetExterneTeilnehmerliste(getliste: boolean): any {

    try {

      let Beteiligte: Projektbeteiligtestruktur;
      let Value: string = '';
      let Eintrag;
      let Liste: string[] = [];

      for(let id of this.CurrentLOPListe.BeteiligExternIDListe) {

        Beteiligte = lodash.find(this.DBProjekt.CurrentProjekt.Beteiligtenliste, {BeteiligtenID: id});

        if(!lodash.isUndefined(Beteiligte)) {

          if(Beteiligte.Beteiligteneintragtyp === this.Const.Beteiligteneintragtypen.Person) {

            Eintrag = this.DBBeteiligte.GetBeteiligtenvorname(Beteiligte) + ' ' + Beteiligte.Name;
            Value +=  Eintrag + '\n';
          }
          else {

            Eintrag = Beteiligte.Firma;
            Value  += Eintrag + '\n';
          }

          Liste.push(Eintrag);
        }
      }

      return getliste ? Liste : Value;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'GetBeteiligteteilnehmerliste', this.Debug.Typen.Service);
    }
  }

  public GetInterneTeilnehmerliste(getliste: boolean): any {

    try {

      let Teammitglied: Mitarbeiterstruktur;
      let Value: string = '';
      let Liste:string[] = [];
      let Eintrag: string;

      for(let id of this.CurrentLOPListe.BeteiligtInternIDListe) {

        Teammitglied = <Mitarbeiterstruktur>lodash.find(this.Pool.Mitarbeiterliste, {_id: id});

        if(!lodash.isUndefined(Teammitglied)) {

          Eintrag = Teammitglied.Vorname + ' ' + Teammitglied.Name + ' / ' + Teammitglied.Kuerzel;
          Value +=  Eintrag + '\n';

          Liste.push(Eintrag);
        }
      }

      return getliste ? Liste : Value;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database LOP Liste', 'GetTeamteilnehmerliste', this.Debug.Typen.Service);
    }
  }
}
