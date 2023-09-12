import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges, SimpleChange, OnDestroy
} from '@angular/core';
import * as lodash from "lodash-es";
import {BasicsProvider} from '../../services/basics/basics';
import {DebugProvider} from '../../services/debug/debug';
import {ConstProvider} from '../../services/const/const';
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";
import {Graphservice} from "../../services/graph/graph";
import {ToolsProvider} from "../../services/tools/tools";
import {Thumbnailstruktur} from "../../dataclasses/thumbnailstrucktur";
import {isTabSwitch} from "@ionic/angular/directives/navigation/stack-utils";
import {MenueService} from "../../services/menue/menue.service";
import {Subscription} from "rxjs";
import {DatabaseProjektpunkteService} from "../../services/database-projektpunkte/database-projektpunkte.service";

@Component({
  selector: 'pj-sites-filebrowser-viewer',
  templateUrl: 'pj-sites-filebrowser-viewer.html',
  styleUrls: ['pj-sites-filebrowser-viewer.scss']
})
export class PjSitesFilebrowserViewerComponent implements OnInit, OnDestroy, OnChanges {

  @Input()  Browserbreite: number;
  @Input()  Browserhoehe: number;
  @Input()  Filelistbreite: number;
  @Input()  TeamsID: string;
  @Input()  Zoomfaktor: number;
  @Input()  Spaltenanzahl: number;
  @Input()  SelectImages: boolean;
  @Input()  CheckedTumbsIDListe: string[];
  @Output() PDFDownloadFinished = new EventEmitter<Teamsfilesstruktur>();
  @Output() PDFDownloadStarted  = new EventEmitter<Teamsfilesstruktur>();
  @Output() PDFRenderedFinished = new EventEmitter<any>();
  @Output() SelectedImagesChanged = new EventEmitter<string[]>();

  public Headerhoehe: number;
  public Contenthoehe: number;
  public Viewerbreite: number;
  public Thumbnailliste: Thumbnailstruktur[][];
  public Zeilenanzahl: number;
  public Thumbbreite: number;
  public ShowImage: boolean;
  public ImageSRC: string;
  public ImageHeight: number;
  private FilelisteAufruferMerker: string;
  private ZoomSubscription: Subscription;

  constructor(private Debug: DebugProvider,
              public Basics: BasicsProvider,
              public GraphService: Graphservice,
              public Pool: DatabasePoolService,
              public  Menuservice: MenueService,
              private DBProjektpunkte: DatabaseProjektpunkteService,
              public Const: ConstProvider) {

    try {

      this.Filelistbreite   = 450;
      this.Browserbreite    = 400;
      this.Browserhoehe     = 800;
      this.Headerhoehe      = 34;
      this.TeamsID          = '';
      this.Zoomfaktor       = 1;
      this.Thumbnailliste   = [];
      this.Spaltenanzahl    = 3;
      this.Zeilenanzahl     = 1;
      this.Thumbbreite      = 100;
      this.ShowImage        = false;
      this.ImageSRC         = null;
      this.ImageHeight      = 0;
      this.ZoomSubscription = null;
      this.SelectImages     = true;
      this.CheckedTumbsIDListe = [];

    }
    catch (error) {


      this.Debug.ShowErrorMessage(error.message,  'Teams Filebrowser', 'Construktor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.ZoomSubscription.unsubscribe();

      this.ZoomSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.Contenthoehe   = this.Browserhoehe - this.Headerhoehe;
      this.Filelistbreite = 500;
      this.Viewerbreite   = this.Browserbreite - this.Filelistbreite;

      this.ZoomSubscription = this.GraphService.ImageZoomOut.subscribe(() => {

        this.ZoomOut();
      });

      if(this.SelectImages === true) {

        if(this.DBProjektpunkte.CurrentProjektpunkt !== null) {

          this.CheckedTumbsIDListe = this.DBProjektpunkte.CurrentProjektpunkt.BilderIDListe;
        }
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Teams Filebrowser', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  private ZoomOut() {

    try {

      this.ShowImage = false;
      this.Menuservice.FilelisteAufrufer = this.FilelisteAufruferMerker;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'ZoomOut', this.Debug.Typen.Component);
    }
  }

  async FolderClicked(File: Teamsfilesstruktur) {

    try {

      await this.GraphService.GetSiteSubdirictoryfilelist(File, true);
      await this.PrepareDaten();


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'FolderClicked', this.Debug.Typen.Component);
    }
  }

  async RootFolderClicked() {

    try {

      await this.GraphService.GetSiteRootfilelist(true);
      await this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'RootFolderClicked', this.Debug.Typen.Component);
    }
  }

