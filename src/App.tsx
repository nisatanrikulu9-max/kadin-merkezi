import { useState } from 'react';
import LandingPage from './components/LandingPage';
import MapDashboard from './components/MapDashboard';
import { FALLBACK_CENTERS } from './data';

export default function App() {
  const [view, setView] = useState<'landing' | 'map'>('landing');

  return (
    <div className="w-full min-h-screen">
      {view === 'landing' ? (
        <LandingPage 
          onEnterMap={() => setView('map')} 
          centerCount={FALLBACK_CENTERS.length} 
        />
      ) : (
        <MapDashboard 
          onBackToLanding={() => setView('landing')} 
          centers={FALLBACK_CENTERS} 
        />
      )}
    </div>
  );
}
