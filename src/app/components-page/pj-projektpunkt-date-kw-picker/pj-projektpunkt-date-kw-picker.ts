import {Component, Input, Output, OnInit, EventEmitter, OnDestroy} from '@angular/core';
import {Moment} from "moment";
import moment from "moment";
import {FormBuilder } from "@angular/forms";
import {DebugProvider} from "../../services/debug/debug";
import {BasicsProvider} from "../../services/basics/basics";
import {ConstProvider} from "../../services/const/const";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {DatabaseProjektpunkteService} from "../../services/database-projektpunkte/database-projektpunkte.service";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {Geschossstruktur} from "../../dataclasses/geschossstruktur";
import {DisplayService} from "../../services/diplay/display.service";
import 'moment-duration-format';
import {Kalendertagestruktur} from "../../dataclasses/kalendertagestruktur";

@Component({
  selector:    'projektpunkt-date-kw-picker',
  templateUrl: 'pj-projektpunkt-date-kw-picker.html',
  styleUrls:  ['pj-projektpunkt-date-kw-picker.scss']
})
export class PjProjektpunktDateKWPickerComponent implements OnInit, OnDestroy {

  @Input() public ShowProtokollpunkte: boolean;
  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;
  @Input() ShowTerminvarianteAuswahl: boolean;
  @Input() DoUpdateProjektpunkt: boolean;

  @Output() StatusChanged            = new EventEmitter<string>();
  @Output() FertigClicked            = new EventEmitter<any>();
  @Output() AddFerstlegungskategorie = new EventEmitter<string>();
  @Output() StichtagChanged          = new EventEmitter<Moment>();
  @Output() KalenderwocheChanged     = new EventEmitter<number>();
  @Output() CancelClickedEvent       = new EventEmitter<any>();
  @Output() OkClickedEvent           = new EventEmitter<any>();


  public Kalendertageliste: Kalendertagestruktur[][];
  public Terminvariante: string;
  public Terminvarianten = {

    Stichtag: 'Stichtag',
    Kalenderwoche: 'Kalenderwoche'
  };

