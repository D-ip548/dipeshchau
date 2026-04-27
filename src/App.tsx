import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DiscoverView } from './views/DiscoverView';
import { MyTreksView } from './views/MyTreksView';
import { CreateTrekView } from './views/CreateTrekView';
import { AuthView } from './views/AuthView';
import { Trek, ViewState } from './types';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  const [view, setView] = useState<ViewState | 'auth'>('discover');
  const [treks, setTreks] = useState<Trek[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser && (view === 'create' || view === 'my-treks')) {
        setView('discover');
      }
    });

    return () => unsubscribe();
  }, [view]);

  // Firestore listener for Treks
  useEffect(() => {
    const treksQuery = query(collection(db, 'treks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(treksQuery, (snapshot) => {
      const fetchedTreks: Trek[] = [];
      snapshot.forEach(doc => {
        fetchedTreks.push({ id: doc.id, ...doc.data() } as Trek);
      });
      setTreks(fetchedTreks);
    }, (error) => {
      console.error("Error fetching treks", error);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleJoin = async (id: string) => {
    if (!user) {
      setView('auth');
      return;
    }

    const trekRef = doc(db, 'treks', id);
    const trek = treks.find(t => t.id === id);
    if (!trek) return;

    try {
      const participantCount = trek.participants?.length || 0;
      const isCurrentlyJoined = trek.participants?.some(p => p.uid === user.uid) || false;

      if (isCurrentlyJoined) {
        try {
          await updateDoc(trekRef, {
            participants: arrayRemove({ uid: user.uid, name: user.displayName || 'Anonymous' }),
            updatedAt: serverTimestamp()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `treks/${id}`);
        }
      } else {
        if (participantCount < trek.maxParticipants) {
          try {
            await updateDoc(trekRef, {
              participants: arrayUnion({ uid: user.uid, name: user.displayName || 'Anonymous' }),
              updatedAt: serverTimestamp()
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, `treks/${id}`);
          }
        }
      }
    } catch (err: any) {
      console.error("Error joining/leaving trek", err);
      // If it's our wrapped error, let the alert show the details
      const displayMessage = err instanceof Error ? err.message : String(err);
      alert("Error joining expedition: " + displayMessage);
    }
  };

  const handleCreateTrek = async (trek: Trek) => {
    try {
      const newTrekRef = doc(collection(db, 'treks'));
      const { id, ...trekDataWithoutId } = trek;
      await setDoc(newTrekRef, {
        ...trekDataWithoutId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setView('discover');
    } catch (err) {
      console.error("Error creating trek", err);
      handleFirestoreError(err, OperationType.WRITE, 'treks');
    }
  };

  const handleCreateClick = () => {
    if (user) {
      setView('create');
    } else {
      setView('auth');
    }
  };

  const handleMyTreksClick = () => {
    if (user) {
      setView('my-treks');
    } else {
      setView('auth');
    }
  };

  const handleDeleteTrek = async (trekId: string) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to decommission this mission? This action is irreversible.")) return;

    try {
      await deleteDoc(doc(db, 'treks', trekId));
      setView('discover');
    } catch (err) {
      console.error("Delete failed:", err);
      handleFirestoreError(err, OperationType.DELETE, `treks/${trekId}`);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setView('discover');
    } catch (err) {
      console.error("Error signing out", err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0b0d] text-white flex items-center justify-center">Loading...</div>;
  }

  // Determine user's joined treks
  const myTreks = user ? treks.filter(t => t.participants?.some(p => p.uid === user.uid)).map(t => t.id) : [];

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-[#e0e0e0] font-sans flex flex-col font-light selection:bg-[#c5a059] selection:text-black">
      <Navbar 
        currentView={view as ViewState} 
        onChangeView={(newView) => {
          if ((newView === 'create' || newView === 'my-treks') && !user) {
            setView('auth');
          } else {
            setView(newView);
          }
        }} 
        currentUser={user?.displayName}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 flex flex-col px-6 md:px-10 py-12 max-w-7xl mx-auto w-full">
        {view === 'discover' && (
          <DiscoverView 
            treks={treks} 
            myTreks={myTreks} 
            onToggleJoin={handleToggleJoin} 
            onCreateClick={handleCreateClick}
            onMyTreksClick={handleMyTreksClick}
            onDeleteTrek={handleDeleteTrek}
            currentUserId={user?.uid}
          />
        )}
        
        {view === 'my-treks' && (
          <MyTreksView 
            treks={treks} 
            myTreks={myTreks} 
            onToggleJoin={handleToggleJoin}
            onDiscoverClick={() => setView('discover')}
            onDeleteTrek={handleDeleteTrek}
            currentUserId={user?.uid}
          />
        )}
        
        {view === 'create' && user && (
          <CreateTrekView 
            onCreate={handleCreateTrek} 
            currentUser={user.displayName || 'Anonymous'}
            currentUserId={user.uid}
          />
        )}

        {view === 'auth' && (
          <AuthView />
        )}
      </main>

      {/* Bottom Bar Info from design */}
      <footer className="px-6 md:px-10 py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/20 tracking-widest uppercase gap-4 text-center md:text-left">
        <div>{treks.length} Active Groups Worldwide</div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <span>Safety Protocols</span>
          <span>Gear Checklists</span>
          <span>Verified Guides</span>
        </div>
        <div className="text-[#c5a059]">Curated by Vanguard</div>
      </footer>
    </div>
  );
}
