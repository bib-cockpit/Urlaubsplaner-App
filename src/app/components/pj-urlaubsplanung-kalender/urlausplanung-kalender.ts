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
import * as lodash from "lodash-es";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";
import {Feiertagestruktur} from "../../dataclasses/feiertagestruktur";
import {Ferienstruktur} from "../../dataclasses/ferienstruktur";
import {DatabaseUrlaubService} from "../../services/database-urlaub/database-urlaub.service";


export type Kalendertagestruktur = {

    Tagnummer:  number;
    Tag:        string;
    Kalenderwoche: number;
    Hauptmonat: boolean;
    Tagstempel: number;
};

@Component({
  selector:    'urlaubsplanung-kalender',
  templateUrl: 'urlausplanung-kalender.html',
  styleUrls:  ['urlausplanung-kalender.scss']
})
export class PjProjektpunktDateKWPickerComponent implements OnInit, OnDestroy {

  @Input() public ShowProtokollpunkte: boolean;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;
  @Input() Monat: string;
  @Input() Jahr: number;
  @Input() Feiertageliste: Feiertagestruktur[];
  @Input() Ferienliste: Ferienstruktur[];

  @Output() FeirtagCrossedEvent      = new EventEmitter<string>();
  @Output() FerientagCrossedEvent    = new EventEmitter<string>();

  public Kalendertageliste: Kalendertagestruktur[][];
  private Monateliste: string[];

  constructor(private Debug: DebugProvider,
              public Basics: BasicsProvider,
              public Pool: DatabasePoolService,
              public Displayservice: DisplayService,
              public DB: DatabaseUrlaubService,
              public Const: ConstProvider) {
    try {

      this.Dialogbreite        = 300;
      this.Dialoghoehe         = 400;
      this.Jahr                = 2023;
      this.Feiertageliste      = [];
      this.ShowProtokollpunkte = true;
      this.Kalendertageliste   = [];
      this.Ferienliste         = [];
      this.Monateliste         = ['Januar', 'Februar', 'März', 'April', 'Mail', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
      this.Monat               = 'Janauar';

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Urlaubsplanung Kalender', 'Construktor', this.Debug.Typen.Component);
    }
  }

  private SetKalendertageliste() {

    try {

      let Datum: Moment             = moment().locale('de');
      let Monat: number             = lodash.indexOf(this.Monateliste, this.Monat);
      let Tageanzahl: number; //        = Datum.daysInMonth();
      let Tagesumme: number         = Tageanzahl;
      let Tagindex: number;
      let Tage: number;
      let Wochenanazahl: number;
      let Monattext: any = Monat + 1;

      if(Monattext < 10 ) Monattext = '0' + Monattext.toString();
      else                Monattext = Monattext.toString();

      Tageanzahl = moment(this.Jahr.toString() + '-' + Monattext , "YYYY-MM").daysInMonth(); // 31
      Tagesumme  = Tageanzahl;

      let MonatStartdatum: Moment   = moment().set({date: 1,          month: Monat, year: this.Jahr, hour: 8, minute: 0}).locale('de');
      let MonatEndedatum: Moment    = moment().set({date: Tageanzahl, month: Monat, year: this.Jahr, hour: 8, minute: 0}).locale('de');

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

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Kalender', 'SetKalendertageliste', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {


      this.SetKalendertageliste();

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Urlaubsplanung Kalender', 'ngOnInit', this.Debug.Typen.Component);
    }
  }



  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.ProjektpunktDateKwPicker);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Kalender', 'ngOnDestroy', this.Debug.Typen.Component);
    }
  }


  CheckIsFeiertag(Tag: Kalendertagestruktur): boolean {

    try {

      let CurrentTag: Moment = moment(Tag.Tagstempel).locale('de');
      let Feiertag: Moment;
      let IsFeiertag: boolean = false;
      let xxxxxx = CurrentTag.format('DD.MM.YYYY');

      for(let Eintrag of this.Feiertageliste) {

        Feiertag = moment(Eintrag.Zeitstempel);
        let yyyy = Feiertag.format('DD.MM.YYYY');

        // debugger;

        if(Feiertag.isSame(CurrentTag, 'day')) {

          IsFeiertag = true;

          break;
        }
      }

      return IsFeiertag;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'CheckIsFeiertag', this.Debug.Typen.Component);
    }
  }

  CheckIsFerientag(Tag: Kalendertagestruktur): boolean {

    try {

      let CurrentTag: Moment = moment(Tag.Tagstempel).locale('de');
      let Starttag: Moment;
      let Endetag: Moment;
      let IsFerientag: boolean = false;

      for(let Eintrag of this.Ferienliste) {

        Starttag = moment(Eintrag.Anfangstempel);
        Endetag  = moment(Eintrag.Endestempel);

        if(CurrentTag.isSameOrAfter(Starttag, 'day') && CurrentTag.isSameOrBefore(Endetag, 'day')) {

          IsFerientag = true;

          break;
        }
      }

      return IsFerientag;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'CheckIsFerientag', this.Debug.Typen.Component);
    }
  }

  FeietragMouseOverEvent(Tag: Kalendertagestruktur) {

    try {

      let Feiertag: Feiertagestruktur = lodash.find(this.Feiertageliste, (feiertag: Feiertagestruktur) => {

        return moment(Tag.Tagstempel).isSame(moment(feiertag.Zeitstempel), 'day');
      });

      debugger;

      if(!lodash.isUndefined(Feiertag)) {

        this.FeirtagCrossedEvent.emit(Feiertag.fname);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'FeietragMouseOverEvent', this.Debug.Typen.Component);
    }
  }

  FerientagMouseOverEvent(Tag: Kalendertagestruktur) {

    try {

      let Ferientag: Ferienstruktur = lodash.find(this.Ferienliste, (ferientag: Ferienstruktur) => {

        return moment(Tag.Tagstempel).isBetween(moment(ferientag.Anfangstempel), moment(ferientag.Endestempel), 'day');
      });

      debugger;

      if(!lodash.isUndefined(Ferientag)) {

        this.FerientagCrossedEvent.emit(Ferientag.name);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'FerientagMouseOverEvent', this.Debug.Typen.Component);
    }
  }

  FeietragMouseLeaveEvent() {

    try {

      this.FeirtagCrossedEvent.emit('');

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'FeietragMouseLeaveEvent', this.Debug.Typen.Component);
    }
  }

  FerientagMouseLeaveEvent() {

    try {

      this.FerientagCrossedEvent.emit('');

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'FerientagMouseLeaveEvent', this.Debug.Typen.Component);
    }
  }
}
