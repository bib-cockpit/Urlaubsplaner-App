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
import {Urlaubsstruktur} from "../../dataclasses/urlaubsstruktur";
import {Urlaubprojektbeteiligtestruktur} from "../../dataclasses/urlaubprojektbeteiligtestruktur";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";

@Component({
  selector: 'common-urlaub-uebersicht-page',
  templateUrl: 'common-urlaub-uebersicht.page.html',
  styleUrls: ['common-urlaub-uebersicht.page.scss'],
})
export class CommonUrlaubUebersichtPage implements OnInit, OnDestroy {

  @ViewChild('PageHeader', { static: false }) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', { static: false }) PageFooter: PageFooterComponent;

  public Ansichtenvarinaten = {

    Gesamtjahr:   'Gesamtjahr',
    HalbjahrEins: 'HalbjahrEins',
    HalbjahrZwei: 'HalbjahrZwei'
  };

  public Monateliste_Gesamtjahr: string[][];
  public Auswahlliste: Auswahldialogstruktur[];
  public BundeslandAuswahlliste: Auswahldialogstruktur[];
  public Auswahlindex: number;
  public Auswahltitel: string;
  public ShowAuswahl: boolean;
  public Auswahlhoehe: number;
  public Ansichtvariante: string;

  public Message: string;
  public ShowMitarbeitereditor: boolean;
  public AddUrlaubRunning: boolean;
  private Auswahldialogorigin: string;
  private DataSubscription: Subscription;
  public AuswahlIDliste: string[];
  public MitarbeiterauswahlTitel: string;
  public ShowMitarbeiterauswahl: boolean;
  public LegendeVisible: boolean;
  public Legendehoehe: number;
  public Legendebreite: number;
  public Flagsource: string;
  public Monateliste_HalbjahrEins: string[];
  public Monateliste_HalbjahrZwei: string[];

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

      this.Monateliste_Gesamtjahr = [];
      this.Monateliste_Gesamtjahr.push(['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni']);
      this.Monateliste_Gesamtjahr.push(['Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']);

      this.Monateliste_HalbjahrEins = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni'];
      this.Monateliste_HalbjahrZwei = ['Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

      this.Auswahlliste          = [{ Index: 0, FirstColumn: '', SecoundColumn: '', Data: null}];
      this.Auswahlindex          = 0;
      this.Auswahltitel          = '';
      this.DataSubscription      = null;
      this.Message               = '';
      this.ShowMitarbeitereditor = false;
      this.Auswahldialogorigin   = this.Const.NONE;
      this.AddUrlaubRunning      = false;
      this.AuswahlIDliste         = [];
      this.MitarbeiterauswahlTitel = '';
      this.ShowMitarbeiterauswahl  = false;
      this.LegendeVisible          = false;
      this.Legendehoehe            = 0;
      this.Legendebreite           = 0;
      this.Flagsource              = '';
      this.Ansichtvariante         = this.Ansichtenvarinaten.Gesamtjahr;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsuebersicht Page', 'constructor', this.Debug.Typen.Page);
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

  public ionViewDidEnter() {

    try {

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);

      this.Legendebreite = 400;
      this.Legendehoehe  = this.Basics.InnerContenthoehe;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsuebersicht Page', 'ionViewDidEnter', this.Debug.Typen.Page);
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


  MitarbeiterauswahlOkButtonClicked(idliste: string[]) {

    try {

      let Mitarbeiter: Mitarbeiterstruktur;

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Urlaubsplanung_Mitarbeiter_Wechseln:

          Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: idliste[0]});

          this.DB.CurrentMitarbeiter = Mitarbeiter;


          this.PrepareData();

          break;

      }

      this.ShowMitarbeiterauswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Page', 'MitarbeiterauswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  async AuswahlOkButtonClicked(data: any) {

    try {

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Urlaubsliste_Bundesland:

          this.DB.Bundeslandkuerzel = data;

          let landcode = this.DB.Bundeslandkuerzel.substring(0, 2);

          this.DB.ReadFeiertage(landcode);

          debugger;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.UrlaubUebersicht_Standort_Filter:


          this.DBStandort.CurrentStandortfilter        = cloneDeep(data);
          this.Pool.Mitarbeitersettings.StandortFilter = data !== null ? data._id : this.Const.NONE;

          this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings, null).then(() => {

            this.ShowAuswahl = false;

            this.DBStandort.StandortfilterChanged.emit();
          });

          break;
      }



      this.ShowAuswahl = false;

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsuebersicht Page', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }



  private async PrepareData() {

    try {

      let Index: number = 0;

      this.DB.Init();
      this.DB.CheckSetup();
      this.DB.SetPlanungsmonate();
      this.DB.CountAnfragenanzahlen();

      this.BundeslandAuswahlliste  = [];

      for(let Region of this.DB.Regionenliste) {

        this.BundeslandAuswahlliste.push({ Index: Index, FirstColumn: Region.Name, SecoundColumn: Region.isoCode, Data: Region.isoCode });

        Index++;
      }

      this.DB.Bundesland = lodash.find(this.BundeslandAuswahlliste, {Data: this.DB.Bundeslandkuerzel}).FirstColumn;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'PrepareData', this.Debug.Typen.Page);
    }
  }

