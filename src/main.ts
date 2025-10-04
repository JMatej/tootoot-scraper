import { Actor } from 'apify';
import { CheerioCrawler } from 'crawlee';

import { router } from './routes.js';
import type { Input, UserData } from './types.js';
import { buildEventUrl, rawToLocalISOString } from './utils.js';

await Actor.init();

const { since, till } = (await Actor.getInput<Input>())!;
const sinceISO = rawToLocalISOString(since, false);
const tillISO = rawToLocalISOString(till, true);

const crawler = new CheerioCrawler({
    maxConcurrency: 3,
    proxyConfiguration: await Actor.createProxyConfiguration(),
    requestHandler: router,
});

await crawler.run([
    {
        url: buildEventUrl({ since: sinceISO, till: tillISO }),
        userData: {
            page: 0,
            since: sinceISO,
            till: tillISO,
        } as UserData,
    },
]);

await Actor.exit();
