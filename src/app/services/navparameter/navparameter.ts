import {EventEmitter, Injectable} from '@angular/core';
import {ConstProvider} from "../const/const";

@Injectable({

  providedIn: 'root'
})
export class Navparameter {

  private NavListe: string[];
  private CanGoBack: boolean;
  private Debugstatus: boolean;

  constructor(private Const: ConstProvider) {

    try {

      this.NavListe    = [];
      this.CanGoBack   = false;
      this.Debugstatus = true;


    }
    catch (error) {

      console.log(error, 'Nav Parameter -> constructor:' + error);
    }
  }

  public RemovePage(): string {

    try {

      let Lastpage: string = null;

      if(this.NavListe.length > 1) {

        this.NavListe.splice(this.NavListe.length - 1, 1);

        Lastpage = this.NavListe[this.NavListe.length -1];

        if(this.NavListe.length > 1) this.CanGoBack = true;
        else                         this.CanGoBack = false;
      }
      else this.CanGoBack = false;

      if(this.Debugstatus) {

        console.log('Navparamter -> Removed Page');
        this.PrintNavliste();
      }

      return Lastpage;
    }
    catch (error) {

      console.log(error, 'Nav Parameter -> RemovePage:' + error);
    }
  }

  public AddPage(page: string) {

    try {

      this.CanGoBack = true;

      if(this.NavListe[this.NavListe.length - 1] !== page) {

        this.NavListe.push(page);

        if(this.Debugstatus) {

          console.log('Navparamter -> AddPage: ' + page);
          this.PrintNavliste();
        }
      }
      else {

          console.log('Add Page Failed: ' + page);
      }
    }
    catch (error) {

      console.log(error, 'Nav Parameter -> AddPage: ' + error);
    }
  }

  private PrintNavliste() {

    try {

      let Eintrag: string;

      console.log('**************************');
      console.log('Navliste: ');

      for(let i = 0; i < this.NavListe.length; i++) {

        Eintrag = this.NavListe[i];

        if(i === this.NavListe.length - 1) console.log('-> ' + Eintrag);
        else                               console.log(Eintrag);
      }

      console.log('**************************');
    }
    catch (error) {

      console.log(error, 'Nav Parameter -> PrintNavliste: ' + error);
    }
  }

  public SetRootpage(page: string) {

    try {

      this.CanGoBack = false;
      this.NavListe  = [];

      this.NavListe.push(page);

      if(this.Debugstatus) {

        console.log('Navparamter -> SetRootpage: ' + page);
        this.PrintNavliste();
      }
    }
    catch (error) {

      console.log(error, 'Nav Parameter -> SetRootpage: ' + error);
    }
  }
}
