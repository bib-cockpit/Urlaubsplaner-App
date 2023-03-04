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
 import moment from "moment";
 import {Moment} from "moment";
 import {NgxMaterialTimepickerComponent} from "ngx-material-timepicker";

@Component({
  selector: 'button-value-time',
  templateUrl: 'button-value-time.html',
  styleUrls: ['button-value-time.scss']
})

export class ButtonValueTimeComponent implements OnInit, OnChanges {

  @Input() public Buttontext: string;
  @Input() public Uhrzeit: Moment;
  @Input() public MinUhrzeit: Moment;
  @Input() public MaxUhrzeit: Moment;
  @Input() public CheckLeft: boolean;
  @Input() public ElementID: string;
  @Input() public Buttoncolor: string;
  @Input() public Enabled: boolean;
  @Input() public InnerBackgroundcolor: string;

  @Output() public TimeChanged      = new EventEmitter<Moment>();
  @Output() public TimeChangedError = new EventEmitter<string>();

  // @ViewChild('TimePicker',  { static: false }) TimePicker: IonDatetime;
  @ViewChild('Timepicker',  { static: false }) Timepicker: NgxMaterialTimepickerComponent;


  private UhrzeitMerker: Moment;

  constructor(public Basics: BasicsProvider, public Debug: DebugProvider, public Tools: ToolsProvider, public Const: ConstProvider) {

    try {

      let Tag: number     = moment().date();
      let Monat: number   = moment().month();
      let Jahr: number    = moment().year();
      let Stunde: number  = 8;
      let Minute: number  = 0;

      this.Enabled     = true;
      this.Buttontext  = 'Datum';
      this.Uhrzeit     =  moment( Tag + '.' + Monat + '.' +  Jahr + ' ' + Stunde + ':' + Minute, 'DD.MM.YYYY HH:mm').locale('de');
      this.Buttontext  = 'Startzeit';
      this.MinUhrzeit  = null;
      this.MaxUhrzeit  = null;
      this.CheckLeft   = true;
      this.ElementID   = 'open-modal-time';
      this.Buttoncolor = this.Basics.Farben.Burnicklbraun;
      this.InnerBackgroundcolor = this.Basics.Farben.Burnicklgrau;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Button Value Time', 'Constructor', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Button Value Time', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  ButtonClickedHandler() {

    try {

      if(this.Enabled === true) this.Timepicker.open();

      // debugger;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Button Value Time', 'ButtonClickedHandler', this.Debug.Typen.Component);
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    try {

      let UhrzeitValue: SimpleChange = changes.Uhrzeit;

      if(typeof UhrzeitValue !== 'undefined' && UhrzeitValue !== null && UhrzeitValue.currentValue !== null) {

        this.UhrzeitMerker = UhrzeitValue.currentValue;
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Button Value Time', 'ngOnChanges', this.Debug.Typen.Component);
    }
  }

  TimeChangedHandler(Timestring: string) {

    try {

      let Message: string    = '';
      let HasError: boolean  = false;
      let Werte: string[]    = Timestring.split(':');
      let Tag: number        = this.Uhrzeit.date();
      let Monat: number      = this.Uhrzeit.month() + 1;
      let Jahr: number       = this.Uhrzeit.year();
      let Stunde: number     = parseInt(Werte[0]);
      let Minute: number     = parseInt(Werte[1]);

      let Uhrzeit = moment( Tag + '.' + Monat + '.' +  Jahr + ' ' + Stunde + ':' + Minute, 'DD.MM.YYYY HH:mm').locale('de');

      if(typeof this.MinUhrzeit !== 'undefined' && this.MinUhrzeit !== null && this.MinUhrzeit.isValid() &&
         typeof this.MaxUhrzeit !== 'undefined' && this.MaxUhrzeit !== null && this.MaxUhrzeit.isValid() && Uhrzeit.isValid()) {

        // Zeit auf Grenzen von lins prüfen

        if(Uhrzeit.isBefore(this.MinUhrzeit)) {

          HasError = true;
          Message  = 'Der gewählte Zeitpunkt ' + Uhrzeit.format('H:mm') + ' liegt vor dem minimalen Zeitpunkt um ' + this.MinUhrzeit.format('H:mm');
        }

        if(this.Uhrzeit.isAfter(this.MaxUhrzeit)) {

          HasError = true;
          Message  = 'Der gewählte Zeitpunkt ' + Uhrzeit.format('H:mm') + ' liegt nach dem maximalen Zeitpunkt um ' + this.MaxUhrzeit.format('H:mm');
        }

        if(this.CheckLeft) {

          if(Uhrzeit.isSame(this.MaxUhrzeit)) {

            HasError = true;
            Message  = 'der gewählte Zeitpunkt ' + Uhrzeit.format('H:mm') + ' und der spätestens mögliche Zeitpunkt dürfen nicht identisch sein.';
          }
        }
        else {

          if(Uhrzeit.isSame(this.MinUhrzeit)) {

            HasError = true;
            Message  = 'der gewählte Zeitpunkt ' + Uhrzeit.format('H:mm') + ' und der frühestends mögliche Zeitpunkt dürfen nicht identisch sein.';
          }
        }
      }

      if(!HasError) {

        this.TimeChanged.emit(Uhrzeit);
      }
      /*
      else {

        this.Uhrzeit          = this.UhrzeitMerker.clone();
        this.TimePicker.value = this.GetUhrzeit();

        this.TimeChangedError.emit(Message);
      }

       */

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'file', 'function', this.Debug.Typen.Page);
    }
  }

  /*

  TimeChangedHandler(value: CustomEvent) {

    try {

      let Timestring: string = value.detail.value;
      let Werte: string[]    = Timestring.split(':');
      let Tag: number        = this.Uhrzeit.date();
      let Monat: number      = this.Uhrzeit.month() + 1;
      let Jahr: number       = this.Uhrzeit.year();
      let Stunde: number     = parseInt(Werte[0]);
      let Minute: number     = parseInt(Werte[1]);
      let Message: string    = '';
      let HasError: boolean  = false;

      let Uhrzeit = MyMoment( Tag + '.' + Monat + '.' +  Jahr + ' ' + Stunde + ':' + Minute, 'DD.MM.YYYY HH:mm').locale('de');

      if(typeof this.MinUhrzeit !== 'undefined' && this.MinUhrzeit !== null && this.MinUhrzeit.isValid() &&
         typeof this.MaxUhrzeit !== 'undefined' && this.MaxUhrzeit !== null && this.MaxUhrzeit.isValid() && Uhrzeit.isValid()) {

        // Zeit auf Grenzen von lins prüfen

        if(Uhrzeit.isBefore(this.MinUhrzeit)) {

          HasError = true;
          Message  = 'Der gewählte Zeitpunkt ' + Uhrzeit.format('H:mm') + ' liegt vor dem minimalen Zeitpunkt um ' + this.MinUhrzeit.format('H:mm');
        }

        if(this.Uhrzeit.isAfter(this.MaxUhrzeit)) {

          HasError = true;
          Message  = 'Der gewählte Zeitpunkt ' + Uhrzeit.format('H:mm') + ' liegt nach dem maximalen Zeitpunkt um ' + this.MaxUhrzeit.format('H:mm');
        }

        if(this.CheckLeft) {

          if(Uhrzeit.isSame(this.MaxUhrzeit)) {

            HasError = true;
            Message  = 'der gewählte Zeitpunkt ' + Uhrzeit.format('H:mm') + ' und der spätestens mögliche Zeitpunkt dürfen nicht identisch sein.';
          }
        }
        else {

          if(Uhrzeit.isSame(this.MinUhrzeit)) {

            HasError = true;
            Message  = 'der gewählte Zeitpunkt ' + Uhrzeit.format('H:mm') + ' und der frühestends mögliche Zeitpunkt dürfen nicht identisch sein.';
          }
        }
      }

      if(!HasError) {

        this.TimeChanged.emit(Uhrzeit);
      }
      else {

        this.Uhrzeit          = this.UhrzeitMerker.clone();
        this.TimePicker.value = this.GetUhrzeit();

        this.TimeChangedError.emit(Message);
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Button Value Time', 'TimeChangedHandler', this.Debug.Typen.Component);
    }
  }

   */

  GetMinUhrzeit(): string {

    try {

      if(typeof this.MinUhrzeit !== 'undefined' && this.MinUhrzeit !== null && this.MinUhrzeit.isValid()) {

        return this.MinUhrzeit.format('HH:mm');
      }
      else {

        return '00:00';
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Button Value Time', 'GetMinUhrzeit', this.Debug.Typen.Component);
    }
  }

  GetMaxUhrzeit(): string {

    try {

      if(typeof this.MaxUhrzeit !== 'undefined' && this.MaxUhrzeit !== null && this.MaxUhrzeit.isValid()) {

        return this.MaxUhrzeit.format('HH:mm');
      }
      else {

        return '23:59';
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Button Value Time', 'GetMaxUhrzeit', this.Debug.Typen.Component);
    }
  }

  GetUhrzeit() {

    try {

      if(typeof this.Uhrzeit !== 'undefined' && this.Uhrzeit !== null && this.Uhrzeit.isValid()) {

        return this.Uhrzeit.clone().format('HH:mm');
      }
      else {

        return '12:00';
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Button Value Time', 'GetUhrzeit', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {


    try {

      // debugger;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'file', 'function', this.Debug.Typen.Page);
    }
  }
}
