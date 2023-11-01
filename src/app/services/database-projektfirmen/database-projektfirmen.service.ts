import {EventEmitter, Injectable, Output} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {ConstProvider} from "../const/const";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {Projektfirmenstruktur} from "../../dataclasses/projektfirmenstruktur";
import {Projektbeteiligtetypenstruktur} from "../../dataclasses/projektbeteiligtetypenstruktur";
import {Fachfirmenypenstruktur} from "../../dataclasses/fachfirmenypenstruktur";

@Injectable({
  providedIn: 'root'
})
export class DatabaseProjektfirmenService {

  public Beteiligtentypenliste: Projektbeteiligtetypenstruktur[];
  public CurrentFirma: Projektfirmenstruktur;
  public FirmenlisteChanged: EventEmitter<any> = new EventEmitter();

  constructor(private Debug: DebugProvider,
              private Const: ConstProvider,
              private Pool: DatabasePoolService) {

    try {

      let Eintrag: Projektbeteiligtetypenstruktur;

      this.CurrentFirma          = null;
      this.Beteiligtentypenliste = [];

      for(const key of Object.keys(this.Const.Beteiligtentypen)) {

        Eintrag = this.Const.Beteiligtentypen[key];

        this.Beteiligtentypenliste.push(Eintrag);
      }

      this.Beteiligtentypenliste.sort( (a: Projektbeteiligtetypenstruktur, b: Projektbeteiligtetypenstruktur) => {

        if (a.Name < b.Name) return -1;
        if (a.Name > b.Name) return 1;

        return 0;
      });

      /*

      this.Fachfirmentypenliste = [];

      for(const key of Object.keys(this.Const.Fachfirmentypen)) {

        Eintrag = this.Const.Fachfirmentypen[key];

        this.Fachfirmentypenliste.push(Eintrag);
      }

      this.Fachfirmentypenliste.sort( (a: Fachfirmenypenstruktur, b: Fachfirmenypenstruktur) => {

        if (a.Name < b.Name) return -1;
        if (a.Name > b.Name) return 1;

        return 0;
      });

       */


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projektfirmen', 'constructor', this.Debug.Typen.Service);
    }
  }

  GetEmptyProjektfirma(): Projektfirmenstruktur {

    try {

      return {
        Email: "",
        Fachfirmentyp: 0,
        Firma: "",
        FirmenID: null,
        Kuerzel: "",
        Mobil: "",
        Ort: "",
        PLZ: "",
        Strasse: "",
        Telefon: "",
        Verfasser: {
          Email:   this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Email :  this.Const.NONE,
          Name:    this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Name:    this.Const.NONE,
          Vorname: this.Pool.Mitarbeiterdaten !== null ? this.Pool.Mitarbeiterdaten.Vorname: this.Const.NONE
        },
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projektfirmen', 'GetEmptyProjektbeteiligte', this.Debug.Typen.Service);
    }
  }


  GetFirmaFachbereichname(typnummer: number): string {

    try {

      let Typ = lodash.find(this.Beteiligtentypenliste, {Typnummer: typnummer });

      if(lodash.isUndefined(Typ) === false) return Typ.Name;
      else return 'Unbekannt';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Projektfirmen', 'GetFirmaFachbereichname', this.Debug.Typen.Service);
    }
  }
}
