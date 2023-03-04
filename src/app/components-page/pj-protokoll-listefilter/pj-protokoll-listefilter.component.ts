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
import {ToolsProvider} from '../../services/tools/tools';
import {BasicsProvider} from '../../services/basics/basics';
import {DebugProvider} from '../../services/debug/debug';
import {ConstProvider} from '../../services/const/const';
import {Moment} from 'moment';
import moment from 'moment';
import {DatabaseProtokolleService} from "../../services/database-protokolle/database-protokolle.service";
import {DisplayService} from "../../services/diplay/display.service";
import {InputCloneComponent} from "../../components/input-clone/input-clone.component";

@Component({
  selector:    'pj-protokoll-listefilter',
  templateUrl: 'pj-protokoll-listefilter.component.html',
  styleUrls: ['pj-protokoll-listefilter.component.scss']
})
export class PjProtokollListefilterComponent implements OnDestroy, OnInit, AfterViewInit {

  @ViewChildren(InputCloneComponent) List: QueryList<InputCloneComponent>;

  @Output() OkClickedEvent              = new EventEmitter<any>();
  @Output() CancelClickedEvent          = new EventEmitter();


  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public Const: ConstProvider,
              public DB: DatabaseProtokolleService,
              public Displayservice: DisplayService) {
    try {

      this.Iconname            = 'filter-outline';
      this.Dialogbreite        = 400;
      this.Dialoghoehe         = 300;
      this.PositionY           = 100;
      this.ZIndex              = 3000;


    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokolle Liste Filter', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnInit(): void {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Protokolllistefilter, this.ZIndex);


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokolle Liste Filter', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokolle Liste Filter', 'ContentClicked', this.Debug.Typen.Component);
    }
  }


  ngOnDestroy(): void {

    try {


      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Protokolllistefilter);



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokolle Liste Filter', 'OnDestroy', this.Debug.Typen.Component);
    }
  }


  public ionViewDidEnter() {

    try {


      this.PrepareData();

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokolle Liste Filter', 'ionViewDidEnter', this.Debug.Typen.Component);
    }
  }

  ionViewDidLeave() {

    try {


    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokolle Liste Filter', 'ionViewDidLeave', this.Debug.Typen.Component);
    }
  }


  private PrepareData() {

    try {


    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokolle Liste Filter', 'PrepareData', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {

    try {


      this.CancelClickedEvent.emit();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokolle Liste Filter', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }


  OkButtonClicked() {

    try {

      this.OkClickedEvent.emit();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokolle Liste Filter', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokolle Liste Filter', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }

  public GetMonatsstring(monatsabzug: number) {

    try {

      let Heute: Moment = moment();

      return Heute.subtract(monatsabzug, 'month').locale('de').format('MMMM YYYY');

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokolle Liste Filter', 'GetMonatstring', this.Debug.Typen.Component);
    }

  }
}
