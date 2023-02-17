var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { BasicsProvider } from '../basics/basics';
import { ComponentmessagesProvider } from '../componentmessages/componentmessages';
var DebugProvider = /** @class */ (function () {
    function DebugProvider(Basics, Messenger) {
        this.Basics = Basics;
        this.Messenger = Messenger;
        this.DebugMessage = '';
        this.DebugAnzahl = 0;
    }
    DebugProvider.prototype.ShowDebugMessage = function (message, submitmessage) {
        try {
            if (this.Basics.ConsolenOutput) {
                console.log(message);
            }
            if (typeof submitmessage !== 'undefined') {
                if (submitmessage)
                    this.Basics.DebugMessage = message;
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    DebugProvider.prototype.ShowErrorMessage = function (msg, url, lineNo, columnNo, error, script, funktion) {
        if (this.Basics.ConsolenOutput) {
            if (this.Basics.ThrowErrorMessage)
                throw msg; // Exception in Konsole ausgeben
            else
                console.log(msg); // Fehlermeldung in Konsole ausgeben
        }
    };
    DebugProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [BasicsProvider, ComponentmessagesProvider])
    ], DebugProvider);
    return DebugProvider;
}());
export { DebugProvider };
//# sourceMappingURL=debug.js.map