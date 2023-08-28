import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges, SimpleChange
} from '@angular/core';
import {BasicsProvider} from '../../services/basics/basics';
import {DebugProvider} from '../../services/debug/debug';
import {ConstProvider} from '../../services/const/const';
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";
import {Graphservice} from "../../services/graph/graph";
import {ToolsProvider} from "../../services/tools/tools";
import {Teamsdownloadstruktur} from "../../dataclasses/teamsdownloadstruktur";

@Component({
  selector: 'pj-sites-filebrowser-viewer',
  templateUrl: 'pj-sites-filebrowser-viewer.html',
  styleUrls: ['pj-sites-filebrowser-viewer.scss']
})
export class PjSitesFilebrowserViewerComponent implements OnInit, OnChanges {

  @Input()  Browserbreite: number;
  @Input()  Browserhoehe: number;
  @Input()  Filelistbreite: number;
  @Input()  TeamsID: string;
  @Input()  Zoomfaktor: number;
  @Output() PDFDownloadFinished = new EventEmitter<Teamsfilesstruktur>();
  @Output() PDFDownloadStarted  = new EventEmitter<Teamsfilesstruktur>();
  @Output() PDFRenderedFinished = new EventEmitter<any>();

  public Headerhoehe: number;
  public Contenthoehe: number;
  public Viewerbreite: number;

  constructor(private Debug: DebugProvider,
              public Basics: BasicsProvider,
              public GraphService: Graphservice,
              public Pool: DatabasePoolService,
              public Tool: ToolsProvider,
              public Const: ConstProvider) {

    try {

      this.Filelistbreite = 450;
      this.Browserbreite  = 400;
      this.Browserhoehe   = 800;
      this.Headerhoehe    = 34;
      this.TeamsID        = '';
      this.Zoomfaktor     = 1;

    }
    catch (error) {


      this.Debug.ShowErrorMessage(error.message,  'Teams Filebrowser', 'Construktor', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.Contenthoehe   = this.Browserhoehe - this.Headerhoehe;
      this.Filelistbreite = 500;
      this.Viewerbreite   = this.Basics.Contentbreite - this.Filelistbreite;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Teams Filebrowser', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  FolderClicked(File: Teamsfilesstruktur) {

    try {

      this.GraphService.GetSiteSubdirictoryfilelist(File, true);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'FolderClicked', this.Debug.Typen.Component);
    }
  }

  RootFolderClicked() {

    try {

      this.GraphService.GetSiteRootfilelist(true);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'RootFolderClicked', this.Debug.Typen.Component);
    }
  }

  async SubFolderBackClicked(index: number, file: Teamsfilesstruktur) {

    try {

      await this.GraphService.GetSiteSubdirictoryfilelist(file, true);
      this.GraphService.RemoveSiteSubdirectory(file);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'SubFolderBackClicked', this.Debug.Typen.Component);
    }
  }

  CheckFile(fileitem: Teamsfilesstruktur): boolean {

    try {

      if(fileitem.file.mimeType === 'application/pdf') {

        return true;
      }
      else {

        return false;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'CheckFile', this.Debug.Typen.Component);
    }

  }

  ngOnChanges(changes: SimpleChanges): void {

    try {

      let TeamsIDValue: SimpleChange = changes.TeamsID;
      let TeamsID: string;

      if(typeof TeamsIDValue !== 'undefined') {

        TeamsID = TeamsIDValue.currentValue;
      }

      this.GraphService.GetSiteRootfilelist(true);

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

  async FileClicked(file: Teamsfilesstruktur) {

    try {

      event.preventDefault();
      event.stopPropagation();

      console.log('File Clicked with id: ' + file.id);

      if(this.CheckFile(file) === true) {

        this.PDFDownloadStarted.emit(file);

        await this.GraphService.DownloadPDFSiteFile(file);

        this.PDFDownloadFinished.emit(file);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Teams Filebrowser', 'FileClicked', this.Debug.Typen.Component);
    }
  }
}
