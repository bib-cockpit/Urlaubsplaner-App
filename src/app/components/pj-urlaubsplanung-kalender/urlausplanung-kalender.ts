import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import {Moment} from "moment";
import moment from "moment";
import {DebugProvider} from "../../services/debug/debug";
import {BasicsProvider} from "../../services/basics/basics";
import {ConstProvider} from "../../services/const/const";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DisplayService} from "../../services/diplay/display.service";
import 'moment-duration-format';
import * as lodash from "lodash-es";
import {Feiertagestruktur} from "../../dataclasses/feiertagestruktur";
import {Ferienstruktur} from "../../dataclasses/ferienstruktur";
import {DatabaseUrlaubService} from "../../services/database-urlaub/database-urlaub.service";
import {Urlauzeitspannenstruktur} from "../../dataclasses/urlauzeitspannenstruktur";
import {Kalendertagestruktur} from "../../dataclasses/kalendertagestruktur";
import {Subscription} from "rxjs";
import {ToolsProvider} from "../../services/tools/tools";

@Component({
  selector: 'urlaubsplanung-kalender',
  templateUrl: 'urlausplanung-kalender.html',
  styleUrls: ['urlausplanung-kalender.scss']
})
export class PjProjektpunktDateKWPickerComponent implements OnInit, OnDestroy, OnChanges {

  @Input() public ShowProtokollpunkte: boolean;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;
  @Input() Monatindex: number;
  @Input() Jahr: number;
  @Input() AddUrlaubRunning: boolean;

  @Output() FeiertagCrossedEvent  = new EventEmitter<string>();
  @Output() FerientagCrossedEvent = new EventEmitter<string>();
  @Output() AddUrlaubFinished = new EventEmitter<string>();

  public Kalendertageliste: Kalendertagestruktur[][];
  public KalendertageExternliste: Kalendertagestruktur[][][];
  private DataSubscription: Subscription;
  private MitarbeiterSubscription: Subscription;
  private MonateSubscription: Subscription;
  public Monatname: string;

  constructor(private Debug: DebugProvider,
              public Basics: BasicsProvider,
              public Pool: DatabasePoolService,
              public Displayservice: DisplayService,
              public DB: DatabaseUrlaubService,
              private Tools: ToolsProvider,
              public Const: ConstProvider) {
    try {

      this.Dialogbreite = 300;
      this.Dialoghoehe = 400;
      this.Jahr = 2023;
      this.ShowProtokollpunkte = true;
      this.Kalendertageliste = [];
      this.KalendertageExternliste = [];
      this.Monatname = 'none';
      this.AddUrlaubRunning = false;
      this.Monatindex = 0;
      this.Monatname = this.DB.Monateliste[this.Monatindex];

      this.DataSubscription = null;
      this.MitarbeiterSubscription = null;
      this.MonateSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Kalender', 'Construktor', this.Debug.Typen.Component);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    try {

      let Monatindexvalue: SimpleChange = changes.Monatindex;

      if(!lodash.isUndefined(Monatindexvalue)) {

        this.PrepareData();
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'file', 'function', this.Debug.Typen.Page);
    }

    }

