export interface MailMetaDataInterface {
    id: string;
    from: From;
    date: number;
    subject: string;
    short_description: string;
}

interface From {
    email: string;
    name: string;
}
