import React from 'react';
import { Trek } from '../types';

interface TrekCardProps {
  trek: Trek;
  index: number;
  isJoined?: boolean;
  onToggleJoin?: (id: string) => void;
  onViewDetails?: () => void;
}

export const TrekCard: React.FC<TrekCardProps> = ({ trek, index, isJoined, onToggleJoin, onViewDetails }) => {
  const participantCount = trek.participants?.length || 0;
  const isFull = participantCount >= trek.maxParticipants;
  const displayNumber = (index + 1).toString().padStart(2, '0');
  
  // Generate date string like "April 24"
  const dateObj = new Date(trek.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const [country] = trek.location.split(','); // Gets standard location form like "Italy" from "Rome, Italy" (assuming location string is simple for now, can fallback)

  return (
    <div 
      onClick={onViewDetails}
      className="group relative bg-vanguard-card border border-white/5 overflow-hidden flex flex-col min-h-[320px] cursor-pointer hover:border-white/10 transition-colors"
    >
      <div className="h-40 bg-[#1c1f26] flex items-center justify-center relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-700 grayscale"
          style={{ backgroundImage: `url(${trek.image})` }}
        />
        <div className="text-white/10 font-serif text-6xl italic relative z-10 group-hover:scale-110 transition-transform duration-700">{displayNumber}</div>
        
        {isJoined && (
          <div className="absolute top-4 right-4 bg-vanguard-accent text-black text-[9px] uppercase tracking-widest px-2 py-1 font-bold z-10">
            Joined
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col relative bg-vanguard-card">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] tracking-widest uppercase text-vanguard-accent font-bold">
            {country || trek.location} • {formattedDate}
          </span>
          <span className={`text-[10px] uppercase tracking-tighter ${isFull && !isJoined ? 'text-red-400' : 'text-white/40'}`}>
            {participantCount}/{trek.maxParticipants} Joined
          </span>
        </div>
        
        <h3 className="text-xl font-serif italic text-white mb-2">{trek.title}</h3>
        <p className="text-white/40 text-xs mb-8 flex-1 line-clamp-3 leading-relaxed">
          {trek.description}
        </p>
        
        <div className="flex justify-between items-center mt-auto">
          {onToggleJoin && (
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleJoin(trek.id); }}
              disabled={isFull && !isJoined}
              className={`text-[11px] uppercase tracking-widest font-bold border-b pb-1 transition-colors ${
                isJoined 
                  ? 'text-white/60 border-white/20 hover:text-white' 
                  : isFull 
                    ? 'text-white/20 border-white/10 cursor-not-allowed'
                    : 'text-vanguard-accent border-vanguard-accent hover:text-white hover:border-white'
              }`}
            >
              {isJoined ? 'Leave Group' : isFull ? 'Group Full' : 'Join Group'}
            </button>
          )}

          <div className="flex -space-x-2">
            {trek.participants?.slice(0, 3).map((p, i) => (
              <div 
                key={i} 
                className="w-6 h-6 rounded-full bg-[#333] border border-black flex items-center justify-center overflow-hidden"
                title={p.name}
              >
                <div className="text-[8px] text-white/50">{p.name?.charAt(0).toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
