import { Actor } from 'apify';
import { CheerioCrawler } from 'crawlee';

import { router } from './routes.js';
import type { Input } from './types.js';
import { buildEventURL, rawToLocalISOString } from './utils.js';

await Actor.init();

// Parse input
const { since, till } = (await Actor.getInput()) as Input;
const sinceISO = rawToLocalISOString(since, false);
const tillISO  = rawToLocalISOString(till, true);

const crawler = new CheerioCrawler({
    requestHandler: router
});

const initUrl = buildEventURL({ since: sinceISO, till: tillISO })
await crawler.run([
    {
        url: initUrl,
        userData: {
            page: 0,
            since: sinceISO,
            till: tillISO,
        },
    }
]);

await Actor.exit();
