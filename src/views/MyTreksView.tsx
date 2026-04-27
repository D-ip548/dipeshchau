import { useState } from 'react';
import { Trek } from '../types';
import { TrekCard } from '../components/TrekCard';
import { TrekDetailsModal } from '../components/TrekDetailsModal';

interface MyTreksViewProps {
  treks: Trek[];
  myTreks: string[];
  onToggleJoin: (id: string) => void;
  onDiscoverClick: () => void;
  onDeleteTrek: (id: string) => void;
  currentUserId?: string;
}

export function MyTreksView({ treks, myTreks, onToggleJoin, onDiscoverClick, onDeleteTrek, currentUserId }: MyTreksViewProps) {
  const activeTreks = treks.filter(t => myTreks.includes(t.id));
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null);

  return (
    <div className="flex flex-col flex-1 pb-16">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-4">Your Expeditions</h2>
        <p className="text-white/40 text-sm">Review your upcoming summits and joined groups.</p>
      </div>

      {activeTreks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center border border-white/5 bg-[#16181d] p-16">
          <div className="text-white/20 font-serif text-6xl italic mb-6">?</div>
          <h3 className="text-xl font-serif italic text-white mb-2">No active journeys</h3>
          <p className="text-white/40 text-sm mb-8 max-w-sm">
            You haven't joined any trekking groups yet. The mountains are calling.
          </p>
          <button 
            onClick={onDiscoverClick}
            className="px-8 py-3 bg-vanguard-accent text-black text-[10px] uppercase tracking-[0.2em] font-bold"
          >
            Discover Treks
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTreks.map((trek, i) => (
            <TrekCard 
              key={trek.id} 
              trek={trek} 
              index={i} 
              isJoined={true}
              onToggleJoin={onToggleJoin}
              onViewDetails={() => setSelectedTrek(trek)}
            />
          ))}
        </div>
      )}

      {selectedTrek && (
        <TrekDetailsModal
          trek={selectedTrek}
          isOpen={!!selectedTrek}
          onClose={() => setSelectedTrek(null)}
          isJoined={true}
          onToggleJoin={onToggleJoin}
          onDeleteTrek={onDeleteTrek}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}
