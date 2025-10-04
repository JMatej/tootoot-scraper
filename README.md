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

### Output Example

```json
{
    "name": "Awesome Concert",
    "about": "A description of the awesome concert.",
    "begin": "2025-10-15T20:00:00+02:00",
    "end": "2025-10-15T23:00:00+02:00",
    "url": "[https://tootoot.fm/sk/events/670b3a1b1234567890abcdef](https://tootoot.fm/sk/events/670b3a1b1234567890abcdef)",
    "currency": "EUR",
    "minPrice": 25.5,
    "maxPrice": 50,
    "rankPosition": 168,
    "location.building": "Grand Concert Hall",
    "location.street": "Main Street 123",
    "location.city": "Bratislava",
    "location.zip": "811 01",
    "location.country": "Slovakia",
    "contacts.email": "info@awesomeconcert.sk",
    "contacts.phone": "+421900123456",
    "contacts.website": "[https://awesomeconcert.sk](https://awesomeconcert.sk)",
    "imageUrl": "[https://ttcdn.b-cdn.net/images/Event/670b3a1b1234567890abcdef/ShareImage.jpg](https://ttcdn.b-cdn.net/images/Event/670b3a1b1234567890abcdef/ShareImage.jpg)"
}
```
