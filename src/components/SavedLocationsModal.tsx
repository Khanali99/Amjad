import React, { useEffect, useState } from 'react';
import {
  X,
  MapPin,
  Trash2,
  Bookmark,
  ExternalLink,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { GeoLocation, UnitSystem, Language } from '../types/weather';
import { POPULAR_CITIES } from '../services/weatherApi';

interface SavedLocationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: GeoLocation[];
  onSelect: (loc: GeoLocation) => void;
  onRemove: (loc: GeoLocation) => void;
  onAdd: (loc: GeoLocation) => void;
  unit: UnitSystem;
  language: Language;
}

export const SavedLocationsModal: React.FC<SavedLocationsModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelect,
  onRemove,
  onAdd,
  unit,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden divide-y divide-white/5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bookmark className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white tracking-tight">
                {language === 'ur'
                  ? 'محفوظ شدہ مقامات'
                  : language === 'ur_roman'
                  ? 'Saved Shehar aur Maqamat'
                  : 'Saved Locations'}
              </h3>
              <p className="text-xs text-slate-400">
                Quick access to your pinned global destinations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Favorite Cities List */}
        <div className="py-4 max-h-72 overflow-y-auto space-y-2">
          {favorites.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Bookmark className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p>No saved locations yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Click the bookmark icon in the header or choose from suggestions below.
              </p>
            </div>
          ) : (
            favorites.map((loc) => (
              <div
                key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all group"
              >
                <button
                  onClick={() => {
                    onSelect(loc);
                    onClose();
                  }}
                  className="flex-1 flex items-center gap-3 text-left"
                >
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-sky-300 transition-colors">
                      {loc.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRemove(loc)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Remove location"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Suggested Quick Add Cities */}
        <div className="pt-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            Recommended Cities
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_CITIES.map((city) => {
              const isFav = favorites.some((f) => f.name.toLowerCase() === city.name.toLowerCase());
              return (
                <button
                  key={city.id}
                  disabled={isFav}
                  onClick={() => onAdd(city)}
                  className={`px-2.5 py-1 text-xs rounded-lg border flex items-center gap-1 transition-colors ${
                    isFav
                      ? 'bg-white/5 border-white/5 text-slate-500 cursor-default'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-white'
                  }`}
                >
                  <span>{city.name}</span>
                  {!isFav && <Plus className="w-3 h-3 text-sky-400" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
