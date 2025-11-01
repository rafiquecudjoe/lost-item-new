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
}

export interface Sighting {
  id: string;
  reportedBy: string;
  reportedByEmail: string;
  location: string;
  notes: string;
  reportedAt: string;
}
