export interface LostItem {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  country: string;
  description: string;
  rewardAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  reportedAt: string;
  sightings: Sighting[];
  comments: Comment[];
  reactions: Reactions;
}

export interface Sighting {
  id: string;
  reportedBy: string;
  reportedByEmail: string;
  location: string;
  notes: string;
  reportedAt: string;
}

export interface Comment {
  id: string;
  author: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}

export interface Reactions {
  heart: number;
  pray: number;
  support: number;
}
