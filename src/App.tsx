import { useState, useEffect } from 'react';
import {
  Palmtree,
  Search,
  Calendar,
  MapPin,
  Users,
  Star,
  ShieldCheck,
  Building,
  Check,
} from 'lucide-react';
import type { Accommodation, SearchFilter } from './types';
import { getAccommodations } from './services/vacationService';
import { isFirebaseConfigured } from './services/firebase';

export default function App() {
  const [properties, setProperties] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SearchFilter>({
    destination: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    propertyType: 'all',
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async (searchFilter?: SearchFilter) => {
    setLoading(true);
    try {
      const data = await getAccommodations(searchFilter);
      setProperties(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProperties(filter);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palmtree className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              VacationFinder
            </span>
          </div>

          {/* Backend Status indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isFirebaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="text-slate-600">
              Firebase:{' '}
              <strong className="text-slate-800">
                {isFirebaseConfigured ? 'Connected' : 'Mock Mode (.env needed)'}
              </strong>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Bar Container */}
        <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">Find your next stay</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Where are you going?
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Greece, Switzerland"
                  value={filter.destination}
                  onChange={(e) => setFilter({ ...filter, destination: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Dates</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  value={filter.checkInDate}
                  onChange={(e) => setFilter({ ...filter, checkInDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Guests</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={filter.guests}
                  onChange={(e) => setFilter({ ...filter, guests: Number(e.target.value) })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6+ Guests</option>
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md flex items-center justify-center gap-2 transition"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </form>
        </section>

        {/* Results List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">
              Available Stays ({properties.length})
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Building className="w-3.5 h-3.5" />
              <span>Types: Hotel, Resort, Villa, Cabin</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No stays matched your search. Try adjusting destination.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="uppercase font-semibold tracking-wider text-blue-600">
                          {item.type}
                        </span>
                        <div className="flex items-center gap-1 font-medium text-slate-700">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{item.rating}</span>
                          <span className="text-slate-400">({item.reviewsCount})</span>
                        </div>
                      </div>

                      <h4 className="font-semibold text-slate-900 text-base line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.city}, {item.country}
                      </p>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.amenities.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                          >
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400">from </span>
                        <span className="font-bold text-slate-900">${item.pricePerNight}</span>
                        <span className="text-xs text-slate-500"> / night</span>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-medium px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md transition"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Developer Setup Info Box */}
        <footer className="mt-12 p-4 rounded-lg bg-blue-50/50 border border-blue-100 text-xs text-blue-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Project Foundations Ready</p>
            <p className="text-blue-800 mt-0.5">
              Stack configured: <strong>React 19</strong>, <strong>TypeScript</strong>,{' '}
              <strong>Vite 8</strong>, <strong>Tailwind CSS v4</strong>,{' '}
              <strong>Lucide React</strong>, and <strong>Firebase SDK</strong>. To connect your live
              Firebase database, fill in the values in <code className="bg-blue-100 px-1 py-0.5 rounded">.env</code>.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
