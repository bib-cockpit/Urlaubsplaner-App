import { Injectable } from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import moment, {Moment} from "moment";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {DatabaseAuthenticationService} from "../database-authentication/database-authentication.service";
import {ConstProvider} from "../const/const";
import {Meinewochestruktur} from "../../dataclasses/meinewochestruktur";

@Injectable({
  providedIn: 'root'
})
export class DatabaseMitarbeiterService {

  public CurrentMitarbeiter: Mitarbeiterstruktur;
  public CurrentMeinewoche: Meinewochestruktur;
  public Fachbereichsliste: string[];
  private ServerMitarbeiterUrl: string;
  private ServerSettingsUrl: string;
  private ServerRegistrierungUrl: string;

  constructor(private Debug: DebugProvider,
              private http: HttpClient,
              private Const: ConstProvider,
              private AuthService: DatabaseAuthenticationService,
              private Pool: DatabasePoolService) {
    try {

      this.ServerMitarbeiterUrl   = this.Pool.CockpitserverURL + '/mitarbeiter';
      this.ServerSettingsUrl      = this.Pool.CockpitserverURL + '/settings';
      this.ServerRegistrierungUrl = this.Pool.CockpitserverURL + '/registrierung';

      this.CurrentMeinewoche = this.GetEmptyMeinewocheeintrag();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeiter', 'constructor', this.Debug.Typen.Service);
    }
  }

  public GetMeinewocheStunden(tag: string): string {

    try {

      let Stunden: number = 0;
      let Minuten: number = 0;

      for(let Eintrag of this.Pool.Mitarbeiterdaten.Meinewocheliste) {

        switch (tag) {

          case 'Montag':

            if(Eintrag.Montagseinsatz) {

              Stunden += Eintrag.Montagsstunden;
              Minuten += Eintrag.Montagsminuten;
            }

            break;

          case 'Dienstag':

            if(Eintrag.Dienstagseinsatz) {

              Stunden += Eintrag.Dienstagsstunden;
              Minuten += Eintrag.Dienstagsminuten;
            }

            break;


          case 'Mittwoch':

            if(Eintrag.Mittwochseinsatz) {

              Stunden += Eintrag.Mittwochsstunden;
              Minuten += Eintrag.Mittwochsminuten;
            }

            break;

          case 'Donnerstag':

            if(Eintrag.Donnerstagseinsatz) {

              Stunden += Eintrag.Donnerstagsstunden;
              Minuten += Eintrag.Donnerstagsminuten;
            }

            break;

          case 'Freitag':

            if(Eintrag.Freitagseinsatz) {

              Stunden += Eintrag.Freitagsstunden;
              Minuten += Eintrag.Freitagsminuten;
            }

            break;
        }
      }

      Minuten = Minuten + 60 * Stunden;

      if(Minuten === 0) return '';
      else return '[' + (Minuten / 60).toFixed(2) + ' Std]';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeiter', 'GetMeinewocheStunden', this.Debug.Typen.Service);
    }
  }

