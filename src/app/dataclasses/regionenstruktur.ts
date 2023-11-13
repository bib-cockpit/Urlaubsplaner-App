export type Regionencategorystruktur = {

  language: string; //  "DE"
  text: string; // "Bundesland"
};
export type Regionennamestruktur = {

  language: string;
  text: string;
};

export type Regionenstruktur = {

  code: string; // ": "DE-BB",
  isoCode: string; // ": "DE-BB",
  shortName: string; //  "BB",
  category: Regionencategorystruktur[];
  name: Regionennamestruktur[];
  officialLanguages: string[];
  Name: string;
};
