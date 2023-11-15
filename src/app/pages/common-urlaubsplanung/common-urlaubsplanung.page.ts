import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MenueService} from "../../services/menue/menue.service";
import {DebugProvider} from "../../services/debug/debug";
import {BasicsProvider} from "../../services/basics/basics";
import {PageHeaderComponent} from "../../components/page-header/page-header";
import {PageFooterComponent} from "../../components/page-footer/page-footer";
import * as lodash from "lodash-es";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import moment, {Moment} from "moment/moment";
import {DatabaseUrlaubService} from "../../services/database-urlaub/database-urlaub.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Mitarbeitersettingsstruktur} from "../../dataclasses/mitarbeitersettingsstruktur";
import {Subscription} from "rxjs";
import {
  DatabaseMitarbeitersettingsService
} from "../../services/database-mitarbeitersettings/database-mitarbeitersettings.service";
import {ConstProvider} from "../../services/const/const";
import {AuswahlDialogService} from "../../services/auswahl-dialog/auswahl-dialog.service";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import {languageSharp} from "ionicons/icons";

@Component({
  selector: 'common-urlaubsplanung-page',
  templateUrl: 'common-urlaubsplanung.page.html',
  styleUrls: ['common-urlaubsplanung.page.scss'],
})
export class CommonUrlaubsplanungPage implements OnInit, OnDestroy {

  @ViewChild('PageHeader', { static: false }) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', { static: false }) PageFooter: PageFooterComponent;

  public Monateliste_Uebersicht: string[][];
  public Monateliste_Planung: string[];
  public Monateliste_Mounseover: boolean[];
  public Auswahlliste: Auswahldialogstruktur[];
  public BundeslandAuswahlliste: Auswahldialogstruktur[];
  public Auswahlindex: number;
  public Auswahltitel: string;
  public ShowAuswahl: boolean;
  public Auswahlhoehe: number;

  public Message: string;
  public ShowMitarbeitereditor: boolean;
  private Auswahldialogorigin: string;
  private DataSubscription: Subscription;

