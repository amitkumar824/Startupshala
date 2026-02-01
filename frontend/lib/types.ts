export interface Deal {
  id: string;
  title: string;
  partner: string;
  description: string;
  fullDescription: string;
  category: 'cloud' | 'marketing' | 'analytics' | 'productivity' | 'design' | 'development';
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  isLocked: boolean;
  requirements: string[];
  features: string[];
  logoUrl: string;
  validUntil: string;
  claimCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  company?: string;
  role?: string;
}

export interface Claim {
  id: string;
  userId: string;
  dealId: string;
  status: 'pending' | 'approved' | 'rejected';
  claimedAt: string;
  updatedAt: string;
}
