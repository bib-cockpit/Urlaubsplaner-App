import {EventEmitter, Injectable} from '@angular/core';
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {DebugProvider} from "../debug/debug";
import moment, {Moment} from "moment";
import {ConstProvider} from "../const/const";
import {BasicsProvider} from "../basics/basics";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import * as lodash from "lodash-es";
import {Mitarbeitersettingsstruktur} from "../../dataclasses/mitarbeitersettingsstruktur";
import {Favoritenstruktur} from "../../dataclasses/favoritenstruktur";
import { v4 as uuidv4 } from 'uuid';
import {DatabaseMitarbeiterService} from "../database-mitarbeiter/database-mitarbeiter.service";
import {Projektauswahlmenuestruktur} from "../../dataclasses/projektauswahlmenuestruktur";
import {Projektfarbenstruktur} from "../../dataclasses/projektfarbenstruktur";
import {reportUnhandledError} from "rxjs/internal/util/reportUnhandledError";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";

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

  public CurrentFavoritenChanged = new EventEmitter<any>();
  public  FavoritenZeilenanzahl: number;
  public FavoritenSpaltenanzahl: number;
  public  FavoritenCellbreite: number;
  public Projektfarbenliste: Projektfarbenstruktur[];

  constructor(private Debug: DebugProvider,
              private Basics: BasicsProvider,
              private Pool: DatabasePoolService,
              private http: HttpClient,
              private MitarbeiterDB: DatabaseMitarbeiterService,
              private Const: ConstProvider) {
    try {

      this.CurrentProjekt             = null;
      this.CurrentFavorit             = null;
      this.CurrentProjektindex        = null;
      this.CurrentFavoritprojektindex = null;
      this.CurrentFavoritenlisteindex = null;
      this.Projektliste               = [];
      this.Projektauswahlsettings     = [];
      this.FavoritenZeilenanzahl      = 1;
      this.FavoritenSpaltenanzahl     = 0;
      this.FavoritenCellbreite        = 100;
      this.Projektfarbenliste         = [];

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

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'cosntructor', this.Debug.Typen.Service);
    }
  }

  public GetProjektByID(id: string): Projektestruktur {

    try {

      return lodash.find(this.Projektliste, {_id: id});

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'GetProjektByID', this.Debug.Typen.Service);
    }
  }

  public InitMenuProjektauswahl() {

    try {

      let Index: number;
      let Projekt: Projektestruktur;
      let ProjektID: string;
      let Spaltenindexsoll: number;
      let Projekteanzahl: number = 0;
      let Buttonanzahl: number;
      let Farbe: Projektfarbenstruktur;

      this.FavoritenZeilenanzahl     = 1;
      this.FavoritenSpaltenanzahl    = 1;
      this.Projektauswahlsettings    = [];
      this.Projektauswahlsettings[0] = [];

      if(this.Pool.Mitarbeiterdaten !== null &&
        this.Pool.Mitarbeitersettings !== null &&
        !lodash.isUndefined(this.Pool.Mitarbeiterdaten.Favoritenliste[this.CurrentFavoritenlisteindex])) {

        Projekteanzahl  = this.Pool.Mitarbeiterdaten.Favoritenliste[this.CurrentFavoritenlisteindex].Projekteliste.length;
        Buttonanzahl    = Projekteanzahl + 3;

        this.FavoritenSpaltenanzahl = this.Pool.Mitarbeitersettings.HeadermenueMaxFavoriten;
        this.FavoritenZeilenanzahl  = Math.ceil(Buttonanzahl / this.FavoritenSpaltenanzahl);
        this.FavoritenCellbreite    = 100 / this.FavoritenSpaltenanzahl;
        Index                       = 0;

        for(let Zeilenindex = 0; Zeilenindex < this.FavoritenZeilenanzahl; Zeilenindex++) {

          this.Projektauswahlsettings[Zeilenindex] = [];

          if(Zeilenindex === 0) Spaltenindexsoll = 3;
          else                  Spaltenindexsoll = 0;

          for(let Spaltenindex = Spaltenindexsoll; Spaltenindex < this.FavoritenSpaltenanzahl; Spaltenindex++) {

            if(Zeilenindex === 0 && Spaltenindex === 3) Index = 0;

            if(lodash.isUndefined(this.Projektauswahlsettings[Zeilenindex][Spaltenindex])) {

              this.Projektauswahlsettings[Zeilenindex][Spaltenindex] = {

                Index:               Index,
                Projektkuerzel:      "",
                Projektname:         "",
                Projektnummer:       "",
                Projektkey:          "",
                Projektpunkteanzahl: 0,
                Background:          this.Const.NONE,
                Foreground:          this.Const.NONE,
                ShowInLOPListeOnly:  false
              };
            }

            if(lodash.isUndefined(this.Pool.Mitarbeiterdaten.Favoritenliste[this.CurrentFavoritenlisteindex].Projekteliste[Index]) === false) {

              this.Projektauswahlsettings[Zeilenindex][Spaltenindex].Index = Index;

              ProjektID = this.Pool.Mitarbeiterdaten.Favoritenliste[this.CurrentFavoritenlisteindex].Projekteliste[Index];
              Projekt   = <Projektestruktur>lodash.find(this.Pool.Gesamtprojektliste, {_id: ProjektID});

              if(!lodash.isUndefined(Projekt)) {

                this.Projektauswahlsettings[Zeilenindex][Spaltenindex].Projektname    = Projekt.Projektname;
                this.Projektauswahlsettings[Zeilenindex][Spaltenindex].Projektkuerzel = Projekt.Projektkurzname;
                this.Projektauswahlsettings[Zeilenindex][Spaltenindex].Projektnummer  = Projekt.Projektnummer;
                this.Projektauswahlsettings[Zeilenindex][Spaltenindex].Projektkey     = Projekt.Projektkey;

                Farbe = this.GetProjektfarbeByName(Projekt.Projektfarbe);

                this.Projektauswahlsettings[Zeilenindex][Spaltenindex].Background = Farbe.Background;
                this.Projektauswahlsettings[Zeilenindex][Spaltenindex].Foreground = Farbe.Foreground;
              }
            }
            else {

              this.Projektauswahlsettings[Zeilenindex][Spaltenindex] = null;
            }

            Index++;
          }
        }
      }

      /*

      this.Projektauswahlsettings[0][0] = {
        Index:          1000,
        Projektkuerzel: "Favoriten",
        Projektname:    "",
        Projektnummer:  "",
        Projektkey:     "",
        Projektpunkteanzahl: 0,
        Background:          this.Const.NONE,
        Foreground:          this.Const.NONE,
        ShowInLOPListeOnly: false,
      };

       */

      if(Projekteanzahl > 0) {


        this.Projektauswahlsettings[0][0] = {
          Index:          2000,
          Projektkuerzel: "Mein Tag",
          Projektname:    "",
          Projektnummer:  "",
          Projektkey:     "",
          Projektpunkteanzahl: 0,
          Background:          this.Const.NONE,
          Foreground:          this.Const.NONE,
          ShowInLOPListeOnly: true
        };

        this.Projektauswahlsettings[0][1] = {
          Index:          3000,
          Projektkuerzel: "Meine Woche",
          Projektname:    "",
          Projektnummer:  "",
          Projektkey:     "",
          Projektpunkteanzahl: 0,
          Background:          this.Const.NONE,
          Foreground:          this.Const.NONE,
          ShowInLOPListeOnly: true
        };

        this.Projektauswahlsettings[0][2] = {
          Index:          1500,
          Projektkuerzel: "Meilensteine",
          Projektname:    "",
          Projektnummer:  "",
          Projektkey:     "",
          Projektpunkteanzahl: 0,
          Background:          this.Const.NONE,
          Foreground:          this.Const.NONE,
          ShowInLOPListeOnly: true
        };
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'InitProjektauswahl', this.Debug.Typen.Service);
    }
  }


  public GetProjektFarbe(Punkt: Projektpunktestruktur): Projektfarbenstruktur {

    try {

      let Projekt: Projektestruktur = this.GetProjektByID(Punkt.ProjektID);

      if(!lodash.isUndefined(Projekt)) return this.GetProjektfarbeByName(Projekt.Projektfarbe);
      else return {
        Background: "#444444",
        Foreground: "white",
        Name: ""
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'GetProjektFarbe', this.Debug.Typen.Service);
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

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'SetProjektpunkteanzahl', this.Debug.Typen.Service);
    }
  }

  public InitService() {

    try {



    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'InitService', this.Debug.Typen.Service);
    }
  }

  public FinishService() {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'FinishService', this.Debug.Typen.Service);
    }
  }

  public InitGesamtprojekteliste() {

    try {

      for(let Projekt of this.Pool.Gesamtprojektliste) {

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

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'InitGesamtprojekteliste', this.Debug.Typen.Service);
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

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'GenerateProjektkey', this.Debug.Typen.Service);
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
        Projektname: "",
        Projektkurzname: "",
        Projektnummer: "",
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
        Bauteilliste: []
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'GetEmptyProjekt', this.Debug.Typen.Service);
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

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'GetProjektstatuscolor', this.Debug.Typen.Service);
    }
  }

  public AddProjekt(): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Projekt: Projektestruktur;

      return new Promise<any>((resove, reject) => {

        // POST für neuen Eintrag

        Observer = this.http.post(this.ServerUrl, this.CurrentProjekt);

        Observer.subscribe({

          next: (result) => {

            Projekt = result.data;

          },
          complete: () => {

            this.UpdateProjektliste(Projekt);
            this.Pool.GesamtprojektelisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'AddProjekt', this.Debug.Typen.Service);
    }
  }

  public UpdateProjekt(): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Params = new HttpParams();

      Params.set('id', this.CurrentProjekt._id);

      return new Promise<any>((resove, reject) => {

        // PUT für update

        Observer = this.http.put(this.ServerUrl, this.CurrentProjekt);

        Observer.subscribe({

          next: (ne) => {

          },
          complete: () => {

            this.UpdateProjektliste(this.CurrentProjekt);

            this.Pool.GesamtprojektelisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'UpdateProjekt', this.Debug.Typen.Service);
    }
  }

  private UpdateProjektliste(projekt: Projektestruktur) {

    try {

      let Index: number;

      Index = lodash.findIndex(this.Pool.Gesamtprojektliste, {_id : this.CurrentProjekt._id});

      if(Index !== -1) {

        this.Pool.Gesamtprojektliste[Index] = projekt;

        console.log('Projektliste updated: ' + projekt.Projektname);
      }
      else {

        console.log('Projekt nicht gefunden -> neues Projekt hinzufügen');

        this.Pool.Gesamtprojektliste.push(projekt); // neuen
      }

      // Gelöscht markiert Einträge entfernen

      this.Pool.Gesamtprojektliste = lodash.filter(this.Pool.Gesamtprojektliste, (currentprojekt: Projektestruktur) => {

        return currentprojekt.Deleted === false;
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'UpdateProjektliste', this.Debug.Typen.Service);
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

            this.Pool.GesamtprojektelisteChanged.emit();

            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'DeleteProjekt', this.Debug.Typen.Service);
    }
  }


  SetProjekteliste(idliste: string[]) {

    try {

      let Projekt: Projektestruktur;

      this.Projektliste = [];

      for(let ProjektID of idliste) {

        Projekt = lodash.find(this.Pool.Gesamtprojektliste, {_id: ProjektID});

        if(!lodash.isUndefined(Projekt)) this.Projektliste.push(Projekt);
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Pool', 'SetProjekteliste', this.Debug.Typen.Service);
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

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'InitFavoritenliste', this.Debug.Typen.Service);
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

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'GetEmptyProjektfavoriten', this.Debug.Typen.Service);
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

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'SaveProjektefavoriten', this.Debug.Typen.Service);
    }
  }

  GetProjektfarbeByName(name: string) {

    try {

      let Farbe: Projektfarbenstruktur = lodash.find(this.Projektfarbenliste, {Name: name});

      if(lodash.isUndefined(Farbe)) {

        return  {

          Background: this.Basics.Farben.Burnicklgruen,
          Foreground: 'white',
          Name: ''
        };
      }
      else {

        return Farbe;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Projekte', 'function', this.Debug.Typen.Service);
    }
  }
}