  constructor(public Menuservice: MenueService,
              public Basics: BasicsProvider,
              private DBMitarbeitersettings: DatabaseMitarbeitersettingsService,
              public Pool: DatabasePoolService,
              public DB: DatabaseUrlaubService,
              private DBMitarbeiter: DatabaseMitarbeiterService,
              public Const: ConstProvider,
              public Auswahlservice: AuswahlDialogService,
              public Debug: DebugProvider) {

    try {

      this.Monateliste_Uebersicht = [];
      this.Monateliste_Uebersicht.push(['Januar', 'Februar', 'März', 'April', 'Mail', 'Juni']);
      this.Monateliste_Uebersicht.push(['Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']);

      this.Monateliste_Planung = ['Januar', 'Februar', 'März', 'April', 'Mail', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
      this.Monateliste_Mounseover = [false, false, false, false, false, false, false, false, false, false, false, false ];

      this.Auswahlliste         = [{ Index: 0, FirstColumn: '', SecoundColumn: '', Data: null}];
      this.Auswahlindex         = 0;
      this.Auswahltitel         = '';
      this.DataSubscription     = null;


      this.Message              = '';
      this.ShowMitarbeitereditor = false;
      this.Auswahldialogorigin   = this.Const.NONE;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Page', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

      this.DataSubscription.unsubscribe();
      this.DataSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);

      this.DataSubscription = this.Pool.LoadingAllDataFinished.subscribe(() => {

        this.PrepareData();
      });

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'OnInit', this.Debug.Typen.Page);
    }
  }

  async AuswahlOkButtonClicked(data: any) {

    try {

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Anrede:

          this.Pool.Mitarbeiterdaten.Anrede = data;
          this.DBMitarbeiter.UpdateMitarbeiter(this.Pool.Mitarbeiterdaten);

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Urlaubsliste_Bundesland:

          this.DB.Bundeslandkuerzel = data;

          let landcode = this.DB.Bundeslandkuerzel.substring(0, 2);

          this.DB.ReadFeiertage(landcode);

          debugger;

          break;
      }

      this.ShowAuswahl = false;

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Page', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  BundeslandClickedHandler() {

    try {

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Urlaubsliste_Bundesland;

      this.Auswahltitel        = 'Bundesland';
      this.Auswahlhoehe        = 600;
      this.Auswahlliste        = this.BundeslandAuswahlliste;
      this.Auswahlindex        = lodash.findIndex(this.Auswahlliste, {Data:this.DB.Bundeslandkuerzel} );
      this.ShowAuswahl         = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Page', 'FortschrittClickedHandler', this.Debug.Typen.Page);
    }
  }

  private async PrepareData() {

    try {

      let Index: number = 0;

      this.BundeslandAuswahlliste  = [];

      for(let Region of this.DB.Regionenliste) {

        this.BundeslandAuswahlliste.push({ Index: Index, FirstColumn: Region.Name, SecoundColumn: Region.isoCode, Data: Region.isoCode });

        Index++;
      }

      this.DB.Bundesland = lodash.find(this.BundeslandAuswahlliste, {Data: this.DB.Bundeslandkuerzel}).FirstColumn;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'PrepareData', this.Debug.Typen.Page);
    }
  }

  FeiertagCrossedEventHandler(event: string) {

    try {

      this.Message = event;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'FeiertagCrossedEventHandler', this.Debug.Typen.Page);
    }
  }

  FerientagCrossedEventHandler(event: string) {

    try {

      this.Message = event;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'FerientagCrossedEventHandler', this.Debug.Typen.Page);
    }
  }

  GetDatum(Anfangstempel: number) {

    return moment(Anfangstempel).format('DD.MM.YYYY');
  }

  AnsichtCheckChanged(event: { status: boolean; index: number; event: any; value: string }, origin: string, landcode: string) {

    try {

      switch (origin) {

        case this.DB.Urlaubstatusvarianten.Ferientag:

          if(landcode === 'DE') this.Pool.Mitarbeitersettings.UrlaubShowFerien_DE = event.status;
          if(landcode === 'BG') this.Pool.Mitarbeitersettings.UrlaubShowFerien_BG = event.status;

          break;

        case this.DB.Urlaubstatusvarianten.Feiertag:

          if(landcode === 'DE') this.Pool.Mitarbeitersettings.UrlaubShowFeiertage_DE = event.status;
          if(landcode === 'BG') this.Pool.Mitarbeitersettings.UrlaubShowFeiertage_BG = event.status;

          break;

        case this.DB.Urlaubstatusvarianten.Beantrag:

          this.Pool.Mitarbeitersettings.UrlaubShowBeantragt = event.status;

          break;

        case this.DB.Urlaubstatusvarianten.Vertreterfreigabe:

          this.Pool.Mitarbeitersettings.UrlaubShowVertreterfreigabe = event.status;

          break;

        case this.DB.Urlaubstatusvarianten.Genehmigt:

          this.Pool.Mitarbeitersettings.UrlaubShowGenehmigt = event.status;

          break;

        case this.DB.Urlaubstatusvarianten.Abgelehnt:

          this.Pool.Mitarbeitersettings.UrlaubShowAbgelehnt = event.status;

          break;
      }

      this.DBMitarbeitersettings.SaveMitarbeitersettings().then(() => {


      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'AnsichtCheckChanged', this.Debug.Typen.Page);
    }
  }

  AnredeClickedEventHandler() {

    try {

      this.ShowAuswahl  = true;
      this.Auswahltitel = 'Anrede festlegen';
      this.Auswahlliste = [];

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Anrede;

      this.Auswahlliste.push({ Index: 0, FirstColumn: 'Unbekannt', SecoundColumn: '', Data: this.Const.NONE });
      this.Auswahlliste.push({ Index: 1, FirstColumn: 'Frau',      SecoundColumn: '', Data: 'Frau' });
      this.Auswahlliste.push({ Index: 2, FirstColumn: 'Herr',      SecoundColumn: '', Data: 'Herr' });

      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data: this.Pool.Mitarbeiterdaten.Anrede});

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'AnredeClickedEventHandler', this.Debug.Typen.Page);
    }
  }

  GetMonatButtonColor(Monatindex: number): string {

    try {

      if(this.DB.CurrentMonatindex === Monatindex) return 'orange';
      else {

        return this.Monateliste_Mounseover[Monatindex] === true ? this.Basics.Farben.BAEBlau : 'black';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'GetMonatButtonColor', this.Debug.Typen.Page);
    }
  }

  MonatButtonClicked(Monatindex: number) {

    try {

      this.DB.CurrentMonatindex = Monatindex;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'MonatButtonClicked', this.Debug.Typen.Page);
    }
  }
}