  FeiertagCrossedEventHandler(Daten: {Name: string; Laendercode: string}) {

    try {

      this.Message = Daten.Name;

      if(Daten.Laendercode !== '') {

        this.Flagsource  = 'assets/images/';
        this.Flagsource += Daten.Laendercode === 'DE' ? 'de.png' : 'bg.png';
      }
      else {

        this.Flagsource = '';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'FeiertagCrossedEventHandler', this.Debug.Typen.Page);
    }
  }

  FerientagCrossedEventHandler(Daten: {Name: string; Laendercode: string}) {

    try {

      this.Message = Daten.Name;

      if(Daten.Laendercode !== '') {

        this.Flagsource  = 'assets/images/';
        this.Flagsource += Daten.Laendercode === 'DE' ? 'de.png' : 'bg.png';
      }
      else {

        this.Flagsource = '';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'FerientagCrossedEventHandler', this.Debug.Typen.Page);
    }
  }

  GetDatum(Anfangstempel: number) {

    return moment(Anfangstempel).format('DD.MM.YYYY');
  }


  MitarebiterStandortfilterClickedHandler() {

    try {

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.UrlaubUebersicht_Standort_Filter;

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

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsuebersicht Page', 'MitarebiterStandortfilterClickedHandler', this.Debug.Typen.Page);
    }
  }

  DisplayExternCheckChanged(event: { status: boolean; index: number; event: any; value: string }, Urlaub: Urlaubsstruktur, i: number) {

    try {

      let Beteiligt: Urlaubprojektbeteiligtestruktur = lodash.find(this.DB.CurrentUrlaub.Projektbeteiligteliste, {MitarbeiterID: Urlaub.MitarbeiterIDExtern});

      if(!lodash.isUndefined(Beteiligt)) Beteiligt.Display = event.status;

      let Urlaubindex = lodash.findIndex(this.DB.CurrentMitarbeiter.Urlaubsliste, { Jahr: this.DB.Jahr });

      this.DB.CurrentMitarbeiter.Urlaubsliste[Urlaubindex] = this.DB.CurrentUrlaub;

      this.DBMitarbeiter.UpdateMitarbeiterUrlaub(this.DB.CurrentMitarbeiter).then(() => {

        this.DB.ExterneUrlaubeChanged.emit();
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'DisplayExternCheckChanged', this.Debug.Typen.Page);
    }
  }

  AnsichtFeiertageCheckChanged(event: { status: boolean; index: number; event: any; value: string }, landcode: string) {

    try {

      switch (landcode) {

        case 'DE':

          this.Pool.Mitarbeitersettings.UrlaubShowFeiertage_DE = event.status;
          this.DB.ShowFeiertage_DE = event.status;

          break;

        case 'BG':

          this.Pool.Mitarbeitersettings.UrlaubShowFeiertage_BG = event.status;
          this.DB.ShowFeiertage_BG = event.status;

          break;
      }

      this.DBMitarbeitersettings.SaveMitarbeitersettings().then(() => {

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'AnsichtFeiertageCheckChanged', this.Debug.Typen.Page);
    }
  }

  AnsichtFerientageCheckChanged(event: { status: boolean; index: number; event: any; value: string }, landcode: string) {

    try {

      switch (landcode) {

        case 'DE':

          this.Pool.Mitarbeitersettings.UrlaubShowFerien_DE = event.status;
          this.DB.ShowFerientage_DE = event.status;

          break;

        case 'BG':

          this.Pool.Mitarbeitersettings.UrlaubShowFerien_BG = event.status;
          this.DB.ShowFerientage_BG = event.status;

          break;
      }

      this.DBMitarbeitersettings.SaveMitarbeitersettings().then(() => {

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'AnsichtFerientageCheckChanged', this.Debug.Typen.Page);
    }
  }

  JahrButtonClicked() {

    try {

      this.Ansichtvariante = this.Ansichtenvarinaten.Gesamtjahr;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'JahrButtonClicked', this.Debug.Typen.Page);
    }
  }

  HalbjahrEinsButtonClicked() {

    try {

      this.Ansichtvariante = this.Ansichtenvarinaten.HalbjahrEins;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'HalbjahrEinsButtonClicked', this.Debug.Typen.Page);
    }
  }

  HalbjahrZweiButtonClicked() {

    try {

      this.Ansichtvariante = this.Ansichtenvarinaten.HalbjahrZwei;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsuebersicht Page', 'HalbjahrZweiButtonClicked', this.Debug.Typen.Page);
    }
  }
}
