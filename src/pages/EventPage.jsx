import EventLanding from './EventLanding';
import NotFound from './NotFound';
import { EVENTS } from '../data/events';

// Page événementielle — le slug est passé en prop (route explicite par événement).
export default function EventPage({ slug }) {
  const eventData = EVENTS[slug];
  if (!eventData) return <NotFound />;
  return <EventLanding eventData={eventData} />;
}
