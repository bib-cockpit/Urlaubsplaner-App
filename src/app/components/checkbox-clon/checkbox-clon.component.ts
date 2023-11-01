import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";

@Component({
  selector: 'checkbox-clon',
  templateUrl: './checkbox-clon.component.html',
  styleUrls: ['./checkbox-clon.component.scss'],
})
export class CheckboxClonComponent implements OnInit {

  @Input() Checked: boolean     = false;
  @Input() Enabled: boolean     = true;
  @Input() CanUnselect: boolean = true;
  @Input() Index:   number      = -1;
  @Input() Background:   string = 'white';
  @Input() Value:        string = null;

  @Output() CheckChanged: EventEmitter<{status: boolean; index: number; event: any; value: string}> = new EventEmitter<{status: boolean; index: number; event: any; value: string}>();

  public ImgSource: string;

  constructor(public Basics: BasicsProvider,
              private Tools: ToolsProvider,
              public Debug: DebugProvider) {

    try {

      this.ImgSource = this.Basics.Svgpath + 'hacken.svg';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Checkbox', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      if(this.Enabled === false) {

        this.Background = '#B2BABB';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Checkbox', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  DivClickedHnadler(event: MouseEvent) {

    try {

      event.stopPropagation();
      event.preventDefault();

      if(this.Enabled && this.CanUnselect === true || this.Enabled && this.CanUnselect === false && this.Checked === false) {

        this.CheckChanged.emit({status: !this.Checked, index: this.Index, event: event, value: this.Value});

      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Checkbox', 'DivClickedHnadler', this.Debug.Typen.Component);
    }
  }
}
