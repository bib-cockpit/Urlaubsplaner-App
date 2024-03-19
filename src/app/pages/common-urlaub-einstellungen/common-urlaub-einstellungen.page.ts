import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {BasicsProvider} from "../../services/basics/basics";
import {PageHeaderComponent} from "../../components/page-header/page-header";
import {PageFooterComponent} from "../../components/page-footer/page-footer";
import * as lodash from "lodash-es";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";
import moment, {Moment} from "moment/moment";
import {DatabaseUrlaubService} from "../../services/database-urlaub/database-urlaub.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {
  DatabaseMitarbeitersettingsService
} from "../../services/database-mitarbeitersettings/database-mitarbeitersettings.service";
import {ConstProvider} from "../../services/const/const";
import {AuswahlDialogService} from "../../services/auswahl-dialog/auswahl-dialog.service";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {Urlaubsstruktur} from "../../dataclasses/urlaubsstruktur";
import {cloneDeep} from "lodash-es";
import {Ferienstruktur} from "../../dataclasses/ferienstruktur";
import {Feiertagestruktur} from "../../dataclasses/feiertagestruktur";
import {Urlaubprojektbeteiligtestruktur} from "../../dataclasses/urlaubprojektbeteiligtestruktur";
import {Subscription} from "rxjs";
import {Standortestruktur} from "../../dataclasses/standortestruktur";

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
  public ShowMitarbeiterauswahl: boolean;
  public AuswahlIDliste: string[];
  public MitarbeiterauswahlTitel: string;
  public Projektbeteiligteliste: Mitarbeiterstruktur[];
  public Urlaubsfreigeberliste: Mitarbeiterstruktur[];
  public Homeofficefreigeberliste: Mitarbeiterstruktur[];
  public MitarbeiterMultiselect: boolean;
  public Ferienliste: Ferienstruktur[];
  public Feiertageliste: Feiertagestruktur[];
  private DataSubscription: Subscription;

  constructor(public Basics: BasicsProvider,
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
      this.Projektbeteiligteliste   = [];
      this.Urlaubsfreigeberliste    = [];
      this.Homeofficefreigeberliste = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaub Einstellungen Page', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

      this.DataSubscription.unsubscribe();
      this.DataSubscription = null;


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  public ionViewDidEnter() {

    try {

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaub Einstellungen Page', 'ionViewDidEnter', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {


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
      this.DB.CheckSetup();
      this.DB.CountAnfragenanzahlen();

      this.Projektbeteiligteliste = [];



      for (let Eintrag of this.DB.CurrentUrlaub.Projektbeteiligteliste) {

        Mitarbeiter = this.DBMitarbeiter.GetMitarbeiterByID(Eintrag.MitarbeiterID);

        if (Mitarbeiter !== null) this.Projektbeteiligteliste.push(Mitarbeiter);
      }

      debugger;

      this.Projektbeteiligteliste.sort((a: Mitarbeiterstruktur, b: Mitarbeiterstruktur) => {

        if (a.Name < b.Name) return -1;
        if (a.Name > b.Name) return 1;
        return 0;
      });

      Standort = lodash.find(this.Pool.Standorteliste, {_id: this.DB.CurrentMitarbeiter.StandortID});

      this.Urlaubsfreigeberliste = [];

      for(let MitarbeterID of Standort.Urlaubfreigabepersonen) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: MitarbeterID});

        if(!lodash.isUndefined(Mitarbeiter)) this.Urlaubsfreigeberliste.push(Mitarbeiter);
      }

      this.Urlaubsfreigeberliste.sort((a: Mitarbeiterstruktur, b: Mitarbeiterstruktur) => {

        if (a.Name < b.Name) return -1;
        if (a.Name > b.Name) return 1;
        return 0;
      });

      this.Homeofficefreigeberliste = [];

      for(let MitarbeterID of Standort.Homeofficefreigabepersonen) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: MitarbeterID});

        if(!lodash.isUndefined(Mitarbeiter)) this.Homeofficefreigeberliste.push(Mitarbeiter);
      }

      this.Homeofficefreigeberliste.sort((a: Mitarbeiterstruktur, b: Mitarbeiterstruktur) => {

        if (a.Name < b.Name) return -1;
        if (a.Name > b.Name) return 1;
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

      let Eintrag: Urlaubprojektbeteiligtestruktur;
      let Mitarbeiter: Mitarbeiterstruktur;
      let Index: number;

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.UrlaubEinstellungen_Projektbeteiligte_Auswahl:

          // Projektbeteiligte auf die IDListe begrezen / gelöschte entfernen

          this.DB.CurrentUrlaub.Projektbeteiligteliste = lodash.filter( this.DB.CurrentUrlaub.Projektbeteiligteliste, (beteiligt: Urlaubprojektbeteiligtestruktur) => {

            return idliste.indexOf(beteiligt.MitarbeiterID) !== -1;
          });

          // Neue Eintraege hinzufügen wenn nicht bereits vorhanden

          for(let id of idliste) {

            Eintrag = lodash.find(this.DB.CurrentUrlaub.Projektbeteiligteliste, {MitarbeiterID: id});

            if(lodash.isUndefined(Eintrag)) this.DB.CurrentUrlaub.Projektbeteiligteliste.push({
              MitarbeiterID: id,
              Display: false
            });
          }

          Index = lodash.findIndex(this.DB.CurrentMitarbeiter.Urlaubsliste, { Jahr: this.DB.CurrentUrlaub.Jahr });

          debugger;

          this.DB.CurrentMitarbeiter.Urlaubsliste[Index] = this.DB.CurrentUrlaub;

          this.DBMitarbeiter.UpdateMitarbeiterUrlaub(this.DB.CurrentMitarbeiter).then(() => {

            this.PrepareData();
          });

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Urlaubsplanung_Mitarbeiter_Wechseln:

          Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: idliste[0]});

          this.DB.CurrentMitarbeiter = Mitarbeiter;

          this.PrepareData();

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

      debugger;

      switch (this.Auswahldialogorigin) {


        case 'Urlaub':

          this.DB.CurrentMitarbeiter.Urlaub = data;

          this.DBMitarbeiter.UpdateMitarbeiterUrlaub(this.DB.CurrentMitarbeiter);

          break;

        case this.Auswahlservice.Auswahloriginvarianten.UrlaubEinstellungen_Standort_Filter:

          this.DBStandort.CurrentStandortfilter        = cloneDeep(data);
          this.Pool.Mitarbeitersettings.StandortFilter = data !== null ? data._id : this.Const.NONE;

          this.DBMitarbeiterstettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings, null).then(() => {

            this.PrepareData();

            this.DBStandort.StandortfilterChanged.emit();
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

        return Eintrag.Data === this.DB.CurrentMitarbeiter.Urlaub;
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

      Urlaub = lodash.find(this.DB.CurrentMitarbeiter.Urlaubsliste, {Jahr: this.DB.CurrentUrlaub.Jahr});

      if (!lodash.isUndefined(Urlaub)) {

        Urlaub.Ferienblockerliste = this.DB.CurrentUrlaub.Ferienblockerliste;

        this.DBMitarbeiter.UpdateMitarbeiterUrlaub(this.DB.CurrentMitarbeiter);
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

      Urlaub = lodash.find(this.DB.CurrentMitarbeiter.Urlaubsliste, {Jahr: this.DB.CurrentUrlaub.Jahr});

      if (!lodash.isUndefined(Urlaub)) {

        Urlaub.Feiertageblockerliste = this.DB.CurrentUrlaub.Feiertageblockerliste;

        this.DBMitarbeiter.UpdateMitarbeiterUrlaub(this.DB.CurrentMitarbeiter);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'FereinBlockedChanged', this.Debug.Typen.Page);
    }
  }

  MitarbeiterWechselnClicked() {

    try {

      this.Auswahldialogorigin    = this.Auswahlservice.Auswahloriginvarianten.Urlaubsplanung_Mitarbeiter_Wechseln;
      this.ShowMitarbeiterauswahl = true;
      this.AuswahlIDliste         = [];


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'MitarbeiterWechselnClicked', this.Debug.Typen.Page);
    }
  }

  /*
  FreigabeAuswahlClicked() {

    try {

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.UrlaubEinstellungen_Freigeber_Auswahl;
      this.ShowMitarbeiterauswahl = true;
      this.AuswahlIDliste = this.DB.CurrentUrlaub.UrlaubsfreigeberID !== null ? [this.DB.CurrentUrlaub.UrlaubsfreigeberID] : [];
      this.MitarbeiterauswahlTitel = 'Vertreter/innen auswählen';
      this.MitarbeiterMultiselect = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Einstellungen Page', 'FreigabeAuswahlClicked', this.Debug.Typen.Page);
    }
  }

   */

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
