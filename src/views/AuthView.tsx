import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

export function AuthView() {
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      setError('');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in was cancelled. Please try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        setError(`Unauthorized Domain: "${currentDomain}" is not in your Firebase Authorized domains list. Please add it in Firebase Console > Authentication > Settings > Authorized domains.`);
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 pb-16 items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md text-center">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-4">Join Vanguard</h2>
          <p className="text-white/40 text-sm">
            Sign in to forge your path and lead expeditions.
          </p>
        </div>

        <div className="bg-vanguard-card border border-white/5 p-8 flex flex-col gap-6 items-center">
          {error && <div className="text-red-400 text-xs">{error}</div>}
          
          <button 
            onClick={handleSignIn}
            className="w-full py-4 bg-white hover:bg-gray-200 text-black text-[10px] uppercase tracking-[0.2em] font-bold transition-colors flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
