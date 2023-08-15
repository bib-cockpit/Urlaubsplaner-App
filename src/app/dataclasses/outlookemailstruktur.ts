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

/*


{
  "@odata.type": "#microsoft.graph.eventMessageRequest",
  "@odata.etag": "W/\"CwAAABYAAACVyfzyI9XJRqHrbLQH2PjAAALqwxXU\"",
  "id": "AAMkAGE2NDQxOWZmLTRlNTAtNDE4Zi05MTQ0LWE0ZGFmYmM3OTUyYgBGAAAAAAB6HdgJp3OPR5CPgWW_Z1vdBwCVyfzyI9XJRqHrbLQH2PjAAAAAAAEMAACVyfzyI9XJRqHrbLQH2PjAAALsc0IsAAA=",
  "createdDateTime": "2023-06-01T07:08:35Z",
  "lastModifiedDateTime": "2023-06-01T23:57:02Z",
  "changeKey": "CwAAABYAAACVyfzyI9XJRqHrbLQH2PjAAALqwxXU",
  "categories": [
  "00-002 HOP BIG"
],
  "receivedDateTime": "2023-06-01T07:08:37Z",
  "sentDateTime": "2023-06-01T07:08:33Z",
  "hasAttachments": false,
  "internetMessageId": "<FR3P281MB32310AB1550B85913FD2E793E149A@FR3P281MB3231.DEUP281.PROD.OUTLOOK.COM>",
  "subject": "Teamupdate - BIW/BIB",
  "bodyPreview": "________________________________________________________________________________\r\nMicrosoft Teams-Besprechung\r\nNehmen Sie auf dem Computer oder in der mobilen App teil\r\nHier klicken, um an der Besprechung teilzunehmen\r\nBesprechungs-ID: 371 519 285 955",
  "importance": "normal",
  "parentFolderId": "AAMkAGE2NDQxOWZmLTRlNTAtNDE4Zi05MTQ0LWE0ZGFmYmM3OTUyYgAuAAAAAAB6HdgJp3OPR5CPgWW_Z1vdAQCVyfzyI9XJRqHrbLQH2PjAAAAAAAEMAAA=",
  "conversationId": "AAQkAGE2NDQxOWZmLTRlNTAtNDE4Zi05MTQ0LWE0ZGFmYmM3OTUyYgAQAAx2mb6hg0txnnG0wzi0Zlk=",
  "conversationIndex": "AQHZlFfgDHaZvqGDS3GecbTDOLRmWQ==",
  "isDeliveryReceiptRequested": false,
  "isReadReceiptRequested": false,
  "isRead": false,
  "isDraft": false,
  "webLink": "https://outlook.office365.com/owa/?ItemID=AAMkAGE2NDQxOWZmLTRlNTAtNDE4Zi05MTQ0LWE0ZGFmYmM3OTUyYgBGAAAAAAB6HdgJp3OPR5CPgWW%2BZ1vdBwCVyfzyI9XJRqHrbLQH2PjAAAAAAAEMAACVyfzyI9XJRqHrbLQH2PjAAALsc0IsAAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
  "inferenceClassification": "focused",
  "meetingMessageType": "meetingRequest",
  "type": "seriesMaster",
  "isOutOfDate": false,
  "isAllDay": false,
  "isDelegated": false,
  "responseRequested": true,
  "allowNewTimeProposals": null,
  "meetingRequestType": "newMeetingRequest",
  "body": {
  "contentType": "html",
    "content": "<html><head>\r\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"><meta name=\"Generator\" content=\"Microsoft Word 15 (filtered medium)\"><style>\r\n<!--\r\n@font-face\r\n\t{font-family:\"Cambria Math\"}\r\n@font-face\r\n\t{font-family:Calibri}\r\n@font-face\r\n\t{font-family:\"Segoe UI\"}\r\n@font-face\r\n\t{font-family:\"Segoe UI Semibold\"}\r\np.MsoNormal, li.MsoNormal, div.MsoNormal\r\n\t{margin:0cm;\r\n\tfont-size:11.0pt;\r\n\tfont-family:\"Calibri\",sans-serif}\r\na:link, span.MsoHyperlink\r\n\t{color:#0563C1;\r\n\ttext-decoration:underline}\r\nspan.E-MailFormatvorlage18\r\n\t{font-family:\"Calibri\",sans-serif;\r\n\tcolor:windowtext}\r\n.MsoChpDefault\r\n\t{font-size:10.0pt}\r\n@page WordSection1\r\n\t{margin:70.85pt 70.85pt 2.0cm 70.85pt}\r\ndiv.WordSection1\r\n\t{}\r\n-->\r\n</style></head><body lang=\"DE\" link=\"#0563C1\" vlink=\"#954F72\" style=\"word-wrap:break-word\"><div class=\"WordSection1\"><p class=\"MsoNormal\">&nbsp;</p><div><p class=\"MsoNormal\"><span style=\"color:#5F5F5F\">________________________________________________________________________________</span> </p></div><div><div style=\"margin-top:18.0pt; margin-bottom:15.0pt\"><p class=\"MsoNormal\"><span style=\"font-size:18.0pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\">Microsoft Teams-Besprechung</span><span style=\"font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\"> </span></p></div><div style=\"margin-bottom:15.0pt\"><div><p class=\"MsoNormal\"><b><span style=\"font-size:10.5pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\">Nehmen Sie auf dem Computer oder in der mobilen App teil</span></b><b><span style=\"font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\"> </span></b></p></div><p class=\"MsoNormal\"><span style=\"font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\"><a href=\"https://eur01.safelinks.protection.outlook.com/ap/t-59584e83/?url=https%3A%2F%2Fteams.microsoft.com%2Fl%2Fmeetup-join%2F19%253ameeting_ODM1Y2ExN2QtM2M1Zi00OTMzLWJiMTMtYWI5YmQ1NDI0YTcw%2540thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%25221bf5df3d-726d-435f-b6dd-658e78e90581%2522%252c%2522Oid%2522%253a%25227e2a0e7f-ce4f-42fd-a3bf-9e554ee7c7cb%2522%257d&amp;data=05%7C01%7Cp.hornburger%40burnickl.com%7Cfefc1a2c4f2447859b2408db626f030f%7C1bf5df3d726d435fb6dd658e78e90581%7C0%7C0%7C638212001158858781%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&amp;sdata=Ll3qr4whD6AH93kx40VyiBJsb2nxeK%2BA%2BIAXmCFcZqI%3D&amp;reserved=0\" originalsrc=\"https://teams.microsoft.com/l/meetup-join/19%3ameeting_ODM1Y2ExN2QtM2M1Zi00OTMzLWJiMTMtYWI5YmQ1NDI0YTcw%40thread.v2/0?context=%7b%22Tid%22%3a%221bf5df3d-726d-435f-b6dd-658e78e90581%22%2c%22Oid%22%3a%227e2a0e7f-ce4f-42fd-a3bf-9e554ee7c7cb%22%7d\" shash=\"l3pWfz56/5uRqbnlxEtbeY/qvmEX0R+mSUO6pdMRympEM8NiIVAYQDCqSF/oKlsvRSuRy8Y47nd3l60d/u6b5jfbE+4KaaXx/W2qQgrmNfmfMw0eN4pwLo6orqaMxKN/oOz04V7AQeNsv4i7Erli7u5Rr5I4QOcLoR2aYhnhJRQ=\" target=\"_blank\"><span style=\"font-size:10.5pt; font-family:&quot;Segoe UI Semibold&quot;,sans-serif; color:#6264A7\">Hier klicken, um an der Besprechung teilzunehmen</span></a> </span></p></div><div style=\"margin-top:15.0pt; margin-bottom:15.0pt\"><div style=\"margin-bottom:3.0pt\"><p class=\"MsoNormal\"><span style=\"font-size:10.5pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\">Besprechungs-ID: </span><span style=\"font-size:12.0pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\">371 519 285 955</span><span style=\"font-size:10.5pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\"> </span><span style=\"font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\"><br></span><span style=\"font-size:10.5pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\">Passcode: </span><span style=\"font-size:12.0pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\">pvHjhQ </span><span style=\"font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\"></span></p><div><p class=\"MsoNormal\"><span style=\"font-size:10.5pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\"><a href=\"https://eur01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.microsoft.com%2Fen-us%2Fmicrosoft-teams%2Fdownload-app&amp;data=05%7C01%7Cp.hornburger%40burnickl.com%7Cfefc1a2c4f2447859b2408db626f030f%7C1bf5df3d726d435fb6dd658e78e90581%7C0%7C0%7C638212001158858781%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&amp;sdata=J5bBxHK3%2BvWOuJAwjVOQBT6oZjWt3ELcAz4d5lH%2Fp7Y%3D&amp;reserved=0\" originalsrc=\"https://www.microsoft.com/en-us/microsoft-teams/download-app\" shash=\"zdWbMgtzprv/EzEO0KvyqygdxxC4I32lRP5y9dP6R6IoW+uuWhe1A5ghzgR9cvPMkYTNRQkEQLMc56QPU2SzimIGxkjo8Ci6iDS5TlRssmcpZCdyoNoKUCAkegxlZcwrhb5JuOjk7NqQ+qXBORbAhbE0zUO00PWgPK6U4Mauk30=\" target=\"_blank\"><span style=\"color:#6264A7\">Teams herunterladen</span></a> | <a href=\"https://eur01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.microsoft.com%2Fmicrosoft-teams%2Fjoin-a-meeting&amp;data=05%7C01%7Cp.hornburger%40burnickl.com%7Cfefc1a2c4f2447859b2408db626f030f%7C1bf5df3d726d435fb6dd658e78e90581%7C0%7C0%7C638212001158858781%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&amp;sdata=pb33Z%2FIw%2Fr6pQbArz3943OEERsMIOvc3jXy5dv%2F7mvk%3D&amp;reserved=0\" originalsrc=\"https://www.microsoft.com/microsoft-teams/join-a-meeting\" shash=\"Ykl3tKoLbAPLfSxVbL5vH+DdWGahAchsW5Vy2BqPYB4YStTkczWNpaENHVUMZps0ZzX4Fd3MTkzCCTLbwnl6OegnWhbA5zqlmhZCsidAnxIXYtSQed3i08DPPOCDk+S+cPRDjJM+9Qt7cu9VGuFyoDygObXgMnAE4/CfkmPnvt0=\" target=\"_blank\"><span style=\"color:#6264A7\">Im Web beitreten</span></a></span></p></div></div></div><div style=\"margin-bottom:3.0pt\"><div><p class=\"MsoNormal\"><span style=\"font-size:10.5pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\"><img border=\"0\" width=\"286\" height=\"64\" id=\"_x0000_i1025\" src=\"https://i.ibb.co/VM2jNgS/BI-Logo-with-Claim-w-rgb-286x64.png\" style=\"width:2.9791in; height:.6666in\"></span><span style=\"font-size:10.5pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\"></span></p></div></div><div style=\"margin-top:15.0pt; margin-bottom:18.0pt\"><p class=\"MsoNormal\"><span style=\"font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424\"><a href=\"https://eur01.safelinks.protection.outlook.com/?url=https%3A%2F%2Faka.ms%2FJoinTeamsMeeting&amp;data=05%7C01%7Cp.hornburger%40burnickl.com%7Cfefc1a2c4f2447859b2408db626f030f%7C1bf5df3d726d435fb6dd658e78e90581%7C0%7C0%7C638212001159014988%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&amp;sdata=Gccl54GSKoz091XuD8qajoIq0J%2BIt3IXW0f8uepCrdE%3D&amp;reserved=0\" originalsrc=\"https://aka.ms/JoinTeamsMeeting\" shash=\"Vnx6D/VCF8Gd0TzQq//tHxef2wwUsCcFtEQFsqNzbyWPwF0M1++P+6ppj1QWaunHzmhqnT8fSEEP6Un+Uzorh7oRMNd2GmLbiml6ju8rZgIoEyVFhDo4hDE3wIIXDRfu7EeFjvY6t96t6iOgYCMSUOU6mp5BPNjnoKALlEyYu0k=\" target=\"_blank\"><span style=\"font-size:10.5pt; color:#6264A7\">Weitere Infos</span></a> | <a href=\"https://eur01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fteams.microsoft.com%2FmeetingOptions%2F%3ForganizerId%3D7e2a0e7f-ce4f-42fd-a3bf-9e554ee7c7cb%26tenantId%3D1bf5df3d-726d-435f-b6dd-658e78e90581%26threadId%3D19_meeting_ODM1Y2ExN2QtM2M1Zi00OTMzLWJiMTMtYWI5YmQ1NDI0YTcw%40thread.v2%26messageId%3D0%26language%3Dde-DE&amp;data=05%7C01%7Cp.hornburger%40burnickl.com%7Cfefc1a2c4f2447859b2408db626f030f%7C1bf5df3d726d435fb6dd658e78e90581%7C0%7C0%7C638212001159014988%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&amp;sdata=G1w8MhLvvd%2FkD%2BaYG%2FELO0q7AasfIFsTeVF1IIYp3GI%3D&amp;reserved=0\" originalsrc=\"https://teams.microsoft.com/meetingOptions/?organizerId=7e2a0e7f-ce4f-42fd-a3bf-9e554ee7c7cb&amp;tenantId=1bf5df3d-726d-435f-b6dd-658e78e90581&amp;threadId=19_meeting_ODM1Y2ExN2QtM2M1Zi00OTMzLWJiMTMtYWI5YmQ1NDI0YTcw@thread.v2&amp;messageId=0&amp;language=de-DE\" shash=\"UBevDvDIGtLi+fEp/dy66bJxUqxfbRWHUd5f9tlB7RbxZSqe68eDaR2RVctb2zxDNMZxKtxcYES11RIKSB8hmDJGMnfKzavEkcGeSmC4a1HlB17TjlN8AfWhEpV15aZaXXyEe94MfLAlT8KIfMMVzgwo7FKMIUGwaeCwpn838E8=\" target=\"_blank\"><span style=\"font-size:10.5pt; color:#6264A7\">Besprechungsoptionen</span></a> | <a href=\"https://eur01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.burnickl.com%2Fde%2Fdatenschutz&amp;data=05%7C01%7Cp.hornburger%40burnickl.com%7Cfefc1a2c4f2447859b2408db626f030f%7C1bf5df3d726d435fb6dd658e78e90581%7C0%7C0%7C638212001159014988%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&amp;sdata=K%2BRju7MEGhocgFcnW3Gcc7voMTQTmdAFDhFDxyKp3ig%3D&amp;reserved=0\" originalsrc=\"https://www.burnickl.com/de/datenschutz\" shash=\"mtU6n4F99K40OUNB4kyJe2ONN+QH7+NJzwL4yIeLNptcawKocUtjLjulipC39vO/XLf3dAM72Z9VSSdEJtNM1WjMULGt3We3Dlxq9oZEPQJvhH8etPq2O6SfygfXtG2KX3VI+FuI3wdDaaNjRZM1Ut6J1FkrtuqyMpsQwYw9YSo=\" target=\"_blank\"><span style=\"font-size:10.5pt; color:#6264A7\">Rechtliche Hinweise</span></a> </span></p></div></div><div><p class=\"MsoNormal\"><span style=\"color:#5F5F5F\">________________________________________________________________________________</span> </p></div><p class=\"MsoNormal\">&nbsp;</p></div></body></html>"
},
  "sender": {
  "emailAddress": {
    "name": "Alexander Hupp",
      "address": "a.hupp@burnickl.com"
  }
},
  "from": {
  "emailAddress": {
    "name": "Alexander Hupp",
      "address": "a.hupp@burnickl.com"
  }
},
  "toRecipients": [
  {
    "emailAddress": {
      "name": "Armin Mees",
      "address": "a.mees@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Cedrik Florschütz",
      "address": "c.florschuetz@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Frank Schmittschmitt",
      "address": "f.schmittschmitt@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Harald Rothleitner",
      "address": "h.rothleitner@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Jochen Schott",
      "address": "j.schott@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Johannes Emmerling",
      "address": "j.emmerling@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Markus Krause-Hauer",
      "address": "m.krause-hauer@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Michael Meyer",
      "address": "michael.meyer@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Miriam Mühlbach",
      "address": "m.muehlbach@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Peter Hornburger",
      "address": "p.hornburger@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Regine Schwaab",
      "address": "r.schwaab@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Sonia Fahlbusch",
      "address": "s.fahlbusch@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Stefan Müller",
      "address": "stefan.mueller@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Svitlana Wagner",
      "address": "s.wagner@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Aaron Kristoff",
      "address": "a.kristoff@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Alexander Ruppert",
      "address": "a.ruppert@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Anja Ebert",
      "address": "a.ebert@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Bernd Albrecht",
      "address": "b.albrecht@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Carsten Albrecht",
      "address": "c.albrecht@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Christian Pfaff",
      "address": "c.pfaff@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Christoph Hillenbrand",
      "address": "c.hillenbrand@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Christoph Ziller",
      "address": "c.ziller@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Dieter Albus",
      "address": "d.albus@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Florian Vogel",
      "address": "f.vogel@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Ines Rein",
      "address": "i.rein@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Khaled Deab",
      "address": "k.deab@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Leonie Sirghe",
      "address": "l.sirghe@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Marcel Ehlert",
      "address": "m.ehlert@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Marco Pfister",
      "address": "m.pfister@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Matthias Merz",
      "address": "m.merz@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Stefan Müller",
      "address": "s.mueller@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Stephan Dittmann",
      "address": "s.dittmann@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Simon Schwarz",
      "address": "s.schwarz@burnickl.com"
    }
  },
  {
    "emailAddress": {
      "name": "Florian Erber",
      "address": "f.erber@burnickl.com"
    }
  }
],
  "ccRecipients": [],
  "bccRecipients": [],
  "replyTo": [],
  "flag": {
  "flagStatus": "notFlagged"
},
  "startDateTime": {
  "dateTime": "2023-01-09T07:30:00.0000000",
    "timeZone": "UTC"
},
  "endDateTime": {
  "dateTime": "2023-01-09T07:55:00.0000000",
    "timeZone": "UTC"
},
  "location": {
  "displayName": "Microsoft Teams-Besprechung",
    "locationType": "default",
    "uniqueIdType": "unknown"
},
  "recurrence": {
  "pattern": {
    "type": "weekly",
      "interval": 1,
      "month": 0,
      "dayOfMonth": 0,
      "daysOfWeek": [
      "monday"
    ],
      "firstDayOfWeek": "monday",
      "index": "first"
  },
  "range": {
    "type": "endDate",
      "startDate": "2023-01-08",
      "endDate": "2023-07-09",
      "recurrenceTimeZone": "tzone://Microsoft/Utc",
      "numberOfOccurrences": 0
  }
},
  "previousLocation": {
  "displayName": "Microsoft Teams-Besprechung",
    "locationType": "default",
    "uniqueIdType": "unknown"
},
  "previousStartDateTime": {
  "dateTime": "2023-01-09T07:30:00.0000000",
    "timeZone": "UTC"
},
  "previousEndDateTime": {
  "dateTime": "2023-01-09T07:55:00.0000000",
    "timeZone": "UTC"
}
}

 */
