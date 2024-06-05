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
import {DatabaseUrlaubService} from "../../services/database-urlaub/database-urlaub.service";
import {Kalendertagestruktur} from "../../dataclasses/kalendertagestruktur";
import {Subscription} from "rxjs";
import {ToolsProvider} from "../../services/tools/tools";
import {boolean} from "joi";

@Component({
  selector: 'urlaubsplanung-kalender',
  templateUrl: 'urlausplanung-kalender.html',
  styleUrls: ['urlausplanung-kalender.scss']
})
export class UrlaubsplanungKalenderComponent implements OnInit, OnDestroy, OnChanges {

  @Input() public ShowProtokollpunkte: boolean;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;
  @Input() Monatindex: number;
  @Input() Jahr: number;
  @Input() AddUrlaubRunning: boolean;
  @Input() AddHomeofficerunning: boolean;
  @Input() AddHalberUrlaubstagRunning: boolean;
  @Input() ShowYear: boolean;

  @Output() FeiertagCrossedEvent  = new EventEmitter<{Name: string; Laendercode: string}>();
  @Output() FerientagCrossedEvent = new EventEmitter<{Name: string; Laendercode: string}>();
  @Output() AddUrlaubFinishedEvent       = new EventEmitter<boolean>();
  @Output() AddHomeofficeFinishedEvent   = new EventEmitter<boolean>();
  @Output() ExternUrlaubstagClickedEvent = new EventEmitter<string>();

  public Kalendertageliste: Kalendertagestruktur[][];
  public KalendertageExternliste: Kalendertagestruktur[][][];
  private DataSubscription: Subscription;
  private MonateSubscription: Subscription;
  public Monatname: string;
  private ExterneUrlaubSubscription: Subscription;
  private UrlaubStatusSubscription: Subscription;
  private HomeofficeStatusSubscription: Subscription;
  private ExterneHomeofficeSubscription: Subscription;
  private CurrentTagindex: number;
  private CurrentWochenindex: number;
  private CancelUrlaubSubscription: Subscription;
  private UpdateKalenderSubscription: Subscription;

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
      this.AddHomeofficerunning = false;
      this.Monatindex = 0;
      this.ShowYear   = false;
      this.CurrentWochenindex = null;
      this.CurrentTagindex = null;
      this.Monatname = this.DB.Monateliste[this.Monatindex];

      this.DataSubscription              = null;
      this.MonateSubscription            = null;
      this.ExterneUrlaubSubscription     = null;
      this.UrlaubStatusSubscription      = null;
      this.HomeofficeStatusSubscription  = null;
      this.ExterneHomeofficeSubscription = null;
      this.CancelUrlaubSubscription      = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Kalender', 'Construktor', this.Debug.Typen.Component);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    try {

      let Monatindexvalue: SimpleChange           = changes.Monatindex;
      let AddHomeofficerunningvalue: SimpleChange = changes.AddHomeofficerunning;

      if(!lodash.isUndefined(Monatindexvalue)) {

        this.PrepareData();
      }

