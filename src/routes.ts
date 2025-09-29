import { createCheerioRouter, Dataset } from 'crawlee';

import type { EmailContact, EventResponse, PhoneContact, WebContact } from './types.js';
import { buildEventURL, getEventLink, getImageURL, isoWithOffset } from './utils.js';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ request, log, json, addRequests }) => {
    log.info(`Processing: ${request.url}`);
    log.info(`Page: ${request.userData.page}`);

    // Cast the untyped `json` to our new typed interface
    const events = json as EventResponse[];

    if (events.length === 0) {
        log.info('No more pagination, exiting.');
        return;
    }

    for (const eventResponse of events) {
        const { Event: event } = eventResponse;

        const contactsArr = Array.isArray(event.Contacts) ? event.Contacts : [];

        const emailContact = contactsArr.find((c): c is EmailContact => c.ContactType === 'EmailContact' && !c.Private);
        const phoneContact = contactsArr.find((c): c is PhoneContact => c.ContactType === 'PhoneContact' && !c.Private);
        const webContact = contactsArr.find((c): c is WebContact => c.ContactType === 'WebContact' && !c.Private);

        const contacts = {
            email: emailContact?.EmailAddress || null,
            phone: phoneContact?.Number || null,
            website: webContact?.Url || null,
        };

        await Dataset.pushData({
            id: event._id,
            event: {
                link: getEventLink(event._id),
                name: event.ProfileName,
                about: event.About,
                keywords: event.Keywords,
                begin: isoWithOffset(event.Begin, event.TimeZone),
                end: isoWithOffset(event.End, event.TimeZone),
                currency: event.Currency,
                minPrice: event.MinPrice,
                maxPrice: event.MaxPrice,
            },
            location: {
                building: event.Building.ProfileName,
                street: event.AddressContact.AddressLine,
                city: event.AddressContact.City,
                zip: event.AddressContact.Zip,
                country: event.AddressContact.Country,
            },
            contacts,
            misc: {
                imageUrl: getImageURL(event._id, event.ShareImage),
            },
        });
    }

    const nextPage = request.userData.page + 1;
    await addRequests([
        {
            url: buildEventURL({
                page: nextPage,
                since: request.userData.since,
                till: request.userData.till,
            }),
            userData: {
                page: nextPage,
                since: request.userData.since,
                till: request.userData.till,
            },
        },
    ]);
});
