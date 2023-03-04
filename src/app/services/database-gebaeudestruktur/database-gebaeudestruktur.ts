import { Injectable } from '@angular/core';
import {DebugProvider} from '../debug/debug';
import * as MyMoment from "moment";
import {BasicsProvider} from "../basics/basics";
import {ConstProvider} from "../const/const";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {Moment} from "moment";
import * as lodash from "lodash-es";
import {Bauteilstruktur} from "../../dataclasses/bauteilstruktur";
import {Geschossstruktur} from "../../dataclasses/geschossstruktur";
import {Raumstruktur} from "../../dataclasses/raumstruktur";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {DatabaseProjekteService} from "../database-projekte/database-projekte.service";
import {DatabaseMitarbeiterService} from "../database-mitarbeiter/database-mitarbeiter.service";
import { v4 as uuidv4 } from 'uuid';
import {Projektestruktur} from "../../dataclasses/projektestruktur";

@Injectable({
  providedIn: 'root'
})
export class DatabaseGebaeudestrukturService {

  public Modus: string;
  public CurrentBauteilindex: number;
  public CurrentGeschossindex: number;
  public CurrentRaumindex: number;
  public CurrentBauteil: Bauteilstruktur;
  public CurrentGeschoss: Geschossstruktur;
  public CurrentRaum: Raumstruktur;

  public Modusvarianten = {

    NONE:                'NONE',
    Bauteil_Neu:         'Bauteil_Neu',
    Bauteil_Bearbeiten:  'Bauteil_Bearbeiten',
    Geschoss_Neu:        'Geschoss_Neu',
    Geschoss_Bearbeiten: 'Geschoss_Bearebiten',
    Raum_Neu:            'Raum_Neu',
    Raum_Bearbeiten:     'Raum_Bearebiten'
  };

  constructor(private Debug: DebugProvider,
              private Basics: BasicsProvider,
              private Pool: DatabasePoolService,
              public DB: DatabaseProjekteService,
              public DBMitarbeiter: DatabaseMitarbeiterService,
              private Const: ConstProvider) {
    try
    {
      this.Modus                = this.Const.NONE;
      this.CurrentBauteil       = null;
      this.CurrentGeschoss      = null;
      this.CurrentRaum          = null;
      this.CurrentGeschossindex = 0;
      this.CurrentBauteilindex  = 0;
      this.CurrentRaumindex     = 0;
    }
    catch(error)
    {
      this.Debug.ShowErrorMessage(error.message, 'Bauteile', 'constructor', this.Debug.Typen.Service);
    }
  }

