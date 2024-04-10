import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MenueService} from "../../services/menue/menue.service";
import {DebugProvider} from "../../services/debug/debug";
import {BasicsProvider} from "../../services/basics/basics";
import {PageHeaderComponent} from "../../components/page-header/page-header";
import {PageFooterComponent} from "../../components/page-footer/page-footer";
import * as lodash from "lodash-es";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";
import moment, {Moment} from "moment/moment";
import {DatabaseUrlaubService} from "../../services/database-urlaub/database-urlaub.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Subscription} from "rxjs";
import {ConstProvider} from "../../services/const/const";
import {AuswahlDialogService} from "../../services/auswahl-dialog/auswahl-dialog.service";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {cloneDeep} from "lodash-es";
import {
  DatabaseMitarbeitersettingsService
} from "../../services/database-mitarbeitersettings/database-mitarbeitersettings.service";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {Kalendertagestruktur} from "../../dataclasses/kalendertagestruktur";
import {Kalenderwochestruktur} from "../../dataclasses/kalenderwochestruktur";
import {Urlauzeitspannenstruktur} from "../../dataclasses/urlauzeitspannenstruktur";

@Component({
  selector: 'common-urlaub-gesamtuebersicht-page',
  templateUrl: 'common-urlaub-gesamtuebersicht.page.html',
  styleUrls: ['common-urlaub-gesamtuebersicht.page.scss'],
})
export class CommonUrlaubGesamtuebersichtPage implements OnInit, OnDestroy {

  @ViewChild('PageHeader', { static: false }) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', { static: false }) PageFooter: PageFooterComponent;

  public Ansichtenvarinaten = {

    Gesamtjahr:   'Gesamtjahr',
    HalbjahrEins: 'HalbjahrEins',
    HalbjahrZwei: 'HalbjahrZwei'
  };

  public Ansichtvariante: string;

  public Message: string;
  private Auswahldialogorigin: string;
  private DataSubscription: Subscription;
  public AuswahlIDliste: string[];
  public Auswahlliste: Auswahldialogstruktur[];
  public ShowMitarbeiterauswahl: boolean;
  public LegendeVisible: boolean;
  public Legendehoehe: number;
  public Legendebreite: number;
  public Flagsource: string;
  public Standortliste: Standortestruktur[];
  public Mitrbeiterliste: Mitarbeiterstruktur[][];
  public Kalendertageliste: Kalendertagestruktur[];
  public Kalenderwochenliste: Kalenderwochestruktur[];
  public Monatname: string;
  public Tagesumme: number;
  public Auswahlindex: number;
  public Auswahltitel: string;
  public ShowAuswahl: boolean;
  public MitarbeiterauswahlTitel: string;
  public Auswahlhoehe: number;
  public Headerhoehe: number;
  public Contenthoehe: number;

  constructor(public Menuservice: MenueService,
              public Basics: BasicsProvider,
              public Pool: DatabasePoolService,
              public DB: DatabaseUrlaubService,
              public Const: ConstProvider,
              private DBMitarbeiter: DatabaseMitarbeiterService,
              private DBMitarbeitersettings: DatabaseMitarbeitersettingsService,
              public DBStandort: DatabaseStandorteService,
              public Auswahlservice: AuswahlDialogService,
              public Debug: DebugProvider) {
    try {


      this.DataSubscription      = null;
      this.Message               = '';
      this.MitarbeiterauswahlTitel = '';
      this.Auswahldialogorigin   = this.Const.NONE;
      this.AuswahlIDliste         = [];
      this.Auswahlliste          = [{ Index: 0, FirstColumn: '', SecoundColumn: '', Data: null}];
      this.Auswahlindex          = 0;
      this.Auswahltitel          = '';
      this.ShowMitarbeiterauswahl  = false;
      this.LegendeVisible          = false;
      this.Legendehoehe            = 0;
      this.Legendebreite           = 0;
      this.Flagsource              = '';
      this.Ansichtvariante         = this.Ansichtenvarinaten.Gesamtjahr;
      this.Standortliste           = [];
      this.Mitrbeiterliste         = [];
      this.Kalendertageliste       = [];
      this.Kalenderwochenliste     = [];
      this.Mitrbeiterliste         = [];
      this.Headerhoehe             = 0;
      this.Contenthoehe            = 0;
      this.Tagesumme = 0;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsuebersicht Page', 'constructor', this.Debug.Typen.Page);
    }
  }

