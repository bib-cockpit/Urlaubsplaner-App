import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {ConstProvider} from "../../services/const/const";
import {InputCloneComponent} from "../../components/input-clone/input-clone.component";
import * as lodash from 'lodash-es';
import {DisplayService} from "../../services/diplay/display.service";
import {DatabaseProjektpunkteService} from "../../services/database-projektpunkte/database-projektpunkte.service";
import {Kostengruppenstruktur} from "../../dataclasses/kostengruppenstruktur";
import {KostengruppenService} from "../../services/kostengruppen/kostengruppen.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DatabaseFestlegungenService} from "../../services/database-festlegungen/database-festlegungen.service";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";

@Component({
  selector: 'pj-kostengruppen-auswahl',
  templateUrl: './pj-kostengruppen-auswahl.component.html',
  styleUrls: ['./pj-kostengruppen-auswahl.component.scss'],
})
export class PjKostengruppenAuswahlComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren(InputCloneComponent) List: QueryList<InputCloneComponent>;

  @Output() CancelClickedEvent      = new EventEmitter<any>();
  @Output() OkClickedEvent          = new EventEmitter<any>();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  public Oberkostengruppenliste: Kostengruppenstruktur[];
  public Hauptkostengruppenliste: Kostengruppenstruktur[];
  public Unterkostengruppenliste: Kostengruppenstruktur[];

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public DB: DatabaseProjektpunkteService,
              private DBProjekte: DatabaseProjekteService,
              public DBFestlegungskategorie: DatabaseFestlegungenService,
              private Pool: DatabasePoolService,
              public Displayservice: DisplayService,
              public Kostengruppenservice: KostengruppenService,
              public Const: ConstProvider) {
    try {


      this.Titel = this.Const.NONE;
      this.Iconname = 'cash-outline';
      this.Dialogbreite = 400;
      this.Dialoghoehe = 300;
      this.PositionY = 100;
      this.ZIndex = 3000;

      this.Oberkostengruppenliste  = [];
      this.Hauptkostengruppenliste = [];
      this.Unterkostengruppenliste = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen Auswahl', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Kostengruppenauswahl);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen Auswahl', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Kostengruppenauswahl, this.ZIndex);

      this.PrepareData();


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen Auswahl', 'OnInit', this.Debug.Typen.Component);
    }
  }

  private PrepareData() {

    try {

      this.Oberkostengruppenliste  = [];

      if(this.DB.CurrentProjektpunkt === null) this.DB.CurrentProjektpunkt = this.DB.GetNewProtokollpunkt(null);

      this.Oberkostengruppenliste = <Kostengruppenstruktur[]>lodash.filter(this.Kostengruppenservice.Kostengruppen, (Gruppe: Kostengruppenstruktur) => {

        return Gruppe.Typ === this.Kostengruppenservice.Kostengruppentypen.Obergruppe;
      });

      this.Hauptkostengruppenliste = [];

      if(this.DB.CurrentProjektpunkt.Oberkostengruppe !== null) {

        this.Hauptkostengruppenliste = <Kostengruppenstruktur[]>lodash.filter(this.Kostengruppenservice.Kostengruppen, (Gruppe: Kostengruppenstruktur) => {

          return Gruppe.Typ === this.Kostengruppenservice.Kostengruppentypen.Hauptgruppe && Gruppe.Obergruppennummer === this.DB.CurrentProjektpunkt.Oberkostengruppe;
        });
      }
      else {

        this.DB.CurrentProjektpunkt.Hauptkostengruppe = null;
        this.DB.CurrentProjektpunkt.Unterkostengruppe = null;
      }

      this.Unterkostengruppenliste = [];

      if(this.DB.CurrentProjektpunkt.Hauptkostengruppe !== null) {

        this.Unterkostengruppenliste = <Kostengruppenstruktur[]>lodash.filter(this.Kostengruppenservice.Kostengruppen, (Gruppe: Kostengruppenstruktur) => {

          return Gruppe.Typ === this.Kostengruppenservice.Kostengruppentypen.Untergruppe && Gruppe.Hauptgruppennummer === this.DB.CurrentProjektpunkt.Hauptkostengruppe;
        });
      }
      else {

        this.DB.CurrentProjektpunkt.Unterkostengruppe = null;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen Auswahl', 'PrepareData', this.Debug.Typen.Component);
    }
  }

  private PrepareDataFestlegungskatego() {

    try {

      this.Oberkostengruppenliste  = [];

      if(this.DBFestlegungskategorie.CurrentFestlegungskategorie === null) {

        this.DBFestlegungskategorie.CurrentFestlegungskategorie = this.DBFestlegungskategorie.GetEmptyFestlegungskategorie(this.DBProjekte.CurrentProjekt);
      }

      this.Oberkostengruppenliste = <Kostengruppenstruktur[]>lodash.filter(this.Kostengruppenservice.Kostengruppen, (Gruppe: Kostengruppenstruktur) => {

        return Gruppe.Typ === this.Kostengruppenservice.Kostengruppentypen.Obergruppe;
      });

      this.Hauptkostengruppenliste = [];

      if(this.DBFestlegungskategorie.CurrentFestlegungskategorie.Oberkostengruppe !== null) {

        this.Hauptkostengruppenliste = <Kostengruppenstruktur[]>lodash.filter(this.Kostengruppenservice.Kostengruppen, (Gruppe: Kostengruppenstruktur) => {

          return Gruppe.Typ === this.Kostengruppenservice.Kostengruppentypen.Hauptgruppe && Gruppe.Obergruppennummer === this.DBFestlegungskategorie.CurrentFestlegungskategorie.Oberkostengruppe;
        });
      }
      else {

        this.DBFestlegungskategorie.CurrentFestlegungskategorie.Hauptkostengruppe = null;
        this.DBFestlegungskategorie.CurrentFestlegungskategorie.Unterkostengruppe = null;
      }

      this.Unterkostengruppenliste = [];

      if(this.DBFestlegungskategorie.CurrentFestlegungskategorie.Hauptkostengruppe !== null) {

        this.Unterkostengruppenliste = <Kostengruppenstruktur[]>lodash.filter(this.Kostengruppenservice.Kostengruppen, (Gruppe: Kostengruppenstruktur) => {

          return Gruppe.Typ === this.Kostengruppenservice.Kostengruppentypen.Untergruppe && Gruppe.Hauptgruppennummer === this.DBFestlegungskategorie.CurrentFestlegungskategorie.Hauptkostengruppe;
        });
      }
      else {

        this.DBFestlegungskategorie.CurrentFestlegungskategorie.Unterkostengruppe = null;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen Auswahl', 'PrepareDataFestlegungskategorie', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen Auswahl', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen Auswahl', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  OberkostengruppeChanged(event: any) {

    try {

      this.DB.CurrentProjektpunkt.Oberkostengruppe = event.detail.value;

      this.DB.CurrentProjektpunkt.Hauptkostengruppe = null;
      this.DB.CurrentProjektpunkt.Unterkostengruppe = null;

      this.Pool.ProjektpunktKostengruppeChanged.emit();

      this.PrepareData();



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen Auswahl', 'OberkostengruppeChanged', this.Debug.Typen.Component);
    }
  }

  HauptkostengruppeChanged(event: any) {

    try {

      this.DB.CurrentProjektpunkt.Hauptkostengruppe = event.detail.value;
      this.DB.CurrentProjektpunkt.Unterkostengruppe = null;

      this.Pool.ProjektpunktKostengruppeChanged.emit();

      this.PrepareData();


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen Auswahl', 'HauptkostengruppeChanged', this.Debug.Typen.Component);
    }
  }

  UnterkostengruppeChanged(event: any) {

    try {

      this.DB.CurrentProjektpunkt.Unterkostengruppe = event.detail.value;

      this.Pool.ProjektpunktKostengruppeChanged.emit();

      this.PrepareData();


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen Auswahl', 'UnterkostengruppeChanged', this.Debug.Typen.Component);
    }
  }
}

