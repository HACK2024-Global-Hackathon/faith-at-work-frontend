import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:8000/events', () => {
    return HttpResponse.json([
      {
        "uuid": "ylnvhAioqezN7xWOMREV",
        "title": "#HACK2024 Singapore: Tech solutions for His Kingdom",
        "summary": "#HACK is the largest global Christian hackathon for anyone who is passionate about leveraging technology to address missional projects.",
        "eventbrite_url": "https://www.eventbrite.com/e/hack2024-singapore-tech-solutions-for-his-kingdom-tickets-934306344427",
        "date": "2024-10-25T12:00:00Z",
        "image_url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F796565779%2F297979351972%2F1%2Foriginal.20240626-094251?h=200&w=450&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C341%2C2732%2C1366&s=ee918b23e458b906b41579a70a82c9ee"
      },
      {
        "uuid": "TeP68B7eEMSmaiIZ0ohc",
        "title": "#HACK2024 Showcase Saturday",
        "summary": "See first-hand the innovative solutions that the teams have worked on for #HACK2024!",
        "eventbrite_url": "https://www.eventbrite.com/e/hack2024-showcase-saturday-tickets-1054556018439",
        "date": "2024-11-02T09:00:00Z",
        "image_url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F880368853%2F297979351972%2F1%2Foriginal.20241022-081741?h=200&w=450&auto=format%2Ccompress&q=75&sharp=10&s=390bf4cb3956faf99d174e841d3082df"
      }
    ])
  })
]
