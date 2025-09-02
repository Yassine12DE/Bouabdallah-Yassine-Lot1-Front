import { Component } from '@angular/core';
import { LoyaltyBadgeService } from '../../services/loyalty-badge.service';
import {
  LoyaltyBadge,
  LevelBenefits,
  BadgeLevel,
} from '../interfaces/loyalty-badge.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loyalty-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loyalty-badge.component.html',
  styleUrl: './loyalty-badge.component.css',
})
export class LoyaltyBadgeComponent {
  loyaltyBadge: LoyaltyBadge | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  // In a real app, you would get this from authentication service

  // Level benefits configuration
  levelBenefits: LevelBenefits[] = [
    {
      level: BadgeLevel.BRONZE,
      name: 'Bronze Member',
      color: 'bronze',
      icon: 'ti ti-award',
      pointsRequired: 0,
      benefits: [
        'Early access to event notifications',
        'Basic customer support',
        '5% discount on selected events',
        'Monthly newsletter',
      ],
    },
    {
      level: BadgeLevel.SILVER,
      name: 'Silver Member',
      color: 'silver',
      icon: 'ti ti-star',
      pointsRequired: 200,
      benefits: [
        'All Bronze benefits',
        '10% discount on all events',
        'Priority seating',
        'Dedicated support line',
        'Exclusive silver-only events',
      ],
    },
    {
      level: BadgeLevel.GOLD,
      name: 'Gold Member',
      color: 'gold',
      icon: 'ti ti-crown',
      pointsRequired: 500,
      benefits: [
        'All Silver benefits',
        '15% discount on all events',
        'VIP event access',
        'Personal event coordinator',
        'Complimentary drinks at events',
        'Early ticket purchasing',
      ],
    },
    {
      level: BadgeLevel.PLATINUM,
      name: 'Platinum Elite',
      color: 'platinum',
      icon: 'ti ti-diamond',
      pointsRequired: 1000,
      benefits: [
        'All Gold benefits',
        '20% discount on all events',
        'Backstage access',
        'Meet & greet with performers',
        'Complimentary premium seating',
        'Exclusive platinum lounge access',
        'Personal concierge service',
      ],
    },
  ];

  constructor(private loyaltyBadgeService: LoyaltyBadgeService) {}

  ngOnInit(): void {
    this.loadLoyaltyBadge();
  }

  loadLoyaltyBadge(): void {
    this.isLoading = true;
    this.loyaltyBadgeService.getLoyaltyBadgeByUserId().subscribe({
      next: (badge: LoyaltyBadge | null) => {
        this.loyaltyBadge = badge;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load loyalty badge information';
        this.isLoading = false;
        console.error('Error loading loyalty badge:', error);
      },
    });
  }

  getCurrentLevelBenefits(): LevelBenefits | undefined {
    if (!this.loyaltyBadge) return undefined;
    return this.levelBenefits.find(
      (level) => level.level === this.loyaltyBadge!.badgeLevel
    );
  }

  getNextLevel(): LevelBenefits | undefined {
    if (!this.loyaltyBadge) return undefined;

    const currentIndex = this.levelBenefits.findIndex(
      (level) => level.level === this.loyaltyBadge!.badgeLevel
    );
    if (currentIndex < this.levelBenefits.length - 1) {
      return this.levelBenefits[currentIndex + 1];
    }
    return undefined;
  }

  getProgressPercentage(): number {
    if (!this.loyaltyBadge || !this.getNextLevel()) return 100;

    const currentLevel = this.getCurrentLevelBenefits();
    const nextLevel = this.getNextLevel();

    if (!currentLevel || !nextLevel) return 100;

    const pointsInCurrentLevel =
      this.loyaltyBadge.points - currentLevel.pointsRequired;
    const pointsNeededForNextLevel =
      nextLevel.pointsRequired - currentLevel.pointsRequired;

    return Math.min(
      100,
      Math.max(0, (pointsInCurrentLevel / pointsNeededForNextLevel) * 100)
    );
  }

  getPointsToNextLevel(): number {
    if (!this.loyaltyBadge || !this.getNextLevel()) return 0;

    const nextLevel = this.getNextLevel()!;
    return Math.max(0, nextLevel.pointsRequired - this.loyaltyBadge.points);
  }

  getLevelColorClass(level: BadgeLevel): string {
    switch (level) {
      case BadgeLevel.BRONZE:
        return 'bg-bronze';
      case BadgeLevel.SILVER:
        return 'bg-silver';
      case BadgeLevel.GOLD:
        return 'bg-gold';
      case BadgeLevel.PLATINUM:
        return 'bg-platinum';
      default:
        return 'bg-secondary';
    }
  }

  getLevelTextColorClass(level: BadgeLevel): string {
    switch (level) {
      case BadgeLevel.BRONZE:
        return 'text-bronze';
      case BadgeLevel.SILVER:
        return 'text-silver';
      case BadgeLevel.GOLD:
        return 'text-gold';
      case BadgeLevel.PLATINUM:
        return 'text-platinum';
      default:
        return 'text-secondary';
    }
  }

  getLevelIcon(level: BadgeLevel): string {
    switch (level) {
      case BadgeLevel.BRONZE:
        return 'ti ti-award';
      case BadgeLevel.SILVER:
        return 'ti ti-star';
      case BadgeLevel.GOLD:
        return 'ti ti-crown';
      case BadgeLevel.PLATINUM:
        return 'ti ti-diamond';
      default:
        return 'ti ti-award';
    }
  }

  formatPoints(points: number): string {
    return points.toLocaleString();
  }

  getAchievementsList(): string[] {
    if (!this.loyaltyBadge || !this.loyaltyBadge.achievements) return [];
    return this.loyaltyBadge.achievements
      .split(', ')
      .filter((achievement) => achievement.trim() !== '');
  }

  getLastUpdatedDate(): string {
    if (!this.loyaltyBadge) return '';
    return new Date(this.loyaltyBadge.lastUpdated).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
