import { Actor } from 'apify';
import { createCheerioRouter } from 'crawlee';

import { EVENT_URL_PREFIX, IMAGE_URL_PREFIX, PAGE_LIMIT } from './const.js';
import type { EmailContact, EventResponse, PhoneContact, UserData, WebContact } from './types.js';
import { buildEventUrl, isoWithOffset } from './utils.js';

export const router = createCheerioRouter();

router.addDefaultHandler<UserData>(async ({ request, log, json, addRequests }) => {
    // Cast the untyped `json` to our new typed interface
    const events = json as EventResponse[];

    if (events.length === 0) {
        log.info(`[Page: ${request.userData.page}]: No more pagination, exiting.`);
        return;
    }

    const eventsToPush = [];
    const pageOffset = request.userData.page * PAGE_LIMIT;

    for (const [index, eventResponse] of events.entries()) {
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


        eventsToPush.push({
            id: event._id,
            url: `${EVENT_URL_PREFIX}/${event._id}`,
            name: event.ProfileName,
            about: event.About,
            keywords: event.Keywords,
            begin: isoWithOffset(event.Begin, event.TimeZone),
            end: isoWithOffset(event.End, event.TimeZone),
            currency: event.Currency,
            minPrice: event.MinPrice,
            maxPrice: event.MaxPrice,
            rankPosition: pageOffset + index + 1,
            location: {
                building: event.Building.ProfileName,
                street: event.AddressContact.AddressLine,
                city: event.AddressContact.City,
                zip: event.AddressContact.Zip,
                country: event.AddressContact.Country,
            },
            contacts,
            imageUrl: `${IMAGE_URL_PREFIX}/${event._id}/${event.ShareImage}.jpg`,
        });
    }

    if (eventsToPush.length > 0) {
        await Actor.pushData(eventsToPush);
    }

    const nextPage = request.userData.page + 1;
    await addRequests([
        {
            url: buildEventUrl({
                page: nextPage,
                since: request.userData.since,
                till: request.userData.till,
            }),
            userData: {
                page: nextPage,
                since: request.userData.since,
                till: request.userData.till,
            } satisfies UserData,
        },
    ]);

    log.info(`[Page: ${request.userData.page}]: Scraped ${events.length} events on ${request.url}`);
});
