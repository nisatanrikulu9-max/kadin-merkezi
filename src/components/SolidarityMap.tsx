import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Center } from '../data';

interface SolidarityMapProps {
  centers: Center[];
  activeCenter: Center | null;
  userLocation: { lat: number; lng: number } | null;
  onCenterClick: (center: Center) => void;
}

export default function SolidarityMap({
  centers,
  activeCenter,
  userLocation,
  onCenterClick
}: SolidarityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Helper to determine custom marker details
  const getMarkerIcon = (category: string, isActive: boolean) => {
    let colorClass = 'text-brand-600'; // Default Solidarity
    let iconLetter = 'D'; // Dayanışma
    
    if (category.includes('Sığınağı') || category.includes('Konukevi')) {
      colorClass = 'text-red-500';
      iconLetter = 'S'; // Sığınak
    } else if (category.includes('ŞÖNİM')) {
      colorClass = 'text-violet-600';
      iconLetter = 'Ş'; // Şönim
    } else if (category.includes('Danışma')) {
      colorClass = 'text-indigo-600';
      iconLetter = 'd'; // Danışma
    } else if (category.includes('Belediye')) {
      colorClass = 'text-emerald-600';
      iconLetter = 'B'; // Belediye
    } else if (category.includes('Sivil')) {
      colorClass = 'text-sky-500';
      iconLetter = 'V'; // Vakıf / Dernek
    }

    return L.divIcon({
      html: `
        <div class="custom-pin-container">
          ${isActive ? `<div class="custom-pin-pulse ${colorClass}"></div>` : ''}
          <div class="custom-pin ${colorClass}" style="color: currentColor">
            <span class="custom-pin-inner font-bold text-xs">${iconLetter}</span>
          </div>
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 35],
      popupAnchor: [0, -32]
    });
  };

  // 1. Initialize Leaflet Map (Runs once on mount)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center of İstanbul
    const defaultCenter: [number, number] = [41.0136, 28.9750];
    const defaultZoom = 11;

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: false // We will position our own zoom controls or let layout handle
    });

    // Add beautiful CartoDB Voyager map tiles (soft, non-cluttered colors perfect for icons)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Add clean zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    mapRef.current = map;

    return () => {
      // Clean up map on dismount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Add or update user's live location beacon
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const liveUserIcon = L.divIcon({
        html: `
          <div class="relative w-8 h-8 flex items-center justify-center">
            <div class="absolute w-6 h-6 rounded-full bg-blue-500 opacity-30 animate-ping"></div>
            <div class="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>
          </div>
        `,
        className: 'user-location-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: liveUserIcon })
        .addTo(map)
        .bindTooltip("Buradasınız", { direction: 'top', className: 'custom-tooltip' });

      userMarkerRef.current = userMarker;

      // Pan map to user's location
      map.setView([userLocation.lat, userLocation.lng], 12.5, { animate: true, duration: 1.0 });
    }
  }, [userLocation]);

  // 3. Re-render markers when centers database/filtered centers change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for all filtered centers
    centers.forEach(center => {
      const isSelected = activeCenter?.name === center.name;
      const markerIcon = getMarkerIcon(center.category, isSelected);

      const marker = L.marker([center.lat, center.lng], { icon: markerIcon })
        .addTo(map);

      // Tooltip shown on hover showing: Name - District
      marker.bindTooltip(`
        <div class="font-sans">
          <p class="font-bold text-slate-800 text-xs">${center.name}</p>
          <p class="text-[10px] text-slate-500 text-left font-semibold">${center.district} / İstanbul</p>
        </div>
      `, {
        direction: 'top',
        className: 'custom-tooltip',
        offset: L.point(0, -5)
      });

      // Interactive popup HTML layout on click
      const cleanedPhone = center.phone ? center.phone.replace(/[^0-9+]/g, '') : '';
      const popupHTML = `
        <div class="p-3 w-64 md:w-72 font-sans select-none max-h-56 overflow-y-auto scrollbar-thin">
          <span class="inline-block text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full mb-1.5">${center.category}</span>
          <h3 class="font-bold text-slate-900 text-sm leading-tight mb-0.5">${center.name}</h3>
          <p class="text-[11px] font-medium text-slate-500 mb-2.5">${center.district} İlçe Sınırları</p>
          
          <div class="space-y-2 text-xs text-slate-705 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
            ${center.address ? `
              <div class="flex items-start gap-1.5 leading-relaxed">
                <span class="text-slate-400 font-semibold shrink-0">Adres:</span>
                <span class="text-slate-650">${center.address}</span>
              </div>
            ` : ''}
            
            ${center.phone ? `
              <div class="flex items-center gap-1.5">
                <span class="text-slate-400 font-semibold shrink-0">Telefon:</span>
                <a href="tel:${cleanedPhone}" class="text-brand-700 font-bold hover:underline flex items-center gap-0.5">
                  ${center.phone}
                </a>
              </div>
            ` : ''}

            <div class="flex items-center gap-1.5 text-slate-600">
              <span class="text-slate-400 font-semibold shrink-0">Çalışma:</span>
              <span>${center.hours}</span>
            </div>
          </div>
          
          <div class="mt-3.5 pt-2 border-t border-slate-100 flex items-center justify-between">
            <a href="https://maps.google.com/?q=${encodeURIComponent(center.name + ' ' + center.address)}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="text-[11px] text-brand-700 hover:text-brand-800 font-bold flex items-center gap-0.5 underline">
              Haritada Aç (Google Maps)
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHTML, {
        closeButton: true,
        className: 'custom-leaflet-popup'
      });

      // Handle click events
      marker.on('click', () => {
        onCenterClick(center);
      });

      markersRef.current.push(marker);

      // If this marker is the active selected one, open its popup and center it
      if (isSelected) {
        marker.openPopup();
      }
    });

  }, [centers, activeCenter]);

  // 4. Listen for changes in active center to center/zoom map and trigger popup
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeCenter) return;

    // Pan map to the selected center with slight zoom in
    map.setView([activeCenter.lat, activeCenter.lng], 14.5, {
      animate: true,
      duration: 1.0
    });

    // Find the corresponding marker to open its popup programmatically
    const targetMarker = markersRef.current.find(m => {
      const latLng = m.getLatLng();
      return Math.abs(latLng.lat - activeCenter.lat) < 0.0001 &&
             Math.abs(latLng.lng - activeCenter.lng) < 0.0001;
    });

    if (targetMarker) {
      targetMarker.openPopup();
    }
  }, [activeCenter]);

  // Handle map sizing and refresh
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Trigger map invalidation to correct size issues inside dynamic grids/flexes
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div id="map-frame" className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      
      {/* Map Legend (Overlay details for quick category orientation) */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-lg shadow-sm border border-gray-200 max-w-xs text-xs space-y-2 hidden md:block">
        <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-1 font-display tracking-tight">Renk Açıklamaları</h4>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-gray-600">
          <div className="flex items-center gap-1.55">
            <span className="w-2.5 h-2.5 rounded bg-brand-600 inline-block shrink-0"></span>
            <span>Dayanışma (D)</span>
          </div>
          <div className="flex items-center gap-1.55">
            <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block shrink-0"></span>
            <span>Danışma (d)</span>
          </div>
          <div className="flex items-center gap-1.55">
            <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block shrink-0"></span>
            <span>Sığınak (S)</span>
          </div>
          <div className="flex items-center gap-1.55">
            <span className="w-2.5 h-2.5 rounded bg-violet-600 inline-block shrink-0"></span>
            <span>ŞÖNİM (Ş)</span>
          </div>
          <div className="flex items-center gap-1.55 col-span-2">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block shrink-0"></span>
            <span>Belediye Birimi (B)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
