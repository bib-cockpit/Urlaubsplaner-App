import {EventEmitter, Inject, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService} from "@azure/msal-angular";
import {AccountInfo} from "@azure/msal-browser";
import {ConstProvider} from "../const/const";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {Festlegungskategoriestruktur} from "../../dataclasses/festlegungskategoriestruktur";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import moment, {Moment} from "moment/moment";
import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import * as lodash from "lodash-es";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {DatabaseProjekteService} from "../database-projekte/database-projekte.service";


@Injectable({
  providedIn: 'root'
})
export class DatabaseFestlegungenService {

  public EmpfaengerInternIDListe: string[];
  public CcEmpfaengerInternIDListe: string[];
  public EmpfaengerExternIDListe: string[];
  public CcEmpfaengerExternIDListe: string[];
  public Betreff: string;
  public Filename: string;
  public FileID: string;
  public Nachricht: string;
  public Displayliste: Projektpunktestruktur[][];
  public Kostengruppenliste: Projektpunktestruktur[];
  public CcEmpfaengerliste: {
    Name:  string;
    Email: string;
  }[];
  public Empfaengerliste: {
    Name:  string;
    Email: string;
  }[];

  public CurrentFestlegungskategorie: Festlegungskategoriestruktur;
  public ServerUrl: string;


  constructor(
              @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
              private Debug: DebugProvider,
              private Pool: DatabasePoolService,
              private DBProjekte: DatabaseProjekteService,
              private authService: MsalService,
              private http: HttpClient,
              private Const: ConstProvider,
  ) {
    try {

      this.EmpfaengerInternIDListe   = [];
      this.CcEmpfaengerInternIDListe = [];
      this.EmpfaengerExternIDListe   = [];
      this.CcEmpfaengerExternIDListe = [];
      this.Displayliste              = [];
      this.Kostengruppenliste        = [];
      this.Empfaengerliste           = [];
      this.CcEmpfaengerliste         = [];
      this.CurrentFestlegungskategorie = null;
      this.Betreff   = '';
      this.Filename  = '';
      this.FileID    = '';
      this.Nachricht = '';
      this.ServerUrl             = this.Pool.CockpitserverURL + '/festlegungskategorie';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Festlegungskategorie', 'constructor', this.Debug.Typen.Service);
    }
  }

  public GetEmptyFestlegungskategorie(projekt: Projektestruktur): Festlegungskategoriestruktur {

    try {

      let Heute: Moment = moment();

      return {

        _id: null,
        Deleted: false,
        Beschreibung: "",
        Hauptkostengruppe: null,
        Oberkostengruppe:  null,
        Unterkostengruppe: null,
        Projektkey: projekt !== null ? projekt.Projektkey : null,
        Startzeitsptempel: Heute.valueOf(),
        Startzeitstring: Heute.format('HH:mm DD.MM.YYYY'),
        Verfasser: {
          Email:   this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Email   : this.Const.NONE,
          Vorname: this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Vorname : this.Const.NONE,
          Name:    this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Name    : this.Const.NONE
        },
      };
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Festlegungskategorie', 'GetEmptyFestlegungskategorie', this.Debug.Typen.Page);
    }
  }

  public DeleteFestlegungskategorie(): Promise<any> {

    try {

      let Observer: Observable<any>;

      this.CurrentFestlegungskategorie.Deleted = true;

      return new Promise<any>((resove, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerUrl, this.CurrentFestlegungskategorie);

        Observer.subscribe({

          next: (ne) => {

            debugger;

          },
          complete: () => {

            debugger;

            this.UpdateFestlegungskategorienliste(this.CurrentFestlegungskategorie);

            this.Pool.StandortelisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Festlegungskategorie', 'DeleteFestlegungskategorie', this.Debug.Typen.Service);
    }
  }

  private UpdateFestlegungskategorienliste(fest: Festlegungskategoriestruktur) {

    try {

      let Index: number;

      Index = lodash.findIndex(this.Pool.Festlegungskategorienliste[fest.Projektkey], {_id : this.CurrentFestlegungskategorie._id});

      if(Index !== -1) {

        this.Pool.Festlegungskategorienliste[fest.Projektkey][Index] = fest;

        this.Debug.ShowMessage('Festlegungskategorienliste updated: ' + fest.Beschreibung, 'Database Festlegungskategorie', 'UpdateFestlegungskategorienliste', this.Debug.Typen.Service);

      }
      else {

        this.Debug.ShowMessage('Festlegungskategorie nicht gefunden -> neue Festlegungskategorie hinzufügen', 'Database Festlegungskategorie', 'UpdateFestlegungskategorienliste', this.Debug.Typen.Service);

        this.Pool.Festlegungskategorienliste[fest.Projektkey].push(fest); // neuen
      }

      // Gelöscht markiert Einträge entfernen

      this.Pool.Festlegungskategorienliste[fest.Projektkey] = lodash.filter(this.Pool.Festlegungskategorienliste[fest.Projektkey], (currentkategorie: Festlegungskategoriestruktur) => {

        return currentkategorie.Deleted === false;
      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Festlegungskategorie', 'UpdateFestlegungskategorienliste', this.Debug.Typen.Service);
    }
  }

  public GetFestlegungskategorieByID(id: string): Festlegungskategoriestruktur {

    try {

      if(this.DBProjekte.CurrentProjekt !== null) {

        return lodash.find(this.Pool.Festlegungskategorienliste[this.DBProjekte.CurrentProjekt.Projektkey], {_id: id});
      }
      else return null;


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Festlegungskategorie', 'GetFestlegungskategorieByID', this.Debug.Typen.Service);
    }
  }


  public UpdateFestlegungskategorie(): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams();

      Params.set('id', this.CurrentFestlegungskategorie._id);

      return new Promise<any>((resove, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerUrl, this.CurrentFestlegungskategorie);

        Observer.subscribe({

          next: (ne) => {

            debugger;

          },
          complete: () => {

            debugger;

            this.UpdateFestlegungskategorienliste(this.CurrentFestlegungskategorie);

            this.Pool.FestlegungskategorienlisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Festlegungskategorie', 'UpdateFestlegungskategorie', this.Debug.Typen.Service);
    }
  }

  public AddFestlegungskategorie(): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Festlegungskategorie: Festlegungskategoriestruktur;

      return new Promise<any>((resove, reject) => {

        // POST für neuen Eintrag

        debugger;

        if(this.CurrentFestlegungskategorie.Projektkey !== null) {

          Observer = this.http.post(this.ServerUrl, this.CurrentFestlegungskategorie);

          Observer.subscribe({

            next: (result) => {

              debugger;

              Festlegungskategorie = result.data;

            },
            complete: () => {

              this.UpdateFestlegungskategorienliste(Festlegungskategorie);
              this.Pool.FestlegungskategorienlisteChanged.emit();

              resove(true);

            },
            error: (error: HttpErrorResponse) => {

              debugger;

              reject(error);
            }
          });
        }
        else {

          reject(false);
        }

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Festlegungskategorie', 'AddFestlegungskategorie', this.Debug.Typen.Service);
    }
  }

}
