import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {PageHeaderComponent} from "../../components/page-header/page-header";
import {PageFooterComponent} from "../../components/page-footer/page-footer";
import {ConstProvider} from "../../services/const/const";
import * as lodash from "lodash-es";
import {BasicsProvider} from "../../services/basics/basics";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DisplayService} from "../../services/diplay/display.service";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {Graphservice} from "../../services/graph/graph";
import {ToolsProvider} from "../../services/tools/tools";
import {MenueService} from "../../services/menue/menue.service";
import {LoadingAnimationService} from "../../services/loadinganimation/loadinganimation";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";

@Component({
  selector:    'pj-filebrowser-page',
  templateUrl: 'pj-filebrowser.page.html',
  styleUrls:  ['pj-filebrowser.page.scss'],
})
export class PjFilebrowserPage implements OnInit, OnDestroy {

  @ViewChild('PageHeader', {static: false}) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', {static: false}) PageFooter: PageFooterComponent;

  public BackMouseOver: boolean;
  public Browserbreite: number;
  public Browserhoehe: number;
  public Zoomfaktor: number;

  constructor(public Displayservice: DisplayService,
              public Basics: BasicsProvider,
              public DBProjekte: DatabaseProjekteService,
              public Const: ConstProvider,
              public Tools: ToolsProvider,
              public Menuservice: MenueService,
              public Pool: DatabasePoolService,
              public GraphService: Graphservice,
              private LoadingAnimation: LoadingAnimationService,
              public Debug: DebugProvider) {

    try {

      this.BackMouseOver = false;
      this.Browserbreite = 450;
      this.Browserhoehe  = 1200;
      this.Zoomfaktor    = 1;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'File Browser', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'File Browser', 'OnInit', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {





    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'File Browser', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  public ionViewDidEnter() {

    try {

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);

      this.Browserhoehe  = this.Basics.InnerContenthoehe;
      this.Browserbreite = this.Basics.Contentbreite;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'File Browser', 'ionViewDidEnter', this.Debug.Typen.Page);
    }
  }

  ionViewDidLeave() {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'File Browser', 'ionViewDidLeave', this.Debug.Typen.Page);
    }
  }

  BackButtonClicked() {

    try {

      switch (this.Menuservice.FilelisteAufrufer) {

        case this.Menuservice.FilelisteAufrufervarianten.Aufgabenliste:

          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Aufgabenliste;

          break;

        case this.Menuservice.FilelisteAufrufervarianten.Protokollliste:

          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Protokolle;

          break;

        case this.Menuservice.FilelisteAufrufervarianten.Bautagebuch:

          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Bautagebuch;

          break;

        case this.Menuservice.FilelisteAufrufervarianten.LOPListe:

          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.LOPListe;

          break;

        case this.Menuservice.FilelisteAufrufervarianten.Festlegungen:

          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Festlegungen;

          break;

        case this.Menuservice.FilelisteAufrufervarianten.Simontabelle:

          this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Simontabelle;

          break;

        case this.Menuservice.FilelisteAufrufervarianten.ImageZoom:

          this.GraphService.ImageZoomOut.emit();

          break;
      }

      this.Tools.PopPage();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'File Browser', 'BackButtonClicked', this.Debug.Typen.Page);
    }
  }

  PDFDownloadStartedHandler(file: Teamsfilesstruktur ) {

    try {

      this.LoadingAnimation.ShowLoadingAnimation('Hinweis', 'Die Datei ' + file.name + ' wird geladen.');

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'File Browser', 'PDFDownloadStartedHandler', this.Debug.Typen.Page);
    }
  }

  PDFPageRenderedFinishedHandler() {

    try {

      this.LoadingAnimation.HideLoadingAnimation(true);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'File Browser', 'PDFPageRenderedFinishedHandler', this.Debug.Typen.Page);
    }
  }

  ZoomOutClicked() {

    try {

      this.Zoomfaktor -= 0.1;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'File Browser', 'ZoomOutClicked', this.Debug.Typen.Page);
    }
  }

  ZoomInClicked() {

    try {

      this.Zoomfaktor += 0.1;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'File Browser', 'ZoomInClicked', this.Debug.Typen.Page);
    }
  }
}

