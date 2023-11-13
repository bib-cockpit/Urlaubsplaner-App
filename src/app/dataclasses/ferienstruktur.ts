export type FeriensubdevisionsStruktur = {

  code: string; // "DE-ST",
  shortName: string; // "ST"
};

export type FeriennameStruktur = {

  language: string;
  text: string; // "Neujahr"
};

export type Ferienstruktur = {

  id: string; // "94498ba1-28e3-4dcd-b28f-d7aaf4cc56d7",
  startDate: string; //  "2023-01-01",
  endDate: string; // "2023-01-01",
  type: string; //  "Public",
  nationwide: boolean; // true
  name: FeriennameStruktur[];
  subdivisions: FeriensubdevisionsStruktur[];
  Anfangstempel: number;
  Endestempel: number;
  Name: string;

  /*
  end: string;
  start: string;
  slug: string;
  name: string;
  stateCode: string;
  year: string;

  Anfangstempel: number;
  Endestempel: number;

   */
};



