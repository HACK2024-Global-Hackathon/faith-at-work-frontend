import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:8000/events', () => {
    return HttpResponse.json([
      {
        "name": {
          "text": "#HACK2024 Singapore: Tech solutions for His Kingdom",
          "html": "#HACK2024 Singapore: Tech solutions for His Kingdom"
        },
        "description": {
          "text": "#HACK is the largest global Christian hackathon for anyone who is passionate about leveraging technology to address missional projects.",
          "html": "#HACK is the largest global Christian hackathon for anyone who is passionate about leveraging technology to address missional projects."
        },
        "url": "https://www.eventbrite.com/e/hack2024-singapore-tech-solutions-for-his-kingdom-tickets-934306344427",
        "vanity_url": "https://hack2024.eventbrite.com",
        "start": {
          "timezone": "Asia/Singapore",
          "local": "2024-10-25T20:00:00",
          "utc": "2024-10-25T12:00:00Z"
        },
        "end": {
          "timezone": "Asia/Singapore",
          "local": "2024-11-02T21:00:00",
          "utc": "2024-11-02T13:00:00Z"
        },
        "organization_id": "297979351972",
        "created": "2024-06-26T09:53:46Z",
        "changed": "2024-10-25T21:36:52Z",
        "published": "2024-06-27T03:03:28Z",
        "capacity": null,
        "capacity_is_custom": null,
        "status": "started",
        "currency": "SGD",
        "listed": true,
        "shareable": true,
        "online_event": false,
        "tx_time_limit": 1200,
        "hide_start_date": false,
        "hide_end_date": false,
        "locale": "en_US",
        "is_locked": false,
        "privacy_setting": "unlocked",
        "is_series": false,
        "is_series_parent": false,
        "inventory_type": "limited",
        "is_reserved_seating": false,
        "show_pick_a_seat": false,
        "show_seatmap_thumbnail": false,
        "show_colors_in_seatmap_thumbnail": false,
        "source": "coyote",
        "is_free": true,
        "version": null,
        "summary": "#HACK is the largest global Christian hackathon for anyone who is passionate about leveraging technology to address missional projects.",
        "facebook_event_id": null,
        "logo_id": "796565779",
        "organizer_id": "19790336369",
        "venue_id": "161213849",
        "category_id": "114",
        "subcategory_id": "14001",
        "format_id": "1",
        "id": "934306344427",
        "resource_uri": "https://www.eventbriteapi.com/v3/events/934306344427/",
        "is_externally_ticketed": false,
        "logo": {
          "crop_mask": {
            "top_left": {
              "x": 0,
              "y": 341
            },
            "width": 2732,
            "height": 1366
          },
          "original": {
            "url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F796565779%2F297979351972%2F1%2Foriginal.20240626-094251?auto=format%2Ccompress&q=75&sharp=10&s=6c9d1717a3c5988d46a90b6ccfcd5ce3",
            "width": 2732,
            "height": 2048
          },
          "id": "796565779",
          "url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F796565779%2F297979351972%2F1%2Foriginal.20240626-094251?h=200&w=450&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C341%2C2732%2C1366&s=ee918b23e458b906b41579a70a82c9ee",
          "aspect_ratio": "2",
          "edge_color": null,
          "edge_color_set": true
        }
      },
      {
        "name": {
          "text": "#HACK2024 Showcase Saturday",
          "html": "#HACK2024 Showcase Saturday"
        },
        "description": {
          "text": "See first-hand the innovative solutions that the teams have worked on for #HACK2024!",
          "html": "See first-hand the innovative solutions that the teams have worked on for #HACK2024!"
        },
        "url": "https://www.eventbrite.com/e/hack2024-showcase-saturday-tickets-1054556018439",
        "start": {
          "timezone": "Asia/Singapore",
          "local": "2024-11-02T17:00:00",
          "utc": "2024-11-02T09:00:00Z"
        },
        "end": {
          "timezone": "Asia/Singapore",
          "local": "2024-11-02T21:30:00",
          "utc": "2024-11-02T13:30:00Z"
        },
        "organization_id": "297979351972",
        "created": "2024-10-22T03:18:43Z",
        "changed": "2024-10-22T13:15:16Z",
        "published": "2024-10-22T08:19:55Z",
        "capacity": null,
        "capacity_is_custom": null,
        "status": "live",
        "currency": "SGD",
        "listed": true,
        "shareable": true,
        "online_event": false,
        "tx_time_limit": 1200,
        "hide_start_date": false,
        "hide_end_date": false,
        "locale": "en_US",
        "is_locked": false,
        "privacy_setting": "unlocked",
        "is_series": false,
        "is_series_parent": false,
        "inventory_type": "limited",
        "is_reserved_seating": false,
        "show_pick_a_seat": false,
        "show_seatmap_thumbnail": false,
        "show_colors_in_seatmap_thumbnail": false,
        "source": "coyote",
        "is_free": true,
        "version": null,
        "summary": "See first-hand the innovative solutions that the teams have worked on for #HACK2024!",
        "facebook_event_id": null,
        "logo_id": "880368853",
        "organizer_id": "19790336369",
        "venue_id": "236763209",
        "category_id": "102",
        "subcategory_id": "2004",
        "format_id": "1",
        "id": "1054556018439",
        "resource_uri": "https://www.eventbriteapi.com/v3/events/1054556018439/",
        "is_externally_ticketed": false,
        "logo": {
          "crop_mask": null,
          "original": {
            "url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F880368853%2F297979351972%2F1%2Foriginal.20241022-081741?auto=format%2Ccompress&q=75&sharp=10&s=7ee5b0db95c78e63c4e9a5fa85cca20c",
            "width": 3177,
            "height": 1787
          },
          "id": "880368853",
          "url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F880368853%2F297979351972%2F1%2Foriginal.20241022-081741?h=200&w=450&auto=format%2Ccompress&q=75&sharp=10&s=390bf4cb3956faf99d174e841d3082df",
          "aspect_ratio": "1.775",
          "edge_color": "#948270",
          "edge_color_set": true
        }
      }
    ])
  })
]
