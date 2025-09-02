export interface LoyaltyBadge {
  id?: number;
  user: User;
  points: number;
  badgeLevel: BadgeLevel;
  achievements: string;
  lastUpdated: string;
}

export interface User {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  // other user properties
}

export enum BadgeLevel {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

export interface LevelBenefits {
  level: BadgeLevel;
  name: string;
  color: string;
  icon: string;
  pointsRequired: number;
  benefits: string[];
  nextLevel?: BadgeLevel;
  pointsToNextLevel?: number;
}