      if(!lodash.isUndefined(AddHomeofficerunningvalue)) {

        if(AddHomeofficerunningvalue.firstChange === false && AddHomeofficerunningvalue.previousValue === false && AddHomeofficerunningvalue.currentValue === true) {

          this.DB.CurrentHomeofficecounter = 0;
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'ngOnChanges', this.Debug.Typen.Component);
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
      let Kalenderewoche: number;

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

          Kalenderewoche = Datum.isoWeek();

          Tag = {

            Tagnummer:     Datum.date(),
            Tag:           Datum.format('dddd'),
            Datumstring:   Datum.format('DD.MM.YYYY'),
            Hauptmonat:    Datum.isSameOrAfter(MonatStartdatum, 'day') && Datum.isSameOrBefore(MonatEndedatum, 'day'),
            Kalenderwoche: Kalenderewoche,
            Tagstempel:    Datum.valueOf(),
            Datum:         Datum,
          };

          if(lodash.isUndefined(this.DB.Kalenderwochenhoehenliste[Kalenderewoche])) this.DB.Kalenderwochenhoehenliste[Kalenderewoche] = [];

          // Feiertag eintragen

          Tag.IsFeiertag_DE  = this.DB.CheckIsFeiertag(Tag, 'DE');
          Tag.IsFeiertag_BG  = this.DB.CheckIsFeiertag(Tag, 'BG');

          if(Tag.IsFeiertag_DE) Tag.Feiertagname_DE = this.DB.GetFeiertag(Tag, 'DE').Feiertagname_DE; // 'DE: ' +
          else Tag.Feiertagname_DE = '';

          if(Tag.IsFeiertag_BG) Tag.Feiertagname_BG = this.DB.GetFeiertag(Tag, 'BG').Feiertagname_BG; // 'BG: ' +
          else Tag.Feiertagname_BG = '';

          // Ferientage eintragen

          Tag.IsFerientag_DE = this.DB.CheckIsFerientag(Tag, 'DE');
          Tag.IsFerientag_BG = this.DB.CheckIsFerientag(Tag, 'BG');

          if(Tag.IsFerientag_DE) Tag.Ferienname_DE = this.DB.GetFerientag(Tag, 'DE').Ferienname_DE; // 'DE: ' +
          else Tag.Ferienname_DE = '';

          if(Tag.IsFerientag_BG) Tag.Ferienname_BG = this.DB.GetFerientag(Tag, 'BG').Ferienname_BG; // 'BG: ' +
          else Tag.Ferienname_BG = '';


          Tag.Background         = 'white';
          Tag.Color              = 'black';
          Tag.IsUrlaub           = false;
          Tag.IsHomeoffice       = false;
          Tag.IsHalberUrlaubstag = false;

          // Urlaube eintragen

          if(this.DB.CurrentUrlaub !== null) {

            for(let Zeitspanne of this.DB.CurrentUrlaub.Urlaubzeitspannen) {

              Startdatum = moment(Zeitspanne.Startstempel);
              Endedatum  = moment(Zeitspanne.Endestempel);

              if(Datum.isSameOrAfter(Startdatum, 'day')  === true &&
                Datum.isSameOrBefore(Endedatum, 'day')   === true &&
                this.DB.CheckIsFeiertag(Tag, this.DB.Laendercode) === false) {

                Tag.IsUrlaub   = true;
                Tag.Background = this.DB.GetUrlaubStatuscolor(Zeitspanne);
                Tag.Color      = 'white';

                break;
              }
            }
          }

          // Halbe Urlaubstage eintragen

          if(this.DB.CurrentUrlaub !== null) {

            for(let Zeitspanne of this.DB.CurrentUrlaub.Urlaubzeitspannen) {

              if(Zeitspanne.Halbertag) {

                Startdatum = moment(Zeitspanne.Startstempel);
                Endedatum  = moment(Zeitspanne.Endestempel);

                if(Datum.isSame(Startdatum, 'day')  === true &&
                  this.DB.CheckIsFeiertag(Tag, this.DB.Laendercode) === false) {

                  Tag.IsHalberUrlaubstag = true;
                  Tag.IsUrlaub           = true;
                  Tag.Background         = this.DB.GetUrlaubStatuscolor(Zeitspanne);
                  Tag.Color              = 'white';

                  break;
                }
              }
            }
          }

          // Homeoffice eintragen

          if(this.DB.CurrentUrlaub !== null && this.Pool.Mitarbeitersettings !== null) {

            for(let Zeitspanne of this.DB.CurrentUrlaub.Homeofficezeitspannen) {

              Startdatum = moment(Zeitspanne.Startstempel);
              Endedatum  = moment(Zeitspanne.Endestempel);

              if(Datum.isSameOrAfter(Startdatum, 'day')  === true &&
                Datum.isSameOrBefore(Endedatum, 'day')   === true &&
                this.DB.CheckIsFeiertag(Tag, this.DB.Laendercode) === false) {

                Tag.IsHomeoffice = true;
                Tag.Background   = this.Pool.Mitarbeitersettings.ShowHomeoffice ? this.DB.GetHomeofficeStatuscolor(Zeitspanne.Status) : 'none';
                Tag.Color        = this.Pool.Mitarbeitersettings.ShowHomeoffice ? 'white' : 'black';


                break;
              }
            }
          }

          this.Kalendertageliste[wochenindex].push(Tag);

          Datum.add(1, 'day');
        }
      }

      // Externe Urlaube

      this.KalendertageExternliste = [];
      Mitarbeiterindex = 0;

      for(let i = 0; i < this.DB.UrlaublisteExtern.length; i++) {

        Datum = Datumsicherung.clone();

        if(this.DB.CheckDisplayExternenUrlaub(this.DB.UrlaublisteExtern[i].MitarbeiterIDExtern)) {

          this.KalendertageExternliste[Mitarbeiterindex] = [];

          for(let wochenindex = 0; wochenindex < Wochenanazahl; wochenindex++) {

            this.KalendertageExternliste[Mitarbeiterindex][wochenindex] = [];

            for(let tagindex = 0; tagindex < 7; tagindex++) {

              Tag = {

                Kuerzel: this.DB.UrlaublisteExtern[i].NameKuerzel,
                MitarbeiterID: this.DB.UrlaublisteExtern[i].MitarbeiterIDExtern,
                Tagnummer:   Datum.date(),
                Tag: Datum.format('dddd'),
                Datumstring: Datum.format('DD.MM.YYYY'),
                Hauptmonat: Datum.isSameOrAfter(MonatStartdatum, 'day') && Datum.isSameOrBefore(MonatEndedatum, 'day'),
                Kalenderwoche: Datum.isoWeek(),
                Tagstempel: Datum.valueOf(),
                Datum: Datum.clone(),
                IsUrlaub: false,
                IsHomeoffice: false,
                Background: 'white',
                Color:      'black'
              };

               // Urlaub Extern

              for(let UrlaubZeitspanne of this.DB.UrlaublisteExtern[i].Urlaubzeitspannen) {

                Startdatum     = moment(UrlaubZeitspanne.Startstempel);
                Endedatum      = moment(UrlaubZeitspanne.Endestempel);
                Kalenderewoche = Startdatum.isoWeek();

                if(lodash.isUndefined(this.DB.Kalenderwochenhoehenliste[Kalenderewoche])) {

                  this.DB.Kalenderwochenhoehenliste[Kalenderewoche] = [];

                  for(let i = 0; i < 5; i++) {

                    this.DB.Kalenderwochenhoehenliste[Kalenderewoche][i] = [];
                  }
                }

                if(Datum.isSameOrAfter(Startdatum, 'day')  === true &&
                  Datum.isSameOrBefore(Endedatum, 'day')   === true &&
                  this.DB.CheckIsFeiertag(Tag, this.DB.Laendercode) === false) {

                  Tag.IsUrlaub     = true;
                  Tag.IsHomeoffice = false;
                  Tag.Background   = this.DB.GetUrlaubStatuscolor(UrlaubZeitspanne);
                  Tag.Color        = 'white';

                  if(this.DB.Kalenderwochenhoehenliste[Kalenderewoche][Datum.weekday()].indexOf(this.DB.UrlaublisteExtern[i].MitarbeiterIDExtern) === -1) {

                    this.DB.Kalenderwochenhoehenliste[Kalenderewoche][Datum.weekday()].push(this.DB.UrlaublisteExtern[i].MitarbeiterIDExtern);
                  }

                  break;
                }
              }

              // Homeoffice Extern

              for(let HomeofficeZeitspanne of this.DB.UrlaublisteExtern[i].Homeofficezeitspannen) {

                Startdatum = moment(HomeofficeZeitspanne.Startstempel);
                Endedatum  = moment(HomeofficeZeitspanne.Endestempel);

                if(Datum.isSameOrAfter(Startdatum, 'day')  === true &&
                  Datum.isSameOrBefore(Endedatum, 'day')   === true &&
                  this.DB.CheckIsFeiertag(Tag, this.DB.Laendercode) === false) {

                  Tag.IsHomeoffice   = true;
                  Tag.IsUrlaub       = false;
                  Tag.Background     = this.DB.GetHomeofficeStatuscolor(HomeofficeZeitspanne.Status);
                  Tag.Color          = 'white';

                  if(this.DB.Kalenderwochenhoehenliste[Kalenderewoche][Datum.weekday()].indexOf(this.DB.UrlaublisteExtern[i].MitarbeiterIDExtern) === -1) {

                    this.DB.Kalenderwochenhoehenliste[Kalenderewoche][Datum.weekday()].push(this.DB.UrlaublisteExtern[i].MitarbeiterIDExtern);
                  }

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

      // debugger;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Kalender', 'PrepareData', this.Debug.Typen.Component);
    }
  }


  ngOnInit() {

    try {

      this.DataSubscription = this.Pool.LoadingAllDataFinished.subscribe(() => {

        this.PrepareData();
      });


      this.MonateSubscription = this.DB.PlanungsmonateChanged.subscribe(() => {

        this.PrepareData();
      });

      this.ExterneUrlaubSubscription = this.DB.ExterneUrlaubeChanged.subscribe(() => {

        this.PrepareData();
      });

      this.ExterneHomeofficeSubscription = this.DB.ExterneHomeofficeChanged.subscribe(() => {

        this.PrepareData();
      });

      this.UrlaubStatusSubscription = this.DB.UrlaubStatusChanged.subscribe(() => {

        this.PrepareData();
      });

      this.HomeofficeStatusSubscription = this.DB.HomeofficeStatusChanged.subscribe(() => {

        this.PrepareData();
      });

      this.CancelUrlaubSubscription = this.DB.AddUrlaubCancelEvent.subscribe(() => {

        this.CancelUrlaub();
      });

      this.UpdateKalenderSubscription = this.DB.UpdateKalenderRequestEvent.subscribe(() => {

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

      this.MonateSubscription.unsubscribe();
      this.MonateSubscription = null;

      this.ExterneUrlaubSubscription.unsubscribe();
      this.ExterneUrlaubSubscription = null;

      this.UrlaubStatusSubscription.unsubscribe();
      this.UrlaubStatusSubscription = null;

      this.HomeofficeStatusSubscription.unsubscribe();
      this.HomeofficeStatusSubscription = null;

      this.ExterneHomeofficeSubscription.unsubscribe();
      this.ExterneHomeofficeSubscription = null;

      this.CancelUrlaubSubscription.unsubscribe();
      this.CancelUrlaubSubscription = null;

      this.UpdateKalenderSubscription.unsubscribe();
      this.UpdateKalenderSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Kalender', 'ngOnDestroy', this.Debug.Typen.Component);
    }
  }

  FeietragMouseOverEvent(Tag: Kalendertagestruktur, laendercode: string) {

    try {

      let Name: string = '';
      let Datum: Moment = moment(Tag.Tagstempel).locale(laendercode === 'DE' ? 'de' : 'en');

      if(Tag.IsFeiertag_DE || Tag.IsFeiertag_BG) {

        if(laendercode === 'DE' && Tag.IsFeiertag_DE) {

          Name = Tag.Feiertagname_DE + ' / ' + Datum.format('D. MMMM YYYY');

          this.FeiertagCrossedEvent.emit({Name: Name, Laendercode: laendercode});
        }
        else if (laendercode === 'BG' && Tag.IsFeiertag_BG){

          Name = Tag.Feiertagname_BG + ' / ' + Datum.format('D. MMMM YYYY');

          this.FeiertagCrossedEvent.emit({Name: Name, Laendercode: laendercode});
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'FeietragMouseOverEvent', this.Debug.Typen.Component);
    }
  }

  FerientagMouseOverEvent(Tag: Kalendertagestruktur, laendercode: string) {

    try {

      let Name: string = laendercode === 'DE' ? Tag.Ferienname_DE : Tag.Ferienname_BG;

      this.FerientagCrossedEvent.emit({Name: Name, Laendercode: laendercode});

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'FerientagMouseOverEvent', this.Debug.Typen.Component);
    }
  }

  TagClicked(event: MouseEvent, Tag: Kalendertagestruktur, Wocheindex: number, CurrentTagindex: number) {

    try {

      let EndeDatum: Moment;
      let Startdatum: Moment;
      let Kalendertag: Kalendertagestruktur;
      let Anzahl: number = 0  ;
      let IsFeiertag: boolean = this.DB.Laendercode === 'DE' ? Tag.IsFeiertag_DE : Tag.IsFeiertag_BG;
      let Resturlaub: number;
      let IsUrlaub: boolean = Tag.IsUrlaub && this.DB.CurrentUrlaubzeitspanne === null;
      let IsHomeoffice: boolean = Tag.IsHomeoffice;
      let Starttagindex: number;
      let Endetagindex: number;
      let Heute: Moment = moment();

      event.stopPropagation();
      event.preventDefault();

      this.CurrentTagindex    = CurrentTagindex;
      this.CurrentWochenindex = Wocheindex;

      if(this.AddUrlaubRunning) {

        if (IsFeiertag === false && IsHomeoffice === false && IsUrlaub === false) {

          if (this.DB.CurrentUrlaubzeitspanne === null) {

            this.DB.CurrentUrlaubzeitspanne = this.DB.GetEmptyUrlaubszeitspanne();

            this.DB.CurrentUrlaubzeitspanne.Startstempel = Tag.Tagstempel;
            this.DB.CurrentUrlaubzeitspanne.Startstring  = Tag.Datumstring;

            Tag.Background = this.DB.Urlaubsfaben.Geplant;
            Tag.IsUrlaub   = true;
            Tag.Color      = 'white';

          } else {

            Startdatum    = moment(this.DB.CurrentUrlaubzeitspanne.Startstempel);
            Starttagindex = Startdatum.isoWeekday() - 1;
            Endetagindex = CurrentTagindex;
            EndeDatum    = moment(Tag.Tagstempel);

            if (EndeDatum.isSameOrAfter(Startdatum, 'day') === true && EndeDatum.isSame(Startdatum, 'week')) {

              this.DB.CurrentUrlaubzeitspanne.Endestempel = Tag.Tagstempel;
              this.DB.CurrentUrlaubzeitspanne.Endestring  = Tag.Datumstring;

              if(EndeDatum.isSameOrBefore(Heute)) {

                this.DB.CurrentUrlaubzeitspanne.Status                      = this.DB.Urlaubstatusvarianten.Genehmigt;
                this.DB.CurrentUrlaubzeitspanne.FreigabeanfrageSended       = true;
                this.DB.CurrentUrlaubzeitspanne.FreigabeantwortSended       = true;
                this.DB.CurrentUrlaubzeitspanne.FreigabeantwortOfficeSended = true;
                this.DB.CurrentUrlaubzeitspanne.Planungmeldung              = 'Der Urlaub befand sich zum Tage der Eintragung am ' + Heute.format('DD.MM.YYYY') + ' in der Vergangenheit.';
              }

              for (let Index = Starttagindex; Index <= Endetagindex; Index++) {

                Kalendertag = this.Kalendertageliste[Wocheindex][Index];
                IsFeiertag  = this.DB.Laendercode === 'DE' ? Kalendertag.IsFeiertag_DE : Kalendertag.IsFeiertag_BG;

                if (IsFeiertag === false) {

                  Kalendertag.Background = this.DB.Urlaubsfaben.Geplant;
                  Kalendertag.IsUrlaub   = true;
                  Kalendertag.Color      = 'white';

                  Anzahl++;
                }
              }

              this.DB.CurrentUrlaubzeitspanne.Tageanzahl = Anzahl;

              Resturlaub = this.DB.CountResturlaub();

              if (Resturlaub - Anzahl >= 0) {

                this.AddUrlaubFinishedEvent.emit(true);

              } else {

                this.Tools.ShowHinweisDialog('Du hast nur noch ' + Resturlaub + ' Tage Resturlaub.');

                this.DB.CurrentUrlaubzeitspanne = null;

                window.setTimeout(() => {

                  for (let Index = Starttagindex; Index < Endetagindex; Index++) {

                    Kalendertag = this.Kalendertageliste[Wocheindex][Index];
                    IsFeiertag = this.DB.Laendercode === 'DE' ? Kalendertag.IsFeiertag_DE : Kalendertag.IsFeiertag_BG;

                    if (IsFeiertag === false) {

                      Kalendertag.Background = 'none';
                      Kalendertag.IsUrlaub   = false;
                      Kalendertag.Color      = 'black';
                    }
                  }

                  this.AddUrlaubFinishedEvent.emit(false);

                }, 3000);

              }
            } else {

              this.Tools.ShowHinweisDialog('Bitte Tag in der gleichen Woche wählen.');
            }
          }

        } else {

          if (IsFeiertag)       this.Tools.ShowHinweisDialog('Dieser Tag ist ein Feiertag.');
          else if(IsHomeoffice) this.Tools.ShowHinweisDialog('Dieser Tag ist ein Homeofficetag.');
          else                  this.Tools.ShowHinweisDialog('Dieser Tag ist bereits ein Urlaubstag.');
        }
      }

      if(this.AddHomeofficerunning) {

        if(IsFeiertag === false && IsUrlaub === false && IsHomeoffice === false) {

          this.DB.CurrentHomeofficezeitspanne = this.DB.GetEmptyHomeofficezeitspanne();

          this.DB.CurrentHomeofficezeitspanne.Startstempel = Tag.Tagstempel;
          this.DB.CurrentHomeofficezeitspanne.Endestempel  = Tag.Tagstempel;
          this.DB.CurrentHomeofficezeitspanne.Startstring  = Tag.Datumstring;
          this.DB.CurrentHomeofficezeitspanne.Endestring   = Tag.Datumstring;
          this.DB.CurrentHomeofficezeitspanne.Tageanzahl   = 1;

          Kalendertag              = this.Kalendertageliste[Wocheindex][CurrentTagindex];
          Kalendertag.Background   = this.DB.Homeofficefarben.Geplant;
          Kalendertag.IsHomeoffice = true;
          Kalendertag.Color        = 'white';

          this.DB.CurrentHomeofficecounter++;

          this.AddHomeofficeFinishedEvent.emit(true);

        } else {

          if (IsFeiertag)       this.Tools.ShowHinweisDialog('Dieser Tag ist ein Feiertag.');
          else if(IsHomeoffice) this.Tools.ShowHinweisDialog('Dieser Tag ist ein Homeofficetag.');
          else                  this.Tools.ShowHinweisDialog('Dieser Tag ist bereits ein Urlaubstag.');

          this.DB.CurrentHomeofficezeitspanne = null;
        }
      }

      if(this.AddHalberUrlaubstagRunning) {

        if(IsFeiertag === false && IsUrlaub === false && IsHomeoffice === false) {

          this.DB.CurrentUrlaubzeitspanne = this.DB.GetEmptyUrlaubszeitspanne();

          this.DB.CurrentUrlaubzeitspanne.Halbertag    = true;
          this.DB.CurrentUrlaubzeitspanne.Startstempel = Tag.Tagstempel;
          this.DB.CurrentUrlaubzeitspanne.Endestempel  = Tag.Tagstempel;
          this.DB.CurrentUrlaubzeitspanne.Startstring  = Tag.Datumstring;
          this.DB.CurrentUrlaubzeitspanne.Endestring   = Tag.Datumstring;
          this.DB.CurrentUrlaubzeitspanne.Tageanzahl   = 0.5;

          Kalendertag                    = this.Kalendertageliste[Wocheindex][CurrentTagindex];
          Kalendertag.Background         = this.DB.Urlaubsfaben.Geplant;
          Kalendertag.IsUrlaub           = true;
          Kalendertag.IsHalberUrlaubstag = true;
          Kalendertag.Color              = 'white';


          this.AddUrlaubFinishedEvent.emit(true);

        } else {

          if (IsFeiertag)   this.Tools.ShowHinweisDialog('Dieser Tag ist ein Feiertag.');
          else if(IsUrlaub) this.Tools.ShowHinweisDialog('Dieser Tag ist ein Urlaubstag.');
          else              this.Tools.ShowHinweisDialog('Dieser Tag ist bereits ein Homeofficetag.');

          this.DB.CurrentUrlaubzeitspanne = null;
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'TagClicked', this.Debug.Typen.Component);
    }
  }

  GetMonatname(): string {

    try {

      let Text: string = this.Monatname;

      if(this.ShowYear) Text += ' ' + this.Jahr;

      return Text;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'GetMonatname', this.Debug.Typen.Component);
    }
  }

  GetTagBackground(Tag: Kalendertagestruktur): string {

    try {

      if(Tag.IsUrlaub === true || Tag.IsHomeoffice === true) {

        if     (Tag.IsUrlaub) return Tag.Background;
        else if(Tag.IsHomeoffice === true && this.Pool.Mitarbeitersettings.ShowHomeoffice === true) return Tag.Background;
        else return 'none';
      }
      else return 'none';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'GetTagBackground', this.Debug.Typen.Component);
    }
  }

  private CancelUrlaub() {

    try {


      let Kalendertag: Kalendertagestruktur;

      if(lodash.isUndefined(this.CurrentWochenindex) === false && this.CurrentWochenindex !== null &&
         lodash.isUndefined(this.CurrentTagindex)    === false && this.CurrentTagindex    !== null) {

        Kalendertag = this.Kalendertageliste[this.CurrentWochenindex][this.CurrentTagindex];

        Kalendertag.Background = 'none';
        Kalendertag.IsUrlaub   = false;
        Kalendertag.Color      = 'black';
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'CancelUrlaub', this.Debug.Typen.Component);
    }
  }

  protected readonly lodash = lodash;

  GetMaxExternUrlaubseintraege(Kalenderwoche: number): number {

    try {

      let Liste: string[][] = this.DB.Kalenderwochenhoehenliste[Kalenderwoche];
      // let IDListe: string[] = [];
      // let Eintrag: string;
      let Eintraege: string[];
      let Max: number = 0;

      if(Liste.length > 0) {

        if(Kalenderwoche === 25) {

            // debugger;
        }

        for(let i = 0; i < Liste.length; i++) {

          if(!lodash.isUndefined(Liste[i])) {

            Eintraege = Liste[i];

            if(Eintraege.length > Max) Max = Eintraege.length;

            /*
            for(let j = 0; j < Eintraege.length; j++) {

              if(lodash.isUndefined(Eintraege[j]) === false) {

                Eintrag = Eintraege[j];

                if(IDListe.indexOf(Eintrag) === -1) IDListe.push(Eintrag);
              }
            }

             */
          }
        }
      }

      return Max;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'GetMaxExternUrlaubseintraege', this.Debug.Typen.Component);
    }
  }

  ExternUrlaubstagClicked(event: MouseEvent, MitarbeiterID: string) {

    try {

      event.preventDefault();
      event.stopPropagation();

      this.ExternUrlaubstagClickedEvent.emit(MitarbeiterID);


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Kalender', 'ExternUrlaubstagClicked', this.Debug.Typen.Component);
    }

  }
}
