import { ViewState } from '../types';
import { LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState | 'auth') => void;
  currentUser?: string | null;
  onLogout: () => void;
}

export function Navbar({ currentView, onChangeView, currentUser, onLogout }: NavbarProps) {
  return (
    <nav className="flex justify-between items-center px-6 md:px-10 py-8 border-b border-white/10 bg-vanguard-bg relative z-40">
      <div 
        className="text-xl tracking-[0.2em] font-light text-vanguard-accent cursor-pointer flex items-center"
        onClick={() => onChangeView('discover')}
      >
        VANGUARD <span className="text-white/40 mx-2">//</span> TREKS
      </div>
      
      <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-widest font-medium">
        <button 
          onClick={() => onChangeView('discover')}
          className={`transition-colors ${currentView === 'discover' ? 'text-white' : 'text-white/60 hover:text-vanguard-accent'}`}
        >
          Expeditions
        </button>
        <button 
          onClick={() => onChangeView('my-treks')}
          className={`transition-colors ${currentView === 'my-treks' ? 'text-white' : 'text-white/60 hover:text-vanguard-accent'}`}
        >
          My Events
        </button>
        <button 
          onClick={() => onChangeView('create')}
          className={`transition-colors ${currentView === 'create' ? 'text-white' : 'text-white/60 hover:text-vanguard-accent'}`}
        >
          Create Event
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        {currentUser && (
          <button 
            onClick={onLogout}
            className="p-2 text-white/40 hover:text-vanguard-accent transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        )}
        <div 
          onClick={() => {
            if (!currentUser) {
              onChangeView('auth');
            }
          }}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[10px] cursor-pointer hover:bg-white/5 hover:border-vanguard-accent transition-colors" 
          title={currentUser || 'Sign In'}
        >
          {currentUser ? currentUser.substring(0, 2).toUpperCase() : '?'}
        </div>
      </div>
    </nav>
  );
}
