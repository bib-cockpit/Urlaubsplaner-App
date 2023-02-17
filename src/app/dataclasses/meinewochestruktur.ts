export type Meinewochestruktur = {

  ProjektID:          string;
  Projektkey:         string;
  ProjektpunktID:     string;
  Kalenderwoche:      number;

  Montagseinsatz:     boolean;
  Dienstagseinsatz:   boolean;
  Mittwochseinsatz:  boolean;
  Donnerstagseinsatz: boolean;
  Freitagseinsatz:    boolean;
  Samstagseinsatz:    boolean;

  Montagsstunden:     number;
  Dienstagsstunden:   number;
  Mittwochsstunden:   number;
  Donnerstagsstunden: number;
  Freitagsstunden:    number;
  Samstagsstunden:    number;

  Montagsminuten:     number;
  Dienstagsminuten:   number;
  Mittwochsminuten:   number;
  Donnerstagsminuten: number;
  Freitagsminuten:    number;
  Samstagsminuten:    number;
};
