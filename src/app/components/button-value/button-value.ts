import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {BasicsProvider} from '../../services/basics/basics';
import {DebugProvider} from '../../services/debug/debug';
import {ToolsProvider} from '../../services/tools/tools';
import {ConstProvider} from '../../services/const/const';


@Component({
  selector: 'button-value',
  templateUrl: 'button-value.html',
  styleUrls: ['button-value.scss'],
})


export class ButtonValueComponent implements OnInit, OnChanges {

  @Input() public Buttoncolor: string;
  @Input() public Buttontext: string;
  @Input() public Wert_A: string; // |Tastaturdatenstruktur;
  @Input() public Wert_B: string;
  @Input() public Iconfile: string;
  @Input() public Iconcolor: string;
  @Input() public Enabled: boolean;
  @Input() public SmallWidth: boolean;
  @Input() public BigHeight: boolean;
  @Input() public ShowMargin: boolean;
  @Input() public Width: number;
  @Input() public ProContent: boolean = false;
  @Input() public ProMessage: string = '';
  @Input() public Buttonvaluecolor: string = '';

  @Output() public ButtonClicked = new EventEmitter();
  @Output() public DisabledButtonClicked = new EventEmitter();

  public RGB: string;
  public Wert_A_String: string;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public Const: ConstProvider) {

    try {

      this.Width       = 0;
      this.ShowMargin  = true;
      this.BigHeight   = false;
      this.SmallWidth  = false;
      this.Buttontext  = '';
      this.Wert_A      = '';
      this.Wert_B      = '';
      this.Iconcolor   = 'red';
      this.Iconfile    = '';
      this.Buttoncolor = this.Basics.Farben.Burnicklbraun;
      this.Enabled     = true;
      this.Buttonvaluecolor = this.Basics.Farben.Burnicklgrau;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Button Value', 'Constructor', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Button Value', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    try {

      let Buttonvalue: SimpleChange = changes.Buttoncolor;
      let Wert_A_Value: SimpleChange = changes.Wert_A;
      // let Werte: Tastaturdatenstruktur;
      let Index: number;
      let Text: string;

      if(typeof Buttonvalue !== 'undefined') {

        if(!Buttonvalue.firstChange)
        {
          this.RGB = this.Tools.HexToRGB(Buttonvalue.currentValue);
        }
      }

      if(typeof Wert_A_Value !== 'undefined' && typeof Wert_A_Value.currentValue !== 'undefined') {

        if(typeof Wert_A_Value.currentValue === 'string') {

          // Stringausgabe

          this.Wert_A_String = Wert_A_Value.currentValue;

        } else {

          /*

          // Tastaturstruktur aks String ausgeben

          Werte = Wert_A_Value.currentValue;
          Index = Exponentenzahlen.indexOf(Werte.Exponent);

          if(Werte.Currency) {

            if(typeof Werte.Wert !== 'undefined') {

              Text = Werte.Wert.toFixed(2).replace('.', ',') + ' ' + Exponentensymbole[Index] + Werte.Einheit;

            } else {

              Text = Werte.Wertname + ' n.d.';
            }

          } else {

            if(typeof Werte.Wert !== 'undefined') {

              Text = Werte.Wert.toString().replace('.', ',') + ' ' + Exponentensymbole[Index] + Werte.Einheit;

            } else {

                Text = Werte.Wertname + ' n.d.';
            }
          }

          if(Werte.Hochzahl === 2) Text += '&sup2';
          if(Werte.Hochzahl === 3) Text += '&sup3';

          this.Wert_A_String = Text;


           */
        }
      }
    }

    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Button Value', 'ngOnChanges', this.Debug.Typen.Component);
    }
  }

  ButtonClickedHandler() {

    try {

      if(this.Enabled === true) {

        this.ButtonClicked.emit();

      }
      else {

        this.DisabledButtonClicked.emit();
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Button Value', 'ButtonClickedHandler', this.Debug.Typen.Component);
    }
  }
}
