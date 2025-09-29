import { createCheerioRouter, Dataset } from 'crawlee';

import { buildEventURL, getEventLink, getImageURL, isoWithOffset } from './utils.js';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ request, log, json, addRequests }) => {
    log.info(`Processing: ${request.url}`);
    log.info(`Page: ${request.userData.page}`);

    if (json.length === 0) {
        log.info('No more pagination, exiting.');
        return;
    }

    for (const eventResponse of json) {
        // TODO: Maybe define eventResponse type?
        interface Contact {
            ContactType: string;
            Private: boolean;
        }
        const contactsArr = Array.isArray(eventResponse.Event.Contacts) ? eventResponse.Event.Contacts : [];

        const emailContact = contactsArr.find((c: Contact) => c.ContactType === 'EmailContact' && !c.Private);
        const phoneContact = contactsArr.find((c: Contact) => c.ContactType === 'PhoneContact' && !c.Private);
        const webContact   = contactsArr.find((c: Contact) => c.ContactType === 'WebContact' && !c.Private);

        const contacts = {
            email: emailContact ? (emailContact.EmailAddress || null) : null,
            phone: phoneContact ? (phoneContact.Number || null) : null,
            website: webContact ? (webContact.Url || null) : null,
        };

        await Dataset.pushData({
            id: eventResponse.Event._id,
            event: {
                link: getEventLink(eventResponse.Event._id),
                name: eventResponse.Event.ProfileName,
                about: eventResponse.Event.About,
                keywords: eventResponse.Event.Keywords,
                begin: isoWithOffset(eventResponse.Event.Begin, eventResponse.Event.TimeZone),
                end: isoWithOffset(eventResponse.Event.End, eventResponse.Event.TimeZone),
                currency: eventResponse.Event.Currency,
                minPrice: eventResponse.Event.MinPrice,
                maxPrice: eventResponse.Event.MaxPrice,
            },
            location: {
                building: eventResponse.Event.Building.ProfileName,
                street: eventResponse.Event.AddressContact.AddressLine,
                city: eventResponse.Event.AddressContact.City,
                zip: eventResponse.Event.AddressContact.Zip,
                country: eventResponse.Event.AddressContact.Country,
            },
            contacts,
            misc: {
                imageUrl: getImageURL(eventResponse.Event._id, eventResponse.Event.ShareImage),
            }
        });
    }


    const nextPage = request.userData.page + 1;
    await addRequests([{
        url: buildEventURL({
            page: nextPage,
            since: request.userData.since,
            till: request.userData.till
        }),
        userData: {
            page: nextPage,
            since: request.userData.since,
            till: request.userData.till
         }
    }]);
});