  async AuswahlOkButtonClicked(data: any) {

    try {

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.UrlaubPlanung_Standort_Filter:

          this.DBStandort.CurrentStandortfilter        = cloneDeep(data);
          this.Pool.Mitarbeitersettings.StandortFilter = data !== null ? data._id : this.Const.NONE;

          this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings, null).then(() => {

            this.ShowAuswahl = false;

            this.DBStandort.StandortfilterChanged.emit();
          });

          break;

      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Page', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  MitarbeiterWechselnClicked() {

    try {

      this.Auswahldialogorigin    = this.Auswahlservice.Auswahloriginvarianten.Urlaubsplanung_Mitarbeiter_Wechseln;
      this.ShowMitarbeiterauswahl = true;
      this.AuswahlIDliste         = [];


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'MitarbeiterWechselnClicked', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

      this.DataSubscription.unsubscribe();
      this.DataSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'OnDestroy', this.Debug.Typen.Page);
    }
  }


  MitarbeiterauswahlOkButtonClicked(idliste: string[]) {

    try {

      let Mitarbeiter: Mitarbeiterstruktur;

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Urlaubsplanung_Mitarbeiter_Wechseln:

          Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: idliste[0]});

          this.DB.CurrentMitarbeiter = Mitarbeiter;

          debugger;

          this.PrepareData();

          this.DB.PlanungsmonateChanged.emit();

          break;

      }

      this.ShowMitarbeiterauswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsuebersicht Page', 'MitarbeiterauswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  MitarebiterStandortfilterClickedHandler() {

    try {

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.UrlaubPlanung_Standort_Filter;

      let Index = 0;

      this.ShowAuswahl         = true;
      this.Auswahltitel        = 'Standort festlegen';
      this.Auswahlliste        = [];

      this.Auswahlliste.push({ Index: Index, FirstColumn: 'kein Filter', SecoundColumn: '', Data: null });
      Index++;

      for(let Eintrag of this.Pool.Standorteliste) {

        this.Auswahlliste.push({ Index: Index, FirstColumn: Eintrag.Kuerzel, SecoundColumn: Eintrag.Standort, Data: Eintrag });
        Index++;
      }

      if(this.DBStandort.CurrentStandortfilter !== null) {

        this.Auswahlindex = lodash.findIndex(this.Pool.Standorteliste, {_id: this.DBStandort.CurrentStandortfilter._id});
      }
      else this.Auswahlindex = 0;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Page', 'MitarebiterStandortfilterClickedHandler', this.Debug.Typen.Page);
    }
  }


  ngOnInit(): void {

    try {

      let Heute: Moment = moment().locale('de');
      let Monat: number = Heute.month() + 1;

      if(Monat <= 6) this.Ansichtvariante = this.Ansichtenvarinaten.HalbjahrEins;
      else           this.Ansichtvariante = this.Ansichtenvarinaten.HalbjahrZwei;


      this.DataSubscription = this.Pool.LoadingAllDataFinished.subscribe(() => {

        this.PrepareData();
      });

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'OnInit', this.Debug.Typen.Page);
    }
  }

  private async PrepareData() {

    try {

      let Tageanzahl: number;
      let Tagindex: number;
      let Tage: number;
      let Monattext: any = this.DB.CurrentMonatindex + 1;
      let Tag: Kalendertagestruktur;
      let Startdatum: Moment;
      let Standort: Standortestruktur;
      let NextStandort: Standortestruktur;
      let Datum: Moment;
      let CurrentKW: Kalenderwochestruktur;

      this.DB.Init();
      this.DB.CheckSetup();
      this.DB.CountAnfragenanzahlen();

      this.Monatname = this.DB.Monateliste[this.DB.CurrentMonatindex];

      if(Monattext < 10 ) Monattext = '0' + Monattext.toString();
      else                Monattext = Monattext.toString();

      Tageanzahl = moment(this.DB.Jahr.toString() + '-' + Monattext , "YYYY-MM").daysInMonth(); // 31
      this.Tagesumme  = Tageanzahl;

      let MonatStartdatum: Moment   = moment().set({date: 1,          month: this.DB.CurrentMonatindex, year: this.DB.Jahr, hour: 8, minute: 0}).locale('de');
      let MonatEndedatum: Moment    = moment().set({date: Tageanzahl, month: this.DB.CurrentMonatindex, year: this.DB.Jahr, hour: 8, minute: 0}).locale('de');

      Tagindex  = MonatStartdatum.isoWeekday();
      Tage      = Tagindex - 1;
      this.Tagesumme = this.Tagesumme + Tage;

      Startdatum     = MonatStartdatum.clone().subtract(Tage, 'day');
      Datum          = Startdatum.clone();
      Tagindex       = MonatEndedatum.isoWeekday();
      Tage           = 7 - Tagindex;
      this.Tagesumme = this.Tagesumme + Tage;

      CurrentKW = {

        Nummer:     Datum.isoWeek(),
        Tageanzahl: 0
      };

      this.Kalendertageliste   = [];
      this.Kalenderwochenliste = [];

      for(let i = 0; i < this.Tagesumme; i++) {

        Tag = {

          Tagnummer:  Datum.date(),
          Tag:        Datum.format('dd'),
          Datumstring: Datum.format('DD.MM.YYYY'),
          Hauptmonat: Datum.isSameOrAfter(MonatStartdatum, 'day') && Datum.isSameOrBefore(MonatEndedatum, 'day'),
          Kalenderwoche: Datum.isoWeek(),
          Tagstempel: Datum.valueOf(),
          Datum:      Datum,
        };

        this.Kalendertageliste.push(Tag);

        if(Tag.Kalenderwoche === CurrentKW.Nummer) CurrentKW.Tageanzahl++;
        else {

          this.Kalenderwochenliste.push(CurrentKW);

          CurrentKW = {

            Nummer: Tag.Kalenderwoche,
            Tageanzahl: 1
          };
        }

        Datum.add(1, 'day');
      }

      if(this.Kalenderwochenliste[this.Kalenderwochenliste.length - 1].Nummer != CurrentKW.Nummer) {

        this.Kalenderwochenliste.push(CurrentKW);
      };

      this.Standortliste   = [];
      this.Mitrbeiterliste = [];

      for(let Mitarbeiter of this.Pool.Mitarbeiterliste) {

        if(Mitarbeiter.ShowInGesamtuebersicht && Mitarbeiter.Archiviert === false) {

          Standort = lodash.find(this.Pool.Standorteliste, {_id: Mitarbeiter.StandortID});

          if(!lodash.isUndefined(Standort)) {

            NextStandort = lodash.find(this.Standortliste, (standort: Standortestruktur) => {

              return Standort._id === standort._id;
            });

            if(lodash.isUndefined(NextStandort)) {

              this.Standortliste.push(Standort);

              this.Mitrbeiterliste[Standort._id] = [];
              this.Mitrbeiterliste[Standort._id].push(Mitarbeiter);
            }
            else {

              this.Mitrbeiterliste[Standort._id].push(Mitarbeiter);
            }
          }
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'PrepareData', this.Debug.Typen.Page);
    }
  }

  public ionViewDidEnter() {

    try {

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);

      this.Legendebreite = 320;
      this.Legendehoehe  = this.Basics.InnerContenthoehe;


      this.Headerhoehe  = 160;
      this.Contenthoehe = this.Basics.InnerContenthoehe - this.Headerhoehe;

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsuebersicht Page', 'ionViewDidEnter', this.Debug.Typen.Page);
    }
  }

  StandortCheckChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      let Standort: Standortestruktur = lodash.find(this.Pool.Standorteliste, {_id: event.value});

      Standort.ShowInGesamtuebersicht = event.status;

      for(let Mitarbeiter of this.Pool.Mitarbeiterliste) {

        if(Mitarbeiter.StandortID === Standort._id) {

          Mitarbeiter.ShowInGesamtuebersicht = event.status;
        }
      }

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'StandortCheckChanged', this.Debug.Typen.Page);
    }
  }

  MitarbeiterCheckChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      let Mitarbeiter: Mitarbeiterstruktur = lodash.find(this.Pool.Mitarbeiterliste, {_id: event.value});

      Mitarbeiter.ShowInGesamtuebersicht = event.status;

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'MitarbeiterCheckChanged', this.Debug.Typen.Page);
    }
  }

  MonatBackButtonClicked() {

    try {

      if(this.DB.CurrentMonatindex > 0) {

        this.DB.CurrentMonatindex--;

        this.PrepareData();

      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'MonatBackButtonClicked', this.Debug.Typen.Page);
    }
  }

  GetMonatButtonColor(Monatindex: number): string {

    try {

      if(this.DB.CurrentMonatindex === Monatindex) return 'orange';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'GetMonatButtonColor', this.Debug.Typen.Page);
    }
  }

  MonatForwardButtonClicked() {

    try {

      if(this.DB.CurrentMonatindex < 11) {

        this.DB.CurrentMonatindex++;

        this.PrepareData();

      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'MonatForwardButtonClicked', this.Debug.Typen.Page);
    }
  }

  MonatButtonClicked(Monatindex: number) {

    try {

      this.DB.CurrentMonatindex = Monatindex;
      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'MonatButtonClicked', this.Debug.Typen.Page);
    }
  }

  SettingsCheckedChanged(event: {status: boolean; index: number; event: any; value: string}) {

    try {

      switch (event.value) {

        case this.DB.Urlaubstatusvarianten.Geplant:

          this.DB.GesamtuebersichtSetting.ShowGeplant = event.status;

          break;

        case this.DB.Urlaubstatusvarianten.Vertreteranfrage:

          this.DB.GesamtuebersichtSetting.ShowVertreteranfragen = event.status;

          break;

        case this.DB.Urlaubstatusvarianten.Vertreterfreigabe:

          this.DB.GesamtuebersichtSetting.ShowVertreterfreigaben = event.status;

          break;

        case this.DB.Urlaubstatusvarianten.Vertreterablehnung:

          this.DB.GesamtuebersichtSetting.ShowVertreterablehnungen = event.status;

          break;

        case this.DB.Urlaubstatusvarianten.Genehmigt:

          this.DB.GesamtuebersichtSetting.ShowUrlaubsgenehmigungen = event.status;

          break;

        case this.DB.Urlaubstatusvarianten.Abgelehnt:

          this.DB.GesamtuebersichtSetting.ShowUrlaubsablehnungen = event.status;

          break;
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'SettingsCheckedChanged', this.Debug.Typen.Page);
    }
  }

  SettingsHomeofficeCheckedChanged(event: {status: boolean; index: number; event: any; value: string}) {

    try {

      switch (event.value) {

        case this.DB.Homeofficestatusvarianten.Geplant:

          this.DB.GesamtuebersichtSetting.ShowHomeofficeGeplant = event.status;

          break;

        case this.DB.Homeofficestatusvarianten.Freigabeanfrage:

          this.DB.GesamtuebersichtSetting.ShowHomeofficeAnfrage = event.status;

          break;

        case this.DB.Homeofficestatusvarianten.Genehmigt:

          this.DB.GesamtuebersichtSetting.ShowHomeofficeGenehmigt = event.status;

          break;

      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'SettingsHomeofficeCheckedChanged', this.Debug.Typen.Page);
    }
  }
}
