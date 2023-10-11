import {Outlookemailadressstruktur} from "./outlookemailadressstruktur";
import {Outlookemailbodystruktur} from "./outlookemailbodystruktur";

export type Outlookemailstruktur = {

  id: string;
  _id?: string;
  __v?: string;
  createdDateTime: string; // "2023-05-03T05:28:17Z",
  lastModifiedDateTime: string; // "2023-05-03T08:55:02Z",
  changeKey: string; // "CQAAABYAAACVyfzyI9XJRqHrbLQH2PjAAALXNlBH",
  categories: string[]; //   "16-076 HERZOG"
  receivedDateTime: string; // "2023-05-03T05:28:17Z",
  Zeitstempel?: number;
  Zeitstring?: string;
  ProjektID?:   string;
  ProjektpunktID?: string;
  sentDateTime: string; //  "2023-05-03T05:28:09Z",
  hasAttachments: boolean; //  true,
  internetMessageId: string; // "<PAXPR03MB78858F4063625E3D166E8D8EFE6C9@PAXPR03MB7885.eurprd03.prod.outlook.com>",
  subject: string; // "230503_47987_Herzo_Aktenvermerk zur Baubesprechung am 02052023",
  bodyPreview: string; // "Sehr geehrte Damen und Herren,\r\n\r\nanbei erhalten sie unseren Aktenvermerk 70 zur Baubesprechung am 02.05.2023 zu Ihrer Information und Ausführung.\r\nBitte beachten sie die angesetzten Termine im Vermerk.\r\n\r\nFür Fragen stehe ich Ihnen selbstverständlich ger",
  importance: string; //  "normal",
  parentFolderId: string; // "AAMkAGE2NDQxOWZmLTRlNTAtNDE4Zi05MTQ0LWE0ZGFmYmM3OTUyYgAuAAAAAAB6HdgJp3OPR5CPgWW_Z1vdAQCVyfzyI9XJRqHrbLQH2PjAAAAAAAFUAAA=",
  conversationId: string; // "AAQkAGE2NDQxOWZmLTRlNTAtNDE4Zi05MTQ0LWE0ZGFmYmM3OTUyYgAQAGWS2HgR4kbzn8b6YvDr3FM=",
  conversationIndex: string; // "Adl9f94DZZLYeBHiRvOfxvpi8OvcUw==",
  isDeliveryReceiptRequested: string; //  null,
  isReadReceiptRequested: boolean; //  false,
  isRead: boolean; //  true,
  isDraft: boolean; //  false,
  webLink: string; // "https://outlook.office365.com/owa/?ItemID=AAMkAGE2NDQxOWZmLTRlNTAtNDE4Zi05MTQ0LWE0ZGFmYmM3OTUyYgBGAAAAAAB6HdgJp3OPR5CPgWW%2BZ1vdBwCVyfzyI9XJRqHrbLQH2PjAAAAAAAFUAACVyfzyI9XJRqHrbLQH2PjAAAIoef5EAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
  inferenceClassification: string; // "focused",
  body: Outlookemailbodystruktur;
  sender: Outlookemailadressstruktur;
  from:   Outlookemailadressstruktur;
  toRecipients:  Outlookemailadressstruktur[];
  ccRecipients:  Outlookemailadressstruktur[];
  bccRecipients: Outlookemailadressstruktur[];
  replyTo:       Outlookemailadressstruktur[];

  meetingMessageType: string;
  meetingRequestType: string;
  type: string;
  isOutOfDate: boolean;
  isAllDay:    boolean;
  isDelegated: boolean;
  responseRequested: boolean;
  allowNewTimeProposals: any;

  Deleted?: boolean;
};


