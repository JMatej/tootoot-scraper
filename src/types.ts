export interface Input {
    since: string | undefined,
    till: string | undefined,
}

export interface EventURLOptions {
  page?: number;
  since?: string;
  till?: string;
  limit?: number;
  cityId?: string;
  categoryId?: string;
}

interface BaseContact {
    ContactType: string;
    Private: boolean;
}

export interface EmailContact extends BaseContact {
    ContactType: 'EmailContact';
    EmailAddress: string;
}

export interface PhoneContact extends BaseContact {
    ContactType: 'PhoneContact';
    Number: string;
}

export interface WebContact extends BaseContact {
    ContactType: 'WebContact';
    Url: string;
}

/**
 * A union type representing any possible contact object.
 */
type Contact = EmailContact | PhoneContact | WebContact;

/**
 * Defines the structure of the main Event object from the API.
 */
interface EventData {
    _id: string;
    Contacts: Contact[];
    ProfileName: string;
    About: string;
    Keywords: string[];
    Begin: string;
    End: string;
    TimeZone: number;
    Currency: string;
    MinPrice: number;
    MaxPrice: number;
    Building: {
        ProfileName: string;
    };
    AddressContact: {
        AddressLine: string;
        City: string;
        Zip: string;
        Country: string;
    };
    ShareImage: string;
}

/**
 * Defines the top-level structure for a single event in the JSON response array.
 */
export interface EventResponse {
    Event: EventData;
}
