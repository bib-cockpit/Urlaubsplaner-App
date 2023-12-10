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
import {backspace, languageSharp} from "ionicons/icons";
import {Urlauzeitspannenstruktur} from "../../dataclasses/urlauzeitspannenstruktur";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {Urlaubsstruktur} from "../../dataclasses/urlaubsstruktur";
import {cloneDeep} from "lodash-es";
import {Ferienstruktur} from "../../dataclasses/ferienstruktur";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {Feiertagestruktur} from "../../dataclasses/feiertagestruktur";
import {Urlaubprojektbeteiligtestruktur} from "../../dataclasses/urlaubprojektbeteiligtestruktur";

@Component({
  selector: 'common-urlaub-einstellungen-page',
  templateUrl: 'common-urlaub-einstellungen.page.html',
  styleUrls: ['common-urlaub-einstellungen.page.scss'],
})
export class CommonUrlaubEinstellungenPage implements OnInit, OnDestroy {

  @ViewChild('PageHeader', {static: false}) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', {static: false}) PageFooter: PageFooterComponent;

  public Auswahlliste: Auswahldialogstruktur[];
  public Auswahlindex: number;
  public Auswahltitel: string;
  public ShowAuswahl: boolean;
  public Auswahlhoehe: number;

  private Auswahldialogorigin: string;
  private DataSubscription: Subscription;
  public ShowMitarbeiterauswahl: boolean;
  public AuswahlIDliste: string[];
  public MitarbeiterauswahlTitel: string;
  public Projektbeteiligteliste: Mitarbeiterstruktur[];
  public MitarbeiterMultiselect: boolean;
  public Ferienliste: Ferienstruktur[];
  public Feiertageliste: Feiertagestruktur[];

