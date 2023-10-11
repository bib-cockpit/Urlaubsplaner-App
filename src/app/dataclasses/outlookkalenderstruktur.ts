
export type Outlookkalenderstruktur = {


    id: string; //  "AAMkAGE2NDQxOWZmLTRlNTAtNDE4Zi05MTQ0LWE0ZGFmYmM3OTUyYgBGAAAAAAB6HdgJp3OPR5CPgWW_Z1vdBwCVyfzyI9XJRqHrbLQH2PjAAAAAAAENAACVyfzyI9XJRqHrbLQH2PjAAAAAAEFUAAA=",
    createdDateTime: string; //  "2020-07-31T08:21:40.1963263Z",
    lastModifiedDateTime: string; // "2020-07-31T08:21:41.3761359Z",
    changeKey: string; // "lcn88iPVyUah62y0B9j4wAAAQeMhDQ==",
    categories: string[]; //  "Freitag"
    transactionId: string;
    originalStartTimeZone: string; //  "UTC",
    originalEndTimeZone: string; //  "UTC",
    iCalUId: string; //  "040000008200E00074C5B7101A82E00800000000103B922D2467D601000000000000000010000000BD90ED1FE035DD498F5ABAB338AFB699",
    reminderMinutesBeforeStart: number; //  15,
    isReminderOn: boolean; // false,
    hasAttachments: boolean; // false,
    subject: string; //  "Neujahrstag",
    bodyPreview: string; //  "",
    importance: string; //  "normal",
    sensitivity: string; //  "normal",
    isAllDay: boolean; //  true,
    isCancelled: boolean; //  false,
    isOrganizer: boolean; //  true,
    responseRequested: boolean; //  true,
    seriesMasterId: string; //  null,
    showAs: string; //  "free",
    type: string; //  "singleInstance",
    webLink: string; //  "https://outlook.office365.com/owa/?itemid=AAMkAGE2NDQxOWZmLTRlNTAtNDE4Zi05MTQ0LWE0ZGFmYmM3OTUyYgBGAAAAAAB6HdgJp3OPR5CPgWW%2BZ1vdBwCVyfzyI9XJRqHrbLQH2PjAAAAAAAENAACVyfzyI9XJRqHrbLQH2PjAAAAAAEFUAAA%3D&exvsurl=1&path=/calendar/item",
    onlineMeetingUrl: string; //  null,
    isOnlineMeeting: boolean; //  false,
    onlineMeetingProvider: string; //  "unknown",
    allowNewTimeProposals: boolean; //  true,
    occurrenceId: string; //  null,
    isDraft: boolean; //  false,
    hideAttendees: boolean; //  false,
    responseStatus: {
    response: string; //  "none",
      time: string; // "0001-01-01T00:00:00Z"
    };
    body: {
      contentType: string; //  "html",
      content: string; //  "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\r\n<meta name=\"Generator\" content=\"Microsoft Exchange Server\">\r\n<!-- converted from text -->\r\n<style><!-- .EmailQuote { margin-left: 1pt; padding-left: 4pt; border-left: #800000 2px solid; } --></style></head>\r\n<body>\r\n<font size=\"2\"><span style=\"font-size:11pt;\"><div class=\"PlainText\">&nbsp;</div></span></font>\r\n</body>\r\n</html>\r\n"
    };
    start: {
      dateTime: string; //  "2023-01-01T00:00:00.0000000",
      timeZone: string; //  "UTC"
      Zeitstempel?: number;
    };
    end: {
      dateTime: string; //  "2023-01-02T00:00:00.0000000",
      timeZone: string; //  "UTC"
      Zeitstempel?: number;
    };
    location: {
      displayName: string; //  "Deutschland",
      locationType: string; //  "default",
      uniqueId: string; //  "Deutschland",
      uniqueIdType: string; //  "pri string; // vate"
    };
    locations:
    {
      displayName: string; //   "Deutschland",
      locationType: string; //  "default",
      uniqueId: string; //      "Deutschland",
      uniqueIdType: string; //  "private"
    }[];
    recurrence: string; // null,
    attendees: any[];
    organizer: {
      emailAddress: {
        name: string; // "Peter Hornburger",
        address: string; //
      };
    };
    onlineMeeting: any; //  null
};
