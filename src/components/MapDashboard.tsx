import { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  Compass, 
  ChevronLeft, 
  ShieldAlert, 
  Info, 
  X, 
  Map as MapIcon, 
  Menu,
  Heart,
  Share2
} from 'lucide-react';
import { Center } from '../data';
import SolidarityMap from './SolidarityMap';

interface MapDashboardProps {
  onBackToLanding: () => void;
  centers: Center[];
}

// Haversine Distance Calculator
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

// Category design mapping
const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  'Kadın Dayanışma Merkezi': {
    bg: 'bg-brand-50',
    text: 'text-brand-700',
    dot: 'bg-brand-500',
    border: 'border-brand-200'
  },
  'Kadın Danışma Merkezi': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    dot: 'bg-indigo-500',
    border: 'border-indigo-150'
  },
  'Kadın Sığınağı / Konukevi': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    border: 'border-red-150'
  },
  'ŞÖNİM (Şiddet Önleme ve İzleme Merkezi)': {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    dot: 'bg-violet-500',
    border: 'border-violet-150'
  },
  'Belediye Destek Birimi': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    border: 'border-emerald-150'
  },
  'Sivil Toplum Kuruluşu (STK)': {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    dot: 'bg-sky-500',
    border: 'border-sky-150'
  },
  'Kadın Destek Kurumu': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    border: 'border-amber-150'
  }
};

