import React from 'react';
import { Trek } from '../types';

import { Trash2 } from 'lucide-react';

interface TrekDetailsModalProps {
  trek: Trek;
  isOpen: boolean;
  onClose: () => void;
  isJoined: boolean;
  onToggleJoin: (id: string) => void;
  onDeleteTrek: (id: string) => void;
  currentUserId?: string;
}

export const TrekDetailsModal: React.FC<TrekDetailsModalProps> = ({ trek, isOpen, onClose, isJoined, onToggleJoin, onDeleteTrek, currentUserId }) => {
  if (!isOpen) return null;

  const participantCount = trek.participants?.length || 0;
  const isFull = participantCount >= trek.maxParticipants;
  const isHost = currentUserId === trek.hostId;

  const handleDelete = () => {
    onDeleteTrek(trek.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-[#0a0b0d]/90 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-vanguard-card border border-white/10 flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          &times;
        </button>

        {/* Left Column: Image & Details */}
        <div className="w-full md:w-1/2 flex flex-col relative bg-[#1c1f26] overflow-y-auto">
          <div className="h-64 relative shrink-0">
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              style={{ backgroundImage: `url(${trek.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f26] to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-8 right-8">
              <span className="text-[10px] tracking-widest uppercase text-vanguard-accent font-bold">
                {trek.location} • {new Date(trek.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </span>
              <h2 className="text-3xl font-serif italic text-white mt-2 leading-tight">{trek.title}</h2>
            </div>
          </div>

          <div className="p-8 pt-4 flex-1">
            <p className="text-white/60 text-sm leading-relaxed mb-8 font-light">
              {trek.description}
            </p>

            <div className="grid grid-cols-2 gap-6 text-[10px] uppercase tracking-widest text-white/40 mb-8 border-t border-white/10 pt-8">
              <div className="flex flex-col gap-1">
                <span className="text-vanguard-accent font-bold">Duration</span>
                <span className="text-white">{trek.duration}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-vanguard-accent font-bold">Difficulty</span>
                <span className="text-white">{trek.difficulty}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-vanguard-accent font-bold">Host</span>
                <span className="text-white">{trek.hostName}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-vanguard-accent font-bold">Spots</span>
                <span className="text-white">{trek.maxParticipants - participantCount} Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Roster & Communication */}
        <div className="w-full md:w-1/2 flex flex-col border-t md:border-t-0 md:border-l border-white/10 bg-vanguard-card overflow-y-auto p-8">
          <h3 className="text-xl font-serif italic text-white mb-6 flex justify-between items-end border-b border-white/10 pb-4">
            Group Roster 
            <span className="not-italic font-sans text-[10px] uppercase tracking-widest text-white/40">
              {participantCount} / {trek.maxParticipants} Members
            </span>
          </h3>

          <div className="flex flex-col gap-3 mb-8">
            {trek.participants?.map((p, i) => (
              <div key={p.uid + i} className="flex items-center gap-4 bg-[#0a0b0d]/50 p-3 border border-white/5 group hover:border-vanguard-accent/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#1c1f26] border border-white/10 flex items-center justify-center text-[10px] text-white/50">
                  {p.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white font-medium flex items-center gap-2">
                    {p.name}
                    {p.uid === trek.hostId && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest bg-vanguard-accent text-black font-bold">Host</span>
                    )}
                  </div>
                  <div className="text-[10px] text-white/40">Member</div>
                </div>
              </div>
            ))}
            
            {participantCount === 0 && (
              <div className="text-center py-6 text-white/40 text-xs italic">
                No pathfinders have joined yet.
              </div>
            )}
          </div>

          <div className="mt-auto border-t border-white/10 pt-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h4 className="text-[10px] uppercase tracking-widest text-vanguard-accent font-bold">Expedition Management</h4>
                {isHost && <p className="text-[8px] text-white/40 uppercase tracking-widest mt-1">Authorized Commander View</p>}
              </div>
              <div className="flex gap-4">
                {isHost && (
                  <button 
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-900/20 border border-red-500/50 text-red-500 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                  >
                    <Trash2 size={12} />
                    Decommission
                  </button>
                )}
                <button 
                  onClick={() => onToggleJoin(trek.id)}
                  disabled={isFull && !isJoined}
                  className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors ${
                    isJoined 
                      ? 'bg-transparent border border-white/20 text-white hover:bg-white/5' 
                      : isFull 
                        ? 'bg-white/5 text-white/20 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-vanguard-accent'
                  }`}
                >
                  {isJoined ? 'Resign Mission' : isFull ? 'Group is Full' : 'Enlist Now'}
                </button>
              </div>
            </div>
            {isJoined ? (
              <div className="flex flex-col gap-3">
                <textarea 
                  rows={2} 
                  placeholder="Broadcast a message to the group..." 
                  className="w-full bg-[#0a0b0d] border border-white/10 text-white text-xs p-3 focus:outline-none focus:border-vanguard-accent transition-colors resize-none placeholder:text-white/20"
                />
                <button className="self-end px-6 py-2 bg-white hover:bg-gray-200 text-black text-[10px] uppercase tracking-[0.2em] font-bold transition-colors">
                  Send Dispatch
                </button>
              </div>
            ) : (
              <div className="text-center p-6 border border-dashed border-white/10">
                <p className="text-white/40 text-xs mb-3">You must join the expedition to access comms and members.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
