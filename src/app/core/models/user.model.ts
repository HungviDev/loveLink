export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  partnerId?: string;
  partnerName?: string;
  partnerAvatarUrl?: string;
  relationshipStartDate?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
