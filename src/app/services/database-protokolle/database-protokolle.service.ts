import {EventEmitter, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {Protokollstruktur} from "../../dataclasses/protokollstruktur";
import * as lodash from 'lodash-es';
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {DatabaseProjekteService} from "../database-projekte/database-projekte.service";
import {ConstProvider} from "../const/const";
import moment, {Moment} from "moment";
import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";

@Injectable({
  providedIn: 'root'
})
export class DatabaseProtokolleService {

  public Leistungsphasenvarianten = {

    LPH1: 'LPH1',
    LPH2: 'LPH2',
    LPH3: 'LPH3',
    LPH4: 'LPH4',
    LPH5: 'LPH5',
    LPH6: 'LPH6',
    LPH7: 'LPH7',
    LPH8: 'LPH8',
  };

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

  public CurrentProtokoll: Protokollstruktur;
  public LetzteProkollnummer: string;
  public Searchmodus: string;
  public Zeitfiltervariante: string;
  public Monatsfilter: Moment;
  public Startdatumfilter: Moment;
  public Enddatumfilter: Moment;
  public MinDatum: Moment;
  public MaxDatum: Moment;
  public Leistungsphasenfilter: string;
  private ServerProtokollUrl: string;

  constructor(private Debug: DebugProvider,
              private DBProjekt: DatabaseProjekteService,
              private Const: ConstProvider,
              private http: HttpClient,
              private Pool: DatabasePoolService) {
    try {

      this.Zeitfiltervariante = this.Const.NONE;
      this.Leistungsphasenfilter = this.Const.NONE;
      this.CurrentProtokoll      = null;
      this.Searchmodus           = this.Searchmodusvarianten.Titelsuche;
      this.Monatsfilter       = null;
      this.Startdatumfilter   = null;
      this.Enddatumfilter     = null;
      this.MinDatum           = null;
      this.MaxDatum           = null;
      this.ServerProtokollUrl = this.Pool.CockpitserverURL + '/protokolle';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Protokolle', 'cosntructor', this.Debug.Typen.Service);
    }
  }

  GetEmptyProtokoll(): Protokollstruktur {

    try {

      let Heute: Moment = moment();
      /*
      let Anzahl: number = this.Pool.Protokollliste[this.DBProjekt.CurrentProjekt.Projektkey].length;
      let Nummer: string = Anzahl === 0 ? '' : (Anzahl + 1).toString();
       */

      return {
        Besprechungsort: "Online",
        Notizen: "",
        DownloadURL: "",
        Endestempel: Heute.clone().add(1, 'hour').valueOf(),
        Leistungsphase: 'LPH5',
        ProjektID: this.DBProjekt.CurrentProjekt._id,
        BeteiligtInternIDListe: [this.Pool.Mitarbeiterdaten._id],
        BeteiligExternIDListe: [],
        ProjektpunkteIDListe: [],
        Protokollnummer: '',
        ShowDetails: true,
        Startstempel: Heute.valueOf(),
        Titel: "Planer JF",
        Deleted: false,
        Verfasser:
          {
            Name:    this.Pool.Mitarbeiterdaten.Name,
            Vorname: this.Pool.Mitarbeiterdaten.Vorname,
            Email:   this.Pool.Mitarbeiterdaten.Email,
          },
        Zeitstempel: Heute.valueOf(),
        Zeitstring: Heute.format('DD.MM.YYYY'),
        _id: null,
        Projektkey: this.DBProjekt.CurrentProjekt.Projektkey
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Protokolle', 'GetEmptyProtokoll', this.Debug.Typen.Service);
    }
  }

  public SaveProtokoll(): Promise<boolean> {

    try {

      return new Promise((resolve, reject) => {

        if(this.CurrentProtokoll._id === null) {

          this.AddProtokoll(this.CurrentProtokoll).then(() => {

            this.Pool.ProtokolllisteChanged.emit();

            resolve(true);

          }).catch((errora) => {

            reject(errora);

            this.Debug.ShowErrorMessage(errora, 'Database Protokolle', 'OkButtonClicked / AddProjektpunkt', this.Debug.Typen.Service);
          });
        }
        else {

          this.UpdateProtokoll(this.CurrentProtokoll).then(() => {

            this.Pool.ProtokolllisteChanged.emit();

            resolve(true);

          }).catch((errorb) => {

            reject(errorb);

            this.Debug.ShowErrorMessage(errorb, 'Database Protokolle', 'OkButtonClicked / UpdateProjektpunkt', this.Debug.Typen.Service);
          });
        }

        /*

          this.CurrentProtokoll.ProjektpunkteIDListe = [];

          this.Punkteliste = lodash.filter(this.Punkteliste, (Punkt: Projektpunktestruktur) => {

            return Punkt.Aufgabe !== '';
          });

          for(let Projektpunkt of this.Punkteliste) {

            this.DB.CurrentProtokoll.ProjektpunkteIDListe.push(Projektpunkt._id);
          }

          this.DBProjektpunkte.SaveProjektpunktliste(this.Punkteliste).then(() => {

          });

         */

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Protokolle', 'SaveProtokoll', this.Debug.Typen.Service);
    }
  }

  DeleteProtokoll(protokoll: Protokollstruktur): Promise<any> {

    try {

      return new Promise((resolve, reject) => {

        resolve(true);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Protokolle', 'DeleteProtokoll', this.Debug.Typen.Service);
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

      this.Debug.ShowErrorMessage(error, 'Database Protokolle', 'SetZeitspannenfilter', this.Debug.Typen.Service);
    }
  }

  GetProtokollByID(ProtokollID: string): Protokollstruktur {

    try {

      let Protoll: Protokollstruktur = lodash.find(this.Pool.Protokollliste[this.DBProjekt.CurrentProjektindex], {_id: ProtokollID});

      if(!lodash.isUndefined(Protoll)) return Protoll;
      else return null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Protokolle', 'GetProtokollByID', this.Debug.Typen.Service);
    }
  }

  GetLetzteProtokollnummer(): string {

    try {

      let Liste: Protokollstruktur[];

      if(!lodash.isUndefined(this.Pool.Protokollliste[this.CurrentProtokoll.Projektkey])) {

        Liste = lodash.cloneDeep(this.Pool.Protokollliste[this.CurrentProtokoll.Projektkey]);

        if(Liste.length === 0) {

          return ': kein vorhergendes Protokoll vorhanden';
        }
        else {

          Liste.sort((punktA: Protokollstruktur, punktB: Protokollstruktur) => {

            if (punktA.Startstempel < punktB.Startstempel) return 1;
            if (punktA.Startstempel > punktB.Startstempel) return -1;
            return 0;
          });

          return Liste[0].Protokollnummer;
        }
      }
      return 'Unbekannt';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Protokolle', 'GetLetzteProtokollnummer', this.Debug.Typen.Service);
    }

  }

  private UpdateProtokoll(protokoll: Protokollstruktur): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams();
      let Merker: Protokollstruktur;

      debugger;

      return new Promise((resolve, reject) => {

        Params.set('id', protokoll._id);

        // PUT für update

        delete protokoll.__v;

        Observer = this.http.put(this.ServerProtokollUrl, protokoll);

        Observer.subscribe({

          next: (ne) => {

            Merker = ne.Protokoll;

          },
          complete: () => {

            if(Merker !== null) {

              this.CurrentProtokoll = Merker;

              this.UpdateProtokollliste(this.CurrentProtokoll);

              resolve(true);
            }
            else {

              reject(new Error('Protokoll auf Server nicht gefunden.'));
            }
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Protokolle', 'UpdateProtokoll', this.Debug.Typen.Service);
    }
  }

  private AddProtokoll(protkoll: Protokollstruktur) {

    try {

      let Observer: Observable<any>;

      return new Promise((resolve, reject) => {

        // POST für neuen Eintrag

        Observer = this.http.post(this.ServerProtokollUrl, protkoll);

        Observer.subscribe({

          next: (result) => {

            this.CurrentProtokoll = result.Protokoll;

            debugger;
          },
          complete: () => {

            this.UpdateProtokollliste(this.CurrentProtokoll);

            resolve(this.CurrentProtokoll);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Protokolle', 'AddProtokoll', this.Debug.Typen.Service);
    }
  }

  private UpdateProtokollliste(Protokoll: Protokollstruktur) {

    try {

      let Index: number;

      Index = lodash.findIndex(this.Pool.Protokollliste[this.DBProjekt.CurrentProjekt.Projektkey], {_id : Protokoll._id});

      if(Index !== -1) {

        this.Pool.Protokollliste[this.DBProjekt.CurrentProjekt.Projektkey][Index] = Protokoll; // aktualisieren

        console.log('Protokollliste updated: "' + Protokoll.Titel + '"');
      }
      else {

        console.log('Protokoll nicht gefunden -> neues Protokoll hinzufügen');

        this.Pool.Protokollliste[this.DBProjekt.CurrentProjekt.Projektkey].push(Protokoll); // neuen
      }

      // Gelöscht markierte Einträge entfernen


      this.Pool.Protokollliste[this.DBProjekt.CurrentProjekt.Projektkey] = lodash.filter(this.Pool.Protokollliste[this.DBProjekt.CurrentProjekt.Projektkey], (protokoll: Protokollstruktur) => {

        return protokoll.Deleted === false;
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Protokolle', 'UpdateProjektpunkteliste', this.Debug.Typen.Service);
    }
  }
}
