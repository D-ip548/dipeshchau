import React, { useState } from 'react';
import { Difficulty, Trek } from '../types';

interface CreateTrekViewProps {
  onCreate: (trek: Trek) => void;
  currentUser: string;
  currentUserId: string;
}

export function CreateTrekView({ onCreate, currentUser, currentUserId }: CreateTrekViewProps) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Moderate');
  const [maxParticipants, setMaxParticipants] = useState('10');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTrek: Trek = {
      id: Math.random().toString(36).substring(7),
      title,
      location,
      date,
      duration,
      difficulty,
      maxParticipants: parseInt(maxParticipants, 10),
      participants: [{ uid: currentUserId, name: currentUser }],
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      hostName: currentUser,
      hostId: currentUserId,
      description
    };

    onCreate(newTrek);
  };

  return (
    <div className="flex flex-col flex-1 pb-16 items-center">
      <div className="w-full max-w-2xl">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-4">Forge a Path</h2>
          <p className="text-white/40 text-sm">Lead the next expedition. Details become the blueprint of your journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-vanguard-card border border-white/5 p-8 md:p-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-vanguard-accent font-bold">Expedition Title</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="bg-[#0a0b0d] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-vanguard-accent transition-colors font-serif italic text-lg"
              placeholder="e.g. The Dolomites Traverse"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-vanguard-accent font-bold">Location</label>
              <input 
                required
                type="text" 
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="bg-[#0a0b0d] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-vanguard-accent transition-colors text-sm"
                placeholder="e.g. Italy"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-vanguard-accent font-bold">Start Date</label>
              <input 
                required
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="bg-[#0a0b0d] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-vanguard-accent transition-colors text-sm [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-vanguard-accent font-bold">Duration</label>
              <input 
                required
                type="text" 
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="bg-[#0a0b0d] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-vanguard-accent transition-colors text-sm"
                placeholder="e.g. 7 Days"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-vanguard-accent font-bold">Difficulty</label>
              <select 
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as Difficulty)}
                className="bg-[#0a0b0d] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-vanguard-accent transition-colors text-sm appearance-none"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-vanguard-accent font-bold">Max Members</label>
              <input 
                required
                type="number" 
                min="2"
                max="50"
                value={maxParticipants}
                onChange={e => setMaxParticipants(e.target.value)}
                className="bg-[#0a0b0d] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-vanguard-accent transition-colors text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-vanguard-accent font-bold">Field Notes (Description)</label>
            <textarea 
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="bg-[#0a0b0d] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-vanguard-accent transition-colors text-sm resize-none"
              placeholder="Describe the altitude, cultural immersions, and gear required..."
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button 
              type="submit"
              className="px-8 py-4 bg-white hover:bg-gray-200 text-black text-[10px] uppercase tracking-[0.2em] font-bold transition-colors w-full md:w-auto text-center"
            >
              Establish Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
