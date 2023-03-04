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

export type Kalendertagestruktur = {

    Tagnummer:  number;
    Tag:        string;
    Kalenderwoche: number;
    Hauptmonat: boolean;
    Tagstempel: number;
};



@Component({
  selector:    'projektpunkt-statusdate-picker',
  templateUrl: 'pj-projektpunkt-statusdate-picker.html',
  styleUrls:  ['pj-projektpunkt-statusdate-picker.scss']
})
export class PjProjektpunktStatusdatePickerComponent implements OnInit, OnDestroy {

  @Input() public Status: string;
  @Input() public Datum: Moment;
  @Input() public ShowProtokollpunkte: boolean;

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;
  // @Input() public Pageheader: PageHeaderComponent;

  // @ViewChild('MyAuswahlDialog', { static: false }) MyAuswahlDialog: AuswahlDialogComponent;

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

      this.Status              = this.Const.Projektpunktstatustypen.Offen.Name;
      this.Datum               = moment().locale('de');
      this.ShowProtokollpunkte = true;
      this.Kalendertageliste   = [];
      this.Terminvariante      = this.Terminvarianten.Stichtag;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'LOP Liste Date Status Picker', 'Construktor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.ProjektpunktStatusDatePicker);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'ngOnDestroy', this.Debug.Typen.Component);
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

      this.DBProjektpunkte.CurrentProjektpunkt.EndeKalenderwoche = Datum.isoWeek();

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

      debugger;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'SetKalendertageliste', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.ProjektpunktStatusDatePicker, this.ZIndex);

      if(this.DBProjektpunkte.CurrentProjektpunkt.EndeKalenderwoche === null) {

        this.Terminvariante = this.Terminvarianten.Stichtag;
      }
      else {

        this.Terminvariante = this.Terminvarianten.Kalenderwoche;
      }

      this.SetKalendertageliste();

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'LOP Liste Date Status Picker', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  StatusChangedHandler(event: any) {

    try {


      this.Status = event.detail.value;

      this.DBProjektpunkte.SetStatus(this.DBProjektpunkte.CurrentProjektpunkt, this.Status);

      this.StatusChanged.emit(this.Status);
    }
    catch (error) {


      this.Debug.ShowErrorMessage(error.message,  'LOP Liste Date Status Picker', 'StatusChangedHandler', this.Debug.Typen.Component);
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

      let Stunde: number     = this.Datum.hours();
      let Minute: number     = this.Datum.minutes();

      this.Datum = moment( Tag + '.' + Monat + '.' +  Jahr + ' ' + Stunde + ':' + Minute, 'DD.MM.YYYY HH:mm').locale('de');

      this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstempel   = this.Datum.valueOf();
      this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstring    = this.Datum.format('DD.MM.YYYY');
      this.DBProjektpunkte.CurrentProjektpunkt.EndeKalenderwoche = null;

      this.StichtagChanged.emit(this.Datum);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'DateChangedEvent', this.Debug.Typen.Component);
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

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'GetGeschossliste', this.Debug.Typen.Component);
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

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'GetRaumIDValue', this.Debug.Typen.Component);
    }
  }

  AddFerstlegungskategorieHandler(id: string) {

    try {

      this.AddFerstlegungskategorie.emit(id);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'function', this.Debug.Typen.Page);
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

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'GetWindowWidth', this.Debug.Typen.Component);
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

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'GetWindowHeight', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {

    // this.ResetEditor();

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      switch(this.DBProjektpunkte.CurrentProjektpunkt.Status) {

        case this.Const.Projektpunktstatustypen.Geschlossen.Name:

          this.DBProjektpunkte.CurrentProjektpunkt.Geschlossenzeitstempel = moment().valueOf();

          break;

        case this.Const.Projektpunktstatustypen.Festlegung.Name:

          this.DBProjektpunkte.CurrentProjektpunkt.Geschlossenzeitstempel = null;
          this.DBProjektpunkte.CurrentProjektpunkt.Meilenstein            = false;
          this.DBProjektpunkte.CurrentProjektpunkt.Meilensteinstatus      = 'OFF';

          break;

        default:

          this.DBProjektpunkte.CurrentProjektpunkt.Geschlossenzeitstempel = null;

          break;
      }

      this.DBProjektpunkte.UpdateProjektpunkt(this.DBProjektpunkte.CurrentProjektpunkt).then(() => {

        this.OkClickedEvent.emit();

      }).catch((error: any) => {

        this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'OkButtonClicked', this.Debug.Typen.Component);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  CheckKalenderwoche(kw: number): boolean {

    try {

      let Datum: Moment = moment(this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstempel).locale('de');
      let KW: number = Datum.isoWeek();


      return KW === kw;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'CheckKalenderwoche', this.Debug.Typen.Component);
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

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'TerminStatusChangedHandler', this.Debug.Typen.Component);
    }
  }

  GetEndemonatname(): string {

    try {

      return moment(this.DBProjektpunkte.CurrentProjektpunkt.Endezeitstempel).locale('de').format('MMMM YYYY');

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'GetEndemonatname', this.Debug.Typen.Component);
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

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'KalenderwocheMonatRueckwaerts', this.Debug.Typen.Component);
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

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'KalenderwocheMonatVorwaerts', this.Debug.Typen.Component);
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

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Date Status Picker', 'KalenderwocheClicked', this.Debug.Typen.Component);
    }
  }
}