  private PrepareData() {

    try {

      let Tageanzahl: number;
      let Tagesumme: number;
      let Tagindex: number;
      let Tage: number;
      let Wochenanazahl: number;
      let Monattext: any = this.Monatindex + 1;
      let Tag: Kalendertagestruktur;
      let Startdatum: Moment;
      let Endedatum: Moment;
      let Datum: Moment;
      let Mitarbeiterindex: number;

      this.Monatname = this.DB.Monateliste[this.Monatindex];

      if(Monattext < 10 ) Monattext = '0' + Monattext.toString();
      else                Monattext = Monattext.toString();

      Tageanzahl = moment(this.Jahr.toString() + '-' + Monattext , "YYYY-MM").daysInMonth(); // 31
      Tagesumme  = Tageanzahl;

      let MonatStartdatum: Moment   = moment().set({date: 1,          month: this.Monatindex, year: this.Jahr, hour: 8, minute: 0}).locale('de');
      let MonatEndedatum: Moment    = moment().set({date: Tageanzahl, month: this.Monatindex, year: this.Jahr, hour: 8, minute: 0}).locale('de');

      Tagindex  = MonatStartdatum.isoWeekday();
      Tage      = Tagindex - 1;
      Tagesumme = Tagesumme + Tage;

      Startdatum  = MonatStartdatum.clone().subtract(Tage, 'day');
      Datum       = Startdatum.clone();

      Tagindex      = MonatEndedatum.isoWeekday();
      Tage          = 7 - Tagindex;
      Tagesumme     = Tagesumme + Tage;
      Wochenanazahl = Tagesumme / 7;

      this.Kalendertageliste = [];

      for(let wochenindex = 0; wochenindex < Wochenanazahl; wochenindex++) {

        this.Kalendertageliste[wochenindex] = [];

        for(let tagindex = 0; tagindex < 7; tagindex++) {

          Tag = {

            Tagnummer:  Datum.date(),
            Tag:        Datum.format('dddd'),
            Datumstring: Datum.format('DD.MM.YYYY'),
            Hauptmonat: Datum.isSameOrAfter(MonatStartdatum, 'day') && Datum.isSameOrBefore(MonatEndedatum, 'day'),
            Kalenderwoche: Datum.isoWeek(),
            Tagstempel: Datum.valueOf(),
            Datum:      Datum,
          };

          // Feiertag eintragen

          Tag.IsFeiertag  = this.DB.CheckIsFeiertag(Tag, this.DB.Laendercode);

          if(Tag.IsFeiertag) {

            Tag.Feiertagname = this.DB.GetFeiertag(Tag, this.DB.Laendercode).Name;

          } else Tag.Feiertagname = '';

          // Ferientage eintragen

          Tag.IsFerientag = this.DB.CheckIsFerientag(Tag, this.DB.Laendercode);

          if(Tag.IsFerientag) {

            Tag.Ferienname = this.DB.GetFerientag(Tag, this.DB.Laendercode).Ferienname;

          } else Tag.Ferienname = '';

          // Urlaube eintragen

          Tag.Background = 'white';
          Tag.Color      = 'black';
          Tag.IsUrlaub   = false;

          if(this.DB.CurrentUrlaub !== null) {

            for(let Zeitspanne of this.DB.CurrentUrlaub.Zeitspannen) {

              Startdatum = moment(Zeitspanne.Startstempel);
              Endedatum  = moment(Zeitspanne.Endestempel);

              if(Datum.isSameOrAfter(Startdatum, 'day') === true &&
                Datum.isSameOrBefore(Endedatum, 'day') === true &&
                this.DB.CheckIsFeiertag(Tag, this.DB.Laendercode) === false) {

                Tag.IsUrlaub = true;

                switch (Zeitspanne.Status) {

                  case this.DB.Urlaubstatusvarianten.Beantragt:

                    Tag.Background = this.DB.Urlaubsfaben.Beantrag;

                    break;

                  case this.DB.Urlaubstatusvarianten.Vertreterfreigabe:

                    Tag.Background = this.DB.Urlaubsfaben.Vertreterfreigabe;

                    break;

                  case this.DB.Urlaubstatusvarianten.Genehmigt:

                    Tag.Background = this.DB.Urlaubsfaben.Genehmigt;

                    break;

                  case this.DB.Urlaubstatusvarianten.Abgelehnt:

                    Tag.Background = this.DB.Urlaubsfaben.Abgelehnt;

                    break;
                }

                Tag.Color = 'white';

                break;
              }
            }
          }

          this.Kalendertageliste[wochenindex].push(Tag);

          Datum.add(1, 'day');
        }
      }

      // Externe Urlaube

      Tageanzahl = moment(this.Jahr.toString() + '-' + Monattext , "YYYY-MM").daysInMonth(); // 31
      Tagesumme  = Tageanzahl;

      Tagindex  = MonatStartdatum.isoWeekday();
      Tage      = Tagindex - 1;
      Tagesumme = Tagesumme + Tage;

      Startdatum  = MonatStartdatum.clone().subtract(Tage, 'day');
      Datum       = Startdatum.clone();

      Tagindex      = MonatEndedatum.isoWeekday();
      Tage          = 7 - Tagindex;
      Tagesumme     = Tagesumme + Tage;
      Wochenanazahl = Tagesumme / 7;

      this.KalendertageExternliste = [];

      Mitarbeiterindex = 0;

      for(let i = 0; i < this.DB.UrlaublisteExtern.length; i++) {

        if(this.DB.UrlaublisteExtern[i].DisplayExtern) {

          this.KalendertageExternliste[Mitarbeiterindex] = [];

          for(let wochenindex = 0; wochenindex < Wochenanazahl; wochenindex++) {

            this.KalendertageExternliste[Mitarbeiterindex][wochenindex] = [];

            for(let tagindex = 0; tagindex < 7; tagindex++) {

              Tag = {

                Kuerzel: this.DB.UrlaublisteExtern[i].NameKuerzel,
                Tagnummer:   Datum.date(),
                Tag: Datum.format('dddd'),
                Datumstring: Datum.format('DD.MM.YYYY'),
                Hauptmonat: Datum.isSameOrAfter(MonatStartdatum, 'day') && Datum.isSameOrBefore(MonatEndedatum, 'day'),
                Kalenderwoche: Datum.isoWeek(),
                Tagstempel: Datum.valueOf(),
                Datum: Datum,
              };

              for(let Zeitspanne of this.DB.CurrentUrlaub.Zeitspannen) {

                Startdatum = moment(Zeitspanne.Startstempel);
                Endedatum  = moment(Zeitspanne.Endestempel);

                if(Datum.isSameOrAfter(Startdatum, 'day') === true &&
                  Datum.isSameOrBefore(Endedatum, 'day') === true &&
                  this.DB.CheckIsFeiertag(Tag, this.DB.Laendercode) === false) {

                  Tag.IsUrlaub = true;

                  switch (Zeitspanne.Status) {

                    case this.DB.Urlaubstatusvarianten.Beantragt:

                      Tag.Background = this.DB.Urlaubsfaben.Beantrag;

                      break;

                    case this.DB.Urlaubstatusvarianten.Vertreterfreigabe:

                      Tag.Background = this.DB.Urlaubsfaben.Vertreterfreigabe;

                      break;

                    case this.DB.Urlaubstatusvarianten.Genehmigt:

                      Tag.Background = this.DB.Urlaubsfaben.Genehmigt;

                      break;

                    case this.DB.Urlaubstatusvarianten.Abgelehnt:

                      Tag.Background = this.DB.Urlaubsfaben.Abgelehnt;

                      break;
                  }

                  Tag.Color = 'white';

                  break;
                }
              }

              this.KalendertageExternliste[Mitarbeiterindex][wochenindex].push(Tag);

              Datum.add(1, 'day');
            }
          }

          Mitarbeiterindex++;
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Kalender', 'PrepareData', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.DataSubscription = this.Pool.LoadingAllDataFinished.subscribe(() => {

        this.PrepareData();
      });

      this.MitarbeiterSubscription = this.Pool.MitarbeiterdatenChanged.subscribe(() => {

        // this.PrepareData();
      });

      this.MonateSubscription = this.DB.PlanungsmonateChanged.subscribe(() => {

        this.PrepareData();
      });

      // this.PrepareData();

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Urlaubsplanung Kalender', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.ProjektpunktDateKwPicker);

      this.DataSubscription.unsubscribe();
      this.DataSubscription = null;

      this.MitarbeiterSubscription.unsubscribe();
      this.MitarbeiterSubscription = null;

      this.MonateSubscription.unsubscribe();
      this.MonateSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Kalender', 'ngOnDestroy', this.Debug.Typen.Component);
    }
  }

