import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {ConstProvider} from "../../services/const/const";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadingAnimationService} from "../../services/loadinganimation/loadinganimation";
import {DatabaseAuthenticationService} from "../../services/database-authentication/database-authentication.service";
import {MenueService} from "../../services/menue/menue.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import * as lodash from "lodash-es";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {Graphservice} from "../../services/graph/graph";
import {PageHeaderComponent} from "../../components/page-header/page-header";
import {PageFooterComponent} from "../../components/page-footer/page-footer";
import {DatabasePlanungsmatrixService} from "../../services/database-planungsmatrix/database-planungsmatrix.service";
import {Aufgabenbereichestruktur} from "../../dataclasses/aufgabenbereichestruktur";
import {Teilaufgabeestruktur} from "../../dataclasses/teilaufgabeestruktur";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {DatabaseProjektpunkteService} from "../../services/database-projektpunkte/database-projektpunkte.service";
import {Subscription} from "rxjs";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";

@Component({
  selector: 'pj-planungsmatrix-page',
  templateUrl: './pj-planungsmatrix.page.html',
  styleUrls: ['./pj-planungsmatrix.page.scss'],
})
export class PjPlanungsmatrixPage implements OnInit, OnDestroy {

  @ViewChild('PageHeader', {static: false}) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', {static: false}) PageFooter: PageFooterComponent;

