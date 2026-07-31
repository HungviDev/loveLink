export interface Couple {
  id: string;
  user1Id: string;
  user1Name: string;
  user1Avatar?: string;
  user2Id: string;
  user2Name: string;
  user2Avatar?: string;
  anniversaryDate: string;
  coupleName: string;
  coverImageUrl?: string;
  totalMemories: number;
  totalPhotos: number;
  status: 'active' | 'pending';
}
