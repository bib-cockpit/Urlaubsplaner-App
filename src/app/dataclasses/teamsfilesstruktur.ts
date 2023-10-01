export type Teamsfilesstruktur = {

  createdDateTime: string;
  eTag: string;
  id: string;
  lastModifiedDateTime: string;
  name: string;
  webUrl: string;
  cTag: string;
  size: number;
  isfolder?: boolean;
  content?: string;
  createdBy: {
    user: {
      email: string;
      id: string;
      displayName: string;
    };
  };
  lastModifiedBy: {
    application?: {
      id: string;
      displayName: string;
    };
    user?: {
      email:       string;
      id:          string;
      displayName: string;
    };
  };
  parentReference: {
    driveType: string;
    driveId:   string;
    id:        string;
    path:      string;
  };
  fileSystemInfo: {
    createdDateTime:      string;
    lastModifiedDateTime: string;
  };
  shared: {
    scope: string;
  };
  file?: {
    mimeType: string;
  };
  folder?: {
    childCount: number;
  };
  GesendetZeitstempel?: number;
  GesendetZeitstring?: string;
};




