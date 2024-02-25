import {Component, Input, Output, OnInit, EventEmitter, OnDestroy} from '@angular/core';
import {Moment} from "moment";
import moment from "moment";
import {FormBuilder } from "@angular/forms";
import {DebugProvider} from "../../services/debug/debug";
import {BasicsProvider} from "../../services/basics/basics";
import {ConstProvider} from "../../services/const/const";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DisplayService} from "../../services/diplay/display.service";
import 'moment-duration-format';
import {DatabaseSimontabelleService} from "../../services/database-simontabelle/database-simontabelle.service";
import {Simontabellestruktur} from "../../dataclasses/simontabellestruktur";
import {Rechnungstruktur} from "../../dataclasses/rechnungstruktur";
import {parseInt} from "lodash-es";

@Component({
  selector:    'pj-rechnung-editor',
  templateUrl: 'pj-rechnung-editor.html',
  styleUrls:  ['pj-rechnung-editor.scss']
})
export class PjRechnungEditorComponent implements OnInit, OnDestroy {

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  @Output() DatumChanged          = new EventEmitter<Moment>();
  @Output() CancelClickedEvent       = new EventEmitter<any>();
  @Output() OkClickedEvent           = new EventEmitter<any>();


  constructor(private Debug: DebugProvider,
              public Basics: BasicsProvider,
              public Pool: DatabasePoolService,
              public fb: FormBuilder,
              public Displayservice: DisplayService,
              public DB: DatabaseSimontabelleService,
              public Const: ConstProvider) {
    try {


    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Rechnung Editor', 'Construktor', this.Debug.Typen.Component);
    }
  }


  ngOnInit() {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.RechnungEditor, this.ZIndex);


    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Rechnung Editor', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  async DatumChangedEvent(event: any) {

    try {

      let Resultstring: string = event.detail.value;
      let Parts: string[]      = Resultstring.split('T');
      let Datestring: string   = Parts[0];
      let Werte: string[]      = Datestring.split('-');

      let Tag: number        = parseInt(Werte[2]);
      let Monat: number      = parseInt(Werte[1]);
      let Jahr: number       = parseInt(Werte[0]);

      let Stunde: number     = 8; // this.Datum.hours();
      let Minute: number     = 0; // this.Datum.minutes();

      let Datum = moment( Tag + '.' + Monat + '.' +  Jahr + ' ' + Stunde + ':' + Minute, 'DD.MM.YYYY HH:mm').locale('de');
      let Tabelle: Simontabellestruktur;
      let Rechnung: Rechnungstruktur;

      this.DB.CurrentRechnung.Zeitstempel = Datum.valueOf();

      for(Tabelle of this.DB.CurrentSimontabellenliste[this.DB.CurrentLeistungsphase]) {

        for(Rechnung of Tabelle.Rechnungen) {

          if(Rechnung.RechnungID === this.DB.CurrentRechnung.RechnungID) {

            Rechnung = this.DB.CurrentRechnung;
          }
        }

        // if(Tabelle._id === this.DB.CurrentSimontabelle._id) this.DB.CurrentSimontabelle = Tabelle;

        await this.DB.UpdateSimontabelle(Tabelle);
      }

      this.DatumChanged.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Rechnung Editor', 'DatumChangedEvent', this.Debug.Typen.Component);
    }
  }


  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Rechnung Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {


    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Rechnung Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      this.OkClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Rechnung Editor', 'function', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.RechnungEditor);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Rechnung Editor', 'ngOnDestroy', this.Debug.Typen.Component);
    }
  }

  GetDatum() {

    try {

      let Datum = moment(this.DB.CurrentRechnung.Zeitstempel);

      return Datum.format('YYYY-MM-DD');

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Rechnung Editor', 'GetDatum', this.Debug.Typen.Component);
    }
  }

  NummerTextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      let Wert: number = parseInt(event.Text);

      if(!isNaN(Wert)) this.DB.CurrentRechnung.Nummer = Wert;



    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Rechnung Editor', 'NummerTextChanged', this.Debug.Typen.Component);
    }
  }
}