  constructor(private Debug: DebugProvider,
              public Basics: BasicsProvider,
              public Pool: DatabasePoolService,
              public fb: FormBuilder,
              public Displayservice: DisplayService,
              public DBProjektpunkte: DatabaseProjektpunkteService,
              public DBProjekte: DatabaseProjekteService,
              public Const: ConstProvider) {
    try {

      this.ShowProtokollpunkte       = true;
      this.Kalendertageliste         = [];
      this.ShowTerminvarianteAuswahl = true;
      this.Terminvariante            = this.Terminvarianten.Stichtag;
      this.DoUpdateProjektpunkt      = true;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'LOP Liste Date KW Picker', 'Construktor', this.Debug.Typen.Component);
    }
  }

  private SetKalendertageliste() {

    try {

      let Datum: Moment             = moment(this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstempel).locale('de');
      let Monat: number             = Datum.month();
      let Jahr: number              = Datum.year();
      let Tageanzahl: number        = Datum.daysInMonth();
      let Tagesumme: number         = Tageanzahl;
      let Tagindex: number;
      let Tage: number;
      let Wochenanazahl: number;

      // this.DBProjektpunkte.CurrentProjektpunkt.EndeKalenderwoche = Datum.isoWeek();

      let MonatStartdatum: Moment   = moment().set({date: 1,          month: Monat, year: Jahr, hour: 8, minute: 0}).locale('de');
      let MonatEndedatum: Moment    = moment().set({date: Tageanzahl, month: Monat, year: Jahr, hour: 8, minute: 0}).locale('de');

      Tagindex  = MonatStartdatum.isoWeekday();
      Tage      = Tagindex - 1;
      Tagesumme = Tagesumme + Tage;

      let Startdatum: Moment  = MonatStartdatum.clone().subtract(Tage, 'day');
      let Tag: Moment         = Startdatum.clone();

      Tagindex      = MonatEndedatum.isoWeekday();
      Tage          = 7 - Tagindex;
      Tagesumme     = Tagesumme + Tage;
      Wochenanazahl = Tagesumme / 7;

      // let Endedatum: Moment =  MonatEndedatum.add(Tage, 'day');

      this.Kalendertageliste = [];

      for(let wochenindex = 0; wochenindex < Wochenanazahl; wochenindex++) {

        this.Kalendertageliste[wochenindex] = [];

        for(let tagindex = 0; tagindex < 7; tagindex++) {

          this.Kalendertageliste[wochenindex].push({

            Tagnummer:  Tag.date(),
            Tag:        Tag.format('dddd'),
            Hauptmonat: Tag.isSameOrAfter(MonatStartdatum, 'day') && Tag.isSameOrBefore(MonatEndedatum, 'day'),
            Kalenderwoche: Tag.isoWeek(),
            Tagstempel: Tag.valueOf()
          });

          Tag.add(1, 'day');
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'SetKalendertageliste', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.ProjektpunktDateKwPicker, this.ZIndex);

      if(this.DBProjektpunkte.CurrentProjektpunkt.EndeKalenderwoche === null) {

        this.Terminvariante = this.Terminvarianten.Stichtag;
      }
      else {

        this.Terminvariante = this.Terminvarianten.Kalenderwoche;
      }

      this.SetKalendertageliste();

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'LOP Liste Date KW Picker', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  StichtagChangedEvent(event: any) {

    try {

      let Resultstring: string = event.detail.value;
      let Parts: string[]      = Resultstring.split('T');
      let Datestring: string   = Parts[0];
      let Werte: string[]      = Datestring.split('-');

      let Tag: number        = parseInt(Werte[2]);
      let Monat: number      = parseInt(Werte[1]);
      let Jahr: number       = parseInt(Werte[0]);

      let Stunde: number     = 8; // this.Datum.hours();
      let Minute: number     = 0; // this.Datum.minutes();

      let Datum = moment( Tag + '.' + Monat + '.' +  Jahr + ' ' + Stunde + ':' + Minute, 'DD.MM.YYYY HH:mm').locale('de');

      this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstempel   = Datum.valueOf();
      this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstring    = Datum.format('DD.MM.YYYY');
      this.DBProjektpunkte.CurrentProjektpunkt.EndeKalenderwoche = null;

      this.StichtagChanged.emit(Datum);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'StichtagChangedEvent', this.Debug.Typen.Component);
    }
  }


  GetGeschossliste(projektpunkt: Projektpunktestruktur): Geschossstruktur[] {

    try {

      return [];

      /*

      let Bauteil: Bauteilstruktur;

      if(projektpunkt !== null) {

        Bauteil = lodash.find(this.Pool.Bauteilstrukturliste[this.Projektservice.Projektindex], { BauteilID: projektpunkt.BauteilID});

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

       */

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'GetGeschossliste', this.Debug.Typen.Component);
    }
  }


  GetRaumIDValue(RaumID: string): string {

    try {

      switch (RaumID) {

        case this.Const.NONE:

          return this.Const.NONE;

          break;

        case 'All':

          return 'All';

          break;

        default:

          return 'Raum';

          break;

      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'GetRaumIDValue', this.Debug.Typen.Component);
    }
  }

  AddFerstlegungskategorieHandler(id: string) {

    try {

      this.AddFerstlegungskategorie.emit(id);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'function', this.Debug.Typen.Page);
    }
  }

  GetWindowWidth(): number {

    try {

      if(this.DBProjektpunkte.CurrentProjektpunkt !== null) {

        if (this.DBProjektpunkte.CurrentProjektpunkt.Status !== this.Const.Projektpunktstatustypen.Festlegung.Name) {

          return 370;
        }
        else {

          if(this.DBProjekte.CurrentProjekt !== null) {

            if(this.DBProjekte.CurrentProjekt.Bauteilliste.length > 0) {

              return 960;
            }
            else {

              return 740;
            }
          }
        }
      }
      else {

        return 0;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'GetWindowWidth', this.Debug.Typen.Component);
    }
  }

  GetWindowHeight(): number {

    try {

      let Hoehe: number = this.Basics.Contenthoehe;
      let Footerhoehe: number = 62;
      let Headerhoehe: number;
      let Topspace: number =    20;
      let Bottomspace: number = 20;

      return 0;

      /*
      if(lodash.isUndefined(this.Pageheader) === false && this.Pageheader !== null) {

        Headerhoehe = this.Pageheader.PageHeaderframeDiv.nativeElement.clientHeight;
      }
      else Headerhoehe = 8; // Small Header

      return Hoehe - Footerhoehe - Headerhoehe - Topspace - Bottomspace;


       */

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'GetWindowHeight', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {

    // this.ResetEditor();

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      this.Debug.ShowMessage('Ok  Button CLicked', 'LOP Liste Date KW Picker', 'OkButtonClicked', this.Debug.Typen.Component);

      if(this.DoUpdateProjektpunkt) {

        if(this.DBProjektpunkte.CurrentProjektpunkt._id !== null && this.DBProjektpunkte.CurrentProjektpunkt.Aufgabe !== '') {

          this.DBProjektpunkte.UpdateProjektpunkt(this.DBProjektpunkte.CurrentProjektpunkt, true).then(() => {


            this.OkClickedEvent.emit();

          }).catch((error: any) => {

            this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'function', this.Debug.Typen.Component);
          });
        }
        else {

          this.OkClickedEvent.emit();
        }
      }
      else {

        this.OkClickedEvent.emit();
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'function', this.Debug.Typen.Component);
    }

  }

  CheckKalenderwoche(kw: number): boolean {

    try {

      let Datum: Moment = moment(this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstempel).locale('de');
      let KW: number = Datum.isoWeek();


      return KW === kw;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'CheckKalenderwoche', this.Debug.Typen.Component);
    }
  }

  TerminStatusChangedHandler(event: any) {

    try {

      let Datum: Moment = moment(this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstempel).locale('de');

      this.Terminvariante = event.detail.value;

      if(this.Terminvariante === this.Terminvarianten.Stichtag) {

        this.DBProjektpunkte.CurrentProjektpunkt.EndeKalenderwoche = null;
      }
      else {

        this.DBProjektpunkte.CurrentProjektpunkt.EndeKalenderwoche = Datum.isoWeek();
      }



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'TerminStatusChangedHandler', this.Debug.Typen.Component);
    }
  }

  GetEndemonatname(): string {

    try {

      return moment(this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstempel).locale('de').format('MMMM YYYY');

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'GetEndemonatname', this.Debug.Typen.Component);
    }
  }



  public KalenderwocheMonatRueckwaerts() {

    try {

      let Datum: Moment      = moment(this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstempel).locale('de');
      let Startdatum: Moment = moment(this.DBProjektpunkte.CurrentProjektpunkt.Startzeitsptempel).locale('de');

      Datum.subtract(1, 'month');

      if(Datum.isBefore(Startdatum, 'day')) Datum = Startdatum.clone().add(1, 'week');

      this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstempel   = Datum.valueOf();
      this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstring    = Datum.format('DD.MM.YYYY');
      this.DBProjektpunkte.CurrentProjektpunkt.EndeKalenderwoche = Datum.isoWeek();

      this.SetKalendertageliste();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'KalenderwocheMonatRueckwaerts', this.Debug.Typen.Component);
    }
  }

  public KalenderwocheMonatVorwaerts() {

    try {

      let Datum: Moment = moment(this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstempel).locale('de');

      Datum.add(1, 'month');

      this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstempel   = Datum.valueOf();
      this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstring    = Datum.format('DD.MM.YYYY');
      this.DBProjektpunkte.CurrentProjektpunkt.EndeKalenderwoche = Datum.isoWeek();

      this.SetKalendertageliste();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'KalenderwocheMonatVorwaerts', this.Debug.Typen.Component);
    }
  }

  KalenderwocheClicked($event: MouseEvent, kalendertag: Kalendertagestruktur) {

    try {

      let Datum = moment(kalendertag.Tagstempel).locale('de');
      let Startdatum: Moment = moment(this.DBProjektpunkte.CurrentProjektpunkt.Startzeitsptempel).locale('de');

      if(Datum.isBefore(Startdatum)) Datum = Startdatum.clone().add(1, 'week');

      this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstempel   = Datum.valueOf();
      this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstring    = Datum.format('DD.MM.YYYY');
      this.DBProjektpunkte.CurrentProjektpunkt.EndeKalenderwoche = Datum.isoWeek();

      this.SetKalendertageliste();

      this.KalenderwocheChanged.emit(this.DBProjektpunkte.CurrentProjektpunkt.EndeKalenderwoche);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'KalenderwocheClicked', this.Debug.Typen.Component);
    }
  }


  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.ProjektpunktDateKwPicker);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'ngOnDestroy', this.Debug.Typen.Component);
    }
  }

  GetDatum() {

    try {

      let Datum = moment(this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstempel);

      return Datum.format('YYYY-MM-DD');

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date KW Picker', 'GetDatum', this.Debug.Typen.Component);
    }
  }
}
