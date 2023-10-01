export type Thumbnailstruktur = {

  id:        string;
  filename:  string;
  weburl:    string;
  smallurl:  string;
  mediumurl: string;
  largeurl:  string;
  content:   string;
  height: {

    small:  number;
    medium: number;
    large:  number;
};
  width: {

    small:  number;
    medium: number;
    large:  number;
  };
};
