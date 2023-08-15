
export interface Outlookkontaktestruktur  {

    id: string;
    createdDateTime: string;
    lastModifiedDateTime:  string;
    fileAs:   string;
    companyName: string;
    IsCompany: boolean;
    department: string;
    jobTitle: string;
    profession: string;
    title: string;
    displayName: string;
    givenName: string;
    middleName: string;
    surname: string;
    nickName: string;
    birthday: string;
    mobilePhone: string;
    homePhones: string[];
    businessPhones: string[];
    categories: string[];
    emailAddresses: [
      {
        name: string;
        address: string;
      }
    ];
    businessAddress: {
      street: string;
      city: string;
      state: string;
      countryOrRegion: string;
      postalCode: string;
    };

    Filtered?: boolean;
    Text_A?: string;
    Text_B?: string;
    Text_C?: string;
    Selected?: boolean;
};
