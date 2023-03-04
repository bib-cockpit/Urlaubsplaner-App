import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ConstProvider} from '../../services/const/const';
import {DebugProvider} from '../../services/debug/debug';
import {BasicsProvider} from '../../services/basics/basics';

@Component({

  selector: 'page-footer',
  templateUrl: 'page-footer.html',
  styleUrls: ['page-footer.scss']
})
export class PageFooterComponent  implements OnInit {

  @ViewChild('PageFooterFrameDiv', { read: ElementRef, static: true }) public PageFooterFrameDiv: ElementRef;

  public MaxFooterhoehe: number;

  constructor(public Const: ConstProvider,
              private Debug: DebugProvider,
              public Basics: BasicsProvider) {
  }

  ngOnInit() {

    try {

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Footer', 'ngOnInit', this.Debug.Typen.Component);
    }
  }


  public InitMaximalhoehe(): number {

    try {

      this.MaxFooterhoehe = this.PageFooterFrameDiv.nativeElement.clientHeight;

      return this.MaxFooterhoehe;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Footer', 'InitMaximalhoehe', this.Debug.Typen.Component);
    }
  }
}