export default function MapDashboard({ onBackToLanding, centers }: MapDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [activeCenter, setActiveCenter] = useState<Center | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Mobile responsive layout view toggle ('list' or 'map')
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  // Quick escape
  const handleQuickExit = () => {
    window.location.href = 'https://www.google.com';
  };

  // Get list of unique districts for select filter
  const uniqueDistricts = useMemo(() => {
    const districts = centers.map(c => c.district);
    return Array.from(new Set(districts)).sort((a, b) => a.localeCompare(b, 'tr'));
  }, [centers]);

  // Unique Categories structure
  const categoriesList = [
    { value: 'all', label: 'Tümü' },
    { value: 'Kadın Dayanışma Merkezi', label: 'Kadın Dayanışma' },
    { value: 'Kadın Danışma Merkezi', label: 'Kadın Danışma' },
    { value: 'Kadın Sığınağı / Konukevi', label: 'Sığınak / Konukevi' },
    { value: 'ŞÖNİM (Şiddet Önleme ve İzleme Merkezi)', label: 'ŞÖNİM' },
    { value: 'Belediye Destek Birimi', label: 'Belediye' },
    { value: 'Sivil Toplum Kuruluşu (STK)', label: 'Vakıf / STK' }
  ];

  // Geolocation trigger
  const handleGeoLocate = () => {
    if (!navigator.geolocation) {
      setLocateError('Tarayıcınız konum özelliğini desteklemiyor.');
      return;
    }
    setLocating(true);
    setLocateError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocating(false);
      },
      (error) => {
        console.error(error);
        setLocating(false);
        if (error.code === 1) {
          setLocateError('Konum erişim izni reddedildi. Ayarlarınızdan izin verebilirsiniz.');
        } else {
          setLocateError('Konum alınırken bir hata oluştu.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Copy contact info to clipboard
  const handleCopyContact = (center: Center) => {
    const textToCopy = `${center.name}\nAdres: ${center.address}\nTelefon: ${center.phone}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(center.name);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Filter and Sort centers
  const filteredAndSortedCenters = useMemo(() => {
    let result = centers.map(center => {
      // If user location is enabled, calculate exact distance in kilometers
      let distance: number | undefined;
      if (userLocation) {
        distance = getDistance(userLocation.lat, userLocation.lng, center.lat, center.lng);
      }
      return { ...center, distance };
    });

    // Filtering by search tag / text
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLocaleLowerCase('tr-TR');
      result = result.filter(c => 
        c.name.toLocaleLowerCase('tr-TR').includes(searchLower) ||
        c.district.toLocaleLowerCase('tr-TR').includes(searchLower) ||
        c.address.toLocaleLowerCase('tr-TR').includes(searchLower) ||
        c.description.toLocaleLowerCase('tr-TR').includes(searchLower)
      );
    }

    // Filtering by Broad Category
    if (selectedCategory !== 'all') {
      result = result.filter(c => c.category === selectedCategory);
    }

    // Filtering by District
    if (selectedDistrict !== 'all') {
      result = result.filter(c => c.district === selectedDistrict);
    }

    // Sort: If user location is active, sort by distance (closest first).
    // Otherwise, sort alphabetically by district, then name
    if (userLocation) {
      result.sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
    } else {
      result.sort((a, b) => {
        const districtCompare = a.district.localeCompare(b.district, 'tr');
        if (districtCompare !== 0) return districtCompare;
        return a.name.localeCompare(b.name, 'tr');
      });
    }

    return result;
  }, [centers, searchTerm, selectedCategory, selectedDistrict, userLocation]);

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden font-sans">
      
      {/* 1. Header with Back controls & Safety exits */}
      <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-1.5 md:gap-3">
          <button 
            onClick={onBackToLanding}
            className="p-1.5 md:p-2 rounded-xl text-slate-500 hover:text-slate-850 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs md:text-sm font-semibold animate-fadeIn"
            id="btn-back"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Açılış Sayfası</span>
          </button>
          
          <div className="h-5 w-[1px] bg-slate-200 hidden sm:block"></div>
          
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </span>
            <div>
              <h1 className="font-display font-bold text-gray-950 text-sm md:text-base tracking-tight leading-none">İstanbul <span className="text-brand-600">Dayanışma</span> Haritası</h1>
              <span className="text-[9px] md:text-[10px] text-gray-400 block leading-tight font-semibold uppercase tracking-wider mt-0.5 font-sans">Harita Görünümü</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Exit */}
          <button 
            onClick={handleQuickExit}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-[11px] md:text-xs px-3.5 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-1 shadow-sm shrink-0"
            title="Ekranı kapat ve hemen Google'ı aç."
            id="dashboard-quick-exit"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Hızlı Kapat</span>
          </button>
        </div>
      </header>

      {/* 2. Main Area Grid (Responsive dual layouts for Mobile toggles vs sidebars) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left sidebar: Directory / Search / Filtering */}
        <aside className={`w-full md:w-[380px] lg:w-[420px] bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden z-20 transition-transform duration-200 ${
          mobileView === 'list' ? 'flex' : 'hidden md:flex'
        }`}>
          
          {/* Geolocation, search inputs */}
          <div className="p-4 bg-slate-50 border-b border-gray-200 space-y-3.5">
            
            {/* Geolocation trigger */}
            <div className="bg-white p-2.5 rounded-2xl border border-brand-200 shadow-sm inline-flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100 shrink-0">
                  <Compass className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
                </span>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-800 leading-none">Haritada Yakınımda Bul</h4>
                  <p className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5">Size en yakın destek birimlerini görün.</p>
                </div>
              </div>
              
              <button
                onClick={handleGeoLocate}
                className="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] transition-all text-white text-[11px] font-bold px-3 py-1.5 rounded-xl block shrink-0 cursor-pointer"
                disabled={locating}
                id="btn-geolocate"
              >
                {locating ? 'Bulunuyor...' : 'Konumunu Kullan'}
              </button>
            </div>

            {/* Geolocation feedback line */}
            {locateError && (
              <p className="text-[10px] text-red-600 bg-red-50 p-2 rounded-xl border border-red-100 font-medium">
                {locateError}
              </p>
            )}
            {userLocation && (
              <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100 font-medium flex items-center justify-between">
                <span>📍 Konum aktif! Merkezler mesafeye göre sıralandı.</span>
                <button 
                  onClick={() => setUserLocation(null)}
                  className="text-slate-600 hover:text-slate-900 ml-1 underline font-bold"
                >
                  Kapat
                </button>
              </div>
            )}

            {/* General Direct Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Kurum adı, ilçe veya adres ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                id="input-search"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* District dropdown filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="district-select" className="text-[11px] font-bold text-slate-600 shrink-0">İlçe:</label>
              <select 
                id="district-select"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-lg text-xs p-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="all">İstanbul (Tüm İlçeler)</option>
                {uniqueDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Categories badging horizontal list */}
          <div className="px-4 py-2 border-b border-gray-200 bg-brand-50/10 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Kurum Türü</span>
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin snap-x">
              {categoriesList.map(cat => {
                const isActive = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setSelectedCategory(cat.value);
                      setActiveCenter(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 snap-center transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-brand-600 text-white ring-1 ring-brand-700 shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-150 border border-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter statistics indicator */}
          <div className="px-4 py-2 bg-slate-50 border-b border-gray-200 flex items-center justify-between text-[11px] text-slate-505 font-semibold">
            <span>{filteredAndSortedCenters.length} kayıt bulunuyor</span>
            {(searchTerm || selectedCategory !== 'all' || selectedDistrict !== 'all') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedDistrict('all');
                  setActiveCenter(null);
                }}
                className="text-brand-600 font-bold hover:underline"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>

          {/* Scrollable list items of Centers */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
            {filteredAndSortedCenters.length === 0 ? (
              <div className="p-8 text-center text-slate-405 space-y-2">
                <span className="text-3xl">🧩</span>
                <p className="font-semibold text-sm">Eşleşen Merkez Bulunamadı</p>
                <p className="text-xs">Farklı anahtar kelimeler aramayı veya filtreleri sıfırlamayı deneyebilirsiniz.</p>
              </div>
            ) : (
              filteredAndSortedCenters.map((center) => {
                const catStyle = CATEGORY_STYLES[center.category] || CATEGORY_STYLES['Kadın Destek Kurumu'];
                const isSelected = activeCenter?.name === center.name;
                return (
                  <div 
                    key={center.name} 
                    onClick={() => {
                      setActiveCenter(center);
                      // In mobile view, center click transitions to showing layout Map
                      if (window.innerWidth < 768) {
                        setMobileView('map');
                      }
                    }}
                    className={`p-4 text-left transition-all cursor-pointer hover:bg-brand-50/10 space-y-2 relative border-l-4 ${
                      isSelected 
                        ? 'bg-brand-50/30 border-l-brand-600' 
                        : 'border-l-transparent'
                    }`}
                  >
                    {/* Header line: category & distance badge */}
                    <div className="flex items-start justify-between gap-2">
                       <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                        <span className={`w-1 h-1 rounded-full ${catStyle.dot}`}></span>
                        <span>{center.category}</span>
                      </span>

                      {center.distance !== undefined && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-mono">
                          {center.distance.toFixed(1)} km
                        </span>
                      )}
                    </div>

                    {/* Center Name */}
                    <div>
                      <h4 className="font-bold text-gray-950 text-sm tracking-tight leading-snug">{center.name}</h4>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{center.district} / İstanbul</span>
                      </div>
                    </div>

                    {/* Small Address, tel, copy */}
                    {isSelected && (
                      <div className="text-xs pt-1.5 text-slate-650 space-y-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 animate-fadeIn">
                        
                        {center.description && (
                          <p className="italic text-slate-500 text-[11px] leading-relaxed select-text">
                            "{center.description}"
                          </p>
                        )}

                        {center.address && (
                          <p className="leading-relaxed select-text">
                            <span className="font-semibold text-slate-605">Adres:</span> {center.address}
                          </p>
                        )}
                        
                        {center.phone && (
                          <p className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-605">Tel:</span>
                            <a 
                              href={`tel:${center.phone.replace(/[^0-9+]/g, '')}`} 
                              onClick={(e) => e.stopPropagation()}
                              className="text-brand-700 hover:text-brand-800 hover:underline font-bold"
                            >
                              {center.phone}
                            </a>
                          </p>
                        )}

                        <p className="flex items-center gap-1.5 text-slate-500">
                          <span className="font-semibold text-slate-600">Çalışma:</span> {center.hours}
                        </p>

                        {/* Interactive footer actions of selected card */}
                        <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-200/50">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyContact(center);
                            }}
                            className="text-[10px] text-slate-500 hover:text-slate-800 font-bold flex items-center gap-0.5"
                          >
                            {copiedId === center.name ? 'Kopyalandı!' : 'Bilgileri Kopyala'}
                          </button>

                          <a 
                            href={`https://maps.google.com/?q=${encodeURIComponent(center.name + ' ' + center.address)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-brand-600 hover:underline font-bold"
                          >
                            Yol Tarifi al ↗
                          </a>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Area: Leaflet Map */}
        <main className={`flex-1 relative overflow-hidden h-full ${
          mobileView === 'map' ? 'block' : 'hidden md:block'
        }`}>
          <div className="absolute inset-0 p-2 md:p-4 h-full">
            <SolidarityMap 
              centers={filteredAndSortedCenters}
              activeCenter={activeCenter}
              userLocation={userLocation}
              onCenterClick={(center) => setActiveCenter(center)}
            />
          </div>
        </main>

      </div>

      {/* 3. Mobile Navigation View switcher (Floating at the bottom for responsive screens) */}
      <div className="md:hidden shrink-0 bg-white border-t border-slate-200 px-4 py-2 grid grid-cols-2 gap-2 z-30 shadow-lg">
        <button
          onClick={() => setMobileView('list')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileView === 'list' 
              ? 'bg-brand-600 text-white shadow shadow-brand-500/20' 
              : 'bg-slate-50 text-slate-600'
          }`}
          id="btn-mobile-list"
        >
          <Menu className="w-4 h-4" />
          <span>Liste Görünümü ({filteredAndSortedCenters.length})</span>
        </button>
        
        <button
          onClick={() => setMobileView('map')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileView === 'map' 
              ? 'bg-brand-600 text-white shadow shadow-brand-500/20' 
              : 'bg-slate-50 text-slate-600'
          }`}
          id="btn-mobile-map"
        >
          <MapIcon className="w-4 h-4" />
          <span>Haritada Göster</span>
        </button>
      </div>

    </div>
  );
}
