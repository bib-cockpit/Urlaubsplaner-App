import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MenueService} from "../../services/menue/menue.service";
import {DebugProvider} from "../../services/debug/debug";
import {PageHeaderComponent} from "../../components/page-header/page-header";
import {PageFooterComponent} from "../../components/page-footer/page-footer";
import {BasicsProvider} from "../../services/basics/basics";
import {AuswahlDialogService} from "../../services/auswahl-dialog/auswahl-dialog.service";
import {DatabaseProjektpunkteService} from "../../services/database-projektpunkte/database-projektpunkte.service";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {Graphservice} from "../../services/graph/graph";
import {ConstProvider} from "../../services/const/const";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {
  DatabaseMitarbeitersettingsService
} from "../../services/database-mitarbeitersettings/database-mitarbeitersettings.service";
import {LOPListestruktur} from "../../dataclasses/loplistestruktur";
import {Subscription} from "rxjs";
import {DatabaseLoplisteService} from "../../services/database-lopliste/database-lopliste.service";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";
import {Bautagebuchstruktur} from "../../dataclasses/bautagebuchstruktur";
import {ToolsProvider} from "../../services/tools/tools";
import moment, {Moment} from "moment";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {DatabaseGebaeudestrukturService} from "../../services/database-gebaeudestruktur/database-gebaeudestruktur";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";

@Component({
  selector: 'pj-baustelle-lopliste',
  templateUrl: 'pj-baustelle-lopliste.page.html',
  styleUrls: ['pj-baustelle-lopliste.page.scss'],
})
export class PjBaustelleLoplistePage implements OnInit, OnDestroy {

  @ViewChild('PageHeader', {static: false}) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', {static: false}) PageFooter: PageFooterComponent;

  public Projektschenllauswahltitel: string;
  public Projektschnellauswahlursprung: string;
  public ShowProjektschnellauswahl: boolean;
  public Auswahlhoehe: number;
  public Headerhoehe: number;
  public Listenhoehe: number;
  public LOPListe: LOPListestruktur[];
  public ProjektSubscription: Subscription;
  private LOPListeSubscription: Subscription;
  public DialogPosY: number;
  public Dialoghoehe: number;
  public Dialogbreite: number;
  public ShowMitarbeiterauswahl: boolean;
  public ShowBeteiligteauswahl: boolean;
  private Auswahldialogorigin: string;
  public AuswahlIDliste: string[];
  public Auswahlliste: Auswahldialogstruktur[];
  public Auswahlindex: number;
  public Auswahltitel: string;
  public ShowAuswahl: boolean;
  public StrukturDialogbreite: number;
  public StrukturDialoghoehe: number;
  public ShowRaumauswahl: boolean;
  public CurrentLOPListeID: string;
  public CurrentPunktID: string;
  public Punkteliste: Projektpunktestruktur[][];
  public Projektschnellauswahlursprungvarianten = {

    LOPListe: 'LOPListe'
  };
  public ShowLOPListeEditor: boolean;
  public ShowEintragEditor: boolean;
  public ShowDateKkPicker: boolean;
  private LOPListepunkteSubscription: Subscription;

