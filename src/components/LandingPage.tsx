import { motion } from 'motion/react';
import { Shield, MapPin, Phone, ShieldAlert, Heart, ArrowRight, ExternalLink } from 'lucide-react';

interface LandingPageProps {
  onEnterMap: () => void;
  centerCount: number;
}

export default function LandingPage({ onEnterMap, centerCount }: LandingPageProps) {
  // Quick Escape feature (extremely useful and safe for users of support resources)
  const handleQuickExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] flex flex-col font-sans selection:bg-brand-200 selection:text-brand-900">
      
      {/* 1. Header with Safety Controls */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-gray-200 px-4 py-3.5 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </span>
            <div>
              <h1 className="font-display font-bold text-lg leading-none text-gray-950 tracking-tight">İstanbul <span className="text-brand-600">Dayanışma</span> Haritası</h1>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">Sosyal Destek Haritası</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Quick Exit "Hızlı Çıkış" button - redirects to google when clicked */}
            <button 
              onClick={handleQuickExit}
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs px-3.5 py-1.5 md:px-4 md:py-2 rounded-lg transition-all duration-155 flex items-center gap-1.5 shadow-sm"
              title="Ekranı hızlıca kapatıp Google'a yönlendir."
              id="btn-quick-exit"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Hızlı Kapat</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-10 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left column: Hero texts and Actions */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-800 px-3.5 py-1 rounded-md text-xs font-bold border border-brand-200"
          >
            <Shield className="w-3.5 h-3.5 text-brand-600" />
            <span>İstanbul Kadın Destek Hizmetleri Platformu</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold text-3xl md:text-5xl lg:text-[52px] text-gray-950 leading-[1.125] tracking-tight"
          >
            Güvende ve <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Birlikteyiz.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-650 text-base md:text-lg leading-relaxed max-w-xl"
          >
            İstanbul genelindeki kadın dayanışma merkezleri, sığınaklar ve destek birimlerine kolayca ulaşmanız için hazırlanan interaktif rehber ve harita. Yakınınızdaki koordinatları doğrulanmış destek noktalarına saniyeler içinde erişin.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3"
          >
            <button
              onClick={onEnterMap}
              className="bg-brand-600 hover:bg-brand-750 text-white font-medium text-base px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-brand-500/15 hover:shadow-brand-500/25 flex items-center justify-center gap-2 group transform active:scale-[0.98]"
              id="btn-view-map"
            >
              <span>Haritayı Görüntüle</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <a 
              href="#emergency-lines" 
              className="text-slate-600 hover:text-slate-800 font-medium text-sm text-center py-3 px-4 hover:bg-slate-100 rounded-2xl transition-colors shrink-0"
              id="link-emergency"
            >
              Acil İletişim Hatları
            </a>
          </motion.div>

          {/* Core Analytics Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-3 pt-6"
          >
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow transition-shadow">
              <span className="block text-xl md:text-2xl font-bold text-brand-600 font-display">{centerCount}</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mt-0.5">Destek Noktası</span>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow transition-shadow">
              <span className="block text-xl md:text-2xl font-bold text-slate-900 font-display">39</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mt-0.5">İlçe Kapsamı</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-brand-100 shadow-sm hover:shadow transition-shadow bg-gradient-to-br from-brand-50/20 inline-block">
              <span className="block text-xl md:text-2xl font-bold text-brand-600 font-display">7/24 Kesintisiz</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mt-0.5">Alo 183 Desteği</span>
            </div>
          </motion.div>
        </div>

        {/* Right column: Beautiful Illustration & Help Badges */}
        <div className="lg:col-span-12 xl:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
          <div className="absolute inset-0 bg-brand-100/30 rounded-full blur-3xl -z-10 w-72 h-72 mx-auto"></div>
          
          <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
            <h3 className="font-display font-bold text-slate-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-600" />
              <span>Harita Ne Sağlar?</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100">
                  <MapPin className="w-4 h-4 text-brand-500" />
                </span>
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">Doğru Lokasyon Bilgisi</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Doğrudan koordinat bilgileriyle doğruluk hassasiyeti yüksek haritalama.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-8 h-8 rounded-lg bg-brand-100/60 flex items-center justify-center shrink-0 border border-brand-200">
                  <ShieldAlert className="w-4 h-4 text-brand-600" />
                </span>
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">Kritik Sığınaklar ve ŞÖNİM</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Şiddet Önleme Merkezleri ve sığınakların tam konum ve temas bilgileri.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100">
                  <Phone className="w-4 h-4 text-teal-600" />
                </span>
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">Tek Tıkla Arama Kolaylığı</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Telefon numarası bulunan merkezleri mobil tarayıcıda doğrudan arama ve arama kısayolu.</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100 text-xs text-amber-800 flex gap-2">
              <span className="text-lg leading-none shrink-0">🔒</span>
              <p className="leading-relaxed"><strong>Veri Gizliliği:</strong> Bu platform tamamen açık kaynaklıdır ve kullanıcıların yerel konumlarını kesinlikle bir sunucuya kaydetmez.</p>
            </div>
          </div>
        </div>

      </main>

      {/* 3. Emergency Contact Section */}
      <section id="emergency-lines" className="bg-slate-900 text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8 border-b border-slate-800 pb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight">Acil Durum / Şiddet İhbar Hatları</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 183 */}
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-red-500/10 text-red-400 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide mb-2 uppercase">Sosyal Destek</span>
                <h3 className="font-bold text-lg text-white">ALO 183</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Aile ve Sosyal Hizmetler Bakanlığı Şiddet ve Destek Hattı. Kadınlara yönelik şiddet vakalarında 7/24 hizmet sunar.</p>
              </div>
              <a href="tel:183" className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2 px-4 rounded-xl text-center transition-colors block mt-3" id="call-183">
                183'ü Şimdi Ara
              </a>
            </div>

            {/* 112 */}
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-red-500/10 text-red-500 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide mb-2 uppercase">Hayati Tehlike</span>
                <h3 className="font-bold text-lg text-white">ALO 112</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Acil durumlarda kolluk kuvvetleri (Polis, Jandarma) ve ambulans çağırmak için 7/24 ücretsiz ulaşılabilen merkez hat.</p>
              </div>
              <a href="tel:112" className="bg-slate-600 hover:bg-slate-550 text-white font-semibold text-xs py-2 px-4 rounded-xl text-center transition-colors block mt-3" id="call-112">
                112'yi Şimdi Ara
              </a>
            </div>

            {/* Kades */}
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-pink-500/10 text-pink-400 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide mb-2 uppercase">Mobil Uygulama</span>
                <h3 className="font-bold text-lg text-white">KADES</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Emniyet Genel Müdürlüğü Kadın Acil Destek Uygulaması. Şiddet anında tek dokunuşla polisin size ulaşmasını sağlar.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a href="https://play.google.com/store/apps/details?id=tr.gov.egm.kades" target="_blank" rel="noopener noreferrer" className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-[10px] py-1.5 px-1 rounded-lg text-center transition-colors flex items-center justify-center gap-0.5">
                  Play Store <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <a href="https://apps.apple.com/tr/app/kades/id1360307507" target="_blank" rel="noopener noreferrer" className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-[10px] py-1.5 px-1 rounded-lg text-center transition-colors flex items-center justify-center gap-0.5">
                  App Store <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            {/* Baro */}
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide mb-2 uppercase">Hukuki Destek</span>
                <h3 className="font-bold text-lg text-white">Baro Adli Yardım</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">İstanbul Barosu Kadın Hakları Merkezi. Geliri yetersiz kadınlar için adli / hukuki davalarda ücretsiz avukat desteği sağlar.</p>
              </div>
              <a href="tel:02122927725" className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs py-2 px-4 rounded-xl text-center transition-colors block mt-3" id="call-baro">
                0212 292 7725
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="bg-slate-950 text-slate-500 py-6 px-4 md:px-8 border-t border-slate-900 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 İstanbul Kadın Dayanışma Haritası. Şiddete sıfır tolerans ile güvenli gelecek.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400">Veri Tabanı: Kadın Korunma Platformu</span>
            <span>|</span>
            <span className="hover:text-slate-400">Açık Kaynak Kodlu Dayanışma Projesi</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
