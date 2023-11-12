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
import {Kostengruppenstruktur} from "../../dataclasses/kostengruppenstruktur";
import {KostengruppenService} from "../../services/kostengruppen/kostengruppen.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DatabaseFestlegungenService} from "../../services/database-festlegungen/database-festlegungen.service";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {Festlegungskategoriestruktur} from "../../dataclasses/festlegungskategoriestruktur";

@Component({
  selector: 'pj-kostengruppen-festlegungskategorie-auswahl',
  templateUrl: './pj-kostengruppen-festlegungskategorie-auswahl.component.html',
  styleUrls: ['./pj-kostengruppen-festlegungskategorie-auswahl.component.scss'],
})
export class PjKostengruppenFestlegungskategorieAuswahlComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren(InputCloneComponent) List: QueryList<InputCloneComponent>;

  @Output() CancelClickedEvent      = new EventEmitter<any>();
  @Output() OkClickedEvent          = new EventEmitter<any>();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;
  @Input() KostengruppenOrigin: string;

  public Oberkostengruppenliste: Kostengruppenstruktur[];
  public Hauptkostengruppenliste: Kostengruppenstruktur[];
  public Unterkostengruppenliste: Kostengruppenstruktur[];
  public OkButtonEnabled: boolean;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public DB: DatabaseFestlegungenService,
              private DBProjekte: DatabaseProjekteService,
              public Displayservice: DisplayService,
              private Pool: DatabasePoolService,
              public Kostengruppenservice: KostengruppenService,
              public Const: ConstProvider) {
    try {

      this.Titel = this.Const.NONE;
      this.Iconname = 'cash-outline';
      this.Dialogbreite = 400;
      this.Dialoghoehe = 300;
      this.PositionY = 100;
      this.ZIndex = 3000;
      this.KostengruppenOrigin = this.Const.NONE;
      this.OkButtonEnabled = false;

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

      debugger;

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Kostengruppenauswahl, this.ZIndex);

      this.PrepareData();


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen Auswahl', 'OnInit', this.Debug.Typen.Component);
    }
  }


  private PrepareData() {

    try {


      this.Oberkostengruppenliste  = [];

      if(this.DB.CurrentFestlegungskategorie === null) {

        this.DB.CurrentFestlegungskategorie = this.DB.GetEmptyFestlegungskategorie(this.DBProjekte.CurrentProjekt);
      }

      this.Oberkostengruppenliste = <Kostengruppenstruktur[]>lodash.filter(this.Kostengruppenservice.Kostengruppen, (Gruppe: Kostengruppenstruktur) => {

        return Gruppe.Typ === this.Kostengruppenservice.Kostengruppentypen.Obergruppe;
      });

      this.Hauptkostengruppenliste = [];

      if(this.DB.CurrentFestlegungskategorie.Oberkostengruppe !== null) {

        this.Hauptkostengruppenliste = <Kostengruppenstruktur[]>lodash.filter(this.Kostengruppenservice.Kostengruppen, (Gruppe: Kostengruppenstruktur) => {

          return Gruppe.Typ === this.Kostengruppenservice.Kostengruppentypen.Hauptgruppe && Gruppe.Obergruppennummer === this.DB.CurrentFestlegungskategorie.Oberkostengruppe;
        });
      }
      else {

        this.DB.CurrentFestlegungskategorie.Hauptkostengruppe = null;
        this.DB.CurrentFestlegungskategorie.Unterkostengruppe = null;
      }

      this.Unterkostengruppenliste = [];

      if(this.DB.CurrentFestlegungskategorie.Hauptkostengruppe !== null) {

        this.Unterkostengruppenliste = <Kostengruppenstruktur[]>lodash.filter(this.Kostengruppenservice.Kostengruppen, (Gruppe: Kostengruppenstruktur) => {

          return Gruppe.Typ === this.Kostengruppenservice.Kostengruppentypen.Untergruppe && Gruppe.Hauptgruppennummer === this.DB.CurrentFestlegungskategorie.Hauptkostengruppe;
        });
      }
      else {

        this.DB.CurrentFestlegungskategorie.Unterkostengruppe = null;
      }

      this.CheckOkReady();

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

      this.DB.CurrentFestlegungskategorie.Oberkostengruppe = event.detail.value;

      this.DB.CurrentFestlegungskategorie.Hauptkostengruppe = null;
      this.DB.CurrentFestlegungskategorie.Unterkostengruppe = null;

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen Auswahl', 'OberkostengruppeChanged', this.Debug.Typen.Component);
    }
  }

  HauptkostengruppeChanged(event: any) {

    try {

      this.DB.CurrentFestlegungskategorie.Hauptkostengruppe = event.detail.value;
      this.DB.CurrentFestlegungskategorie.Unterkostengruppe = null;


      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen Auswahl', 'HauptkostengruppeChanged', this.Debug.Typen.Component);
    }
  }

  UnterkostengruppeChanged(event: any) {

    try {

      this.DB.CurrentFestlegungskategorie.Unterkostengruppe = event.detail.value;

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Kostengruppen Auswahl', 'UnterkostengruppeChanged', this.Debug.Typen.Component);
    }
  }


  CheckOkReady() {

    try {

      let GoOn: boolean;

      if(this.DB.CurrentFestlegungskategorie !== null) {

        GoOn = this.DB.CurrentFestlegungskategorie.Hauptkostengruppe !== null &&
               this.DB.CurrentFestlegungskategorie.Oberkostengruppe  !== null &&
               this.DB.CurrentFestlegungskategorie.Unterkostengruppe !== null;
      }
      else {

        GoOn = false;
      }

      this.OkButtonEnabled = GoOn;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Kostengruppen Auswahl', 'CheckOkReady', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      this.Pool.CurrentFestlegungskategorieChanged.emit();
      this.OkClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Kostengruppen Auswahl', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }
}