  constructor(public Menuservice: MenueService,
              public Basics: BasicsProvider,
              public Auswahlservice: AuswahlDialogService,
              public DB: DatabaseLoplisteService,
              public DBProjektpunkte: DatabaseProjektpunkteService,
              public DBStandort: DatabaseStandorteService,
              public DBProjekte: DatabaseProjekteService,
              public GraphService: Graphservice,
              public DBGebaeude: DatabaseGebaeudestrukturService,
              public Pool: DatabasePoolService,
              private DBMitarbeitersettings: DatabaseMitarbeitersettingsService,
              public DBMitarbeiter: DatabaseMitarbeiterService,
              public Const: ConstProvider,
              public Tools: ToolsProvider,
              public Debug: DebugProvider) {

    try {

      this.Auswahlliste              = [{ Index: 0, FirstColumn: '', SecoundColumn: '', Data: null}];
      this.Auswahlindex              = 0;
      this.Auswahltitel              = '';
      this.ShowAuswahl               = false;
      this.ShowProjektschnellauswahl = false;
      this.Auswahlhoehe              = 200;
      this.Listenhoehe               = 0;
      this.Headerhoehe               = 0;
      this.LOPListe                  = [];
      this.ProjektSubscription       = null;
      this.LOPListeSubscription      = null;
      this.ShowLOPListeEditor        = false;
      this.Dialoghoehe              = 400;
      this.Dialogbreite             = 950;
      this.DialogPosY               = 60;
      this.ShowMitarbeiterauswahl   = false;
      this.ShowBeteiligteauswahl    = false;
      this.Auswahldialogorigin      = this.Const.NONE;
      this.ShowEintragEditor        = false;
      this.ShowDateKkPicker         = false;
      this.StrukturDialogbreite     = 1260;
      this.StrukturDialoghoehe      = 800;
      this.ShowRaumauswahl          = false;
      this.Punkteliste              = [];
      this.LOPListepunkteSubscription = null;
      this.CurrentLOPListeID        = null;
      this.CurrentPunktID           = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

      this.LOPListeSubscription.unsubscribe();
      this.ProjektSubscription.unsubscribe();
      this.LOPListepunkteSubscription.unsubscribe();

      this.LOPListeSubscription       = null;
      this.ProjektSubscription        = null;
      this.LOPListepunkteSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);

      this.ProjektSubscription = this.DBProjekte.CurrentFavoritenProjektChanged.subscribe(() => {

        this.PrepareData();
      });

      this.LOPListeSubscription = this.Pool.LOPListeChanged.subscribe(() => {

        this.PrepareData();
      });

      this.LOPListepunkteSubscription = this.Pool.ProjektpunktelisteChanged.subscribe(() => {

        this.PrepareData();
      });

      this.Headerhoehe = 38;
      this.Listenhoehe = this.Basics.InnerContenthoehe - this.Headerhoehe;

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'ngOnInit', this.Debug.Typen.Page);
    }
  }

  private PrepareData() {

    try {

      let Punkt: Projektpunktestruktur;
      let Stichtag: Moment;
      let Datum: Moment;
      let Heute: Moment = moment();

      Stichtag = Heute.clone().subtract(this.Pool.Mitarbeitersettings.LOPListeGeschlossenZeitfilter, 'days');

      if(this.DBProjekte.CurrentProjekt !== null) {

        if(!lodash.isUndefined(this.Pool.LOPListe[this.DBProjekte.CurrentProjekt.Projektkey])) {

          this.LOPListe = lodash.cloneDeep(this.Pool.LOPListe[this.DBProjekte.CurrentProjekt.Projektkey]);

          this.LOPListe.sort( (a: LOPListestruktur, b: LOPListestruktur) => {

            if (a.Zeitstempel > b.Zeitstempel) return -1;
            if (a.Zeitstempel < b.Zeitstempel) return 1;
            return 0;
          });

          this.LOPListe = lodash.filter(this.LOPListe, (Eintrag: LOPListestruktur) => {

            return Eintrag.Deleted === false ;
          });

          for(let LOPListe of this.LOPListe) {

            this.Punkteliste[LOPListe._id] = [];

            for(let PunktID of LOPListe.ProjektpunkteIDListe) {

              Punkt = lodash.find(this.Pool.Projektpunkteliste[this.DBProjekte.CurrentProjekt.Projektkey], {_id: PunktID});

              if(!lodash.isUndefined(Punkt)) {

                if(Punkt.Status !== this.Const.Projektpunktstatustypen.Geschlossen.Name) {

                  this.Punkteliste[LOPListe._id].push(Punkt);
                }
                else {

                  Datum = moment(Punkt.Geschlossenzeitstempel).locale('de');

                  if(Datum.isAfter(Stichtag, 'day')) this.Punkteliste[LOPListe._id].push(Punkt);
                }
              }
            }

            this.Punkteliste[LOPListe._id] = this.Punkteliste[LOPListe._id].sort( (a: Projektpunktestruktur, b: Projektpunktestruktur) => {

              if (parseInt(a.Nummer) > parseInt(b.Nummer)) return -1;
              if (parseInt(a.Nummer) < parseInt(b.Nummer)) return  1;

              return 0;
            });
          }
        }
        else {

          this.LOPListe = [];
        }

      }
      else {

        this.LOPListe = [];
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'PrepareData', this.Debug.Typen.Page);
    }
  }

  GetBauteilnamen(Projektpunkt: Projektpunktestruktur): string {

    try {

      let Projekt: Projektestruktur = lodash.find(this.DBProjekte.Gesamtprojektliste, { _id: Projektpunkt.ProjektID });

      if(!lodash.isUndefined(Projekt)) {

        return this.DBGebaeude.GetGebaeudeteilname(Projekt, Projektpunkt);
      }
      else {

        return 'Gesamtes Gebäude';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'GetBauteilnamen', this.Debug.Typen.Page);
    }
  }


  ShowProjektauswahlEventHandler() {

    try {

      this.Projektschnellauswahlursprung = this.Projektschnellauswahlursprungvarianten.LOPListe;
      this.ShowProjektschnellauswahl     = true;
      this.Projektschenllauswahltitel    = 'Projekt wechseln';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'ShowProjektauswahlEventHandler', this.Debug.Typen.Page);
    }
  }


  public ProjektSchnellauswahlProjektClickedEventHandler(projekt: Projektestruktur) {

    try {

      switch (this.Projektschnellauswahlursprung) {

        case this.Projektschnellauswahlursprungvarianten.LOPListe:

          debugger;

          this.DBProjekte.CurrentProjekt      = projekt;
          this.DBProjekte.CurrentProjektindex = lodash.findIndex(this.DBProjekte.Projektliste, {_id: projekt._id});

          this.Pool.Mitarbeitersettings.Favoritprojektindex = this.DBProjekte.CurrentProjektindex;
          this.Pool.Mitarbeitersettings.ProjektID           = this.DBProjekte.CurrentProjekt._id;

          this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings);

          this.PrepareData();

          break;

      }

      this.ShowProjektschnellauswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'ProjektSchnellauswahlProjektClickedEventHandler', this.Debug.Typen.Page);
    }
  }

  ShowProjektfilesHandler() {

    try {

      this.Menuservice.FilelisteAufrufer    = this.Menuservice.FilelisteAufrufervarianten.LOPListe;
      this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Fileliste;

      this.Menuservice.SetCurrentPage();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'ShowProjektfilesHandler', this.Debug.Typen.Page);
    }
  }

  AddLOPListeButtonClicked() {

    try {

      this.DB.CurrentLOPListe         = this.DB.GetEmptyLOPListe();
      this.DB.LOPListeEditorViewModus = this.DB.LOPListeEditorViewModusvarianten.Allgemein;
      this.ShowLOPListeEditor         = true;
      this.Dialogbreite               = 1200;
      this.Dialoghoehe                = this.Basics.InnerContenthoehe - this.DialogPosY * 2;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'AddLOPListeButtonClicked', this.Debug.Typen.Page);
    }
  }

  AddLOPListepunktClickedHandler() {

    try {

      this.ShowEintragEditor                   = true;
      this.DBProjektpunkte.CurrentProjektpunkt = lodash.cloneDeep(this.DBProjektpunkte.GetNewLOPListepunkt(this.DB.CurrentLOPListe));

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'AddLOPListepunktClickedHandler', this.Debug.Typen.Page);
    }
  }

  GetLOPListeTitel(): string {

    try {

      if(this.DB.CurrentLOPListe !== null) {

        return this.DB.CurrentLOPListe._id !== null ? 'LOP Liste bearbeiten' : 'Neue LOP Liste erstellen';


      } else return 'Unbekannt';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'GetLOPListeTitel', this.Debug.Typen.Page);
    }
  }

  TeamteilnehmerClickedHandler() {

    try {

      this.AuswahlIDliste = lodash.cloneDeep(this.DB.CurrentLOPListe.BeteiligtInternIDListe);

      this.Auswahldialogorigin    = this.Auswahlservice.Auswahloriginvarianten.LOPListe_LOPListeeditor_InternTeilnehmer;
      this.ShowMitarbeiterauswahl = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'TeamteilnehmerClickedHandler', this.Debug.Typen.Page);
    }
  }

  BeteiligteteilnehmerClickedHandler() {

    try {

      this.AuswahlIDliste         = lodash.cloneDeep(this.DB.CurrentLOPListe.BeteiligExternIDListe);
      this.Auswahldialogorigin    = this.Auswahlservice.Auswahloriginvarianten.LOPListe_LOPListeeditor_ExternTeilnehmer;
      this.ShowBeteiligteauswahl  = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'BeteiligteteilnehmerClickedHandler', this.Debug.Typen.Page);
    }
  }

  MitarbeiterauswahlOkButtonClicked(idliste: string[]) {

    try {

      debugger;

      switch (this.Auswahldialogorigin) {


        case this.Auswahlservice.Auswahloriginvarianten.LOPListe_LOPListeeditor_InternTeilnehmer:

          this.DB.CurrentLOPListe.BeteiligtInternIDListe = idliste;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.LOPListe_Eintrageditor_ZustaendigIntern:

          this.DBProjektpunkte.CurrentProjektpunkt.ZustaendigeInternIDListe = idliste;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.LOPListe_Emaileditor_Intern_Empfaenger:

          this.DB.CurrentLOPListe.EmpfaengerInternIDListe = idliste;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.LOPListe_Emaileditor_Intern_CcEmpfaenger:

          this.DB.CurrentLOPListe.CcEmpfaengerInternIDListe = idliste;

          break;
      }

      this.Pool.EmailempfaengerChanged.emit();
      this.Pool.MitarbeiterAuswahlChanged.emit();

      this.ShowMitarbeiterauswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'MitarbeiterauswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  GetBeteiligtenauswahlTitel(): string {

    try {

      switch(this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.LOPListe_LOPListeeditor_ExternTeilnehmer:

          return 'Teiolnehmer festlegen';

          break;

        default:

          return 'unbekannt';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'GetBeteiligtenauswahlTitel', this.Debug.Typen.Page);
    }
  }


  BeteiligteauswahlOkButtonClicked(idliste: string[]) {

    try {

      debugger;

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.LOPListe_LOPListeeditor_ExternTeilnehmer:

          this.DB.CurrentLOPListe.BeteiligExternIDListe = idliste;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.LOPListe_Eintrageditor_ZustaendigExtern:

          this.DBProjektpunkte.CurrentProjektpunkt.ZustaendigeExternIDListe = idliste;

          break;


        case this.Auswahlservice.Auswahloriginvarianten.LOPListe_Emaileditor_Extern_Empfaenger:

          this.DB.CurrentLOPListe.EmpfaengerExternIDListe = idliste;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.LOPListe_Emaileditor_Extern_CcEmpfaenger:

          this.DB.CurrentLOPListe.CcEmpfaengerExternIDListe = idliste;

          break;
      }

      this.ShowBeteiligteauswahl = false;

      this.Pool.EmailempfaengerChanged.emit();
      this.Pool.BeteiligteAuswahlChanged.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'BeteiligteauswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  MitarebiterStandortfilterClickedHandler() {

    try {

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.LOPListe_Eintrageditor_Standortfilter;

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

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'MitarebiterStandortfilterClickedHandler', this.Debug.Typen.Page);
    }
  }

  AuswahlOkButtonClicked(data: any) {

    try {

      let Heute: Moment = moment();

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.LOPListe:

          this.Pool.Mitarbeitersettings.LOPListeGeschlossenZeitfilter = data;

          this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings);

          this.PrepareData();

          break;

        case this.Auswahlservice.Auswahloriginvarianten.LOPListe_Eintrageditor_Status:

          this.DBProjektpunkte.CurrentProjektpunkt.Status = data;

          if(data === this.Const.Projektpunktstatustypen.Geschlossen.Name) {

            this.DBProjektpunkte.CurrentProjektpunkt.Geschlossenzeitstempel =  Heute.valueOf();
            this.DBProjektpunkte.CurrentProjektpunkt.Geschlossenzeitstring  =  Heute.format('DD.MM.YYYY');
          }
          else {

            this.DBProjektpunkte.CurrentProjektpunkt.Geschlossenzeitstempel = null;
            this.DBProjektpunkte.CurrentProjektpunkt.Geschlossenzeitstring  = null;
          }

          this.Pool.ProjektpunktStatusChanged.emit();

          break;

        case this.Auswahlservice.Auswahloriginvarianten.LOPListe_Eintrageditor_Prioritaet:

          this.DBProjektpunkte.CurrentProjektpunkt.Prioritaet = data;

          break;

        case  this.Auswahlservice.Auswahloriginvarianten.LOPListe_Eintrageditor_Fachbereich:

          this.DBProjektpunkte.CurrentProjektpunkt.Fachbereich = data;

          break;

        default:

          break;
      }

      this.ShowAuswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  GetDialogTitelicon(): string {

    try {

      switch (this.Auswahldialogorigin) {


        case this.Auswahlservice.Auswahloriginvarianten.LOPListe_Eintrageditor_Fachbereich:

          return 'hammer-outline';

          break;

        case this.Auswahlservice.Auswahloriginvarianten.LOPListe_Eintrageditor_Status:

          return 'tats-chart-outline';

          break;

        default:

          break;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'GetDialogTitelicon', this.Debug.Typen.Page);
    }
  }

  SendMailButtonClicked($event: MouseEvent, Eintrag: LOPListestruktur) {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'SendMailButtonClicked', this.Debug.Typen.Page);
    }
  }

  GetKalenderwoche(Zeitstempel: number): string {

    try {

      let Tag: Moment = moment(Zeitstempel);

      return Tag.isoWeeks().toString();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'GetKalenderwoche', this.Debug.Typen.Page);
    }

  }

  EintragEditorFachbereichClickedHandler() {

    this.Auswahltitel = 'Stataus festlegen';
    this.Auswahlliste = [];
    this.Auswahlhoehe = 200;

    this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.LOPListe_Eintrageditor_Fachbereich;

    this.Auswahlliste.push({Index: 0, FirstColumn: this.Const.Fachbereiche.unbekannt, SecoundColumn: '',      Data: this.Const.Fachbereiche.unbekannt});
    this.Auswahlliste.push({Index: 1, FirstColumn: this.Const.Fachbereiche.Elektrotechnik, SecoundColumn: '', Data: this.Const.Fachbereiche.Elektrotechnik});
    this.Auswahlliste.push({Index: 2, FirstColumn: this.Const.Fachbereiche.HLS, SecoundColumn: '',            Data: this.Const.Fachbereiche.HLS});
    this.Auswahlliste.push({Index: 3, FirstColumn: this.Const.Fachbereiche.Heizung, SecoundColumn: '',        Data: this.Const.Fachbereiche.Heizung});
    this.Auswahlliste.push({Index: 4, FirstColumn: this.Const.Fachbereiche.Lueftung, SecoundColumn: '',       Data: this.Const.Fachbereiche.Lueftung});
    this.Auswahlliste.push({Index: 5, FirstColumn: this.Const.Fachbereiche.Sanitaer, SecoundColumn: '',       Data: this.Const.Fachbereiche.Sanitaer});
    this.Auswahlliste.push({Index: 6, FirstColumn: this.Const.Fachbereiche.Klimatisierung, SecoundColumn: '', Data: this.Const.Fachbereiche.Klimatisierung});
    this.Auswahlliste.push({Index: 7, FirstColumn: this.Const.Fachbereiche.MSR, SecoundColumn: '',            Data: this.Const.Fachbereiche.MSR});

    this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data: this.DBProjektpunkte.CurrentProjektpunkt.Fachbereich});
    this.ShowAuswahl  = true;

  } catch (error) {

    this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'EintragEditorFachbereichClickedHandler', this.Debug.Typen.Page);
  }

  ZeitspanneFilterClickedHandler() {

    try {

      this.Auswahltitel = 'Anzeige festlegen';
      this.Auswahlliste = [];
      this.Auswahlhoehe = 200;

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.LOPListe;

      this.Auswahlliste.push({Index:  0, FirstColumn:  '1', SecoundColumn: '', Data:  1});
      this.Auswahlliste.push({Index:  1, FirstColumn:  '2', SecoundColumn: '', Data:  2});
      this.Auswahlliste.push({Index:  2, FirstColumn:  '3', SecoundColumn: '', Data:  3});
      this.Auswahlliste.push({Index:  3, FirstColumn:  '4', SecoundColumn: '', Data:  4});
      this.Auswahlliste.push({Index:  4, FirstColumn:  '5', SecoundColumn: '', Data:  5});
      this.Auswahlliste.push({Index:  5, FirstColumn:  '6', SecoundColumn: '', Data:  6});
      this.Auswahlliste.push({Index:  6, FirstColumn:  '7', SecoundColumn: '', Data:  7});
      this.Auswahlliste.push({Index:  7, FirstColumn:  '8', SecoundColumn: '', Data:  8});
      this.Auswahlliste.push({Index:  8, FirstColumn:  '9', SecoundColumn: '', Data:  9});
      this.Auswahlliste.push({Index:  9, FirstColumn: '10', SecoundColumn: '', Data: 10});
      this.Auswahlliste.push({Index: 10, FirstColumn: '11', SecoundColumn: '', Data: 11});
      this.Auswahlliste.push({Index: 11, FirstColumn: '12', SecoundColumn: '', Data: 12});
      this.Auswahlliste.push({Index: 12, FirstColumn: '13', SecoundColumn: '', Data: 13});
      this.Auswahlliste.push({Index: 13, FirstColumn: '14', SecoundColumn: '', Data: 14});

      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data: this.Pool.Mitarbeitersettings.LOPListeGeschlossenZeitfilter});
      this.ShowAuswahl = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'EintragEditorFachbereichClickedHandler', this.Debug.Typen.Page);
    }
  }

  EintragEditorZustaendigInternHandler() {

    try {

      this.AuswahlIDliste         = lodash.cloneDeep(this.DBProjektpunkte.CurrentProjektpunkt.ZustaendigeInternIDListe);
      this.Auswahldialogorigin    = this.Auswahlservice.Auswahloriginvarianten.LOPListe_Eintrageditor_ZustaendigIntern;
      this.ShowMitarbeiterauswahl = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'EintragEditorZustaendigInternHandler', this.Debug.Typen.Page);
    }
  }

  EintragEditorZustaendigExternHandler() {

    try {

      this.AuswahlIDliste        = lodash.cloneDeep(this.DBProjektpunkte.CurrentProjektpunkt.ZustaendigeExternIDListe);
      this.Auswahldialogorigin   = this.Auswahlservice.Auswahloriginvarianten.LOPListe_Eintrageditor_ZustaendigExtern;
      this.ShowBeteiligteauswahl = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'EintragEditorZustaendigExternHandler', this.Debug.Typen.Page);
    }
  }


  EintragEditorStatusClickedHandler() {

    try {


      this.Auswahltitel = 'Status festlegen';
      this.Auswahlliste = [];
      this.Auswahlhoehe = 200;

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.LOPListe_Eintrageditor_Status;

      this.Auswahlliste  = [];
      this.Auswahlliste.push({ Index: 0, FirstColumn: this.Const.Projektpunktstatustypen.Offen.Displayname,          SecoundColumn:  '',  Data: this.Const.Projektpunktstatustypen.Offen.Name });
      this.Auswahlliste.push({ Index: 1, FirstColumn: this.Const.Projektpunktstatustypen.Bearbeitung.Displayname,    SecoundColumn:  '',  Data: this.Const.Projektpunktstatustypen.Bearbeitung.Name });
      this.Auswahlliste.push({ Index: 2, FirstColumn: this.Const.Projektpunktstatustypen.Geschlossen.Displayname,    SecoundColumn: '',   Data: this.Const.Projektpunktstatustypen.Geschlossen.Name });
      this.Auswahlliste.push({ Index: 3, FirstColumn: this.Const.Projektpunktstatustypen.Protokollpunkt.Displayname, SecoundColumn: '',   Data: this.Const.Projektpunktstatustypen.Protokollpunkt.Name });


      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data: this.DBProjektpunkte.CurrentProjektpunkt.Status});
      this.ShowAuswahl  = true;



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'EintragEditorStatusClickedHandler', this.Debug.Typen.Page);
    }
  }

  GetEintrageditorTitel(): string {

    try {

      return this.DBProjektpunkte.CurrentProjektpunkt._id !== null ? 'LOP - Listen Eintrag bearbeiten' : 'Neuen LOP - Listen Eintrag erstellen';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'GetProjektpunkteditorTitel', this.Debug.Typen.Page);
    }
  }

  EintragPrioritaetClickedHandler() {
    try {


      this.Auswahltitel = 'Status festlegen';
      this.Auswahlliste = [];
      this.Auswahlhoehe = 200;

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.LOPListe_Eintrageditor_Prioritaet;

      this.Auswahlliste  = [];
      this.Auswahlliste.push({ Index: 0, FirstColumn: this.Const.Projektpunktprioritaetstypen.Niedrig.Displayname,   SecoundColumn:  '',  Data: this.Const.Projektpunktprioritaetstypen.Niedrig.Name });
      this.Auswahlliste.push({ Index: 1, FirstColumn: this.Const.Projektpunktprioritaetstypen.Mittel.Displayname,    SecoundColumn:  '',  Data: this.Const.Projektpunktprioritaetstypen.Mittel.Name });
      this.Auswahlliste.push({ Index: 2, FirstColumn: this.Const.Projektpunktprioritaetstypen.Hoch.Displayname,      SecoundColumn: '',   Data: this.Const.Projektpunktprioritaetstypen.Hoch.Name });


      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data: this.DBProjektpunkte.CurrentProjektpunkt.Prioritaet});
      this.ShowAuswahl  = true;



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'EintragPrioritaetClickedHandler', this.Debug.Typen.Page);
    }
  }

  LOPListepunktClickedHandler(punkt: Projektpunktestruktur) {

    try {

      this.DBProjektpunkte.CurrentProjektpunkt = lodash.cloneDeep(punkt);
      this.ShowEintragEditor                   = true;
      this.Dialoghoehe                         = 900;
      this.DB.LOPListeEditorViewModus          = this.DB.LOPListeEditorViewModusvarianten.Allgemein;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'LOPListepunktClickedHandler', this.Debug.Typen.Page);
    }
  }

  GetTermindatum(Projektpunkt: Projektpunktestruktur) {

    try {

      if(Projektpunkt.EndeKalenderwoche !== null) return 'KW ' + Projektpunkt.EndeKalenderwoche;
      else {

        return moment(Projektpunkt.Endezeitstempel).format('DD.MM.YYYY');
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste', 'GetTermindatum', this.Debug.Typen.Component);
    }
  }

  GebaeudeteilClickedHandler() {

    try {

      this.ShowRaumauswahl = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'GebaeudeteilClickedHandler', this.Debug.Typen.Page);
    }
  }

  LOPListeClicked(lopliste: LOPListestruktur) {

    try {

      this.DB.CurrentLOPListe         = lodash.cloneDeep(lopliste);
      this.DB.LOPListeEditorViewModus = this.DB.LOPListeEditorViewModusvarianten.Allgemein;
      this.ShowLOPListeEditor         = true;
      this.Dialogbreite               = 1200;
      this.Dialoghoehe                = this.Basics.InnerContenthoehe - this.DialogPosY * 2;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'LOPListeClicked', this.Debug.Typen.Page);
    }
  }

  EintragZeileEnterEvent(LOPListe: LOPListestruktur, Punkt: Projektpunktestruktur) {

    try {

      this.CurrentLOPListeID = LOPListe._id;
      this.CurrentPunktID    = Punkt._id;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'EintragZeileEnterEvent', this.Debug.Typen.Page);
    }
  }

  EintragZeileLeaveEvent() {

    try {

      this.CurrentLOPListeID = null;
      this.CurrentPunktID    = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste', 'EintragZeileEnterEvent', this.Debug.Typen.Page);
    }
  }
}
