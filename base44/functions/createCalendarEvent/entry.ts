import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { title, description, date } = body;

    if (!title || !date) {
      return Response.json({ error: 'title and date are required' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const event = {
      summary: title,
      description: description || '',
      start: {
        dateTime: date + 'T09:00:00',
        timeZone: 'Europe/Rome'
      },
      end: {
        dateTime: date + 'T10:00:00',
        timeZone: 'Europe/Rome'
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 30 },
          { method: 'email', minutes: 1440 }
        ]
      }
    };

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ error: `Google API error: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return Response.json({ success: true, event_id: data.id, html_link: data.htmlLink });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}