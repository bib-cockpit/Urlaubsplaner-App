import {DebugProvider} from "../../services/debug/debug";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {ConstProvider} from "../../services/const/const";
import {ToolsProvider} from "../../services/tools/tools";
import {BasicsProvider} from "../../services/basics/basics";
import {DatabaseSimontabelleService} from "../../services/database-simontabelle/database-simontabelle.service";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Subscription} from "rxjs";
import {PageHeaderComponent} from "../../components/page-header/page-header";
import {PageFooterComponent} from "../../components/page-footer/page-footer";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";
import {AuswahlDialogService} from "../../services/auswahl-dialog/auswahl-dialog.service";
import {MenueService} from "../../services/menue/menue.service";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {Aufgabenansichtstruktur} from "../../dataclasses/aufgabenansichtstruktur";
import * as lodash from "lodash-es";
import {
  DatabaseMitarbeitersettingsService
} from "../../services/database-mitarbeitersettings/database-mitarbeitersettings.service";
import {Simontabellestruktur} from "../../dataclasses/simontabellestruktur";
import {Simontabellebesondereleistungstruktur} from "../../dataclasses/simontabellebesondereleistungstruktur";
import {number} from "joi";

export type Summenstruktur = {

  Nettokostensumme: number;
  Bruttokostensumme: number;
  Nettohonorar: number;
  Bruttohonorar: number;
  Nettoleistungssumme: number;
  Bruttoleistungssumme: number;
  Nettogesamtsumme: number;
  Bruttogesamtsumme: number;
  Nettonebenkosten: number;
  Bruttonebenkosten: number;
};

@Component({
  selector:    'pj-simontabelle-liste-page',
  templateUrl: 'pj-simontabelle-liste.page.html',
  styleUrls:  ['pj-simontabelle-liste.page.scss'],
})

export class PjSimontabelleListePage implements OnInit, OnDestroy {

  @ViewChild('PageHeader', {static: false}) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', {static: false}) PageFooter: PageFooterComponent;

  public Auswahlliste: Auswahldialogstruktur[];
  public Auswahlindex: number;
  public Auswahltitel: string;
  public ShowAuswahl: boolean;
  public ShowProjektschnellauswahl: boolean;
  private Projektschenllauswahltitel: string;
  public ShowEditor: boolean;
  public ContentHoehe: number;
  private PageLoaded: boolean;
  public Auswahlhoehe: number;
  private Auswahldialogorigin: string;
  public Leistungsphasenliste: string[];
  private TabellenSubscription: Subscription;
  public ShowLeistungeditor: boolean;
  public Summenliste: Summenstruktur[];
  public Anzahlliste: number[][];
  constructor(public Basics: BasicsProvider,
              public Menuservice: MenueService,
              public DBProjekte: DatabaseProjekteService,
              public DB: DatabaseSimontabelleService,
              public Tools: ToolsProvider,
              public Auswahlservice: AuswahlDialogService,
              public Const: ConstProvider,
              public Pool: DatabasePoolService,
              private DBMitarbeitersettings: DatabaseMitarbeitersettingsService,
              public Debug: DebugProvider) {

    try {

      this.Auswahlliste             = [{ Index: 0, FirstColumn: '', SecoundColumn: '', Data: null}];
      this.Auswahlindex             = 0;
      this.Auswahltitel             = '';
      this.ShowAuswahl              = false;
      this.ShowEditor               = false;
      this.ContentHoehe             = 0;
      this.PageLoaded               = false;
      this.Leistungsphasenliste     = [];
      this.TabellenSubscription     = null;
      this.ShowLeistungeditor       = false;
      this.Summenliste              = [];
      this.Anzahlliste              = [];

      this.ShowProjektschnellauswahl        = false;
      this.Auswahlhoehe                     = 300;
      this.Auswahldialogorigin               = this.Const.NONE;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Liste', 'constructor', this.Debug.Typen.Page);
    }
  }

  ShowProjektauswahlEventHandler() {

    try {

      // this.Projektschnellauswahlursprung = this.Projektschnellauswahlursprungvarianten.Projektfavoriten;
      this.ShowProjektschnellauswahl     = true;
      this.Projektschenllauswahltitel    = 'Projekt wechseln';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Liste', 'ShowProjektauswahlEventHandler', this.Debug.Typen.Page);
    }
  }