  FeietragMouseOverEvent(Tag: Kalendertagestruktur) {

    try {

      let Feiertag: Feiertagestruktur = lodash.find(this.DB.Feiertageliste[this.DB.Laendercode], (feiertag: Feiertagestruktur) => {

        return moment(Tag.Tagstempel).isSame(moment(feiertag.Anfangstempel), 'day');
      });

      if(!lodash.isUndefined(Feiertag)) {

        this.FeiertagCrossedEvent.emit(Feiertag.Name);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'FeietragMouseOverEvent', this.Debug.Typen.Component);
    }
  }

  FerientagMouseOverEvent(Tag: Kalendertagestruktur) {

    try {

      let Ferientag: Ferienstruktur = lodash.find(this.DB.Ferienliste[this.DB.Laendercode], (ferientag: Ferienstruktur) => {

        return moment(Tag.Tagstempel).isBetween(moment(ferientag.Anfangstempel), moment(ferientag.Endestempel), 'day');
      });

      if(!lodash.isUndefined(Ferientag)) {

        this.FerientagCrossedEvent.emit(Ferientag.Name);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'FerientagMouseOverEvent', this.Debug.Typen.Component);
    }
  }



  TagMouseEnterEvent(event: MouseEvent, Tag: Kalendertagestruktur) {

    try {

      let Datum: Moment;
      let Startdatum: Moment;

      if(this.AddUrlaubRunning && this.DB.CurrentZeitspanne !== null) {

        Datum      = moment(Tag.Tagstempel);
        Startdatum = moment(this.DB.CurrentZeitspanne.Startstempel);

        if(Datum.isSameOrAfter(Startdatum, 'day')) {

          this.DB.CurrentZeitspanne.Endestempel = Datum.valueOf();
          this.DB.CurrentZeitspanne.Endestring = Datum.format('DD.MM.YY');
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'TagMouseEnterEvent', this.Debug.Typen.Component);
    }
  }

  TagMouseLeaveEvent(event: MouseEvent, Tag: Kalendertagestruktur) {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'TagMouseLeaveEvent', this.Debug.Typen.Component);
    }
  }

  GetTagStyle(Tag: Kalendertagestruktur) {

    try {

      let Background:string = 'red';
      let Color: string = 'black';
      let Datum: Moment = moment(Tag.Tagstempel);
      let Startdatum: Moment;
      let Endedatum: Moment;
      let Liste: Urlauzeitspannenstruktur[];

      if(this.DB.CurrentUrlaub !== null) {

        Liste = this.DB.CurrentUrlaub.Zeitspannen;

        if(this.DB.CurrentZeitspanne !== null) Liste.push(this.DB.CurrentZeitspanne);

        for(let Zeitspanne of Liste) {

          Startdatum = moment(Zeitspanne.Startstempel);
          Endedatum  = moment(Zeitspanne.Endestempel);

          if(Datum.isSameOrAfter(Startdatum, 'day') === true &&
             Datum.isSameOrBefore(Endedatum, 'day') === true &&
             this.DB.CheckIsFeiertag(Tag, this.DB.Laendercode) === false) {

            switch (Zeitspanne.Status) {

              case this.DB.Urlaubstatusvarianten.Beantragt:

                Background = this.DB.Urlaubsfaben.Beantrag;

                break;

              case this.DB.Urlaubstatusvarianten.Vertreterfreigabe:

                Background = this.DB.Urlaubsfaben.Vertreterfreigabe;

                break;

              case this.DB.Urlaubstatusvarianten.Genehmigt:

                Background = this.DB.Urlaubsfaben.Genehmigt;

                break;

              case this.DB.Urlaubstatusvarianten.Abgelehnt:

                Background = this.DB.Urlaubsfaben.Abgelehnt;

                break;
            }

            Color = 'white';
          }
          else {

            Background = 'none';
            Color      = 'black';
          }
        }
      }

      return {

        background: Background,
        color: Color
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'GetTagStyle', this.Debug.Typen.Component);
    }
  }

  TagClicked(Tag: Kalendertagestruktur, Wocheindex: number, Tagindex: number) {

    try {

      let Datum: Moment;
      let Startdatum: Moment;
      let Kalendertag: Kalendertagestruktur;
      let Anzahl: number = 0  ;

      if(this.AddUrlaubRunning && Tag.IsFeiertag === false) {

        if(this.DB.CurrentZeitspanne === null ) {

          this.DB.CurrentZeitspanne = this.DB.GetEmptyZeitspanne();

          this.DB.CurrentZeitspanne.Startstempel = Tag.Tagstempel;
          this.DB.CurrentZeitspanne.Startstring  = Tag.Datumstring;

          this.DB.CurrentZeitspanne.Endestempel = Tag.Tagstempel;
          this.DB.CurrentZeitspanne.Endestring  = Tag.Datumstring;

          Tag.Background = this.DB.Urlaubsfaben.Beantrag;
          Tag.IsUrlaub   = true;
          Tag.Color      = 'white';
        }
        else {

          Startdatum = moment(this.DB.CurrentZeitspanne.Startstempel);
          Datum      = moment(Tag.Tagstempel);

          if(Datum.isSameOrAfter(Startdatum, 'day') === true && Datum.isSame(Startdatum, 'week')) {

            this.DB.CurrentZeitspanne.Endestempel = Tag.Tagstempel;
            this.DB.CurrentZeitspanne.Endestring = Tag.Datumstring;

            for(let Index = Tagindex; Index >= 0; Index--) {

              Kalendertag = this.Kalendertageliste[Wocheindex][Index];

              if(Kalendertag.IsFeiertag === false) {

                Kalendertag.Background = this.DB.Urlaubsfaben.Beantrag;
                Kalendertag.IsUrlaub   = true;
                Kalendertag.Color      = 'white';

                Anzahl++;
              }
            }

            this.DB.CurrentZeitspanne.Tageanzahl = Anzahl;

            this.AddUrlaubFinished.emit();

          }
          else {

              this.Tools.ShowHinweisDialog('Bitte Tag in der gleichen Woche wählen.');
          }
        }
      }
      else {

        if(this.AddUrlaubRunning) this.Tools.ShowHinweisDialog('Dieser Tag ist ein Feiertag.');
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'TagClicked', this.Debug.Typen.Component);
    }
  }
}
