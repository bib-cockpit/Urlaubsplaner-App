import {EventEmitter, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import moment, {Moment} from "moment";
import {ConstProvider} from "../const/const";
import {Changelogstruktur} from "../../dataclasses/changelogstruktur";

@Injectable({
  providedIn: 'root'
})
export class DatabaseChangelogService {

  private ServerUrl: string;
  public CurrentChangelog: Changelogstruktur;

  constructor(private Debug: DebugProvider,
              private Pool: DatabasePoolService,
              private Const: ConstProvider,
              private http: HttpClient) {
    try {

      this.ServerUrl        = this.Pool.CockpitserverURL + '/changelog';
      this.CurrentChangelog = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Chnagelog', 'constructor', this.Debug.Typen.Service);
    }
  }


  GetChangelog(id):string {

    try {

      let Changelog: Changelogstruktur;

      Changelog = lodash.find(this.Pool.Changlogliste, {_id: id});

        if(!lodash.isUndefined(Changelog)) {

          return Changelog.Beschreibung;
        }
        else return 'unbekannt';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiter Editor', 'GetChangelog', this.Debug.Typen.Component);
    }
  }

  public GetEmptyChangelog(): Changelogstruktur {

    try {

      let Heute: Moment = moment();

      return {

        _id: null,
        Beschreibung: '',
        Version: '',
        Zeitstempel: Heute.valueOf(),
        Deleted: false
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Chnagelog', 'GetEmptyChangelog', this.Debug.Typen.Service);
    }
  }

  public AddChangelog(): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Changelog: Changelogstruktur;

      debugger;

      return new Promise<any>((resove, reject) => {

        // POST für neuen Eintrag

        Observer = this.http.post(this.ServerUrl, this.CurrentChangelog);

        Observer.subscribe({

          next: (result) => {

            debugger;

            Changelog = result.Changelog;

          },
          complete: () => {

            this.UpdateChangelogliste(Changelog);
            this.Pool.ChangeloglisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Chnagelog', 'AddChangelog', this.Debug.Typen.Service);
    }
  }

  private UpdateChangelogliste(changelog: Changelogstruktur) {

    try {

      let Index: number;

      Index = lodash.findIndex(this.Pool.Changlogliste, {_id : this.CurrentChangelog._id});

      if(Index !== -1) {

        this.Pool.Changlogliste[Index] = changelog; // aktualisieren

        this.Debug.ShowMessage('Changelogliste updated: ' + changelog.Version, 'Database Changelog', 'UpdateChangelogliste', this.Debug.Typen.Service);

      }
      else {

        this.Debug.ShowMessage('Chnagelog nicht gefunden -> neues Changlog hinzufügen', 'Database Chnagelog', 'UpdateChangelogliste', this.Debug.Typen.Service);

        this.Pool.Changlogliste.unshift(changelog); // neuen
      }

      // Gelöscht markiert Einträge entfernen

      this.Pool.Changlogliste = lodash.filter(this.Pool.Changlogliste, (currentchangelog: Changelogstruktur) => {

        return currentchangelog.Deleted === false;
      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Chnagelog', 'UpdateChangelogliste', this.Debug.Typen.Service);
    }
  }


  public UpdateChangelog(): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams();

      Params.set('id', this.CurrentChangelog._id);

      return new Promise<any>((resove, reject) => {

          // PUT für update

        Observer = this.http.put(this.ServerUrl, this.CurrentChangelog);

        Observer.subscribe({

          next: (ne) => {

            debugger;

          },
          complete: () => {

            debugger;

            this.UpdateChangelogliste(this.CurrentChangelog);

            this.Pool.ChangeloglisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Chnagelog', 'UpdateChangelog', this.Debug.Typen.Service);
    }
  }
  public DeleteChangelog(): Promise<any> {

    try {

      let Observer: Observable<any>;

      this.CurrentChangelog.Deleted = true;

      return new Promise<any>((resove, reject) => {

          // PUT für update

        Observer = this.http.put(this.ServerUrl, this.CurrentChangelog);

        Observer.subscribe({

          next: (ne) => {

            debugger;

          },
          complete: () => {

            debugger;

            this.UpdateChangelogliste(this.CurrentChangelog);

            this.Pool.ChangeloglisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Chnagelog', 'DeleteChangelog', this.Debug.Typen.Service);
    }
  }
}
