import {Component, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'common-urlaubsplanung-page',
  templateUrl: 'common-urlaubsplanung.page.html',
  styleUrls: ['common-urlaubsplanung.page.scss'],
})
export class CommonUrlaubsplanungPage implements OnInit {

  @ViewChild('PageHeader', { static: false }) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', { static: false }) PageFooter: PageFooterComponent;

  public Monateliste: string[][];
  public Auswahlliste: Auswahldialogstruktur[];
  public BundeslandAuswahlliste: Auswahldialogstruktur[];
  public Auswahlindex: number;
  public Auswahltitel: string;
  public ShowAuswahl: boolean;
  public Auswahlhoehe: number;

  public Message: string;
  private SettingsSubscription: Subscription;

  constructor(public Menuservice: MenueService,
              public Basics: BasicsProvider,
              private DBMitarbeitersettings: DatabaseMitarbeitersettingsService,
              public Pool: DatabasePoolService,
              public DB: DatabaseUrlaubService,
              public Debug: DebugProvider) {

    try {

      this.Monateliste = [];
      this.Monateliste.push(['Januar', 'Februar', 'März', 'April', 'Mail', 'Juni']);
      this.Monateliste.push(['Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']);

      this.Auswahlliste         = [{ Index: 0, FirstColumn: '', SecoundColumn: '', Data: null}];
      this.Auswahlindex         = 0;
      this.Auswahltitel         = '';

      this.SettingsSubscription = null;

      this.Message              = '';

      this.BundeslandAuswahlliste  = [];
      this.BundeslandAuswahlliste.push({ Index:  0, FirstColumn:   'Baden-Württemberg', SecoundColumn: '', Data:   'bw' });
      this.BundeslandAuswahlliste.push({ Index:  1, FirstColumn:   'Bayern', SecoundColumn: '', Data:   'by' });
      this.BundeslandAuswahlliste.push({ Index:  2, FirstColumn:   'Berlin', SecoundColumn: '', Data:   'be' });
      this.BundeslandAuswahlliste.push({ Index:  3, FirstColumn:   'Brandenburg', SecoundColumn: '', Data:   'bb' });
      this.BundeslandAuswahlliste.push({ Index:  4, FirstColumn:   'Bremen', SecoundColumn: '', Data:   'hb' });
      this.BundeslandAuswahlliste.push({ Index:  5, FirstColumn:   'Hamburg', SecoundColumn: '', Data:   'hh' });
      this.BundeslandAuswahlliste.push({ Index:  6, FirstColumn:   'Hessen', SecoundColumn: '', Data:   'he' });
      this.BundeslandAuswahlliste.push({ Index:  7, FirstColumn:   'Mecklenburg-Vorpommern', SecoundColumn: '', Data:   'mv' });
      this.BundeslandAuswahlliste.push({ Index:  8, FirstColumn:   'Niedersachsen', SecoundColumn: '', Data:   'ni' });
      this.BundeslandAuswahlliste.push({ Index:  9, FirstColumn:   'Nordrhrein-Westfalen', SecoundColumn: '', Data:   'nw' });
      this.BundeslandAuswahlliste.push({ Index: 10, FirstColumn:   'Rheinland-Pfalz', SecoundColumn: '', Data:   'rp' });
      this.BundeslandAuswahlliste.push({ Index: 11, FirstColumn:   'Saarland', SecoundColumn: '', Data:   'sl' });
      this.BundeslandAuswahlliste.push({ Index: 12, FirstColumn:   'Sachsen', SecoundColumn: '', Data:   'sn' });
      this.BundeslandAuswahlliste.push({ Index: 13, FirstColumn:   'Sachsen-Anhalt', SecoundColumn: '', Data:   'st' });
      this.BundeslandAuswahlliste.push({ Index: 14, FirstColumn:   'Schleswig-Holstein', SecoundColumn: '', Data:   'sh' });
      this.BundeslandAuswahlliste.push({ Index: 15, FirstColumn:   'Thüringen', SecoundColumn: '', Data:   'th' });

      this.DB.Bundesland = lodash.find(this.BundeslandAuswahlliste, {Data: this.DB.Bundeslandkuerzel}).FirstColumn;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Page', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);

      this.SettingsSubscription = this.Pool.MitarbeitersettingsChanged.subscribe(() => {


      });

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'OnInit', this.Debug.Typen.Page);
    }
  }

  async AuswahlOkButtonClicked(data: any) {

    try {

      this.DB.Bundeslandkuerzel = data;
      this.DB.Bundesland        = lodash.find(this.BundeslandAuswahlliste, {Data: this.DB.Bundeslandkuerzel}).FirstColumn;
      this.ShowAuswahl          = false;

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Page', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  BundeslandClickedHandler() {

    try {

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

      await this.DB.ReadFeiertage();
      await this.DB.ReadFerien();

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

  AnsichtCheckChanged(event: {status: boolean; index: number; event: any; value: string}, origin: string) {

    try {

      switch (origin) {

        case this.DB.Urlaubstatusvarianten.Ferientag:

          this.Pool.Mitarbeitersettings.UrlaubShowFerien = event.status;

          break;

        case this.DB.Urlaubstatusvarianten.Feiertag:

          this.Pool.Mitarbeitersettings.UrlaubShowFeiertage = event.status;

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
}
