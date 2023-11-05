 import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
   SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {BasicsProvider} from '../../services/basics/basics';
import {DebugProvider} from '../../services/debug/debug';
import {ToolsProvider} from '../../services/tools/tools';
 import {ConstProvider} from '../../services/const/const';
 import {IonDatetime} from "@ionic/angular";
 import MyMoment from "moment";
 import {Moment} from "moment";

@Component({
  selector: 'button-value-date',
  templateUrl: 'button-value-date.html',
  styleUrls: ['button-value-date.scss']
})

export class ButtonValueDateComponent implements OnInit, OnChanges {

  @Input() public Buttontext: string;
  @Input() public Minimum: Moment;
  @Input() public Maximum: Moment;
  @Input() public Datum: Moment;
  @Input() public Buttoncolor: string;
  @Input() public InnerBackgroundcolor: string;
  @Input() public Enabled: boolean;
  @Input() public ElementID: string;
  @Input() public Buttonsize: string;
  @Input() public ShowKW: boolean;
  @Input() public ValueBreite: number;

  @Output() public TimeChanged = new EventEmitter<Moment>();
  @Output() public DiabledButtonClicked = new EventEmitter<Moment>();

  @ViewChild('DatePicker', { static: false }) DatePicker: IonDatetime;

  public Minimumstring: string;
  public Maximumstring: string;

  constructor(public Basics: BasicsProvider, public Debug: DebugProvider, public Tools: ToolsProvider, public Const: ConstProvider) {

    try {

      let Tag: number     = 1;
      let Monat: number   = 7;
      let Heute: Moment   = MyMoment();
      let Jahr: number    = Heute.year();
      let Stunde: number  = 12;
      let Minute: number = 0;

      this.ValueBreite   = 260;
      this.Minimum       = MyMoment().set({year: 2000, month: 0, date: 1 }).locale('de');
      this.Maximum       = MyMoment().set({year: Jahr, month: 11, date: 31}).locale('de');
      this.Minimumstring = '2000-01-01';
      this.Maximumstring = Jahr.toString() + '-12-31';
      this.Buttontext    = 'Datum';
      this.Datum         =  MyMoment( Tag + '.' + Monat + '.' +  Jahr + ' ' + Stunde + ':' + Minute, 'DD.MM.YYYY HH:mm').locale('de');
      this.Enabled       = true;
      this.Buttoncolor   = this.Basics.Farben.Burnicklbraun;
      this.ElementID     = 'open-modal-date';
      this.Buttonsize    = 'normal';
      this.ShowKW        = false;

      this.InnerBackgroundcolor = this.Basics.Farben.Burnicklgrau;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Button Value Date', 'Constructor', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Button Value Date', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    try {

      let Minimum: SimpleChange = changes.Minimum;
      let Maximum: SimpleChange = changes.Maximum;

      if (typeof Minimum !== 'undefined') {

        this.Minimum       = Minimum.currentValue;
        this.Minimumstring = this.Minimum.format('YYYY-MM-DD');
      }

      if (typeof Maximum !== 'undefined') {

        this.Maximum       = Maximum.currentValue;
        this.Maximumstring = this.Maximum.format('YYYY-MM-DD');
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Button Value Date', 'ngOnChanges', this.Debug.Typen.Component);
    }
  }

  /*

  ButtonClickedHandler() {

    try {

      if(this.Enabled === true) {

        this.Tools.PlayClicksound().then(() => {

          // this.DatePicker.open();
        });
      }
      else {

        this.DiabledButtonClicked.emit();
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Button Value Date', 'ButtonClickedHandler', this.Debug.Typen.Component);
    }
  }

   */



  public FetigButtonClicked() {

    try {

      this.DatePicker.confirm(true);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Button Value Date', 'FetigButtonClicked', this.Debug.Typen.Component);
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

      this.Datum = MyMoment( Tag + '.' + Monat + '.' +  Jahr + ' ' + Stunde + ':' + Minute, 'DD.MM.YYYY HH:mm').locale('de');

      this.TimeChanged.emit(this.Datum);
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Button Value Date', 'DateChangedHandler', this.Debug.Typen.Component);
    }
  }
}
