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
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {Urlaubprojektbeteiligtestruktur} from "../../dataclasses/urlaubprojektbeteiligtestruktur";

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
  @Output() AddUrlaubFinished = new EventEmitter<boolean>();

  public Kalendertageliste: Kalendertagestruktur[][];
  public KalendertageExternliste: Kalendertagestruktur[][][];
  private DataSubscription: Subscription;
  private MitarbeiterSubscription: Subscription;
  private MonateSubscription: Subscription;
  public Monatname: string;
  private ExterneUrlaubSubscription: Subscription;
  private UrlaubStatusSubscription: Subscription;

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
      this.ExterneUrlaubSubscription = null;
      this.UrlaubStatusSubscription = null;

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
      let Datumsicherung: Moment;

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

      Startdatum     = MonatStartdatum.clone().subtract(Tage, 'day');
      Datum          = Startdatum.clone();
      Tagindex       = MonatEndedatum.isoWeekday();
      Tage           = 7 - Tagindex;
      Tagesumme      = Tagesumme + Tage;
      Wochenanazahl  = Tagesumme / 7;
      Datumsicherung = Datum.clone();

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

          Tag.IsFeiertag_DE  = this.DB.CheckIsFeiertag(Tag, 'DE');
          Tag.IsFeiertag_BG  = this.DB.CheckIsFeiertag(Tag, 'BG');

          if(Tag.IsFeiertag_DE) Tag.Feiertagname_DE = 'DE: ' + this.DB.GetFeiertag(Tag, 'DE').Feiertagname_DE;
          else Tag.Feiertagname_DE = '';

          if(Tag.IsFeiertag_BG) Tag.Feiertagname_BG = 'BG: ' + this.DB.GetFeiertag(Tag, 'BG').Feiertagname_BG;
          else Tag.Feiertagname_BG = '';

          // Ferientage eintragen

          Tag.IsFerientag_DE = this.DB.CheckIsFerientag(Tag, 'DE');
          Tag.IsFerientag_BG = this.DB.CheckIsFerientag(Tag, 'BG');

          if(Tag.IsFerientag_DE) Tag.Ferienname_DE = 'DE: ' + this.DB.GetFerientag(Tag, 'DE').Ferienname_DE;
          else Tag.Ferienname_DE = '';

          if(Tag.IsFerientag_BG) Tag.Ferienname_BG = 'BG: ' + this.DB.GetFerientag(Tag, 'BG').Ferienname_BG;
          else Tag.Ferienname_BG = '';

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

                Tag.IsUrlaub   = true;
                Tag.Background = this.DB.GetStatuscolor(Zeitspanne.Status);
                Tag.Color      = 'white';

                break;
              }
            }
          }

          this.Kalendertageliste[wochenindex].push(Tag);

          Datum.add(1, 'day');
        }
      }

      // Externe Urlaube

      /*

      Tageanzahl = moment(this.Jahr.toString() + '-' + Monattext , "YYYY-MM").daysInMonth(); // 31
      Tagesumme  = Tageanzahl;

      Tagindex  = MonatStartdatum.isoWeekday();
      Tage      = Tagindex - 1;
      Tagesumme = Tagesumme + Tage;

      Startdatum     = MonatStartdatum.clone().subtract(Tage, 'day');
      Tagindex      = MonatEndedatum.isoWeekday();
      Tage          = 7 - Tagindex;
      Tagesumme     = Tagesumme + Tage;
      Wochenanazahl = Tagesumme / 7;

       */

      this.KalendertageExternliste = [];
      Mitarbeiterindex = 0;

      for(let i = 0; i < this.DB.UrlaublisteExtern.length; i++) {

        Datum = Datumsicherung.clone();

        debugger;

        if(this.DB.CheckDisplayExternenUrlaub(this.DB.UrlaublisteExtern[i].MitarbeiterIDExtern)) {

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
                Datum: Datum.clone(),
                IsUrlaub: false,
                Background: 'white',
                Color:      'black'
              };

              for(let Zeitspanne of this.DB.UrlaublisteExtern[i].Zeitspannen) {

                Startdatum = moment(Zeitspanne.Startstempel);
                Endedatum  = moment(Zeitspanne.Endestempel);

                if(Datum.isSameOrAfter(Startdatum, 'day')  === true &&
                  Datum.isSameOrBefore(Endedatum, 'day')   === true &&
                  this.DB.CheckIsFeiertag(Tag, this.DB.Laendercode) === false) {

                  Tag.IsUrlaub   = true;
                  Tag.Background = this.DB.GetStatuscolor(Zeitspanne.Status);
                  Tag.Color      = 'white';

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

      this.ExterneUrlaubSubscription = this.DB.ExterneUrlaubeChanged.subscribe(() => {

        this.PrepareData();
      });

      this.UrlaubStatusSubscription = this.DB.UrlaubStatusChanged.subscribe(() => {

        this.PrepareData();
      });

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

      this.ExterneUrlaubSubscription.unsubscribe();
      this.ExterneUrlaubSubscription = null;

      this.UrlaubStatusSubscription.unsubscribe();
      this.UrlaubStatusSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Kalender', 'ngOnDestroy', this.Debug.Typen.Component);
    }
  }

  FeietragMouseOverEvent(Tag: Kalendertagestruktur, laendercode: string) {

    try {

      this.FeiertagCrossedEvent.emit(laendercode === 'DE' ? Tag.Feiertagname_DE : Tag.Feiertagname_BG);

      /*
      let Feiertag: Feiertagestruktur = lodash.find(this.DB.Feiertageliste[laendercode], (feiertag: Feiertagestruktur) => {

        return moment(Tag.Tagstempel).isSame(moment(feiertag.Anfangstempel), 'day');
      });

      if(!lodash.isUndefined(Feiertag)) {

      }

       */

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'FeietragMouseOverEvent', this.Debug.Typen.Component);
    }
  }

  FerientagMouseOverEvent(Tag: Kalendertagestruktur, laendercode: string) {

    try {

      this.FerientagCrossedEvent.emit(laendercode === 'DE' ? Tag.Ferienname_DE : Tag.Ferienname_BG);

      /*
      let Ferientag: Ferienstruktur = lodash.find(this.DB.Ferienliste[laendercode], (ferientag: Ferienstruktur) => {

        return moment(Tag.Tagstempel).isBetween(moment(ferientag.Anfangstempel), moment(ferientag.Endestempel), 'day');
      });

      if(!lodash.isUndefined(Ferientag)) {

        this.FerientagCrossedEvent.emit(Ferientag.Name);
      }

       */

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'FerientagMouseOverEvent', this.Debug.Typen.Component);
    }
  }

  TagClicked(Tag: Kalendertagestruktur, Wocheindex: number, Tagindex: number) {

    try {

      let Datum: Moment;
      let Startdatum: Moment;
      let Kalendertag: Kalendertagestruktur;
      let Anzahl: number = 0  ;
      let IsFeiertag: boolean = this.DB.Laendercode === 'DE' ? Tag.IsFeiertag_DE : Tag.IsFeiertag_BG;
      let Resturlaub: number;

      if(this.AddUrlaubRunning && IsFeiertag === false) {

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
            this.DB.CurrentZeitspanne.Endestring  = Tag.Datumstring;

            for(let Index = Tagindex; Index >= 0; Index--) {

              Kalendertag = this.Kalendertageliste[Wocheindex][Index];
              IsFeiertag  = this.DB.Laendercode === 'DE' ? Kalendertag.IsFeiertag_DE : Kalendertag.IsFeiertag_BG;

              if(IsFeiertag === false) {

                Kalendertag.Background = this.DB.Urlaubsfaben.Beantrag;
                Kalendertag.IsUrlaub   = true;
                Kalendertag.Color      = 'white';

                Anzahl++;
              }
            }

            this.DB.CurrentZeitspanne.Tageanzahl = Anzahl;

            Resturlaub = this.DB.CountResturlaub();

            if(Resturlaub - Anzahl >= 0) {

              this.AddUrlaubFinished.emit(true);
            }
            else {

              this.Tools.ShowHinweisDialog('Du hast nur noch ' + Resturlaub + ' Tage Resturlaub.');

              this.DB.CurrentZeitspanne = null;

              window.setTimeout(() => {

                for(let Index = Tagindex; Index >= 0; Index--) {

                  Kalendertag = this.Kalendertageliste[Wocheindex][Index];
                  IsFeiertag  = this.DB.Laendercode === 'DE' ? Kalendertag.IsFeiertag_DE : Kalendertag.IsFeiertag_BG;

                  if(IsFeiertag === false) {

                    Kalendertag.Background = 'none';
                    Kalendertag.IsUrlaub   = false;
                    Kalendertag.Color      = 'black';
                  }
                }

                this.AddUrlaubFinished.emit(false);

              }, 3000);

            }
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