  async SubFolderBackClicked(index: number, file: Teamsfilesstruktur) {

    try {

      await this.GraphService.GetSiteSubdirictoryfilelist(file, true);
      await this.GraphService.RemoveSiteSubdirectory(file);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'SubFolderBackClicked', this.Debug.Typen.Component);
    }
  }

  CheckFile(fileitem: Teamsfilesstruktur): boolean {

    try {

      if(!lodash.isUndefined(fileitem.file)) {

        if(this.SelectImages === false) {

          switch(fileitem.file.mimeType) {

            case 'application/pdf':

              return true;

              break;

            case 'image/jpeg':

              return true;

              break;

            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':

              return false;

              break;

            default:

            return true;

              break;
          }
        }
        else {

          switch(fileitem.file.mimeType) {

            case 'application/jpg':

              return true;

              break;

            case 'image/jpeg':

              return true;

              break;

            case 'image/png':

              return true;

              break;

            default:

              return false;

              break;
          }
        }
      }
      else return false;



    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'CheckFile', this.Debug.Typen.Component);
    }
  }

  async PrepareDaten() {

    try {

      let Thumb, Merker: Thumbnailstruktur;
      let Anzahl: number;
      let Index: number;
      let Liste: Thumbnailstruktur[] = [];

      let Imageliste: Teamsfilesstruktur[] = lodash.filter(this.GraphService.TeamsCurrentfilelist, (fileitem: Teamsfilesstruktur) => {

          if(!lodash.isUndefined(fileitem.file)) {

            if(fileitem.file.mimeType === 'image/jpeg') {

              return true;
            }
          }
          else return false;
      });

      for(let File of Imageliste) {

        Thumb  = await this.GraphService.GetSiteThumbnail(File);
        Merker = lodash.find(Liste, {id: File.id});

        if(lodash.isUndefined(Merker)) Liste.push(Thumb);
      }

      Anzahl              = Liste.length;
      this.Zeilenanzahl   = Math.ceil(Anzahl / this.Spaltenanzahl);
      Index               = 0;
      this.Thumbnailliste = [];

      for(let Zeilenindex = 0; Zeilenindex < this.Zeilenanzahl; Zeilenindex++) {

        this.Thumbnailliste[Zeilenindex] = [];

        for(let Spaltenindex = 0; Spaltenindex < this.Spaltenanzahl; Spaltenindex++) {

          if(!lodash.isUndefined(Liste[Index])) {

            this.Thumbnailliste[Zeilenindex][Spaltenindex] = Liste[Index];
          }
          else {

            this.Thumbnailliste[Zeilenindex][Spaltenindex] = null;
          }

          Index++;
        }
      }

      this.Thumbbreite = (this.Viewerbreite - 8 * (this.Spaltenanzahl + 0)) / this.Spaltenanzahl;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'function', this.Debug.Typen.Component);
    }
  }

  async ngOnChanges(changes: SimpleChanges) {

    try {

      let TeamsIDValue: SimpleChange = changes.TeamsID;
      let TeamsID: string;

      if(typeof TeamsIDValue !== 'undefined') {

        TeamsID = TeamsIDValue.currentValue;
      }

      await this.GraphService.GetSiteRootfilelist(true);
      await this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'OnChanges', this.Debug.Typen.Component);
    }
  }

  PDFPageRenderedFinishedHandler() {

    try {

      this.PDFRenderedFinished.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'PDFPageRenderedFinishedHandler', this.Debug.Typen.Component);
    }
  }

  async FileClicked(fileitem: Teamsfilesstruktur) {

    try {

      event.preventDefault();
      event.stopPropagation();

      console.log('File Clicked with id: ' + fileitem.id);

      switch (fileitem.file.mimeType) {

        case 'application/pdf':

          this.PDFDownloadStarted.emit(fileitem);

          await this.GraphService.DownloadPDFSiteFile(fileitem);

          this.PDFDownloadFinished.emit(fileitem);

          break;

        case 'image/jpeg':

          await this.GraphService.GetSiteThumbnail(fileitem);


          break;

        default:

          debugger;

          break;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'FileClicked', this.Debug.Typen.Component);
    }
  }

  ThumbnailClicked(Thumb: Thumbnailstruktur) {

    try {

      if(this.SelectImages === true) {

        if(this.CheckedTumbsIDListe.indexOf(Thumb.id) === -1) {

          this.CheckedTumbsIDListe.push(Thumb.id);
        }
        else {

          this.CheckedTumbsIDListe = lodash.filter(this.CheckedTumbsIDListe, (id: string) => {

            return id !== Thumb.id;
          });
        }

        this.SelectedImagesChanged.emit(this.CheckedTumbsIDListe);
      }
      else {

        this.ImageSRC  = Thumb.weburl;
        this.ShowImage = true;

        this.FilelisteAufruferMerker       = this.Menuservice.FilelisteAufrufer;
        this.Menuservice.FilelisteAufrufer = this.Menuservice.FilelisteAufrufervarianten.ImageZoom;
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'ThumbnailClicked', this.Debug.Typen.Component);
    }
  }

  ZoomImageClicked(event: MouseEvent) {

    try {

      event.stopPropagation();
      event.preventDefault();

      this.ZoomOut();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'ZoomImageClicked', this.Debug.Typen.Component);
    }
  }

  CheckImagesIsSelected(Thumb: Thumbnailstruktur): boolean {

    try {

      return lodash.indexOf(this.CheckedTumbsIDListe, Thumb.id) !== -1;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'CheckImagesIsSelected', this.Debug.Typen.Component);
    }
  }

  ImageCheckedChanged(event: {status: boolean; index: number; event: any}, Thumb: Thumbnailstruktur) {

    try {

      if(event.status === true) {

        this.CheckedTumbsIDListe.push(Thumb.id);
      }
      else {

        this.CheckedTumbsIDListe = lodash.filter(this.CheckedTumbsIDListe, (id: string) => {

          return id !== Thumb.id;
        });
      }

      this.SelectedImagesChanged.emit(this.CheckedTumbsIDListe);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'ImageCheckedChanged', this.Debug.Typen.Component);
    }
  }
}
