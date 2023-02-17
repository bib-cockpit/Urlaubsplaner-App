export type Notizenstruktur = {

  NotizenID: string;
  ProjektID: string;
  ProjektpunktID: string;
  Titel: string;
  Notizentext: string;
  Verfasser: {

    Name: string;
    Email: string;
  };

  Zeitstempel: number;
  Zeitstring: string;

  EmailDownloadURL: string;
  Emailfilename: string;

  Filtered?: boolean;
  Text_A?: string;
  Text_B?: string;
  Text_C?: string;
};
