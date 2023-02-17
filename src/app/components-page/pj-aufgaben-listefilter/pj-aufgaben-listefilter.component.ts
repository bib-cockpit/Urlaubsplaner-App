import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {ToolsProvider} from '../../services/tools/tools';
import {BasicsProvider} from '../../services/basics/basics';
import {DebugProvider} from '../../services/debug/debug';
import {ConstProvider} from '../../services/const/const';
import {Moment} from 'moment';
import moment from 'moment';
import * as lodash from "lodash-es";
import {DisplayService} from "../../services/diplay/display.service";
import {InputCloneComponent} from "../../components/input-clone/input-clone.component";
import {DatabaseProjektpunkteService} from "../../services/database-projektpunkte/database-projektpunkte.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import {Subscription} from "rxjs";
import {Mitarbeitersettingsstruktur} from "../../dataclasses/mitarbeitersettingsstruktur";
import {
  DatabaseMitarbeitersettingsService
} from "../../services/database-mitarbeitersettings/database-mitarbeitersettings.service";

@Component({
  selector:    'pj-aufgaben-listefilter',
  templateUrl: 'pj-aufgaben-listefilter.component.html',
  styleUrls: ['pj-aufgaben-listefilter.component.scss']
})
export class PjAufgabenListefilterComponent implements OnDestroy, OnInit, AfterViewInit {

  @Output() OkClickedEvent              = new EventEmitter<any>();
  @Output() CancelClickedEvent          = new EventEmitter();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  private MitarbeiterSubscription: Subscription;
  public Mitarbeitersettings: Mitarbeitersettingsstruktur;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public Const: ConstProvider,
              public MitarbeitersettingsDB: DatabaseMitarbeitersettingsService,
              public DB: DatabaseProjektpunkteService,
              public Pool: DatabasePoolService,
              public Displayservice: DisplayService) {
    try {

      this.Iconname                = 'filter-outline';
      this.Dialogbreite            = 400;
      this.Dialoghoehe             = 300;
      this.PositionY               = 100;
      this.ZIndex                  = 3000;
      this.MitarbeiterSubscription = null;
      this.Mitarbeitersettings     = null;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnInit(): void {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Aufgabenlistefilter, this.ZIndex);

      this.MitarbeiterSubscription = this.Pool.MitarbeitersettingsChanged.subscribe(() => {

        this.PrepareData();
      });

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'OnInit', this.Debug.Typen.Component);
    }

  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'ContentClicked', this.Debug.Typen.Component);
    }
  }


  ngOnDestroy(): void {

    try {


      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Aufgabenlistefilter);



    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'OnDestroy', this.Debug.Typen.Component);
    }
  }


  public ionViewDidEnter() {

    try {

      this.PrepareData();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'ionViewDidEnter', this.Debug.Typen.Component);
    }
  }

  ionViewDidLeave() {

    try {


    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'ionViewDidLeave', this.Debug.Typen.Component);
    }
  }


  private PrepareData() {

    try {

      this.Mitarbeitersettings = lodash.cloneDeep(this.Pool.Mitarbeitersettings);
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'PrepareData', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {

    try {


      this.CancelClickedEvent.emit();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }


  OkButtonClicked() {

    try {

      this.Pool.Mitarbeitersettings = this.Mitarbeitersettings;


      this.MitarbeitersettingsDB.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings).then(() => {

        this.OkClickedEvent.emit();

      });

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }

  public GetDatum(timestamp: number): Moment {

    try {

      let Heute: Moment = moment().locale('de');

      if(timestamp !== null) return moment(timestamp).locale('de');
      else return Heute;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'file', 'function', this.Debug.Typen.Component);
    }
  }

  public GetWochenstring(): string {

    try {

      let Heute: Moment = moment();

      return 'KW ' + Heute.locale('de').format('WW YYYY');

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'GetWochenstring', this.Debug.Typen.Component);
    }
  }

  public GetMonatsstring(): string {

    try {

      let Heute: Moment = moment();

      return Heute.locale('de').format('MMMM YYYY');

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'GetMonatsstring', this.Debug.Typen.Component);
    }
  }

  SetAufgabenTerminfiltervariante(event: any) {

    try {

      let Heute: Moment = moment().locale('de');

      this.Mitarbeitersettings.AufgabenTerminfiltervariante = event.detail.value;

      switch(this.Mitarbeitersettings.AufgabenTerminfiltervariante) {

        case this.Const.Faelligkeitsterminfiltervarianten.Zeitspanne:

          if(this.Mitarbeitersettings.AufgabenTerminfilterStartwert === null) this.Mitarbeitersettings.AufgabenTerminfilterStartwert = Heute.valueOf();
          if(this.Mitarbeitersettings.AufgabenTerminfilterEndewert  === null) this.Mitarbeitersettings.AufgabenTerminfilterEndewert  = Heute.valueOf();

          break;

        case this.Const.Faelligkeitsterminfiltervarianten.Bis_zum_Zeitpunkt:

          if(this.Mitarbeitersettings.AufgabenTerminfilterEndewert  === null) this.Mitarbeitersettings.AufgabenTerminfilterEndewert  = Heute.valueOf();

          break;

        case this.Const.Faelligkeitsterminfiltervarianten.Seit_dem_Zeitpunkt:

          if(this.Mitarbeitersettings.AufgabenTerminfilterStartwert === null) this.Mitarbeitersettings.AufgabenTerminfilterStartwert = Heute.valueOf();

          break;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'SetAufgabenTerminfiltervariante', this.Debug.Typen.Component);
    }
  }

  TerminEndeDatumChanged(datum: moment.Moment) {

    try {

      this.Mitarbeitersettings.AufgabenTerminfilterEndewert = datum.valueOf();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'TerminEndeDatumChanged', this.Debug.Typen.Component);
    }
  }

  TerminStartDatumChanged(datum: moment.Moment) {

    try {

      this.Mitarbeitersettings.AufgabenTerminfilterStartwert = datum.valueOf();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Aufgaben Liste Filter', 'TerminStartDatumChanged', this.Debug.Typen.Component);
    }
  }
}
