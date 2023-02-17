var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BasicsProvider, Devicetypeliste } from '../../providers/basics/basics';
import { DebugProvider } from '../../providers/debug/debug';
import { MenueProvider } from '../../providers/menue/menue';
var AuswahlDialogComponent = /** @class */ (function () {
    function AuswahlDialogComponent(Basics, Debug, Menulibrary) {
        this.Basics = Basics;
        this.Debug = Debug;
        this.Menulibrary = Menulibrary;
        this.HideAuswahl = true;
        this.Titel = 'Testtitel';
        this.ButtonClicked = new EventEmitter();
    }
    AuswahlDialogComponent.prototype.ngOnInit = function () {
        try {
            var PosX = 0;
            var PosY = 0;
            this.Buttonbreite = this.Basics.Menubuttonhoehe;
            this.Buttonhoehe = this.Basics.Menubuttonhoehe;
            this.CloseButtonbreite = this.Basics.Menubuttonhoehe - 3 * this.Basics.PageBorderbreite;
            this.CloseButtonhoehe = this.CloseButtonbreite;
            this.CarrierStyle = {
                'position': 'absolute',
                'background': 'black',
                'z-index': 200,
                'width': this.Basics.Contentbreite + 'px',
                'height': this.Basics.Contenthoehe + 'px',
                'top': PosY + 'px',
                'left': PosX + 'px',
            };
        }
        catch (error) {
            this.Debug.ShowErrorMessage('Auswahl Dialog -> ngOnInit:' + error.message);
        }
    };
    AuswahlDialogComponent.prototype.AuswahlButtonClicked = function (index) {
        var _this = this;
        try {
            this.Debug.ShowDebugMessage('Auswahl Dialog -> ButtonClicked: ' + index);
            this.Auswahlindex = index;
            window.setTimeout(function () {
                _this.ButtonClicked.emit({
                    Index: index,
                    Dialogname: _this.Titel
                });
            }, 150);
            return false;
        }
        catch (error) {
            this.Debug.ShowErrorMessage('Auswahl Dialog -> ButtonClicked:' + error.message);
        }
    };
    AuswahlDialogComponent.prototype.CancelButtonClicked = function () {
        try {
            this.Debug.ShowDebugMessage('Auswahl Dialog -> CancelButtonClicked');
            this.AuswahlButtonClicked(this.Auswahlindex);
            return false;
        }
        catch (error) {
            this.Debug.ShowErrorMessage('Auswahl Dialog -> CancelButtonClicked:' + error.message);
        }
    };
    AuswahlDialogComponent.prototype.ngOnChanges = function (changes) {
        try {
            if (typeof changes.Auswahlliste !== 'undefined' && typeof changes.Auswahlliste.currentValue !== 'undefined') {
                this.SetSize(changes.Auswahlliste.currentValue.length);
            }
        }
        catch (error) {
            this.Debug.ShowErrorMessage('Auswahl Dialog -> ngOnChanges :' + error.message);
        }
    };
    AuswahlDialogComponent.prototype.SetSize = function (anzahl) {
        try {
            var Dialoghoehe = void 0;
            var Dialogbreite = void 0;
            var PosX = void 0;
            var PosY = void 0;
            var Hoehe = void 0;
            var Breite = void 0;
            var MaxAnzahl = void 0;
            var Anzahl = void 0;
            var MaxDialoghoehe = void 0;
            var Buttonspace = void 0;
            switch (this.Basics.Devicetype) {
                case this.Const.Devicetype.Tablet:
                    Dialogbreite = this.Basics.Contentbreite * 0.5;
                    break;
                case this.Const.Devicetype.Mobil:
                    Dialogbreite = this.Basics.Contentbreite - this.Basics.Menubuttonhoehe;
                    break;
            }
            this.Buttonbreite = Dialogbreite - 4 * this.Basics.PageBorderbreite;
            this.Buttonhoehe = this.Basics.Menubuttonhoehe;
            MaxDialoghoehe = this.Basics.Contenthoehe - (2 * this.Basics.Menubuttonhoehe + 2 * this.Basics.PageBorderbreite); // Absand Oben + Anstand Unten
            Buttonspace = this.Buttonhoehe + this.Basics.PageBorderbreite;
            MaxAnzahl = Math.floor(MaxDialoghoehe / Buttonspace);
            if (anzahl > MaxAnzahl)
                Anzahl = MaxAnzahl;
            else
                Anzahl = anzahl;
            Dialoghoehe = (Anzahl + 1) * this.Buttonhoehe + (Anzahl + 3) * this.Basics.PageBorderbreite;
            PosX = (this.Basics.Contentbreite - Dialogbreite) / 2;
            PosY = this.Basics.Menubuttonhoehe;
            this.DialogStyle = {
                'position': 'absolute',
                'z-index': 10,
                'width': Dialogbreite + 'px',
                'height': Dialoghoehe + 'px',
                'top': PosY + 'px',
                'left': PosX + 'px',
                'border': this.Basics.PageBorderbreite + 'px solid #0099cc',
            };
            Hoehe = this.Basics.Menubuttonhoehe;
            Breite = Dialogbreite - 2 * this.Basics.PageBorderbreite;
            this.CloseButtonhoehe = Hoehe - 3 * this.Basics.PageBorderbreite;
            this.CloseButtonbreite = this.CloseButtonhoehe;
            this.Headercellhoehe = Hoehe - this.Basics.PageBorderbreite;
            this.Headerstyle = {
                'position': 'absolute',
                'width': Breite + 'px',
                'height': Hoehe + 'px',
                'border-bottom': this.Basics.PageBorderbreite + 'px solid #0099cc',
            };
            PosY = Hoehe;
            Hoehe = Dialoghoehe - Hoehe - 2 * this.Basics.PageBorderbreite;
            this.Contentstyle = {
                'top': PosY + 'px',
                'background': 'none',
                'overflow': 'auto',
                'position': 'absolute',
                'width': Breite + 'px',
                'height': Hoehe + 'px',
            };
            this.Buttonstyle = {
                'z-index': 20,
                'background': this.Basics.Buttoncolor,
                'width': this.Buttonbreite + 'px',
                'height': this.Buttonhoehe + 'px',
            };
            Hoehe = this.Buttonhoehe / 2.4;
            Breite = Hoehe;
            this.Selectcirclestyle = {
                'border-radius': '50%',
                'border': this.Basics.PageBorderbreite + 'px solid ' + this.Basics.Contentcolor,
                'height': Hoehe + 'px',
                'width': Breite + 'px',
                'background': this.Basics.Farben.Gruen
            };
            this.Emptycirclestyle = {
                'border-radius': '50%',
                'border': this.Basics.PageBorderbreite + 'px solid ' + this.Basics.Buttoncolor,
                'height': Hoehe + 'px',
                'width': Breite + 'px',
                'background': this.Basics.Buttoncolor
            };
        }
        catch (error) {
            this.Debug.ShowErrorMessage('Auswahl Dialog -> SetSize :' + error.message);
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], AuswahlDialogComponent.prototype, "HideAuswahl", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AuswahlDialogComponent.prototype, "Titel", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], AuswahlDialogComponent.prototype, "Auswahlliste", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AuswahlDialogComponent.prototype, "Auswahlindex", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AuswahlDialogComponent.prototype, "ButtonClicked", void 0);
    AuswahlDialogComponent = __decorate([
        Component({
            selector: 'auswahl-dialog',
            templateUrl: 'auswahl-dialog.html'
        }),
        __metadata("design:paramtypes", [BasicsProvider, DebugProvider, MenueProvider])
    ], AuswahlDialogComponent);
    return AuswahlDialogComponent;
}());
export { AuswahlDialogComponent };
//# sourceMappingURL=auswahl-dialog.js.map
