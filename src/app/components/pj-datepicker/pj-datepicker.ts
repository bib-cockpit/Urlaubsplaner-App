 import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild} from '@angular/core';
import {BasicsProvider} from '../../services/basics/basics';
import {DebugProvider} from '../../services/debug/debug';
import {ToolsProvider} from '../../services/tools/tools';
 import {ConstProvider} from '../../services/const/const';
 import {IonDatetime, IonModal} from "@ionic/angular";
 import moment from "moment";
 import {Moment} from "moment";
 import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";

@Component({
  selector:    'pj-datepicker',
  templateUrl: 'pj-datepicker.html',
  styleUrls:  ['pj-datepicker.scss']
})

export class PjDatepickerComponent implements OnInit, OnChanges {

  @Input() public Minimum: Moment;
  @Input() public Maximum: Moment;
  @Input() public Datum: Moment;
  @Input() public ElementID: string;
  @Input() public Background: string;
  @Input() public Color:      string;
  @Input() public Projektpunkt: Projektpunktestruktur;
  @Input() public Smallsize: boolean;
  @Input() public Smalldate: boolean;

  @Output() public DateClicked = new EventEmitter<any>();
  @Output() public TimeChanged = new EventEmitter<
    {
      Zeit: Moment;
      Projektpunkt: Projektpunktestruktur;
    }>();

  @Output() public DiabledButtonClicked = new EventEmitter<Moment>();

  @ViewChild('DatePicker', { static: false }) DatePicker: IonDatetime;

  public Minimumstring: string;
  public Maximumstring: string;

  constructor(public Basics: BasicsProvider, public Debug: DebugProvider, public Tools: ToolsProvider, public Const: ConstProvider) {

    try {

      let Tag: number     = 1;
      let Monat: number   = 7;
      let Heute: Moment   = moment();
      let Jahr: number    = Heute.year();
      let Stunde: number  = 12;
      let Minute: number = 0;

      this.Minimum       = moment().set({year: 2000, month: 0, date: 1 }).locale('de');
      this.Maximum       = moment().set({year: Jahr, month: 11, date: 31}).locale('de');
      this.Minimumstring = '2000-01-01';
      this.Maximumstring = Jahr.toString() + '-12-31';
      this.Datum         =  moment( Tag + '.' + Monat + '.' +  Jahr + ' ' + Stunde + ':' + Minute, 'DD.MM.YYYY HH:mm').locale('de');
      this.ElementID     = 'open-modal-date';
      this.Background    = 'white';
      this.Color         = 'black';
      this.Projektpunkt  = null;
      this.Smallsize     = false;
      this.Smalldate     = false;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error,  'Button Value Date', 'Constructor', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error,  'Button Value Date', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    try {

      let Minimum: SimpleChange = changes.Minimum;
      let Maximum: SimpleChange = changes.Maximum;

      if (typeof Minimum !== 'undefined') {

        // debugger;

        this.Minimum       = Minimum.currentValue;
        this.Minimumstring = this.Minimum.format('YYYY-MM-DD');
      }

      if (typeof Maximum !== 'undefined') {

        this.Maximum       = Maximum.currentValue;
        this.Maximumstring = this.Maximum.format('YYYY-MM-DD');
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Button Value Date', 'ngOnChanges', this.Debug.Typen.Component);
    }
  }

  public FetigButtonClicked() {

    try {

      this.DatePicker.confirm(true);
      this.DatePicker.reset();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Button Value Date', 'FetigButtonClicked', this.Debug.Typen.Component);
    }
  }

  DateChangedHandler(value: any) {

    try {

      let Resultstring: string = value.detail.value;
      let Parts: string[]      = Resultstring.split('T');
      let Datestring: string   = Parts[0];
      let Werte: string[]      = Datestring.split('-');

      let Tag: number        = parseInt(Werte[2]);
      let Monat: number      = parseInt(Werte[1]);
      let Jahr: number       = parseInt(Werte[0]);


      let Stunde: number     = this.Datum.hours();
      let Minute: number     = this.Datum.minutes();

      this.Datum = moment( Tag + '.' + Monat + '.' +  Jahr + ' ' + Stunde + ':' + Minute, 'DD.MM.YYYY HH:mm').locale('de');

      this.Debug.ShowMessage(Datestring,'Button Value Date', 'DateChangedHandler', this.Debug.Typen.Component);

      this.TimeChanged.emit({Zeit: this.Datum, Projektpunkt: this.Projektpunkt });

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Button Value Date', 'DateChangedHandler', this.Debug.Typen.Component);
    }
  }

  DateClickedHandler($event: MouseEvent) {

    try {

      this.DateClicked.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Button Value Date', 'DateClickedHandler', this.Debug.Typen.Component);
    }
  }
}
