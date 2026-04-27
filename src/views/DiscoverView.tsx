import { useState } from 'react';
import { Trek, Difficulty } from '../types';
import { TrekCard } from '../components/TrekCard';
import { TrekDetailsModal } from '../components/TrekDetailsModal';

interface DiscoverViewProps {
  treks: Trek[];
  myTreks: string[];
  onToggleJoin: (id: string) => void;
  onCreateClick: () => void;
  onMyTreksClick: () => void;
  onDeleteTrek: (id: string) => void;
  currentUserId?: string;
}

export function DiscoverView({ treks, myTreks, onToggleJoin, onCreateClick, onMyTreksClick, onDeleteTrek, currentUserId }: DiscoverViewProps) {
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<'All' | 'Recommended' | Difficulty>('Recommended');

  // Recommendation Logic
  const joinedTreks = treks.filter(t => myTreks.includes(t.id));
  const joinedDifficulties = Array.from(new Set(joinedTreks.map(t => t.difficulty)));

  // The user only wants to see treks related to what they've joined
  const recommendedDifficulties: Difficulty[] = joinedDifficulties;

  // If no recommendations (new user), show all to help them find their first trek
  const finalFilter = (filterDifficulty === 'Recommended' && recommendedDifficulties.length === 0) 
    ? 'All' 
    : filterDifficulty;

  const filteredTreks = finalFilter === 'All' 
    ? treks 
    : finalFilter === 'Recommended'
      ? treks.filter(t => recommendedDifficulties.includes(t.difficulty))
      : treks.filter(t => t.difficulty === finalFilter);

  return (
    <div className="flex flex-col flex-1 pb-16">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-8">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-7xl font-serif italic text-white leading-tight mb-4">
            The Wild is <br/>
            <span className="not-italic font-sans font-light tracking-tight">Better Shared.</span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm">
            {recommendedDifficulties.length > 0 && filterDifficulty === 'Recommended' 
              ? "Tailored expeditions based on your pathfinder profile. Higher summits await."
              : "Connect with seasoned pathfinders and elite trekking groups. From the Himalayas to the Alps, your next collective summit begins here."}
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-6">
          <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/10">
            <button className="px-6 py-2 rounded-full bg-vanguard-accent text-black text-xs font-bold uppercase tracking-wider">
              Find Groups
            </button>
            <button 
              onClick={onMyTreksClick}
              className="px-6 py-2 rounded-full text-white/60 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              My Events
            </button>
          </div>
          <div className="w-full md:w-64 h-px bg-white/20 relative hidden md:block">
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-vanguard-accent"></div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 mb-8 overflow-x-auto border-b border-white/10">
        {['Recommended', 'All', 'Easy', 'Moderate', 'Hard', 'Expert'].map((diff) => {
          // Hide Recommended if no data, or just keep it and show empty
          const isActive = filterDifficulty === diff;
          return (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff as any)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap -mb-px border-b-2 ${
                isActive 
                  ? 'text-vanguard-accent border-vanguard-accent' 
                  : 'text-white/40 hover:text-white border-transparent'
              }`}
            >
              {diff}
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
        {filteredTreks.length > 0 ? (
          filteredTreks.map((trek, i) => (
            <TrekCard 
              key={trek.id} 
              trek={trek} 
              index={i} 
              isJoined={myTreks.includes(trek.id)}
              onToggleJoin={onToggleJoin}
              onViewDetails={() => setSelectedTrek(trek)}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10">
             <p className="text-white/20 font-serif italic text-xl">No expeditions matched this profile.</p>
             <button 
              onClick={() => setFilterDifficulty('All')}
              className="mt-4 text-vanguard-accent text-[10px] uppercase tracking-widest hover:underline"
             >
                View all collections
             </button>
          </div>
        )}
        
        {/* Create Action Card */}
        <div 
          onClick={onCreateClick}
          className="group relative bg-transparent border border-dashed border-white/20 hover:border-vanguard-accent/50 transition-colors overflow-hidden flex flex-col items-center justify-center text-center p-8 cursor-pointer h-full min-h-[320px]"
        >
          <div className="w-16 h-16 rounded-full border border-white/10 group-hover:border-vanguard-accent/50 transition-colors flex items-center justify-center mb-6">
            <span className="text-2xl text-vanguard-accent font-light">+</span>
          </div>
          <h3 className="text-xl font-serif italic text-white mb-2">Lead the Way</h3>
          <p className="text-white/30 text-xs mb-6 max-w-[200px] leading-relaxed">
            Can't find the right group? <br/>
            Organize your own expedition and find your tribe.
          </p>
          <button className="px-8 py-3 bg-white hover:bg-white/90 text-black text-[10px] uppercase tracking-[0.2em] font-bold transition-colors">
            Create Event
          </button>
        </div>
      </div>

      {selectedTrek && (
        <TrekDetailsModal
          trek={selectedTrek}
          isOpen={!!selectedTrek}
          onClose={() => setSelectedTrek(null)}
          isJoined={myTreks.includes(selectedTrek.id)}
          onToggleJoin={onToggleJoin}
          onDeleteTrek={onDeleteTrek}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}
