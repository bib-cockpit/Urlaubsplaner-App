import {EventEmitter, Injectable} from '@angular/core';
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {DebugProvider} from "../debug/debug";
import moment, {Moment} from "moment";
import {ConstProvider} from "../const/const";
import {BasicsProvider} from "../basics/basics";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import * as lodash from "lodash-es";
import {Mitarbeitersettingsstruktur} from "../../dataclasses/mitarbeitersettingsstruktur";
import {Favoritenstruktur} from "../../dataclasses/favoritenstruktur";
import { v4 as uuidv4 } from 'uuid';
import {DatabaseMitarbeiterService} from "../database-mitarbeiter/database-mitarbeiter.service";
import {Projektauswahlmenuestruktur} from "../../dataclasses/projektauswahlmenuestruktur";
import {Projektfarbenstruktur} from "../../dataclasses/projektfarbenstruktur";
import {reportUnhandledError} from "rxjs/internal/util/reportUnhandledError";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {Graphservice} from "../graph/graph";
import {assignWith, forEach} from "lodash-es";
import {Teamsstruktur} from "../../dataclasses/teamsstruktur";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";
import {Protokollstruktur} from "../../dataclasses/protokollstruktur";

@Injectable({
  providedIn: 'root'
})
export class DatabaseProjekteService {

  public CurrentProjekt: Projektestruktur;
  public CurrentProjektindex: number;
  private ServerUrl: string;
  public CurrentFavorit: Favoritenstruktur;
  public CurrentFavoritenlisteindex: number;
  public CurrentFavoritprojektindex: number;
  public Favoritenprojekteanzahl: number;
  public Projektauswahlsettings: Projektauswahlmenuestruktur[][];
  public Projektliste:            Projektestruktur[];
  public GesamtprojektlisteHasDatenerror: boolean;

  public CurrentFavoritenChanged = new EventEmitter<any>();
  public CurrentFavoritenProjektChanged = new EventEmitter<any>();
  public GesamtprojektelisteChanged: EventEmitter<any> = new EventEmitter<any>();
  public TeamsPathesChanged: EventEmitter<Teamsfilesstruktur> = new EventEmitter<Teamsfilesstruktur>();

  public  FavoritenZeilenanzahl: number;
  public FavoritenSpaltenanzahl: number;
  public  FavoritenCellbreite: number;
  public Projektfarbenliste: Projektfarbenstruktur[];
  public Gesamtprojektliste:      Projektestruktur[];

