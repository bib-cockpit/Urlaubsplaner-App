import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import {PageHeaderComponent} from '../../components/page-header/page-header';
import {PageFooterComponent} from '../../components/page-footer/page-footer';
import {ConstProvider} from "../const/const";

@Injectable({

  providedIn: 'root'
})
export class BasicsProvider {

  public Headerhoehe: number          = 0;
  public Footerhoehe: number          = 0;
  public Contenthoehe: number         = 0;
  public Contentbreite: number        = 0;
  public InnerContenthoehe: number    = 0;
  public Waittime: number             = 300;
  public Svgpath: string              = 'assets/svgs/';
  public AppVersionName: string       = 'none';
  public AppVersionDatum: string      = 'none';


  public Farben = {

    Gruen:         '#006400',
    Burnicklgruen: '#c7d304',
    Buttoncolor:   '#444444',
    Blau:          '#00008B',
    Orange:        '#FF8C00',
    Bordercolor:   '#3880ff',
    Burnicklbraun: '#7b6a58',
    Burnicklgrau:  '#354547',
    ButtongrauDisabled: '#444444'
  };

  public Ionicfarben = {

    BurnicklGruen: 'burnicklgruen',
    BurnicklGrau:  'burnicklgrau',
    BurnicklBraun: 'burnicklbraun',
    Gruen:         'gruen',
    Orange:        'orange',
    Grau:          'grau',
    Silber:        'silber',
    Schwarz:       'schwarz',
    Weiss:         'weiss',
    Rot:           'rot',
    Blau:          'blau',
    Dunkelblau:    'dunkelblau',
    Braun:         'braun',
    Teal:          'teal',
    Gelb:          'gelb'
  };


  public  ShowFehlerbericht: boolean  = true;


  constructor(public platform: Platform, public Const: ConstProvider) {


  }


  public MeassureInnercontent(header: PageHeaderComponent, footer: PageFooterComponent) {

    try {

      if(typeof header !== 'undefined' && header !== null) {

        this.Headerhoehe = header.PageHeaderDiv.nativeElement.clientHeight;
      }
      else this.Headerhoehe = 56;

      if(typeof footer !== 'undefined' &&footer !== null) {

        this.Footerhoehe = footer.PageFooterFrameDiv.nativeElement.clientHeight;
      }
      else this.Footerhoehe = 55;

      this.InnerContenthoehe = this.Contenthoehe - this.Headerhoehe - this.Footerhoehe;


      console.log('Basics MeassureScreen -> Screenbreite: ' + this.platform.width() + ' / Screenhoehe: ' + this.platform.height());
      console.log('Basics MeassureScreen -> Headerhoehe: ' + this.Headerhoehe + ' / Footerhoehe: ' + this.Footerhoehe);
      console.log('Basics MeassureScreen -> InnerContenthoehe: ' + this.InnerContenthoehe);
    }
    catch (error) {

      window.console.log(error +  ' / Basics '  + ' / MeassureInnercontent ');
    }
  }
}