  constructor(public Menuservice: MenueService,
              public Basics: BasicsProvider,
              private DBMitarbeitersettings: DatabaseMitarbeitersettingsService,
              public Pool: DatabasePoolService,
              public DB: DatabaseUrlaubService,
              private DBMitarbeiter: DatabaseMitarbeiterService,
              public Const: ConstProvider,
              public DBStandort: DatabaseStandorteService,
              public DBMitarbeiterstettings: DatabaseMitarbeitersettingsService,
              public Auswahlservice: AuswahlDialogService,
              public Debug: DebugProvider) {
    try {

      this.Auswahlliste = [{Index: 0, FirstColumn: '', SecoundColumn: '', Data: null}];
      this.Auswahlindex = 0;
      this.Auswahltitel = '';
      this.DataSubscription = null;
      this.Auswahldialogorigin = this.Const.NONE;
      this.ShowMitarbeiterauswahl = false;
      this.AuswahlIDliste = [];
      this.MitarbeiterauswahlTitel = '';
      this.MitarbeiterMultiselect = true;
      this.Ferienliste = [];
      this.Feiertageliste = [];
      this.Projektbeteiligteliste = [];


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaub Einstellungen Page', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'OnDestroy', this.Debug.Typen.Page);
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

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'OnInit', this.Debug.Typen.Page);
    }
  }

  private PrepareData() {

    try {

      let Mitarbeiter: Mitarbeiterstruktur;
      let Standort: Standortestruktur;

      this.DB.Init();

      this.Projektbeteiligteliste = [];


      for (let Eintrag of this.DB.CurrentUrlaub.Projektbeteiligteliste) {

        Mitarbeiter = this.DBMitarbeiter.GetMitarbeiterByID(Eintrag.MitarbeiterID);

        if (Mitarbeiter !== null) this.Projektbeteiligteliste.push(Mitarbeiter);
      }

      this.Projektbeteiligteliste.sort((a: Mitarbeiterstruktur, b: Mitarbeiterstruktur) => {

        if (a.Name > b.Name) return -1;
        if (a.Name < b.Name) return 1;
        return 0;
      });

      this.Ferienliste = [];

      if (!lodash.isUndefined(this.DB.Ferienliste[this.DB.Laendercode])) {

        this.Ferienliste = lodash.cloneDeep(this.DB.Ferienliste[this.DB.Laendercode]);
      }

      this.Feiertageliste = [];

      if (!lodash.isUndefined(this.DB.Feiertageliste[this.DB.Laendercode])) {

        this.Feiertageliste = lodash.cloneDeep(this.DB.Feiertageliste[this.DB.Laendercode]);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'PrepareData', this.Debug.Typen.Page);
    }
  }

  MitarbeiterauswahlOkButtonClicked(idliste: string[]) {

    try {

      let Urlaub: Urlaubsstruktur;
      let Eintrag: Urlaubprojektbeteiligtestruktur;

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.UrlaubEinstellungen_Projektbeteiligte_Auswahl:

          this.DB.CurrentUrlaub.Projektbeteiligteliste = lodash.filter( this.DB.CurrentUrlaub.Projektbeteiligteliste, (beteiligt: Urlaubprojektbeteiligtestruktur) => {

            return idliste.indexOf(beteiligt.MitarbeiterID) !== -1;
          });

          for(let id of idliste) {

            Eintrag = lodash.find(this.DB.CurrentUrlaub.Projektbeteiligteliste, {MitarbeiterID: id});

            if(lodash.isUndefined(Eintrag)) this.DB.CurrentUrlaub.Projektbeteiligteliste.push({
              MitarbeiterID: id,
              Display: false
            });
          }

          Urlaub = lodash.find(this.Pool.Mitarbeiterdaten.Urlaubsliste, {Jahr: this.DB.CurrentUrlaub.Jahr});

          if (!lodash.isUndefined(Urlaub)) {

            Urlaub.Projektbeteiligteliste = this.DB.CurrentUrlaub.Projektbeteiligteliste;

            this.DBMitarbeiter.UpdateMitarbeiter(this.Pool.Mitarbeiterdaten).then(() => {

              this.PrepareData();
            });
          }

          break;

        case this.Auswahlservice.Auswahloriginvarianten.UrlaubEinstellungen_Freigeber_Auswahl:

          this.DB.CurrentUrlaub.FreigeberID = lodash.isUndefined(idliste[0]) ? null : idliste[0];

          Urlaub = lodash.find(this.Pool.Mitarbeiterdaten.Urlaubsliste, {Jahr: this.DB.CurrentUrlaub.Jahr});

          if (!lodash.isUndefined(Urlaub)) {

            Urlaub.FreigeberID = lodash.isUndefined(idliste[0]) ? null : idliste[0];

            this.DBMitarbeiter.UpdateMitarbeiter(this.Pool.Mitarbeiterdaten).then(() => {

              this.PrepareData();
            });
          }

          break;
      }

      this.ShowMitarbeiterauswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaub Einstellungen Page', 'MitarbeiterauswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  MitarebiterStandortfilterClickedHandler() {

    try {

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.UrlaubEinstellungen_Standort_Filter;

      let Index = 0;

      this.ShowAuswahl = true;
      this.Auswahltitel = 'Standort festlegen';
      this.Auswahlliste = [];

      this.Auswahlliste.push({Index: Index, FirstColumn: 'kein Filter', SecoundColumn: '', Data: null});
      Index++;

      for (let Eintrag of this.Pool.Standorteliste) {

        this.Auswahlliste.push({
          Index: Index,
          FirstColumn: Eintrag.Kuerzel,
          SecoundColumn: Eintrag.Standort,
          Data: Eintrag
        });
        Index++;
      }

      if (this.DBStandort.CurrentStandortfilter !== null) {

        this.Auswahlindex = lodash.findIndex(this.Pool.Standorteliste, {_id: this.DBStandort.CurrentStandortfilter._id});
      } else this.Auswahlindex = 0;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaub Einstellungen Page', 'MitarebiterStandortfilterClickedHandler', this.Debug.Typen.Page);
    }
  }

  async AuswahlOkButtonClicked(data: any) {

    try {

      let Urlaub: Urlaubsstruktur;

      switch (this.Auswahldialogorigin) {

        case 'Resturlaub':

          this.DB.CurrentUrlaub.Resturlaub = data;

          Urlaub = lodash.find(this.Pool.Mitarbeiterdaten.Urlaubsliste, {Jahr: this.DB.CurrentUrlaub.Jahr});

          if (!lodash.isUndefined(Urlaub)) {

            Urlaub.Resturlaub = data;

            this.DBMitarbeiter.UpdateMitarbeiter(this.Pool.Mitarbeiterdaten);
          }

          break;

        case 'Urlaub':

          this.Pool.Mitarbeiterdaten.Urlaub = data;

          this.DBMitarbeiter.UpdateMitarbeiter(this.Pool.Mitarbeiterdaten);

          break;

        case this.Auswahlservice.Auswahloriginvarianten.UrlaubEinstellungen_Standort_Filter:

          this.DBStandort.CurrentStandortfilter = cloneDeep(data);
          this.Pool.Mitarbeitersettings.StandortFilter = data !== null ? data._id : this.Const.NONE;

          this.DBMitarbeiterstettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings, null).then(() => {

            this.PrepareData();
          });

          break;
      }

      this.ShowAuswahl = false;

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaub Einstellungen Page', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  MitarbeiterAuswahlClicked() {

    try {

      this.Auswahldialogorigin     = this.Auswahlservice.Auswahloriginvarianten.UrlaubEinstellungen_Projektbeteiligte_Auswahl;
      this.MitarbeiterauswahlTitel = 'Mitarbeiter/innen auswählen';
      this.ShowMitarbeiterauswahl  = true;
      this.AuswahlIDliste          = [];
      this.MitarbeiterMultiselect  = true;

      for(let eintrag of this.DB.CurrentUrlaub.Projektbeteiligteliste) {

        this.AuswahlIDliste.push(eintrag.MitarbeiterID);
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'MitarbeiterWechselnClicked', this.Debug.Typen.Page);
    }
  }


  ResturlaubClickedEvent() {

    try {

      this.Auswahldialogorigin = 'Resturlaub';
      this.Auswahlhoehe = 600;
      this.Auswahltitel = 'Resturlaub festlegen';
      this.Auswahlliste = [];

      this.Auswahlliste.push({Index: 0, FirstColumn: '0,5', SecoundColumn: 'Tage', Data: 0.5});
      this.Auswahlliste.push({Index: 1, FirstColumn: '1,0', SecoundColumn: 'Tag', Data: 1.0});
      this.Auswahlliste.push({Index: 2, FirstColumn: '1,5', SecoundColumn: 'Tage', Data: 1.5});
      this.Auswahlliste.push({Index: 3, FirstColumn: '2,0', SecoundColumn: 'Tage', Data: 2.0});
      this.Auswahlliste.push({Index: 4, FirstColumn: '2,5', SecoundColumn: 'Tage', Data: 2.5});
      this.Auswahlliste.push({Index: 5, FirstColumn: '3,0', SecoundColumn: 'Tage', Data: 3.0});
      this.Auswahlliste.push({Index: 6, FirstColumn: '3,5', SecoundColumn: 'Tage', Data: 3.5});
      this.Auswahlliste.push({Index: 7, FirstColumn: '4,0', SecoundColumn: 'Tage', Data: 4.0});
      this.Auswahlliste.push({Index: 8, FirstColumn: '4,5', SecoundColumn: 'Tage', Data: 4.5});
      this.Auswahlliste.push({Index: 9, FirstColumn: '5,0', SecoundColumn: 'Tage', Data: 5.0});
      this.Auswahlliste.push({Index: 10, FirstColumn: '5,5', SecoundColumn: 'Tage', Data: 5.5});
      this.Auswahlliste.push({Index: 11, FirstColumn: '6,0', SecoundColumn: 'Tage', Data: 6.0});
      this.Auswahlliste.push({Index: 12, FirstColumn: '6,5', SecoundColumn: 'Tage', Data: 6.5});
      this.Auswahlliste.push({Index: 13, FirstColumn: '7,0', SecoundColumn: 'Tage', Data: 7.0});
      this.Auswahlliste.push({Index: 14, FirstColumn: '7,5', SecoundColumn: 'Tage', Data: 7.5});
      this.Auswahlliste.push({Index: 15, FirstColumn: '8,0', SecoundColumn: 'Tage', Data: 8.0});
      this.Auswahlliste.push({Index: 16, FirstColumn: '8,5', SecoundColumn: 'Tage', Data: 8.5});
      this.Auswahlliste.push({Index: 17, FirstColumn: '9,0', SecoundColumn: 'Tage', Data: 9.0});
      this.Auswahlliste.push({Index: 18, FirstColumn: '9,5', SecoundColumn: 'Tage', Data: 9.5});
      this.Auswahlliste.push({Index: 19, FirstColumn: '10,0', SecoundColumn: 'Tage', Data: 10.0});

      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, (Eintrag: Auswahldialogstruktur) => {

        return Eintrag.Data === this.DB.CurrentUrlaub.Resturlaub;
      });

      this.ShowAuswahl = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'ResturlaubClickedEvent', this.Debug.Typen.Page);
    }
  }

  GetResturlaub(): string {

    try {

      let Text = this.DB.CurrentUrlaub.Resturlaub.toString();

      if (this.DB.CurrentUrlaub.Resturlaub === 1) {

        Text += ' Tag';
      } else {

        Text += ' Tage';
      }

      return Text;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'GetResturlaub', this.Debug.Typen.Page);
    }
  }

  GetDatum(stempel: number) {

    try {

      return moment(stempel).format('DD.MM.YYYY');

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'GetDatum', this.Debug.Typen.Page);
    }

  }

  UrlaubClickedEvent() {

    try {

      this.Auswahldialogorigin = 'Urlaub';
      this.Auswahlhoehe = 600;
      this.Auswahltitel = 'Urlaubsanspruch festlegen';
      this.Auswahlliste = [];

      this.Auswahlliste.push({Index: 0, FirstColumn: '10', SecoundColumn: 'Tage', Data: 10});
      this.Auswahlliste.push({Index: 1, FirstColumn: '11', SecoundColumn: 'Tage', Data: 11});
      this.Auswahlliste.push({Index: 2, FirstColumn: '12', SecoundColumn: 'Tage', Data: 12});
      this.Auswahlliste.push({Index: 3, FirstColumn: '13', SecoundColumn: 'Tage', Data: 13});
      this.Auswahlliste.push({Index: 4, FirstColumn: '14', SecoundColumn: 'Tage', Data: 14});
      this.Auswahlliste.push({Index: 5, FirstColumn: '15', SecoundColumn: 'Tage', Data: 15});
      this.Auswahlliste.push({Index: 6, FirstColumn: '16', SecoundColumn: 'Tage', Data: 16});
      this.Auswahlliste.push({Index: 7, FirstColumn: '17', SecoundColumn: 'Tage', Data: 17});
      this.Auswahlliste.push({Index: 8, FirstColumn: '18', SecoundColumn: 'Tage', Data: 18});
      this.Auswahlliste.push({Index: 9, FirstColumn: '19', SecoundColumn: 'Tage', Data: 19});
      this.Auswahlliste.push({Index: 10, FirstColumn: '20', SecoundColumn: 'Tage', Data: 20});
      this.Auswahlliste.push({Index: 11, FirstColumn: '21', SecoundColumn: 'Tage', Data: 21});
      this.Auswahlliste.push({Index: 12, FirstColumn: '22', SecoundColumn: 'Tage', Data: 22});
      this.Auswahlliste.push({Index: 13, FirstColumn: '23', SecoundColumn: 'Tage', Data: 23});
      this.Auswahlliste.push({Index: 14, FirstColumn: '24', SecoundColumn: 'Tage', Data: 24});
      this.Auswahlliste.push({Index: 15, FirstColumn: '25', SecoundColumn: 'Tage', Data: 25});
      this.Auswahlliste.push({Index: 16, FirstColumn: '26', SecoundColumn: 'Tage', Data: 26});
      this.Auswahlliste.push({Index: 17, FirstColumn: '27', SecoundColumn: 'Tage', Data: 27});
      this.Auswahlliste.push({Index: 18, FirstColumn: '28', SecoundColumn: 'Tage', Data: 28});
      this.Auswahlliste.push({Index: 19, FirstColumn: '29', SecoundColumn: 'Tage', Data: 29});
      this.Auswahlliste.push({Index: 20, FirstColumn: '30', SecoundColumn: 'Tage', Data: 30});
      this.Auswahlliste.push({Index: 21, FirstColumn: '31', SecoundColumn: 'Tage', Data: 31});
      this.Auswahlliste.push({Index: 22, FirstColumn: '32', SecoundColumn: 'Tage', Data: 32});
      this.Auswahlliste.push({Index: 23, FirstColumn: '33', SecoundColumn: 'Tage', Data: 33});
      this.Auswahlliste.push({Index: 24, FirstColumn: '34', SecoundColumn: 'Tage', Data: 34});
      this.Auswahlliste.push({Index: 25, FirstColumn: '35', SecoundColumn: 'Tage', Data: 35});
      this.Auswahlliste.push({Index: 26, FirstColumn: '36', SecoundColumn: 'Tage', Data: 36});

      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, (Eintrag: Auswahldialogstruktur) => {

        return Eintrag.Data === this.Pool.Mitarbeiterdaten.Urlaub;
      });

      this.ShowAuswahl = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'ResturlaubClickedEvent', this.Debug.Typen.Page);
    }
  }

  CheckFerienBlocker(Anfangstempel: number): boolean {

    try {


      return this.DB.CurrentUrlaub.Ferienblockerliste.indexOf(Anfangstempel) === -1;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'CheckFerienBlocker', this.Debug.Typen.Page);
    }

  }

  FerienBlockedChanged(event: { status: boolean; index: number; event: any; value: string }, Anfangstempel: number) {

    try {

      let Urlaub: Urlaubsstruktur;

      if (event.status === false) {

        this.DB.CurrentUrlaub.Ferienblockerliste.push(Anfangstempel);
      } else {

        this.DB.CurrentUrlaub.Ferienblockerliste = lodash.filter(this.DB.CurrentUrlaub.Ferienblockerliste, (stempel: number) => {

          return stempel !== Anfangstempel;
        });
      }

      Urlaub = lodash.find(this.Pool.Mitarbeiterdaten.Urlaubsliste, {Jahr: this.DB.CurrentUrlaub.Jahr});

      if (!lodash.isUndefined(Urlaub)) {

        Urlaub.Ferienblockerliste = this.DB.CurrentUrlaub.Ferienblockerliste;

        this.DBMitarbeiter.UpdateMitarbeiter(this.Pool.Mitarbeiterdaten);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'FereinBlockedChanged', this.Debug.Typen.Page);
    }

  }

  CheckFeiertagBlocker(Anfangstempel: any) {

    try {
      return this.DB.CurrentUrlaub.Feiertageblockerliste.indexOf(Anfangstempel) === -1;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'CheckFeiertagBlocker', this.Debug.Typen.Page);
    }
  }


  FeiertagBlockedChanged(event: { status: boolean; index: number; event: any; value: string }, Anfangstempel: number) {

    try {

      let Urlaub: Urlaubsstruktur;

      if (event.status === false) {

        this.DB.CurrentUrlaub.Feiertageblockerliste.push(Anfangstempel);
      } else {

        this.DB.CurrentUrlaub.Feiertageblockerliste = lodash.filter(this.DB.CurrentUrlaub.Feiertageblockerliste, (stempel: number) => {

          return stempel !== Anfangstempel;
        });
      }

      Urlaub = lodash.find(this.Pool.Mitarbeiterdaten.Urlaubsliste, {Jahr: this.DB.CurrentUrlaub.Jahr});

      if (!lodash.isUndefined(Urlaub)) {

        Urlaub.Feiertageblockerliste = this.DB.CurrentUrlaub.Feiertageblockerliste;

        this.DBMitarbeiter.UpdateMitarbeiter(this.Pool.Mitarbeiterdaten);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'FereinBlockedChanged', this.Debug.Typen.Page);
    }
  }

  FreigabeAuswahlClicked() {

    try {

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.UrlaubEinstellungen_Freigeber_Auswahl;
      this.ShowMitarbeiterauswahl = true;
      this.AuswahlIDliste = this.DB.CurrentUrlaub.FreigeberID !== null ? [this.DB.CurrentUrlaub.FreigeberID] : [];
      this.MitarbeiterauswahlTitel = 'Vertreter/innen auswählen';
      this.MitarbeiterMultiselect = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'FreigabeAuswahlClicked', this.Debug.Typen.Page);
    }
  }

  GetFreigeberName(FreigeberID: string): string {

    try {

      let Mitarbeiter: Mitarbeiterstruktur = this.DBMitarbeiter.GetMitarbeiterByID(FreigeberID);

      if(Mitarbeiter !== null) {

        return Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name;
      }
      else {

        return 'unbekannt';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'GetFreigeberName', this.Debug.Typen.Page);
    }
  }
}
