import { Injectable } from '@angular/core';
import {DebugProvider} from "../debug/debug";

@Injectable({
  providedIn: 'root'
})
export class AuswahlDialogService {

  public Auswahloriginvarianten = {

    Standorteeditor_Land:       'Standorteeditor_Land',
    Standorteeditor_Bundesland: 'Standorteeditor_Bundesland',
    Standorteeditor_Konfession: 'Standorteeditor_Konfession',

    Projekteliste_Standortfiler:                       'Projekteliste_Standortfiler',
    Projekteliste_Editor_Leistungsphase:               'Projekteliste_Editor_Leistungsphase',

    Projekte_Editor_Standort:                          'Projekte_Editor_Standortfilter',
    Projekte_Editor_Mitarbeiterauswahl_Projektleiter:  'Projekte_Editor_Mitarbeiterauswahl_Projektleiter',
    Projekte_Editor_Mitarbeiterauswahl_Stellvertreter: 'Projekte_Editor_Mitarbeiterauswahl_Stellvertreter',
    Projekte_Editor_Mitarbeiterauswahl:                'Projekte_Editor_Mitarbeiterauswahl',
    Projekte_Editor_Mitarbeiterauswahl_Standortfilter: 'Projekte_Editor_Mitarbeiterauswahl_Standortfilter',
    Projekte_Editor_Projektstatus:                     'Projekte_Editor_Projektstatus',
    // Projekte_Editor_Beteiligteneditor_Fachbereich:     'Projekte_Editor_Beteiligteneditor_Fachbereich',
    Projekte_Editor_Firmeneditor_Fachbereich:          'Projekte_Editor_Firmeneditor_Fachbereich',
    Projekte_Editor_Beteiligteneditor_Fachfirma:       'Projekte_Editor_Beteiligteneditor_Fachfirma',

    Favoriten_Editor_Projekteauswahl_Standortfilter:  'Favoriten_Editor_Projekteauswahl_Standortfilter',

    Mitarbeiter_Editor_Standort:                       'Mitarbeiter_Editor_Standort',
    Mitarbeiter_Editor_Fachbereich:                    'Mitarbeiter_Editor_Fachbereich',
    Mitarbeiter_Editor_Anrede:                         'Mitarbeiter_Editor_Anrede',
    Mitarbeiter_Editor_Urlaub:                         'Mitarbeiter_Editor_Urlaub',
    Mitarbeiter_Liste_Standortfilter:                  'Mitarbeiter_Liste_Standortfilter',

    Aufgabenliste_ZustaendigExtern:                    'Aufgabenliste_ZustaendigExtern',
    Aufgabenliste_ZustaendigIntern:                    'Aufgabenliste_ZustaendigIntern',
    Aufgabenliste_Fortschritt:                         'Aufgabenliste_Fortschritt',
    Aufgabenliste_Zeitfilter:                          'Aufgabenliste_Zeitfilter',

    Aufgabenliste_Filter_Zeitspanne:                   'Aufgabenliste_Filter_Zeitspanne',

    Aufgabenliste_Editor_Fachbereich:                    'Aufgabenliste_Editor_Fachbereich',
    Aufgabenliste_Editor_Status:                         'Aufgabenliste_Editor_Status',
    Aufgabenliste_Editor_Standortfilter:                 'Aufgabenliste_Editor_Standortfilter',
    Aufgabenliste_Editor_ZustaendigExtern:               'Aufgabenliste_Editor_ZustaendigExtern',
    Aufgabenliste_Editor_ZustaendigIntern:               'Aufgabenliste_Editor_ZustaendigIntern',
    Aufgabenliste_Editor_Leistungsphase:                 'Aufgabenliste_Editor_Kostengruppe',
    Aufgabenliste_Editor_Kostengruppe:                 'Aufgabenliste_Editor_Leistungsphase',
    Aufgabenliste_Editor_Verfasser:                      'Aufgabenliste_Editor_Verfasser',
    Aufgabenliste_Editor_AnmerkungenVerfasser:           'Aufgabenliste_Editor_AnmerkungenVerfasser',

    Aufgabenliste_Meintageintrag_Status:                 'Aufgabenliste_Meintageintrag_Status',
    Aufgabenliste_Meintageintrag_Termin:                 'Aufgabenliste_Meintageintrag_Termin',

    Festlegungsliste_Editor_Leistungsphase:        'Festlegungsliste_Editor_Leistungsphase',
    Festlegungsliste_Leistungsphasefilter:         'Festlegungsliste_Leistungsphasefilter',
    Festlegungliste_Emaileditor_Standortfilter:    'Festlegungliste_Emaileditor_Standortfilter',
    Festlegungliste_Editor_Status:                 'Festlegungliste_Editor_Status',
    Festlegungliste_Editor_Fachbereich:            'Festlegungliste_Editor_Fachbereich',
    Festlegungliste_Editor_Kostengruppe:            'Festlegungliste_Editor_Kostengruppe',
    Festlegungliste_Editor_ZustaendigExtern:       'Festlegungliste_Editor_ZustaendigExtern',
    Festlegungliste_Editor_ZustaendigIntern:       'Festlegungliste_Editor_ZustaendigIntern',

    Festlegungliste_Emaileditor_Intern_Empfaenger:          'Festlegungliste_Emaileditor_Intern_Empfaenger',
    Festlegungliste_Emaileditor_Intern_CcEmpfaenger:        'Festlegungliste_Emaileditor_Intern_CcEmpfaenger',
    Festlegungliste_Emaileditor_Extern_Empfaenger:          'Festlegungliste_Emaileditor_Extern_Empfaenger',
    Festlegungliste_Emaileditor_Extern_CcEmpfaenger:        'Festlegungliste_Emaileditor_Extern_CcEmpfaenger',

    Bautagebuchliste_Emaileditor_Intern_Empfaenger:         'Bautagebuchliste_Emaileditor_Intern_Empfaenger',
    Bautagebuchliste_Emaileditor_Intern_CcEmpfaenger:       'Bautagebuchliste_Emaileditor_Intern_CcEmpfaenger',
    Bautagebuchliste_Emaileditor_Extern_Empfaenger:         'Bautagebuchliste_Emaileditor_Extern_Empfaenger',
    Bautagebuchliste_Emaileditor_Extern_CcEmpfaenger:       'Bautagebuchliste_Emaileditor_Extern_CcEmpfaenger',
    Bautagebuchliste_Bautagebucheditor:                     'Bautagebuchliste_Bautagebucheditor',

    Protokollliste_Editor_Leistungsphase:                   'Protokollliste_Editor_Leistungsphase',
    Protokollliste_Editor_Kostengruppe:                     'Protokollliste_Editor_Kostengruppe',
    Protokollliste_Protokolleditor_Teamteilnehmer:          'Protokollliste_Protokolleditor_Teamteilnehmer',
    Protokollliste_Projektpunkteditor_Teamteilnehmer:       'Protokollliste_Projektpunkteditor_Teamteilnehmer',
    Protokollliste_Protokolleditor_Beteilgtenteilnehmer:    'Protokollliste_Protokolleditor_Beteilgtenteilnehmer',
    Protokollliste_Projektpunkteditor_Beteilgtenteilnehmer: 'Protokollliste_Projektpunkteditor_Beteilgtenteilnehmer',

    Urlaubsplanung_Mitarbeiter_Wechseln:                    'Urlaubsplanung_Mitarbeiter_Wechseln',
    Urlaubsplanung_Vertreter_Festlegen:                     'Urlaubsplanung_Vertreter_Festlegen',
    Urlaubsplanung_Status_Aendern:                          'Urlaubsplanung_Status_Aendern',
    UrlaubEinstellungen_Projektbeteiligte_Auswahl:          'UrlaubEinstellungen_Projektbeteiligte_Auswahl',
    UrlaubEinstellungen_Freigeber_Auswahl:                  'UrlaubEinstellungen_Freigeber_Auswahl',
    UrlaubEinstellungen_Standort_Filter:                    'UrlaubEinstellungen_Standort_Filter',
    UrlaubPlanung_Standort_Filter:                          'UrlaubPlanung_Standort_Filter',
    UrlaubUebersicht_Standort_Filter:                       'UrlaubUebersicht_Standort_Filter',
    UrlaubAnfargen_Standort_Filter:                         'UrlaubAnfargen_Standort_Filter',

    Protokollliste_Emaileditor_Extern_Empfaenger:           'Protokollliste_Emaileditor_Extern_Empfaenger',
    Protokollliste_Emaileditor_Extern_CcEmpfaenger:         'Protokollliste_Emaileditor_Extern_CcEmpfaenger',
    Protokollliste_Emaileditor_Intern_Empfaenger:           'Protokollliste_Emaileditor_Intern_Empfaenger',
    Protokollliste_Emaileditor_Intern_CcEmpfaenger:         'Protokollliste_Emaileditor_Intern_CcEmpfaenger',

    LOPliste_Emaileditor_Extern_Empfaenger:           'LOPliste_Emaileditor_Extern_Empfaenger',
    LOPliste_Emaileditor_Extern_CcEmpfaenger:         'LOPliste_Emaileditor_Extern_CcEmpfaenger',
    LOPliste_Emaileditor_Intern_Empfaenger:           'LOPliste_Emaileditor_Intern_Empfaenger',
    LOPliste_Emaileditor_Intern_CcEmpfaenger:         'LOPliste_Emaileditor_Intern_CcEmpfaenger',


    Protokollliste_Editor_Standortfilter:              'Protokollliste_Editor_Standortfilter',
    Protokollliste_Projektpunkteditor_Status:          'Protokollliste_Projektpunkteditor_Status',
    Protokollliste_Projektpunkteditor_Fachbereich:     'Protokollliste_Projektpunkteditor_Fachbereich',

    Simontabelle_Editor_Emailempfaenger:           'Simontabelle_Editor_Emailempfaenger',


    Emailliste_Projektpunkteditor_Fachbereich:     'Emailliste_Projektpunkteditor_Fachbereich',
    Emailliste_Editor_ZustaendigIntern:            'Emailliste_Editor_ZustaendigIntern',
    Emailliste_Editor_ZustaendigExtern:            'Emailliste_Editor_ZustaendigExtern',
    Emailliste_Beteiligteneditor_Projektauswahl:   'Emailliste_Beteiligteneditor_Projektauswahl',

    Protokollliste_Filter_Leistungsphase:     'Protokollliste_Filter_Leistungsphase',
    Protokollliste_Filter_Zeitspanne:         'Protokollliste_Filter_Zeitspanne',

    LOPListe_LOPListeeditor_InternTeilnehmer:       'LOPListe_LOPListeeditor_InternTeilnehmer',
    LOPListe_LOPListeeditor_ExternTeilnehmer:       'LOPListe_LOPListeeditor_ExternTeilnehmer',
    LOPListe:                                       'LOPListe',
    LOPListe_Thumnailsize:                          'LOPListe_Thumnailsize',

    LOPListe_Eintrageditor_ZustaendigExtern:     'LOPListe_Eintrageditor_ZustaendigExtern',
    LOPListe_Eintrageditor_ZustaendigIntern:     'LOPListe_Eintrageditor_ZustaendigIntern',
    LOPListe_Eintrageditor_Standortfilter:       'LOPListe_Eintrageditor_Standortfilter',
    LOPListe_Eintrageditor_Fachbereich:          'LOPListe_Eintrageditor_Fachbereich',
    LOPListe_Eintrageditor_Status:               'LOPListe_Eintrageditor_Status',
    LOPListe_Eintrageditor_Prioritaet:           'LOPListe_Eintrageditor_Prioritaet',
    LOPListe_Eintrageditor_AnmerkungVerfasser:            'LOPListe_Eintrageditor_AnmerkungVerfasser',
    LOPListe_Eintrageditor_Verfasser:            'LOPListe_Eintrageditor_Verfasser',

    LOPListe_Emaileditor_Intern_Empfaenger:           'LOPListe_Emaileditor_Intern_Empfaenger',
    LOPListe_Emaileditor_Intern_CcEmpfaenger:         'LOPListe_Emaileditor_Intern_CcEmpfaenger',
    LOPListe_Emaileditor_Extern_Empfaenger:           'LOPListe_Emaileditor_Extern_Empfaenger',
    LOPListe_Emaileditor_Extern_CcEmpfaenger:         'LOPListe_Emaileditor_Extern_CcEmpfaenger',

    Urlaubsliste_Bundesland: 'Urlaubsliste_Bundesland'
  };

  constructor(private Debug: DebugProvider) {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Dialog Auswahl', 'constructor', this.Debug.Typen.Service);
    }
  }
}
