import { Injectable } from '@angular/core';
import {DebugProvider} from "../debug/debug";
import moment, {Moment} from "moment";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {DatabaseAuthenticationService} from "../database-authentication/database-authentication.service";
import {ConstProvider} from "../const/const";
import {Graphservice} from "../graph/graph";
import {Notizenkapitelstruktur} from "../../dataclasses/notizenkapitelstruktur";
import {DatabaseProjekteService} from "../database-projekte/database-projekte.service";
import {Notizenkapitelabschnittstruktur} from "../../dataclasses/notizenkapitelabschnittstruktur";

@Injectable({
  providedIn: 'root'
})
export class DatabaseNotizenService {

  public CurrentNotizenkapitel: Notizenkapitelstruktur;
  public CurrentNotizenkapitelabschnitt: Notizenkapitelabschnittstruktur;
  private ServerNotizenkapitelUrl: string;

  constructor(private Debug: DebugProvider,
              private http: HttpClient,
              private Const: ConstProvider,
              private GraphService: Graphservice,
              private DBProjekte: DatabaseProjekteService,
              private AuthService: DatabaseAuthenticationService,
              private Pool: DatabasePoolService) {
    try {

      this.ServerNotizenkapitelUrl        = this.Pool.CockpitserverURL + '/notizenkapitel';
      this.CurrentNotizenkapitel          = null; // this.GetEmptyNotizenkapiteleintrag();
      this.CurrentNotizenkapitelabschnitt = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Databse Notizen', 'constructor', this.Debug.Typen.Service);
    }
  }

  public GetEmptyNotizenkapiteleintrag(): Notizenkapitelstruktur {

    try {

      let Heute: Moment = moment();

      return {

        _id:        null,
        ProjektID:  this.DBProjekte.CurrentProjekt !== null ? this.DBProjekte.CurrentProjekt._id        : null,
        Projektkey: this.DBProjekte.CurrentProjekt !== null ? this.DBProjekte.CurrentProjekt.Projektkey : null,
        Titel:      "",
        Abschnittliste: [{
          KapitelabschnittID: 'Allgemein',
          Titel:    'Allgemein',
          HTML:     '',
          Filepath: '',
        }],
        Deleted:    false,
        Verfasser: {

          Name:    this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Name    : this.Const.NONE,
          Vorname: this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Vorname : this.Const.NONE,
          Email:   this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Email   : this.Const.NONE
        },
        Zeitstempel: Heute.valueOf(),
        Zeitstring:  Heute.format('DD.MM.YYYY HH:mm')
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Databse Notizen', 'v', this.Debug.Typen.Service);
    }
  }


  public UpdateNotizenkapitel(notizenkapitel: Notizenkapitelstruktur) {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams();
      let Merker: Notizenkapitelstruktur;

      delete notizenkapitel.__v;

      Params.set('id', notizenkapitel._id);

      return new Promise<any>((resove, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerNotizenkapitelUrl, notizenkapitel);

        Observer.subscribe({

          next: (ne) => {

            Merker = ne.Notizenkapitel;
          },
          complete: () => {

            if(Merker !== null) {

              this.CurrentNotizenkapitel = Merker;

              this.UpdateNotizenkapitel(this.CurrentNotizenkapitel);
              this.Pool.NotizenkapitellisteChanged.emit();
            }
            else {

              reject(new Error('Notizenkapitel auf Server nicht gefunden.'));
            }

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Notizen', 'UpdateNotizenkapitel', this.Debug.Typen.Page);
    }
  }


  private UpdateNotizenkapitelliste(notizenkapitel: Notizenkapitelstruktur) {

    try {

      let Index: number;

      Index = lodash.findIndex(this.Pool.Notizenkapitelliste[notizenkapitel.Projektkey], {_id : notizenkapitel._id});

      if(Index !== -1) {

        this.Pool.Notizenkapitelliste[notizenkapitel.Projektkey][Index] = notizenkapitel; // aktualisieren

        this.Debug.ShowMessage('Notizenkapitelliste updated: "' + notizenkapitel.Titel + '"', 'Database Notizen', 'UpdateNotizenkapitelliste', this.Debug.Typen.Service);
      }
      else {

        this.Debug.ShowMessage('Notizenkapitel nicht gefunden -> neuen Projektpunkt hinzufügen', 'Database Notizen', 'UpdateNotizenkapitelliste', this.Debug.Typen.Service);

        this.Pool.Notizenkapitelliste[notizenkapitel.Projektkey].push(notizenkapitel); // neuen
      }

      // Gelöscht markierte Einträge entfernen


      this.Pool.Notizenkapitelliste[notizenkapitel.Projektkey] = lodash.filter(this.Pool.Notizenkapitelliste[notizenkapitel.Projektkey], (currentnotizenkapitel: Notizenkapitelstruktur) => {

        return currentnotizenkapitel.Deleted === false;
      });

      this.Pool.Notizenkapitelliste[notizenkapitel.Projektkey].sort((a: Notizenkapitelstruktur, b: Notizenkapitelstruktur) => {

        if (a.Titel < b.Titel) return -1;
        if (a.Titel > b.Titel) return 1;

        return 0;
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Databse Notizen', 'UpdateNotizenkapitelliste', this.Debug.Typen.Service);
    }
  }

  public AddNotizenkapitel(notizenkapitel: Notizenkapitelstruktur) {

    try {

      let Observer: Observable<any>;
      let Notizenkapitel: Notizenkapitelstruktur;

      return new Promise((resolve, reject) => {

        // POST für neuen Eintrag

        console.log('POST new Notizenkapitel:');
        console.log(notizenkapitel);

        Observer = this.http.post(this.ServerNotizenkapitelUrl, notizenkapitel);

        Observer.subscribe({

          next: (result) => {

            debugger;

            Notizenkapitel = result.Notizenkapitel;

          },
          complete: () => {


            this.UpdateNotizenkapitelliste(Notizenkapitel);
            this.Pool.NotizenkapitellisteChanged.emit();

            resolve(Notizenkapitel);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Databse Notizen', 'AddNotizenkapitel', this.Debug.Typen.Service);
    }
  }

  public DeleteNotizenkapitel(notizenkapitel: Notizenkapitelstruktur): Promise<any> {

    try {

      notizenkapitel.Deleted = true;

      return this.UpdateNotizenkapitel(notizenkapitel);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Standorte', 'DeleteNotizenkapitel', this.Debug.Typen.Service);
    }
  }
}