  public Init() {

    try {

      if(this.DB.CurrentProjekt !== null) {

        if(!lodash.isUndefined(this.DB.CurrentProjekt.Bauteilliste[0])) {

          this.CurrentBauteilindex = 0;
          this.CurrentBauteil      = this.DB.CurrentProjekt.Bauteilliste[0];

          if(!lodash.isUndefined(this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste[0])) {

            this.CurrentGeschossindex = 0;
            this.CurrentGeschoss      = this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste[this.CurrentGeschossindex];
          }
          else {

            this.CurrentGeschoss      = null;
            this.CurrentGeschossindex = null;
          }
        }
        else {

          this.CurrentBauteilindex = null;
          this.CurrentBauteil      = null;
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteile', 'Init', this.Debug.Typen.Service);
    }
  }

  public GetEmptyRaum(): Raumstruktur {


    let Listenposition;


    if(this.DB.CurrentProjekt !== null) {

       Listenposition = this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste[this.CurrentGeschossindex].Raumliste.length * 10 + 10;

      return {

        RaumID: null,
        DokumentID: this.Const.NONE,
        Raumname: '',
        Raumnummer: '',
        Listenposition: Listenposition,
      };
    }
  }


  public SaveBauteil(): Promise<any> {

    try {

      let Index: number;

      return new Promise<any>((resolve, reject) => {

        if(this.CurrentBauteil.BauteilID === null) {

          this.CurrentBauteil.BauteilID = uuidv4();

          this.DB.CurrentProjekt.Bauteilliste.push(this.CurrentBauteil);
        }
        else {

          Index = lodash.findIndex(this.DB.CurrentProjekt.Bauteilliste, {BauteilID: this.CurrentBauteil.BauteilID});

          if(Index !== -1) {

            this.DB.CurrentProjekt.Bauteilliste[Index] = this.CurrentBauteil;
          }
        }

        this.DB.CurrentProjekt.Bauteilliste.sort((a: Bauteilstruktur, b: Bauteilstruktur) => {

          if (a.Listenposition < b.Listenposition) return -1;
          if (a.Listenposition > b.Listenposition) return 1;
          return 0;
        });

        resolve(true);

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteile', 'SaveBauteil', this.Debug.Typen.Service);
    }
  }

  public SaveGeschoss(): Promise<any> {

    try {

      let Index: number;

      return new Promise<any>((resolve, reject) => {

        if(this.CurrentGeschoss.GeschossID === null) {

          this.CurrentGeschoss.GeschossID = uuidv4();

          this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste.push(this.CurrentGeschoss);
        }
        else {

          Index = lodash.findIndex(this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste, {GeschossID: this.CurrentGeschoss.GeschossID});

          if(Index !== -1) {

            this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste[Index] = this.CurrentGeschoss;
          }
        }

        this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste.sort((a: Geschossstruktur, b: Geschossstruktur) => {

          if (a.Listenposition < b.Listenposition) return -1;
          if (a.Listenposition > b.Listenposition) return 1;
          return 0;
        });

        resolve(true);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteile', 'SaveGeschoss', this.Debug.Typen.Service);
    }
  }

  public SaveRaum(): Promise<any> {

    try {

      let Index: number;

      return new Promise<any>((resolve, reject) => {

        if(this.CurrentRaum.RaumID === null) {

          this.CurrentRaum.RaumID = uuidv4();

          this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste[this.CurrentGeschossindex].Raumliste.push(this.CurrentRaum);
        }
        else {

          Index = lodash.findIndex(this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste[this.CurrentGeschossindex].Raumliste, {RaumID: this.CurrentRaum.RaumID});

          if(Index !== -1) {

            this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste[this.CurrentGeschossindex].Raumliste[Index] = this.CurrentRaum;
          }
        }

        this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste[this.CurrentGeschossindex].Raumliste.sort((a: Raumstruktur, b: Raumstruktur) => {

          if (a.Listenposition < b.Listenposition) return -1;
          if (a.Listenposition > b.Listenposition) return 1;
          return 0;
        });

        resolve(true);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteile', 'SaveRaum', this.Debug.Typen.Service);
    }
  }

  public DeleteRaum(): Promise<any> {

    try {

      let Liste: Raumstruktur[] = this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste[this.CurrentGeschossindex].Raumliste;

      return new Promise((resolve) => {

        Liste = lodash.filter(Liste, (raum: Raumstruktur) => {

          return raum.RaumID !== this.CurrentRaum.RaumID;
        });

        this.CurrentRaum      = null;
        this.CurrentRaumindex = null;

        this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste[this.CurrentGeschossindex].Raumliste = Liste;

        this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste[this.CurrentGeschossindex].Raumliste.sort((a: Raumstruktur, b: Raumstruktur) => {

          if (a.Listenposition < b.Listenposition) return -1;
          if (a.Listenposition > b.Listenposition) return 1;
          return 0;
        });

        resolve(true);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteile', 'DeleteRaum', this.Debug.Typen.Service);
    }
  }

  public DeleteGeschoss(): Promise<any> {

    try {

      let Index: number;

      let Liste: Geschossstruktur[] = this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste;

      return new Promise((resolve) => {

        Liste = lodash.filter(Liste, (geschoss: Geschossstruktur) => {

          return geschoss.GeschossID !== this.CurrentGeschoss.GeschossID;
        });

        if(this.CurrentGeschossindex > Liste.length - 1 && this.CurrentGeschossindex > 0) {

          this.CurrentGeschossindex--;
        }

        if(!lodash.isUndefined(Liste[this.CurrentGeschossindex])) {

          this.CurrentGeschoss = Liste[this.CurrentGeschossindex];
        }
        else {

          this.CurrentGeschossindex = null;
          this.CurrentRaumindex     = null;
          this.CurrentGeschoss      = null;
          this.CurrentRaum          = null;
        }

        this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste = Liste;

        this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste.sort((a: Geschossstruktur, b: Geschossstruktur) => {

          if (a.Listenposition < b.Listenposition) return -1;
          if (a.Listenposition > b.Listenposition) return 1;
          return 0;
        });

        resolve(true);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteile', 'DeleteGeschoss', this.Debug.Typen.Service);
    }
  }

  public GetBauteilnamen(projektpunkt: Projektpunktestruktur) {

    try {

      let Bauteil: Bauteilstruktur;

      Bauteil = <Bauteilstruktur>lodash.find(this.DB.CurrentProjekt.Bauteilliste, { BauteilID: projektpunkt.BauteilID});

      if(lodash.isUndefined(Bauteil) === false) return Bauteil.Bauteilname;
      else return '-unbekannt-';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteile', 'GetBauteilnamen', this.Debug.Typen.Service);
    }
  }

  public GetEmptyGeschoss(): Geschossstruktur {

    let Listenposition = this.DB.CurrentProjekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste.length * 10 + 10;

    return {

      GeschossID:   null,
      Geschossname: '',
      Kurzbezeichnung: '',
      Raumliste: [],
      Listenposition: Listenposition,
    };
  }

  public CheckGeschossHasRaumliste(): boolean {

    try {

      let result: boolean = true;
      let Projekt: Projektestruktur = this.DB.CurrentProjekt;


      if(lodash.isUndefined(Projekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste) ||
          Projekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste.length === 0) {

        result = false;
      }
      else {

        if(lodash.isUndefined(Projekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste[this.CurrentGeschossindex]) ||
            Projekt.Bauteilliste[this.CurrentBauteilindex].Geschossliste[this.CurrentGeschossindex].Raumliste.length === 0) {

         result = false;
        }
      }

      return result;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteile', 'CheckGeschossHasRaumliste', this.Debug.Typen.Service);
    }
  }

  public GetEmptyBauteil(): Bauteilstruktur {

    try {

      let Listenposition = this.DB.CurrentProjekt.Bauteilliste.length * 10 + 10;

      return {

        BauteilID:      null,
        Bauteilname:    '',
        Geschossliste:  [],
        Listenposition: Listenposition,
      };
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Gebauedestruktur', 'GetEmptyGeschoss', this.Debug.Typen.Service);
    }

  }

  GetGeschossnamen(projektpunkt: Projektpunktestruktur): string {

    try {

      let Bauteil: Bauteilstruktur;
      let Geschossliste: Geschossstruktur[];
      let Geschoss: Geschossstruktur;


      if(projektpunkt !== null && projektpunkt.GeschossID !== this.Const.NONE) {

        Bauteil = <Bauteilstruktur>lodash.find(this.DB.CurrentProjekt.Bauteilliste, {BauteilID: projektpunkt.BauteilID});

        if (lodash.isUndefined(Bauteil) === false) {

          Geschossliste = Bauteil.Geschossliste;

          if (Geschossliste.length > 0) {

            Geschoss = <Geschossstruktur>lodash.find(Geschossliste, {GeschossID: projektpunkt.GeschossID});

            if (lodash.isUndefined(Geschoss) === false) {

              return Geschoss.Geschossname;
            }
          }
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteile', 'function', this.Debug.Typen.Service);
    }
  }


  GetRaumliste(projektpunkt: Projektpunktestruktur): Raumstruktur[] {

    try {

      let Bauteil: Bauteilstruktur;
      let Geschossliste: Geschossstruktur[];
      let Geschoss: Geschossstruktur;


      if(projektpunkt !== null) {

        Bauteil = <Bauteilstruktur>lodash.find(this.DB.CurrentProjekt.Bauteilliste, { BauteilID: projektpunkt.BauteilID});

        if(lodash.isUndefined(Bauteil) === false) {

          Geschossliste = Bauteil.Geschossliste;

          if(Geschossliste.length > 0) {

            Geschoss = <Geschossstruktur>lodash.find(Geschossliste, { GeschossID: projektpunkt.GeschossID});

            if(lodash.isUndefined(Geschoss) === false) {

              return Geschoss.Raumliste;
            }
            else {

              return [];
            }
          }
          else {

            return [];
          }
        }
        else {

          return [];
        }
      }
      else {

        return [];
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteile', 'GetRaumliste', this.Debug.Typen.Service);
    }
  }

  GetRaumnamen(projektpunkt: Projektpunktestruktur): string {

    try {

      let Raumliste: Raumstruktur[] = this.GetRaumliste(projektpunkt);
      let Raum: Raumstruktur;

      if(lodash.isUndefined(Raumliste) === false) {

        Raum = <Raumstruktur>lodash.find(Raumliste, {RaumID: projektpunkt.RaumID});

        if(lodash.isUndefined(Raum) === false) {

          if(Raum.Raumnummer !== '') return Raum.Raumnummer + ' ' + Raum.Raumname;
          else                       return Raum.Raumname;
        }
        else {

          return '-Unbekannt-';
        }
      }
      else {

        return '-Unbekannt-';
      }

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteile', 'GetRaumnamen', this.Debug.Typen.Service);
    }
  }


  GetGeschossliste(projektpunkt: Projektpunktestruktur): Geschossstruktur[] {

    try {


      let Bauteil: Bauteilstruktur;

      if(projektpunkt !== null) {

        Bauteil = <Bauteilstruktur>lodash.find(this.DB.CurrentProjekt.Bauteilliste, { BauteilID: projektpunkt.BauteilID});

        if(lodash.isUndefined(Bauteil) === false) {

          return Bauteil.Geschossliste;
        }
        else {

          return [];
        }
      }
      else {

        return [];
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteile', 'GetGeschossliste', this.Debug.Typen.Service);
    }
  }

  GetGebaeudeteilname(projekt: Projektestruktur, projektpunkt: Projektpunktestruktur): string {

    try {

      let Bauteil: Bauteilstruktur;
      let Raum: Raumstruktur;
      let Geschoss: Geschossstruktur;
      let Bauteilindex: number;
      let Geschossindex: number;
      let Text: string = 'Gesamtes Gebäude';

      if(projektpunkt.BauteilID !== null) {

        Bauteil = lodash.find(projekt.Bauteilliste, {BauteilID: projektpunkt.BauteilID});

        if(!lodash.isUndefined(Bauteil)) {

          Bauteilindex = lodash.findIndex(projekt.Bauteilliste, {BauteilID: projektpunkt.BauteilID});
          Text         = Bauteil.Bauteilname;

          if(projektpunkt.GeschossID !== null) {

            Geschoss = lodash.find(Bauteil.Geschossliste, {GeschossID: projektpunkt.GeschossID});

            if(!lodash.isUndefined(Geschoss)) {

              Geschossindex = lodash.findIndex(Bauteil.Geschossliste, {GeschossID: projektpunkt.GeschossID});
              Text          = Geschoss.Geschossname + ' (' + Geschoss.Kurzbezeichnung + ')';

              if(projektpunkt.RaumID !== null) {

                Raum = lodash.find(Geschoss.Raumliste, {RaumID: projektpunkt.RaumID});

                if(!lodash.isUndefined(Raum)) {

                  Text = Raum.Raumnummer + ' ' + Raum.Raumname;
                }
                else Text = 'Raum nicht gefunden';
              }
            }
            else Text = 'Geschoss nicht gefunden';
          }
        }
        else Text = 'Bauteil nicht gefunden';
      }

      return Text;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'GetGebaeudeteilname', this.Debug.Typen.Component);
    }
  }

}
