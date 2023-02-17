import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {BasicsProvider} from "../../services/basics/basics";
import {ConstProvider} from "../../services/const/const";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";

@Component({
  selector: 'page-modal-keeper',
  templateUrl: './page-modal-keeper.component.html',
  styleUrls: ['./page-modal-keeper.component.scss'],
})
export class PageModalKeeperComponent implements OnInit {

  @Output() CancelClickedEvent         = new EventEmitter<any>();
  @Output() StandortfilterClickedEvent = new EventEmitter<any>();
  @Output() OkClickedEvent             = new EventEmitter<any>();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() OkButtonEneabled: boolean;
  @Input() ShowSandortfilter: boolean;
  @Input() PositionY: number;

  /*
  @Input()  DialogVisible: boolean;
  @Output() DialogVisibleChange = new EventEmitter<boolean>();

   */


  constructor(private Debug: DebugProvider,
              public Const: ConstProvider,
              public Basics: BasicsProvider,
              public DBStandort: DatabaseStandorteService) {
    try {

      this.Titel             = this.Const.NONE;
      this.Iconname          = 'help-circle-outline';
      // this.DialogVisible     = false;
      this.Dialogbreite      = 400;
      this.Dialoghoehe       = 300;
      this.OkButtonEneabled  = true;
      this.ShowSandortfilter = true;
      this.PositionY         = 100;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Modal Keeper', 'consturctor', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Modal Keeper', 'OnInit', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    this.CancelClickedEvent.emit();
    // this.DialogVisibleChange.emit(false);

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Modal Keeper', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {


    this.OkClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Modal Keeper', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Modal Keeper', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  StandortfilterButtonClicked() {

    try {

      this.StandortfilterClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Modal Keeper', 'StandortfilterButtonClicked', this.Debug.Typen.Component);
    }

  }
}
