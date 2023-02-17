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

  @Output() CheckChanged: EventEmitter<{status: boolean; index: number; event: any}> = new EventEmitter<{status: boolean; index: number; event: any}>();

  public ImgSource: string;

  constructor(public Basics: BasicsProvider,
              private Tools: ToolsProvider,
              public Debug: DebugProvider) {

    try {

      this.ImgSource = this.Basics.Svgpath + 'hacken.svg';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'file', 'function', this.Debug.Typen.Page);
    }
  }

  ngOnInit() {}

  DivClickedHnadler(event: MouseEvent) {

    try {

      event.stopPropagation();
      event.preventDefault();

      if(this.Enabled && this.CanUnselect === true || this.Enabled && this.CanUnselect === false && this.Checked === false) {

        this.CheckChanged.emit({status: !this.Checked, index: this.Index, event: event});

      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'file', 'function', this.Debug.Typen.Page);
    }
  }
}
