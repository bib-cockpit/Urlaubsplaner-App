import {Component, OnInit} from '@angular/core';
import {MenueService} from "../../services/menue/menue.service";
import {DebugProvider} from "../../services/debug/debug";

@Component({
  selector: 'common-testseite-page',
  templateUrl: 'common-testseite.page.html',
  styleUrls: ['common-testseite.page.scss'],
})
export class CommonTestseitePage implements OnInit {

  constructor(public Menuservice: MenueService,
              public Debug: DebugProvider) {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Test', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {


  }

}