  constructor(private Debug: DebugProvider,
              private Basics: BasicsProvider,
              private Pool: DatabasePoolService,
              private http: HttpClient,
              private GraphService: Graphservice,
              private MitarbeiterDB: DatabaseMitarbeiterService,
              private Const: ConstProvider) {
    try {

      this.CurrentProjekt             = null;
      this.CurrentFavorit             = null;
      this.CurrentProjektindex        = null;
      this.CurrentFavoritprojektindex = null;
      this.CurrentFavoritenlisteindex = null;
      this.Projektliste               = [];
      this.Gesamtprojektliste         = [];
      this.Projektauswahlsettings     = [];
      this.FavoritenZeilenanzahl      = 1;
      this.FavoritenSpaltenanzahl     = 0;
      this.FavoritenCellbreite        = 100;
      this.Projektfarbenliste         = [];
      this.GesamtprojektlisteHasDatenerror = false;

      this.Projektfarbenliste.push({Name: 'Grau',          Background: '#444444', Foreground: 'white'});
      this.Projektfarbenliste.push({Name: 'Hellblau',      Background: '#2554C7', Foreground: ''});
      this.Projektfarbenliste.push({Name: 'Dunkelblau',    Background: '#000080', Foreground: 'white'});
      this.Projektfarbenliste.push({Name: 'Hellgruen',     Background: '#50C878', Foreground: 'white'});
      this.Projektfarbenliste.push({Name: 'Dunkelgruen',   Background: '#006400', Foreground: 'white'});
      this.Projektfarbenliste.push({Name: 'Burnicklgruen', Background: '#c7d304', Foreground: 'white'});
      this.Projektfarbenliste.push({Name: 'Gruen',         Background: '#008000', Foreground: 'white'});
      this.Projektfarbenliste.push({Name: 'Weinrot',       Background: '#800000', Foreground: 'white'});
      this.Projektfarbenliste.push({Name: 'Teal',          Background: '#008080', Foreground: 'white'});
      this.Projektfarbenliste.push({Name: 'Lila',          Background: '#800080', Foreground: 'white'});
      this.Projektfarbenliste.push({Name: 'Hellorange',    Background: '#FFD700', Foreground: 'white'});
      this.Projektfarbenliste.push({Name: 'Orange',        Background: '#FFA500', Foreground: 'white'});
      this.Projektfarbenliste.push({Name: 'Gelb',          Background: '#FFFF00', Foreground: 'black'});

      this.ServerUrl = this.Pool.CockpitserverURL + '/projekte';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'cosntructor', this.Debug.Typen.Service);
    }
  }

  public GetProjektByID(id: string): Projektestruktur {

    try {

      return lodash.find(this.Projektliste, {_id: id});

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'GetProjektByID', this.Debug.Typen.Service);
    }
  }

  public CheckProjektmembership(Projekt: Projektestruktur): boolean {

    try {

      let Index = lodash.findIndex(this.GraphService.Teamsliste, {id: Projekt.TeamsID});

      return Index !== -1;


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'CheckProjektmembership', this.Debug.Typen.Service);
    }
  }

  public ReadGesamtprojektliste(): Promise<any> {

    try {

      this.Gesamtprojektliste = [];

      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
      });

      return new Promise((resolve, reject) => {

        let StandortObservable = this.http.get(this.Pool.CockpitserverURL + '/projekte', { headers: headers });

        StandortObservable.subscribe({

          next: (data) => {

            this.Gesamtprojektliste = <Projektestruktur[]>data;
          },
          complete: () => {

            for(let Projekt of this.Gesamtprojektliste) {

              if(lodash.isUndefined(Projekt.Projektfarbe))  Projekt.Projektfarbe  = 'Burnicklgruen';
              if(lodash.isUndefined(Projekt.ProjektIsReal)) Projekt.ProjektIsReal = true;

              if(lodash.isUndefined(Projekt.BaustellenLOPFolderID)) Projekt.BaustellenLOPFolderID = this.Const.NONE;
              if(lodash.isUndefined(Projekt.ProtokolleFolderID))    Projekt.ProtokolleFolderID    = this.Const.NONE;
              if(lodash.isUndefined(Projekt.BautagebuchFolderID))   Projekt.BautagebuchFolderID   = this.Const.NONE;

              for(let Beteiligter of Projekt.Beteiligtenliste) {

                if(lodash.isUndefined(Beteiligter.Fachfirmentyp)) Beteiligter.Fachfirmentyp = 0;
              }
            }

            this.GesamtprojektelisteChanged.emit();

            resolve(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'ReadGesamtprojektliste', this.Debug.Typen.Service);
    }
  }


  public GetProjektFarbeByProjektpunkt(Punkt: Projektpunktestruktur): Projektfarbenstruktur {

    try {

      let Projekt: Projektestruktur = this.GetProjektByID(Punkt.ProjektID);



      if(!lodash.isUndefined(Projekt)) {

        if(this.CheckProjektmembership(Projekt) === true) return this.GetProjektfarbeByProjektfarbnamen(Projekt.Projektfarbe);
        else return {
          Background: "silver",
          Foreground: "white",
          Name: ""
        };
      }
      else return {
        Background: "#444444",
        Foreground: "white",
        Name: ""
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Meine Woche Editor', 'GetProjektFarbeByProjektpunkt', this.Debug.Typen.Service);
    }
  }


  public SetProjektpunkteanzahl(anzahl: number, projektkey: string) {

    try {

      let Projektauswahl: Projektauswahlmenuestruktur;

      for(let zeilenindex = 0; zeilenindex < this.Projektauswahlsettings.length; zeilenindex++) {

        for(let spaltenindex = 0; spaltenindex < this.Projektauswahlsettings[zeilenindex].length; spaltenindex++) {

          Projektauswahl = this.Projektauswahlsettings[zeilenindex][spaltenindex];

          if(Projektauswahl !== null && Projektauswahl.Projektkey === projektkey) {

            Projektauswahl.Projektpunkteanzahl = anzahl;
          }
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'SetProjektpunkteanzahl', this.Debug.Typen.Service);
    }
  }

  public InitService() {

    try {



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'InitService', this.Debug.Typen.Service);
    }
  }

  public FinishService() {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'FinishService', this.Debug.Typen.Service);
    }
  }

  public InitGesamtprojekteliste() {

    try {

      for(let Projekt of this.Gesamtprojektliste) {

        if(lodash.isUndefined(Projekt.Projektkey)) Projekt.Projektkey = this.GenerateProjektkey(Projekt);

        if(lodash.isUndefined(Projekt.Beteiligtenliste)) {

          Projekt.Beteiligtenliste = [];
        }

        if(lodash.isUndefined(Projekt.Verfasser)) {

          Projekt.Verfasser = {

            Name:    this.Const.NONE,
            Vorname: this.Const.NONE,
            Email:   this.Const.NONE
          };
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'InitGesamtprojekteliste', this.Debug.Typen.Service);
    }
  }

  public GenerateProjektkey(projekt: Projektestruktur): string {

    try {

      let key: string = projekt.Projektkurzname.toUpperCase();

      key = key.replace(/ /g, '_');
      key = key.replace(/ä/g, 'ae');
      key = key.replace(/Ä/g, 'AE');
      key = key.replace(/ö/g, 'oe');
      key = key.replace(/Ö/g, 'OE');
      key = key.replace(/ü/g, 'ue');
      key = key.replace(/Ü/g, 'UE');
      key = key.replace(/ß/g, 'ss');
      key = key.replace(/[^a-zA-Z0-9 ]/g, '_'); // /[&\/\\#,+()$~%.'§=^!`´;":.,*-?<>{}]/g, '_');

      return key;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'GenerateFilename', this.Debug.Typen.Service);
    }
  }

  public GetEmptyProjekt() : Projektestruktur {

    try {

      let Zeit: Moment = moment();

      return {

        _id: null,
        StandortID:       this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.StandortID : this.Const.NONE,
        ProjektleiterID:  this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten._id : this.Const.NONE,
        StellvertreterID: this.Const.NONE,
        Projektkey:       this.Const.NONE,
        Projektname:      "",
        Projektkurzname:  "",
        Projektnummer:    "",
        PLZ: "",
        Ort: "",
        Strasse: "",
        Status: "Bearbeitung",
        Verfasser: {

          Email:    this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Email : this.Const.NONE,
          Vorname: this.Pool.Mitarbeiterdaten  !== null ? this.Pool.Mitarbeiterdaten.Vorname : this.Const.NONE,
          Name:    this.Pool.Mitarbeiterdaten  !== null ? this.Pool.Mitarbeiterdaten.Name : this.Const.NONE
        },
        Zeitpunkt:   Zeit.format('HH:mm DD.MM.YYYY'),
        Zeitstempel: Zeit.valueOf(),
        Deleted: false,
        Projektfarbe: this.Const.NONE,
        Beteiligtenliste: [],
        Bauteilliste: [],
        ProjektIsNew: true,
        ProjektIsReal: true,

        TeamsID:          this.Const.NONE,
        TeamsDescription: this.Const.NONE,
        TeamsName:        this.Const.NONE,

        BaustellenLOPFolderID: this.Const.NONE,
        ProtokolleFolderID:    this.Const.NONE,
        BautagebuchFolderID:   this.Const.NONE,
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'GetEmptyProjekt', this.Debug.Typen.Service);
    }
  }

  GetProjektstatuscolor(Status: string): string {

    try {

      switch (Status) {

        case this.Const.Projektstatusvarianten.Bearbeitung:

          return this.Basics.Farben.Blau;

          break;

        case this.Const.Projektstatusvarianten.Abgeschlossen:

          return this.Basics.Farben.Burnicklgruen;

          break;

        case this.Const.Projektstatusvarianten.Ruht:

          return this.Basics.Farben.Orange;

          break;

      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'GetProjektstatuscolor', this.Debug.Typen.Service);
    }
  }

  public AddProjekt(projekt: Projektestruktur): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Projekt: Projektestruktur;

      return new Promise<any>((resove, reject) => {

        // POST für neuen Eintrag

        Observer = this.http.post(this.ServerUrl, projekt);

        Observer.subscribe({

          next: (result) => {

            debugger;

            Projekt = result.data;

          },
          complete: () => {

            this.UpdateProjektliste(Projekt);
            this.GesamtprojektelisteChanged.emit();

            debugger;

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'AddProjekt', this.Debug.Typen.Service);
    }
  }

  public UpdateProjekt(projekt: Projektestruktur): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams();

      Params.set('id', projekt._id);

      return new Promise<any>((resove, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerUrl, projekt);

        Observer.subscribe({

          next: (ne) => {

          },
          complete: () => {

            this.UpdateProjektliste(projekt);

            this.GesamtprojektelisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'UpdateProjekt', this.Debug.Typen.Service);
    }
  }

  private UpdateProjektliste(projekt: Projektestruktur) {

    try {

      let Index: number;

      Index = lodash.findIndex(this.Gesamtprojektliste, {_id : projekt._id});

      if(Index !== -1) {

        this.Gesamtprojektliste[Index] = projekt;

        this.Debug.ShowMessage('Projektliste updated: ' + projekt.Projektname, 'Database Projekte', 'UpdateProjektliste', this.Debug.Typen.Service);

      }
      else {

        this.Debug.ShowMessage('Projekt nicht gefunden -> neues Projekt hinzufügen', 'Database Projekte', 'UpdateProjektliste', this.Debug.Typen.Service);

        this.Gesamtprojektliste.push(projekt); // neuen
      }

      // Gelöscht markiert Einträge entfernen

      this.Gesamtprojektliste = lodash.filter(this.Gesamtprojektliste, (currentprojekt: Projektestruktur) => {

        return currentprojekt.Deleted === false;
      });

      this.CheckMyProjektdaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'UpdateProjektliste', this.Debug.Typen.Service);
    }
  }

  public DeleteProjekt(): Promise<any> {

    try {

      let Observer: Observable<any>;

      this.CurrentProjekt.Deleted = true;

      return new Promise<any>((resove, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerUrl, this.CurrentProjekt);

        Observer.subscribe({

          next: (ne) => {


          },
          complete: () => {


            this.UpdateProjektliste(this.CurrentProjekt);

            this.GesamtprojektelisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'DeleteProjekt', this.Debug.Typen.Service);
    }
  }


  public SetProjekteliste(idliste: string[]) {

    try {

      let Projekt: Projektestruktur;

      this.Projektliste = [];

      for(let ProjektID of idliste) {

        Projekt = lodash.find(this.Gesamtprojektliste, {_id: ProjektID});

        if(!lodash.isUndefined(Projekt)) this.Projektliste.push(Projekt);
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'SetProjekteliste', this.Debug.Typen.Service);
    }
  }

  InitProjektfavoritenliste() {

    try {

      let Settings: Mitarbeitersettingsstruktur = this.Pool.Mitarbeitersettings;

      if(Settings !== null) {

        if(Settings.FavoritenID === null && this.Pool.Mitarbeiterdaten.Favoritenliste.length > 0) {

          this.CurrentFavorit  = this.Pool.Mitarbeiterdaten.Favoritenliste[0];
          Settings.FavoritenID = this.CurrentFavorit.FavoritenID;
        }

        if(Settings.FavoritenID !== null) {

          this.CurrentFavoritenlisteindex = lodash.findIndex(this.Pool.Mitarbeiterdaten.Favoritenliste, {FavoritenID: Settings.FavoritenID} );

          if(this.CurrentFavoritenlisteindex !== -1) {

            this.CurrentFavorit          = this.Pool.Mitarbeiterdaten.Favoritenliste[this.CurrentFavoritenlisteindex];
            this.Favoritenprojekteanzahl = this.CurrentFavorit.Projekteliste.length;
          }
          else {

            this.CurrentFavoritenlisteindex = 0;
            this.CurrentFavorit             = this.Pool.Mitarbeiterdaten.Favoritenliste[this.CurrentFavoritenlisteindex];
          }

          this.SetProjekteliste(this.CurrentFavorit.Projekteliste);

          this.CurrentFavoritenChanged.emit();

          if(Settings.Favoritprojektindex !== null && Settings.Favoritprojektindex >= 1000) {

            this.CurrentFavoritprojektindex = Settings.Favoritprojektindex;
          }
          else {

              if(Settings.ProjektID !== null) {

                this.CurrentFavoritprojektindex = lodash.findIndex(this.Projektliste, {_id: Settings.ProjektID});

                if(this.CurrentFavoritprojektindex === -1) {

                  this.CurrentFavoritprojektindex = 0;
                  this.CurrentProjekt             = this.Projektliste[this.CurrentFavoritprojektindex];
                }
                else this.CurrentProjekt  = this.Projektliste[this.CurrentFavoritprojektindex];
              }
              else {

                this.CurrentFavoritprojektindex = 0;
                this.CurrentProjekt             = this.Projektliste[this.CurrentFavoritprojektindex];
              }
          }
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'InitFavoritenliste', this.Debug.Typen.Service);
    }
  }

  GetEmptyProjektfavoriten(): Favoritenstruktur {

    try {

      return {

        FavoritenID: null,
        Name: '',
        Projekteliste: []
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'GetEmptyProjektfavoriten', this.Debug.Typen.Service);
    }
  }

  SaveProjektefavoriten( ): Promise<any> {

    try {

      let Index: number;

      return new Promise((resolve, reject) => {

        delete this.Pool.Mitarbeiterdaten.__v;

        if(this.CurrentFavorit.FavoritenID === null) {

          this.CurrentFavorit.FavoritenID = uuidv4();

          this.Pool.Mitarbeiterdaten.Favoritenliste.push(this.CurrentFavorit);
        }
        else {

          Index = lodash.findIndex(this.Pool.Mitarbeiterdaten.Favoritenliste, {FavoritenID: this.CurrentFavorit.FavoritenID});

          if(Index !== -1) {

            this.Pool.Mitarbeiterdaten.Favoritenliste[Index] = this.CurrentFavorit;
          }
        }

        this.MitarbeiterDB.UpdateMitarbeiter(this.Pool.Mitarbeiterdaten).then(() => {

          resolve(true);

        }).catch((error: any) => {

          reject(error);
        });

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'SaveProjektefavoriten', this.Debug.Typen.Service);
    }
  }

  GetProjektfarbeByProjekt(projekt: Projektestruktur): Projektfarbenstruktur {

    try {

      let Farbe = this.GetProjektfarbeByProjektfarbnamen(projekt.Projektfarbe);

      if(this.CheckProjektmembership(projekt)) return Farbe;
      else return {
        Background: "silver",
        Foreground: "black",
        Name: ""
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'GetProjektfarbeByProjekt', this.Debug.Typen.Service);
    }

  }

  GetProjektfarbeByProjektfarbnamen(name: string) {

    try {

      let Farbe: Projektfarbenstruktur = lodash.find(this.Projektfarbenliste, {Name: name});

      if(lodash.isUndefined(Farbe)) {

        Farbe =  {

          Background: this.Basics.Farben.Burnicklgruen,
          Foreground: 'white',
          Name: ''
        };
      }

      return Farbe;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projekte', 'GetProjektfarbeByProjektfarbnamen', this.Debug.Typen.Service);
    }
  }

  public CheckProjektdaten(projekt: Projektestruktur): boolean {

    try {

      let Team: Teamsstruktur;
      let DatenOk: boolean = true;

      // Wenn die Angaben im Projekt fehlen und das Projekt dem Nutzer (Teams) gehört dann Fehler

      if(projekt.Projektnummer === '' || projekt.Projektname === '' || projekt.Projektkurzname === '') {

        Team = lodash.find(this.GraphService.Teamsliste, {id: projekt.TeamsID});

        if (!lodash.isUndefined(Team)) DatenOk = false;
      }

      return DatenOk;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'CheckProjektdaten', this.Debug.Typen.Service);
    }
  }

  public CheckMyProjektdaten(): boolean {

    try {

      let DatenOk: boolean = true;
      let Liste: Projektestruktur[] = lodash.filter(this.Gesamtprojektliste, (projekt: Projektestruktur) => {

        for(let Team of this.GraphService.Teamsliste) {

          if(Team.id === projekt.TeamsID) return true;
        }

        return false;
      });

      Liste.forEach((projekt: Projektestruktur) => {

        if(this.CheckProjektdaten(projekt) === false) DatenOk = false;
      });

      this.GesamtprojektlisteHasDatenerror = !DatenOk;

      return DatenOk;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'CheckMyProjektdaten', this.Debug.Typen.Service);
    }
  }

  async SyncronizeGesamtprojektlisteWithTeams(teamsliste: Teamsstruktur[]): Promise<any> {

    try {

      let Projekt: Projektestruktur;

        for(let Team of teamsliste) {

          Projekt = lodash.find(this.Gesamtprojektliste, { TeamsID : Team.id});

          if(lodash.isUndefined(Projekt)) {

            Projekt = this.GetEmptyProjekt();

            Projekt.TeamsID          = Team.id;
            Projekt.TeamsDescription = Team.description;
            Projekt.TeamsName        = Team.displayName;

            await this.AddProjekt(Projekt);
          }
        }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'SyncronizeGesamtprojektlisteWithTeams', this.Debug.Typen.Service);
    }
  }
}