  public Spaltenbreite: number;
  public Zahlenzellebreite: number;
  public Leistungsphase: number;
  public Aufgabenbereicheliste: Aufgabenbereichestruktur[];
  public Bezeichnungbreite: number;
  public Displayliste: Projektpunktestruktur[][][];
  private ProjektpunkteSubscription: Subscription;
  public ShowEditor: boolean;
  public Auswahlliste: Auswahldialogstruktur[];
  public Auswahlindex: number;
  public Auswahltitel: string;
  public ShowAuswahl: boolean;
  private KostengruppenSubscription: Subscription;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public Const: ConstProvider,
              public Pool: DatabasePoolService,
              public DB: DatabasePlanungsmatrixService,
              public DBProjekte: DatabaseProjekteService,
              public DBProjektpunkte: DatabaseProjektpunkteService,
              public GraphService: Graphservice,
              public AuthService: DatabaseAuthenticationService) {
    try
    {
      this.Spaltenbreite         = 0;
      this.Zahlenzellebreite     = 0;
      this.Leistungsphase        = 1;
      this.Bezeichnungbreite     = 0;
      this.Aufgabenbereicheliste = [];
      this.Displayliste          = [];
      this.ShowEditor            = false;
      this.ShowAuswahl           = false;
      this.Auswahltitel          = 'Leistungsphase';
      this.Auswahlliste          = [];

      this.KostengruppenSubscription = null;
      this.ProjektpunkteSubscription = null;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrix', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);


      this.ProjektpunkteSubscription = this.Pool.ProjektpunktelisteChanged.subscribe(() => {

        this.PrepareDaten();

      });

      this.KostengruppenSubscription = this.DB.DisplayKostengruppenChanged.subscribe(() => {

        this.PrepareDaten();

      });

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrix', 'OnInit', this.Debug.Typen.Page);
    }
  }

  ionViewDidEnter() {

    try {


    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrix', 'ionViewDidEnter', this.Debug.Typen.Page);
    }
  }

  ionViewDidLeave() {

    try {

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrix', 'ionViewDidLeave', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

      this.ProjektpunkteSubscription.unsubscribe();
      this.KostengruppenSubscription.unsubscribe();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrix', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  private PrepareDaten() {

    try {

      let Abstand: number   = 20;
      let Zellenanzahl;
      let Gesamtpunkteliste: Projektpunktestruktur[] = [];
      let Punkteliste: Projektpunktestruktur[] = [];

      if(this.DB.Musterprojekt === null) this.DB.Musterprojekt = this.Pool.GetMusterProjekt();
      this.Zahlenzellebreite = 40;
      this.Bezeichnungbreite = 140;



      this.DB.SetuoKostengruppendisplay(this.DB.Musterprojekt);

      Zellenanzahl = this.DB.CountVisisbleKosten();

      this.Spaltenbreite = (this.Basics.Contentbreite - Abstand - this.Zahlenzellebreite - this.Bezeichnungbreite) / Zellenanzahl;

      this.Aufgabenbereicheliste = [];

      for(let Bereich of this.DB.Aufgabenbereicheliste) {

        if(Bereich.Leistungsphasen.indexOf(this.DB.Leistungsphase) !== -1) {

          this.Aufgabenbereicheliste.push(Bereich);
        }
      }

      this.Aufgabenbereicheliste.sort( (a: Aufgabenbereichestruktur, b: Aufgabenbereichestruktur) => {

        if (a.Nummer[this.DB.Leistungsphase - 1] < b.Nummer[this.DB.Leistungsphase - 1]) return -1;
        if (a.Nummer[this.DB.Leistungsphase - 1] > b.Nummer[this.DB.Leistungsphase - 1]) return 1;
        return 0;
      });

      // Projektounkte zusammenstellen

      if(this.DB.MusterprojektAktiv === true) {

        if(!lodash.isUndefined(this.Pool.Projektpunkteliste[this.DB.Musterprojekt.Projektkey])) {

          Gesamtpunkteliste = this.Pool.Projektpunkteliste[this.DB.Musterprojekt.Projektkey];

          this.DBProjektpunkte.CurrentProjektpunkt = Gesamtpunkteliste[0];
        }
      }

      debugger;

      // Projektpunkte einsortieren

      this.Displayliste = [];

      for(let Bereich of this.DB.Aufgabenbereicheliste) {

        this.Displayliste[Bereich.id] = [];

        for(let Kostengruppe of this.DB.Kostengruppenliste) {

          if(Kostengruppe.Display) {

            this.Displayliste[Bereich.id][Kostengruppe.Kostengruppennummer] = [];

            for(let Teilaufgabe of Bereich.Teilaufgabenbereiche[this.DB.Leistungsphase]) {

              this.Displayliste[Bereich.id][Kostengruppe.Kostengruppennummer][Teilaufgabe[Kostengruppe.Kostengruppennummer].id] = [];

              Punkteliste = lodash.filter(Gesamtpunkteliste, (punkt: Projektpunktestruktur) => {

                return punkt.Oberkostengruppe      === Kostengruppe.Kostengruppennummer &&
                       punkt.AufgabenbereichID     === Bereich.id &&
                       punkt.AufgabenteilbereichID === Teilaufgabe[Kostengruppe.Kostengruppennummer].id;
              });

              this.Displayliste[Bereich.id][Kostengruppe.Kostengruppennummer][Teilaufgabe[Kostengruppe.Kostengruppennummer].id] = Punkteliste;

            }
          }
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Planungsmatrix', 'PrepareDaten', this.Debug.Typen.Page);
    }
  }

  PrintConsole(Teilaufgabe: Teilaufgabeestruktur, Teilaufgabeliste: Teilaufgabeestruktur[]) {

    try {

      debugger;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Planungsmatrix', 'function', this.Debug.Typen.Page);
    }

  }

  TeilaufgabeClicked(teilaufgabe: Teilaufgabeestruktur, Kostengruppennummer: number, Leistungsphase: number) {

    try {

      if(this.DB.MusterprojektAktiv === true) {

        this.DBProjektpunkte.CurrentProjektpunkt = this.DBProjektpunkte.GetNewPlanungsmatrixpunkt(this.DB.Musterprojekt, teilaufgabe, Kostengruppennummer, Leistungsphase);

      }

      this.ShowEditor = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Planungsmatrix', 'TeilaufgabeClicked', this.Debug.Typen.Page);
    }
  }

  TeilaufgabenpunktCheckedChanged(event: { status: boolean; index: number; event: any }, Punkt: Projektpunktestruktur) {

    try {

      let Istpunkt: Projektpunktestruktur = lodash.find(this.Displayliste[Punkt.AufgabenbereichID][Punkt.Oberkostengruppe][Punkt.AufgabenteilbereichID], {_id: Punkt._id});

      if(!lodash.isUndefined(Istpunkt) && Istpunkt.Matrixanwendung === true) {

        if(event.status === true) {

          Istpunkt.Status = this.Const.Projektpunktstatustypen.Geschlossen.Name;
        }
        else {

          Istpunkt.Status = this.Const.Projektpunktstatustypen.Offen.Name;
        }

        this.DBProjektpunkte.CurrentProjektpunkt = Istpunkt;

        this.DBProjektpunkte.UpdateProjektpunkt(Istpunkt).then(() => {


        }).catch((error) => {


        });
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Planungsmatrix', 'TeilaufgabenpunktCheckedChanged', this.Debug.Typen.Page);
    }
  }

  GetEditortitel(): string {

    try {

      if(this.DBProjektpunkte.CurrentProjektpunkt !== null) {

        if(this.DBProjektpunkte.CurrentProjektpunkt._id === null) return 'Neue Aufgabe';
        else return 'Aufgabe bearbeiten';
      }
      else return 'kein aktueller Projektpunt';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Planungsmatrix', 'GetEditortitel', this.Debug.Typen.Page);
    }
  }

  EintragClicked(Punkt: Projektpunktestruktur) {

    try {

      this.DBProjektpunkte.CurrentProjektpunkt = Punkt;
      this.ShowEditor                          = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Planungsmatrix', 'EintragClicked', this.Debug.Typen.Page);
    }
  }

  PlanungsmatrixLeistungsphaseHandler() {

    try {

      // this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Aufgabenliste_Editor_Leistungsphase;

      this.Auswahltitel  = 'Leistungsphase festlegen';
      this.Auswahlliste  = [];
      this.Auswahlliste.push({ Index: 0, FirstColumn: this.Const.Leistungsphasenvarianten.LPH1, SecoundColumn: '', Data: 1 });
      this.Auswahlliste.push({ Index: 1, FirstColumn: this.Const.Leistungsphasenvarianten.LPH2, SecoundColumn: '', Data: 2 });
      this.Auswahlliste.push({ Index: 2, FirstColumn: this.Const.Leistungsphasenvarianten.LPH3, SecoundColumn: '', Data: 3 });
      this.Auswahlliste.push({ Index: 3, FirstColumn: this.Const.Leistungsphasenvarianten.LPH4, SecoundColumn: '', Data: 4 });
      this.Auswahlliste.push({ Index: 4, FirstColumn: this.Const.Leistungsphasenvarianten.LPH5, SecoundColumn: '', Data: 5 });
      this.Auswahlliste.push({ Index: 5, FirstColumn: this.Const.Leistungsphasenvarianten.LPH6, SecoundColumn: '', Data: 6 });
      this.Auswahlliste.push({ Index: 6, FirstColumn: this.Const.Leistungsphasenvarianten.LPH7, SecoundColumn: '', Data: 7 });
      this.Auswahlliste.push({ Index: 7, FirstColumn: this.Const.Leistungsphasenvarianten.LPH8, SecoundColumn: '', Data: 8 });

      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data: this.DB.Leistungsphase });
      this.ShowAuswahl  = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Planungsmatrix', 'PlanungsmatrixLeistungsphaseHandler', this.Debug.Typen.Page);
    }
  }

  AuswahlOkButtonClicked(data: any) {

    try {

      this.DB.Leistungsphase = data;
      this.ShowAuswahl       = false;

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Planungsmatrix', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }

  }
}