  public ProjektSchnellauswahlProjektClickedEventHandler(projekt: Projektestruktur) {

    try {

      let Aufgabenansicht: Aufgabenansichtstruktur = this.Pool.GetAufgabenansichten(this.DBProjekte.CurrentProjekt !== null ? this.DBProjekte.CurrentProjekt._id : null);


      this.DBProjekte.CurrentProjekt      = projekt;
      this.DBProjekte.CurrentProjektindex = lodash.findIndex(this.DBProjekte.Projektliste, {_id: projekt._id});

      this.Pool.Mitarbeitersettings.Favoritprojektindex = this.DBProjekte.CurrentProjektindex;
      this.Pool.Mitarbeitersettings.ProjektID           = this.DBProjekte.CurrentProjekt._id;

      this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings, Aufgabenansicht);

      this.ShowProjektschnellauswahl = false;

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Protokoll Liste', 'ProjektSchnellauswahlProjektClickedEventHandler', this.Debug.Typen.Page);
    }
  }

  ShowProjektfilesHandler() {

    try {

      this.Menuservice.FilelisteAufrufer    = this.Menuservice.FilelisteAufrufervarianten.Simontabelle;
      this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Fileliste;

      this.Menuservice.SetCurrentPage();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Liste', 'ShowProjektfilesHandler', this.Debug.Typen.Page);
    }
  }


  private InitScreen() {

    try {

      let KapitelabschnitteHoehe: number = 40;

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);

      this.ContentHoehe = this.Basics.InnerContenthoehe - KapitelabschnitteHoehe;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Liste', 'InitScreen', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {

      this.TabellenSubscription = this.Pool.SimontabellenlisteChanged.subscribe(() => {

        this.PrepareDaten();
      });

      this.PrepareDaten();


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Liste', 'OnInit', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

      this.TabellenSubscription.unsubscribe();
      this.TabellenSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Liste', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  public ionViewDidEnter() {

    try {




    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Liste', 'ionViewDidEnter', this.Debug.Typen.Page);
    }
  }

  ionViewDidLeave() {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Liste', 'ionViewDidLeave', this.Debug.Typen.Page);
    }
  }

  AuswahlOkButtonClicked(data: any) {

    try {

      let Anlagengruppe: number;
      let Leistungsphase: string;


      switch (this.Auswahldialogorigin) {


        case 'Anlagengruppe':

          this.DB.CurrentSimontabelle.Anlagengruppe = data;

          if(this.DB.CurrentSimontabelle.Anlagengruppe !== null && this.DB.CurrentSimontabelle.Leistungsphase !== null) {

            Anlagengruppe  = this.DB.CurrentSimontabelle.Anlagengruppe;
            Leistungsphase = this.DB.CurrentSimontabelle.Leistungsphase;

            this.DB.CurrentSimontabelle = this.DB.GetNewSimontabelle(Leistungsphase, Anlagengruppe);
          }

          break;

        case 'Leistungsphase':

          this.DB.CurrentSimontabelle.Leistungsphase = data;

          if(this.DB.CurrentSimontabelle.Anlagengruppe !== null && this.DB.CurrentSimontabelle.Leistungsphase !== null) {

            Anlagengruppe  = this.DB.CurrentSimontabelle.Anlagengruppe;
            Leistungsphase = this.DB.CurrentSimontabelle.Leistungsphase;

            this.DB.CurrentSimontabelle = this.DB.GetNewSimontabelle(Leistungsphase, Anlagengruppe);
          }

          break;

        default:

          break;
      }

      this.Pool.SimontabelleChanged.emit();

      this.ShowAuswahl = false;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Liste', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  public async PrepareDaten() {

    try {

      let Tabelle: Simontabellestruktur;
      let Index: number;
      let Leistungssumme: number;
      let Nettonebenkosten: number;
      let Bruttonebenkosten: number;

      this.Anzahlliste          = [];
      this.Leistungsphasenliste = [];

      debugger;

      for(Tabelle of this.Pool.Simontabellenliste[this.DBProjekte.CurrentProjekt.Projektkey]) {

        Leistungssumme = 0;

        for(let Leistung of Tabelle.Besondereleistungenliste) {

          Leistungssumme += Leistung.Honorar;
        }

        Index = this.Leistungsphasenliste.indexOf(Tabelle.Leistungsphase);

        if( Index === -1) {

          this.Leistungsphasenliste.push(Tabelle.Leistungsphase);

          this.Anzahlliste[Tabelle.Leistungsphase] = 0;

          Index = this.Leistungsphasenliste.length - 1;

          Nettonebenkosten  = (Tabelle.Honorar + Leistungssumme) * Tabelle.Nebenkosten / 100;
          Bruttonebenkosten = (Tabelle.Honorar * (1 + this.DB.Steuersatz / 100) + Leistungssumme * (1 + this.DB.Steuersatz / 100)) * Tabelle.Nebenkosten / 100;

          Tabelle.Nettonebenkosten  = Nettonebenkosten;
          Tabelle.Bruttonebenkosten = Bruttonebenkosten;

          this.Summenliste[Index] = {

            Nettokostensumme:  Tabelle.Kosten,
            Bruttokostensumme: Tabelle.Kosten * (1 + this.DB.Steuersatz / 100),
            Nettohonorar:      Tabelle.Honorar,
            Bruttohonorar:     Tabelle.Honorar * (1 + this.DB.Steuersatz / 100),
            Nettoleistungssumme:  Leistungssumme,
            Bruttoleistungssumme: Leistungssumme * (1 + this.DB.Steuersatz / 100),
            Nettogesamtsumme:  Tabelle.Honorar + Leistungssumme + Nettonebenkosten,
            Bruttogesamtsumme: Tabelle.Honorar * (1 + this.DB.Steuersatz / 100) + Leistungssumme * (1 + this.DB.Steuersatz / 100) + Bruttonebenkosten,
            Nettonebenkosten:  Nettonebenkosten,
            Bruttonebenkosten: Bruttonebenkosten
          };
        }
        else {

          this.Anzahlliste[Tabelle.Leistungsphase] += 1;

          Nettonebenkosten  = (Tabelle.Honorar + Leistungssumme) * Tabelle.Nebenkosten / 100;
          Bruttonebenkosten = (Tabelle.Honorar * (1 + this.DB.Steuersatz / 100) + Leistungssumme * (1 + this.DB.Steuersatz / 100)) * Tabelle.Nebenkosten / 100;

          Tabelle.Nettonebenkosten  = Nettonebenkosten;
          Tabelle.Bruttonebenkosten = Bruttonebenkosten;

          this.Summenliste[Index].Nettokostensumme     += Tabelle.Kosten;
          this.Summenliste[Index].Bruttokostensumme    += Tabelle.Kosten * (1 + this.DB.Steuersatz / 100);
          this.Summenliste[Index].Nettohonorar         += Tabelle.Honorar;
          this.Summenliste[Index].Bruttohonorar        += Tabelle.Honorar * (1 + this.DB.Steuersatz / 100);
          this.Summenliste[Index].Nettoleistungssumme  += Leistungssumme;
          this.Summenliste[Index].Bruttoleistungssumme += Leistungssumme * (1 + this.DB.Steuersatz / 100);
          this.Summenliste[Index].Nettogesamtsumme     += Tabelle.Honorar + Leistungssumme + Bruttonebenkosten;
          this.Summenliste[Index].Bruttogesamtsumme    += Tabelle.Honorar * (1 + this.DB.Steuersatz / 100) + Leistungssumme * (1 + this.DB.Steuersatz / 100) + Bruttonebenkosten;
          this.Summenliste[Index].Nettonebenkosten     += Nettonebenkosten;
          this.Summenliste[Index].Bruttonebenkosten    += Bruttonebenkosten;

          debugger;
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Liste', 'PrepareDaten', this.Debug.Typen.Page);
    }
  }

  AddSimontabelleButtonClicked() {

    try {

      this.DB.CurrentSimontabelle = this.DB.GetNewSimontabelle(this.Const.Leistungsphasenvarianten.LPH5, 4);
      this.ShowEditor             = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Liste', 'AddSimontabelleButtonClicked', this.Debug.Typen.Page);
    }
  }



  AnlagengruppeClickedEventHandler() {

    try {


      this.Auswahltitel = 'Anlagengruppe festlegen';
      this.Auswahlliste = [];
      this.Auswahlhoehe = 200;

      this.Auswahldialogorigin = 'Anlagengruppe';

      this.Auswahlliste  = [];
      this.Auswahlliste.push({ Index: 0, FirstColumn: '-',       SecoundColumn:  'Unbekannt',  Data: null });
      this.Auswahlliste.push({ Index: 1, FirstColumn: this.Const.Anlagengruppen.Anlagengruppe_1.Nummer, SecoundColumn:  this.Const.Anlagengruppen.Anlagengruppe_1.Name,  Data: this.Const.Anlagengruppen.Anlagengruppe_1.Nummer });
      this.Auswahlliste.push({ Index: 2, FirstColumn: this.Const.Anlagengruppen.Anlagengruppe_2.Nummer, SecoundColumn:  this.Const.Anlagengruppen.Anlagengruppe_2.Name,  Data: this.Const.Anlagengruppen.Anlagengruppe_2.Nummer });
      this.Auswahlliste.push({ Index: 3, FirstColumn: this.Const.Anlagengruppen.Anlagengruppe_3.Nummer, SecoundColumn:  this.Const.Anlagengruppen.Anlagengruppe_3.Name,  Data: this.Const.Anlagengruppen.Anlagengruppe_3.Nummer });
      this.Auswahlliste.push({ Index: 4, FirstColumn: this.Const.Anlagengruppen.Anlagengruppe_4.Nummer, SecoundColumn:  this.Const.Anlagengruppen.Anlagengruppe_4.Name,  Data: this.Const.Anlagengruppen.Anlagengruppe_4.Nummer });
      this.Auswahlliste.push({ Index: 5, FirstColumn: this.Const.Anlagengruppen.Anlagengruppe_5.Nummer, SecoundColumn:  this.Const.Anlagengruppen.Anlagengruppe_5.Name,  Data: this.Const.Anlagengruppen.Anlagengruppe_5.Nummer });
      this.Auswahlliste.push({ Index: 6, FirstColumn: this.Const.Anlagengruppen.Anlagengruppe_6.Nummer, SecoundColumn:  this.Const.Anlagengruppen.Anlagengruppe_6.Name,  Data: this.Const.Anlagengruppen.Anlagengruppe_6.Nummer });
      this.Auswahlliste.push({ Index: 7, FirstColumn: this.Const.Anlagengruppen.Anlagengruppe_7.Nummer, SecoundColumn:  this.Const.Anlagengruppen.Anlagengruppe_7.Name,  Data: this.Const.Anlagengruppen.Anlagengruppe_7.Nummer });
      this.Auswahlliste.push({ Index: 8, FirstColumn: this.Const.Anlagengruppen.Anlagengruppe_8.Nummer, SecoundColumn:  this.Const.Anlagengruppen.Anlagengruppe_8.Name,  Data: this.Const.Anlagengruppen.Anlagengruppe_8.Nummer });

      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data: this.DB.CurrentSimontabelle.Anlagengruppe});
      this.ShowAuswahl  = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Liste', 'AnlagengruppeClickedEventHandler', this.Debug.Typen.Page);
    }
  }

  LeistungsphaseClickedEventHandler() {

    this.Auswahltitel = 'Leistungsphase festlegen';
    this.Auswahlliste = [];
    this.Auswahlhoehe = 200;

    this.Auswahldialogorigin = 'Leistungsphase';

    this.Auswahlliste  = [];
    this.Auswahlliste.push({ Index: 0, FirstColumn: 'Unbekannt',                              SecoundColumn: '', Data: null });
    this.Auswahlliste.push({ Index: 1, FirstColumn: this.Const.Leistungsphasenvarianten.LPH1, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH1 });
    this.Auswahlliste.push({ Index: 2, FirstColumn: this.Const.Leistungsphasenvarianten.LPH2, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH2 });
    this.Auswahlliste.push({ Index: 3, FirstColumn: this.Const.Leistungsphasenvarianten.LPH3, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH3 });
    this.Auswahlliste.push({ Index: 4, FirstColumn: this.Const.Leistungsphasenvarianten.LPH4, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH4 });
    this.Auswahlliste.push({ Index: 5, FirstColumn: this.Const.Leistungsphasenvarianten.LPH5, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH5 });
    this.Auswahlliste.push({ Index: 6, FirstColumn: this.Const.Leistungsphasenvarianten.LPH6, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH6 });
    this.Auswahlliste.push({ Index: 7, FirstColumn: this.Const.Leistungsphasenvarianten.LPH7, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH7 });
    this.Auswahlliste.push({ Index: 8, FirstColumn: this.Const.Leistungsphasenvarianten.LPH8, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH8 });

    this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data: this.DB.CurrentSimontabelle.Leistungsphase});
    this.ShowAuswahl  = true;

  } catch (error) {

    this.Debug.ShowErrorMessage(error, 'Simontabelle Liste', 'AnlagengruppeClickedEventHandler', this.Debug.Typen.Page);
  }

  SimontabelleClicked(event: MouseEvent, Tabelle: Simontabellestruktur) {

    try {

      this.DB.CurrentSimontabelle = lodash.cloneDeep(Tabelle);
      this.ShowEditor             = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Liste', 'SimontabelleClicked', this.Debug.Typen.Page);
    }
  }

  DeleteLeistungClickedHandler() {

    try {

      this.ShowLeistungeditor = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Liste', 'DeleteLeistungClickedHandler', this.Debug.Typen.Page);
    }
  }

  AddLeistungClickedEventHandler() {

    try {

      this.DB.CurrentBesondereleistung = this.DB.GetNewBesondereleistung();
      this.ShowLeistungeditor = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Liste', 'AddLeistungClickedEventHandler', this.Debug.Typen.Page);
    }
  }

  EditLeistungClickedEventHandler(leistung: Simontabellebesondereleistungstruktur) {

    try {

      this.DB.CurrentBesondereleistung = lodash.cloneDeep(leistung);
      this.ShowLeistungeditor          = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Liste', 'EditLeistungClickedEventHandler', this.Debug.Typen.Page);
    }

  }
}

