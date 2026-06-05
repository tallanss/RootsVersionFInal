import CityLanding from './CityLanding';
import NotFound from './NotFound';
import { CITIES } from '../data/cities';

// Page ville — le slug court est passé en prop (route explicite par ville)
export default function CityPage({ slug }) {
  const cityData = CITIES[slug];
  if (!cityData) return <NotFound />;
  return <CityLanding cityData={cityData} />;
}
