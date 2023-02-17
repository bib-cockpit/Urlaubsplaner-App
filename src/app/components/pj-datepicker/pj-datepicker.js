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
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { ToolsProvider } from '../../providers/tools/tools';
var ButtonValueComponent = /** @class */ (function () {
    function ButtonValueComponent(Basics, Debug, Tools) {
        this.Basics = Basics;
        this.Debug = Debug;
        this.Tools = Tools;
        this.ButtonClicked = new EventEmitter();
        try {
            var PosX = void 0;
            var PosY = void 0;
            var Breite = void 0;
            this.Buttontext = '';
            this.Wert_A = '';
            this.Wert_B = '';
            this.buttonstate = 'notpressed';
            this.Iconcolor = this.Basics.Backgroundcolor;
            this.Iconsource = '';
            this.Buttoncolor = this.Basics.Buttoncolor;
            this.Buttonhoehe = this.Basics.Menubuttonhoehe + 4 * this.Basics.Buttonabstand;
            this.Bildhoehe = this.Buttonhoehe - 2 * this.Basics.Buttonabstand;
            this.Bildbreite = this.Bildhoehe;
            switch (this.Basics.Devicetype) {
                case this.Const.Devicetype.Mobil:
                    this.Buttonbreite = this.Basics.Contentbreite - 2 * this.Basics.Buttonabstand;
                    break;
                case this.Const.Devicetype.Tablet:
                    this.Buttonbreite = (this.Basics.Contentbreite - 3 * this.Basics.Buttonabstand) / 2;
                    break;
            }
            this.Buttonstyle = {
                'position': 'relative',
                'width': this.Buttonbreite + 'px',
                'height': this.Buttonhoehe + 'px',
                'margin-top': this.Basics.Buttonabstand + 'px',
                'margin-left': this.Basics.Buttonabstand + 'px'
            };
            PosX = this.Basics.PageBorderbreite;
            PosY = this.Basics.PageBorderbreite;
            Breite = (this.Buttonbreite - 2 * this.Basics.PageBorderbreite) * 0.6;
            this.Cellhoehe = this.Buttonhoehe - 2 * this.Basics.PageBorderbreite;
            this.Buttonbeschreibungstyle = {
                'position': 'absolute',
                'left': PosX + 'px',
                'top': PosY + 'px',
                'width': Breite + 'px',
                'height': this.Cellhoehe + 'px',
                'overflow': 'hidden',
                'background': 'red' // this.Buttoncolor
            };
            Breite = (this.Buttonbreite - 2 * this.Basics.PageBorderbreite) * 0.4;
            PosX = this.Basics.PageBorderbreite;
            this.Buttonwertstyle = {
                'position': 'absolute',
                'right': PosX + 'px',
                'top': PosY + 'px',
                'width': Breite + 'px',
                'height': this.Cellhoehe + 'px',
                'overflow': 'hidden',
                'background': this.Basics.Backgroundcolor
            };
        }
        catch (error) {
            this.Debug.ShowErrorMessage(' :' + error.message);
        }
    }
    ButtonValueComponent.prototype.ngOnInit = function () {
        try {
            this.RGB = this.Tools.HexToRGB(this.Buttoncolor);
        }
        catch (error) {
            this.Debug.ShowErrorMessage('Menue Button: ' + error.message);
        }
    };
    ButtonValueComponent.prototype.ngOnChanges = function (changes) {
        var Value = changes.Buttoncolor;
        if (typeof Value !== 'undefined')
            if (!Value.firstChange) {
                this.RGB = this.Tools.HexToRGB(Value.currentValue);
            }
    };
    ButtonValueComponent.prototype.ButtonClickedHandler = function () {
        try {
            this.Debug.ShowDebugMessage('Button Clicked');
            this.buttonstate = (this.buttonstate === 'notpressed' ? 'pressed' : 'notpressed');
            this.ButtonClicked.emit();
        }
        catch (error) {
            this.Debug.ShowErrorMessage(' :' + error.message);
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ButtonValueComponent.prototype, "Buttoncolor", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ButtonValueComponent.prototype, "Buttontext", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ButtonValueComponent.prototype, "Wert_A", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ButtonValueComponent.prototype, "Wert_B", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ButtonValueComponent.prototype, "Iconsource", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ButtonValueComponent.prototype, "Iconcolor", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], ButtonValueComponent.prototype, "ButtonClicked", void 0);
    ButtonValueComponent = __decorate([
        Component({
            selector: 'button-value',
            templateUrl: 'button-value-berechtigung.html',
            animations: [
                trigger('buttonpressedanim', [
                    state('notpressed', style({ backgroundColor: "rgba({{RGB}}, 1.0)" }), { params: { RGB: '68, 68, 68' } }),
                    state('pressed', style({ backgroundColor: "rgba({{RGB}}, 1.0)" }), { params: { RGB: '68, 68, 68' } }),
                    transition('notpressed <=> pressed', [
                        animate(50, keyframes([
                            style({ backgroundColor: "rgba({{RGB}}, 1.0)", offset: 0 }),
                            style({ backgroundColor: "rgba({{RGB}}, 0.8)", offset: 1.0 }),
                        ]))
                    ])
                ])
            ]
        }),
        __metadata("design:paramtypes", [BasicsProvider, DebugProvider, ToolsProvider])
    ], ButtonValueComponent);
    return ButtonValueComponent;
}());
export { ButtonValueComponent };
//# sourceMappingURL=button-value.js.map