  public GetEmptyMeinewocheeintrag(): Meinewochestruktur {

    try {

      return {
        ProjektID: "",
        Projektkey: "",
        ProjektpunktID: "",
        Kalenderwoche: moment().isoWeek(),

        Montagsstunden:    0,
        Dienstagsstunden:  0,
        Mittwochsstunden:  0,
        Donnerstagsstunden:0,
        Freitagsstunden:   0,
        Samstagsstunden:   0,

        Montagsminuten:     30,
        Dienstagsminuten:   30,
        Mittwochsminuten:   30,
        Donnerstagsminuten: 30,
        Freitagsminuten:    30,
        Samstagsminuten:    30,

        Dienstagseinsatz:   false,
        Donnerstagseinsatz: false,
        Freitagseinsatz:    false,
        Mittwochseinsatz:  false,
        Montagseinsatz:     false,
        Samstagseinsatz:    false,
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeiter', 'GetEmptyMeinewoche', this.Debug.Typen.Service);
    }
  }

  public GetEmptyMitarbeiter(): Mitarbeiterstruktur {

    try {

      let Zeit: Moment = moment();

      return {

        _id: null,
        Vorname: "",
        Name: "",
        Kuerzel: "",
        Fachbereich: "Unbekannt",
        StandortID: "",
        // MitarbeiterID: "",
        Email: "",
        Mobil: "",
        SettingsID: null,
        Telefon: "",
        Zeitstring: Zeit.format('HH:mm DD.MM.YYYY'),
        Zeitstempel: Zeit.valueOf(),
        Deleted: false,
        Favoritenliste: [],
        Meintagliste: [],
        Meinewocheliste: []
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeiter', 'GetEmptyMitarbeiter', this.Debug.Typen.Service);
    }
  }

  GetMitarbeitername(id: string): string {

    try {

      let Mitarbeiter: Mitarbeiterstruktur = <Mitarbeiterstruktur>lodash.find(this.Pool.Mitarbeiterliste, {_id: id});

      if(lodash.isUndefined(Mitarbeiter)) return 'Unbekannt';
      else {

        return Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeiter', 'GetMitarbeitername', this.Debug.Typen.Service);
    }
  }

  public InitService() {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeiter', 'InitService', this.Debug.Typen.Service);
    }
  }

  public FinishService() {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeiter', 'FinishService', this.Debug.Typen.Service);
    }
  }

  public UpdateMitarbeiter(mitarbeiter: Mitarbeiterstruktur) {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams();
      let Merker: Mitarbeiterstruktur;

      delete mitarbeiter.__v;

      Params.set('id', mitarbeiter._id);

      return new Promise<any>((resove, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerMitarbeiterUrl, mitarbeiter);

        Observer.subscribe({

          next: (ne) => {

            Merker = ne.Mitarbeiter;
          },
          complete: () => {

            if(Merker !== null) {

              this.CurrentMitarbeiter = Merker;
              this.Pool.MitarbeiterdatenChanged.emit();

              this.UpdateMitarbeiterliste(this.CurrentMitarbeiter);
              this.Pool.MitarbeiterlisteChanged.emit();
            }
            else {

              reject(new Error('Mitarbeiter auf Server nicht gefunden.'));
            }

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeiter', 'UpdateMitarbeiter', this.Debug.Typen.Page);
    }
  }


  private UpdateMitarbeiterliste(mitarbeiter: Mitarbeiterstruktur) {

    try {

      let Index: number;

      Index = lodash.findIndex(this.Pool.Mitarbeiterliste, {_id : this.CurrentMitarbeiter._id});

      if(Index !== -1) {

        this.Pool.Mitarbeiterliste[Index] = mitarbeiter; // aktualisieren

        console.log('Mitarbeiterliste updated: ' + mitarbeiter.Name);
      }
      else {

        console.log('Mitarbeiter nicht gefunden -> neuen Mitarbeiter hinzufügen');

        this.Pool.Mitarbeiterliste.push(mitarbeiter); // neuen
      }

      // Gelöscht markiert Einträge entfernen

      this.Pool.Mitarbeiterliste = lodash.filter(this.Pool.Mitarbeiterliste, (currentmitarbeiter: Mitarbeiterstruktur) => {

        return currentmitarbeiter.Deleted === false;
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeiter', 'UpdateMitarbeiterliste', this.Debug.Typen.Service);
    }
  }

  public AddMitarbeiter(mitarbeiter: Mitarbeiterstruktur) {

    try {

      let Observer: Observable<any>;
      let Mitarbeiter: Mitarbeiterstruktur;

      return new Promise((resolve, reject) => {

        // POST für neuen Eintrag

        Observer = this.http.post(this.ServerMitarbeiterUrl, mitarbeiter);

        Observer.subscribe({

          next: (result) => {

            debugger;

            Mitarbeiter = result.Mitarbeiter;

          },
          complete: () => {


            this.UpdateMitarbeiterliste(Mitarbeiter);
            this.Pool.MitarbeiterlisteChanged.emit();

            resolve(Mitarbeiter);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeiter', 'AddMitarbeiter', this.Debug.Typen.Service);
    }
  }

  public RegisterMitarbeiter() {

    try {

      let Observer: Observable<any>;
      let Daten: any;
      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
        'authorization': this.AuthService.GetAuthenticationToken()
      });

      return new Promise((resolve, reject) => {

        // POST für neue Registrierung

        Observer = this.http.post(this.ServerRegistrierungUrl, this.CurrentMitarbeiter, { headers: headers } );

        Observer.subscribe({

          next: (result) => {

            Daten = result;

          },
          complete: () => {

            resolve(Daten);
          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Mitarbeiter', 'RegisterMitarbeiter', this.Debug.Typen.Page);
    }
  }

  public GetMitarbeiterRegistrierung(email: string): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams({ fromObject: { email: email }} );
      let Daten: any;
      let Token:string = this.AuthService.GetAuthenticationToken();

      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
        'authorization': Token
      });

      return new Promise<any>((resove, reject) => {

        Observer = this.http.get(this.ServerRegistrierungUrl, { params: Params, headers: headers });

        Observer.subscribe({

          next: (result) => {

            debugger;

            Daten = result;
          },
          complete: () => {

            debugger;

            resove(Daten);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Standorte', 'GetMitarbeiterRegistrierung', this.Debug.Typen.Service);
    }
  }

  public GetMitarbeiter(email: string): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams({fromObject: {email: email}});
      let Daten: any;


      return new Promise<any>((resove, reject) => {

        Observer = this.http.get(this.ServerMitarbeiterUrl, { params: Params });

        Observer.subscribe({

          next: (result) => {

            Daten = result;
          },
          complete: () => {

            resove(Daten);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Standorte', 'SaveMitarbeiter', this.Debug.Typen.Service);
    }
  }

  public DeleteMitarbeiter(mitarbeiter: Mitarbeiterstruktur): Promise<any> {

    try {

      mitarbeiter.Deleted = true;

      return this.UpdateMitarbeiter(mitarbeiter);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Standorte', 'DeleteMitarbeiter', this.Debug.Typen.Service);
    }
  }
}
