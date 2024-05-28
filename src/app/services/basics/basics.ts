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
  public AppBuild: string             = '28.05.2024 20:30';
  public AppVersionName: string       = '1.16';
  public AppVersionDatum: string      = '28.05.2024';
  public WebAppUrl: string            = 'https://polite-cliff-084832d03.4.azurestaticapps.net/';


  public Farben = {

    BAEBlau:       '#307ac1',
    BAEHellgrau:   '#dfe5eb',
    Gruen:         '#006400',
    Burnicklgruen: '#c7d304',
    Grau:          '#454545',
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
    BAEBlau:       'baeblau',
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
