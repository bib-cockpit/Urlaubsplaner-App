import {
  Component, ElementRef,
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
import {ConstProvider} from '../../services/const/const';
import {ToolsProvider} from '../../services/tools/tools';
import {PageHeaderComponent} from '../page-header/page-header';
import {PageFooterComponent} from '../page-footer/page-footer';

@Component({
  selector: 'alphabet-relative',
  templateUrl: 'alphabet-relative.html',
  styleUrls: ['alphabet-relative.scss']
})
export class AlphabetRelativeComponent implements OnInit, OnChanges {

  @Input() Breite: number;
  @Input() Auswahl: string = '';
  @Input() Buchstabenliste: string[] = [];
  @Output() AlphabetClicked = new EventEmitter();
  @Output() ZusatzbuttonClicked = new EventEmitter();

  @ViewChild('ImageKeeperDiv', {  static: true }) private ImageKeeperDiv: ElementRef;


  public Style;
  public Filterliste: string[];

  constructor(private Debug: DebugProvider,
               public Basics: BasicsProvider,
              public Const: ConstProvider,
              private Tools: ToolsProvider) {

    try {

      this.Auswahl           = '';
      this.Breite            = 0;
      this.Buchstabenliste   = ['Alle','A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
      this.Filterliste       = [];

   }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Alphabet', 'Constructor', this.Debug.Typen.Component);
    }
  }

  public InitScreen() {

    try {

      let TopPossition: number    = 0;
      let BottomPossition: number = 0;

      this.Style = {

        width: this.Breite      + 'px',
        top: TopPossition       + 'px',
        bottom: BottomPossition + 'px',
        background: this.Basics.Farben.Burnicklgrau,
        display: 'flex',
        'flex-direction': 'column',
        'justify-content': 'center' // horizontal
      };
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Alphabet', 'InitScreen', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.InitScreen();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Alphabet', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  AlphabetClickedHandler(buchstabe: string) {

    try {

      this.AlphabetClicked.emit(buchstabe);

      this.Auswahl = buchstabe;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Alphabet', 'AlphabetClickedHandler', this.Debug.Typen.Component);
    }
  }


  SetFilterliste() {

    try {

      this.Filterliste = this.Buchstabenliste;

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Alphabet', 'SetFilterliste', this.Debug.Typen.Component);
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    try {

      let Value: SimpleChange;

      Value = changes.Buchstabenliste;

      if(typeof Value !== 'undefined') {

        this.SetFilterliste();
      }

      Value = changes.Breite;

      if(typeof Value !== 'undefined') {

        this.InitScreen();
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error,  'Alphabet', 'ngOnChanges', this.Debug.Typen.Component);
    }
  }
}
