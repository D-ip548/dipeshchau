export type Difficulty = 'Easy' | 'Moderate' | 'Hard' | 'Expert';

export interface Trek {
  id: string;
  title: string;
  location: string;
  date: string;
  duration: string;
  difficulty: Difficulty;
  maxParticipants: number;
  participants: { uid: string, name: string }[];
  image: string;
  hostName: string;
  hostId: string;
  description: string;
  createdAt?: any;
  updatedAt?: any;
}

export type ViewState = 'discover' | 'create' | 'my-treks';
