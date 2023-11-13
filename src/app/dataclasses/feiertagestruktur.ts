export type FeiertagsubdevisionsStruktur = {

  code: string; // "DE-ST",
  shortName: string; // "ST"
};

export type FeiertagnameStruktur = {

  language: string;
  text: string; // "Neujahr"
};

export type Feiertagestruktur = {

  id: string; // "94498ba1-28e3-4dcd-b28f-d7aaf4cc56d7",
  startDate: string; //  "2023-01-01",
  endDate: string; // "2023-01-01",
  type: string; //  "Public",
  nationwide: boolean; // true
  name: FeiertagnameStruktur[];
  subdivisions: FeiertagsubdevisionsStruktur[];
  Anfangstempel: number;
  Endestempel: number;
  Name: string;
  Konfession: string;
};

/*





export type Feiertagestruktur = {

  date: string;
  fname: string;
  katholisch: string;
  Zeitstempel: number;
};

 */
