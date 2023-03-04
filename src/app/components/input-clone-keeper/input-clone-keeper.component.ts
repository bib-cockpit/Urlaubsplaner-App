import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output, QueryList,
  ViewChildren
} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {BasicsProvider} from "../../services/basics/basics";
import {ToolsProvider} from "../../services/tools/tools";
import {InputCloneComponent} from "../input-clone/input-clone.component";

@Component({
  selector: 'input-clone-keeper',
  templateUrl: './input-clone-keeper.component.html',
  styleUrls: ['./input-clone-keeper.component.scss'],
})
export class InputCloneKeeperComponent implements OnInit, AfterViewInit {

  @Input()  Valid: boolean;
  @Output() ValidChange = new EventEmitter<boolean>();

  @ViewChildren(InputCloneComponent) List: QueryList<InputCloneComponent>;

  private Inputliste: InputCloneComponent[];

  constructor(private Debug: DebugProvider,
              public Basics: BasicsProvider,
              private elRef: ElementRef,
              public Tools: ToolsProvider) {

    try {

      this.Valid      = true;
      this.Inputliste = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Input Clone Keeper', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Input Clone Keeper', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  public CheckValid(): boolean {

    try {


      let Valid: boolean = true;

      for(let Inputelement of this.Inputliste) {


        if(!Inputelement.Valid) {

          Valid = false;

          break;
        }
      }

      return Valid;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Input Clone Keeper', 'CheckValid', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      this.Inputliste = this.elRef.nativeElement.getElementsByTagName('input-clone');

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Input Clone Keeper', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }
}
