# Tootoot.fm Scraper

This Apify Actor scrapes event details and prices from [Tootoot.fm](https://tootoot.fm/sk/). It allows you to filter events within a specific date range and extracts comprehensive information about each event, including location, contacts, pricing, and more.

## Cost of Usage

This Actor is free to use. However, you will be charged for the Apify platform resources consumed during the run. The cost is based on standard [Apify pricing](https://apify.com/pricing).

## Input

The Actor accepts the following input parameters to filter the events. If no dates are provided, it will scrape all available upcoming events.

| Field   | Type | Description                                        |
| ------- | ---- | -------------------------------------------------- |
| `since` | Date | Filter events starting from this date (inclusive). |
| `till`  | Date | Filter events until this date (inclusive).         |

### Input Example

```json
{
    "since": "2025-10-01",
    "till": "2025-10-31"
}
```

## Output

The scraped data is stored in the Apify Dataset. Each item represents a single event with the following structure:

| Field               | Type     | Description                                                           |
| ------------------- | -------- | --------------------------------------------------------------------- |
| `misc.imageUrl`     | String   | URL of the event's main image.                                        |
| `event.name`        | String   | The name of the event.                                                |
| `event.about`       | String   | A short description of the event.                                     |
| `event.begin`       | Datetime | The start date and time of the event (ISO 8601 format with timezone). |
| `event.end`         | Datetime | The end date and time of the event (ISO 8601 format with timezone).   |
| `event.link`        | String   | A direct link to the event page on Tootoot.fm.                        |
| `event.currency`    | String   | The currency for the ticket prices (e.g., `EUR`).                     |
| `event.minPrice`    | Number   | The minimum ticket price.                                             |
| `event.maxPrice`    | Number   | The maximum ticket price.                                             |
| `location.building` | String   | The name of the venue or building.                                    |
| `location.street`   | String   | The street address of the venue.                                      |
| `location.city`     | String   | The city where the event is located.                                  |
| `location.zip`      | String   | The postal code for the venue.                                        |
| `location.country`  | String   | The country where the event is located.                               |
| `contacts.email`    | String   | The public contact email for the event.                               |
| `contacts.phone`    | String   | The public contact phone number for the event.                        |
| `contacts.website`  | String   | The public website URL for the event.                                 |

### Output Example

```json
{
    "misc.imageUrl": "[https://ttcdn.b-cdn.net/images/Event/670b3a1b1234567890abcdef/ShareImage.jpg](https://ttcdn.b-cdn.net/images/Event/670b3a1b1234567890abcdef/ShareImage.jpg)",
    "event.name": "Awesome Concert",
    "event.about": "A description of the awesome concert.",
    "event.begin": "2025-10-15T20:00:00+02:00",
    "event.end": "2025-10-15T23:00:00+02:00",
    "event.link": "[https://tootoot.fm/sk/events/670b3a1b1234567890abcdef](https://tootoot.fm/sk/events/670b3a1b1234567890abcdef)",
    "event.currency": "EUR",
    "event.minPrice": 25.5,
    "event.maxPrice": 50,
    "location.building": "Grand Concert Hall",
    "location.street": "Main Street 123",
    "location.city": "Bratislava",
    "location.zip": "811 01",
    "location.country": "Slovakia",
    "contacts.email": "info@awesomeconcert.sk",
    "contacts.phone": "+421900123456",
    "contacts.website": "[https://awesomeconcert.sk](https://awesomeconcert.sk)"
}
```
