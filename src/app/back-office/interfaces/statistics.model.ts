export interface StatisticsResponse {
  [key: string]: any;
}

export interface EventStatistics {
  event?: any;
  totalReservations?: number;
  confirmedReservations?: number;
  waitlistReservations?: number;
  attendanceRate?: number;
  averageRating?: number;
  feedbackCount?: number;
  positiveFeedback?: number;
  neutralFeedback?: number;
  negativeFeedback?: number;
}

export interface OverallStatistics {
  totalEvents?: number;
  upcomingEvents?: number;
  totalReservations?: number;
  eventsByCategory?: { [key: string]: number };
  eventsByMonth?: { [key: string]: number };
}

export interface FinancialStatistics {
  totalRevenue?: number;
  totalTransactions?: number;
  revenueByCategory?: { [key: string]: number };
}

export enum EventCategory {
  CONFERENCE = 'CONFERENCE',
  CONCERT = 'CONCERT',
  WORKSHOP = 'WORKSHOP',
  SEMINAR = 'SEMINAR',
  NETWORKING = 'NETWORKING',
}

export enum Month {
  JANUARY = 'JANUARY',
  FEBRUARY = 'FEBRUARY',
  MARCH = 'MARCH',
  APRIL = 'APRIL',
  MAY = 'MAY',
  JUNE = 'JUNE',
  JULY = 'JULY',
  AUGUST = 'AUGUST',
  SEPTEMBER = 'SEPTEMBER',
  OCTOBER = 'OCTOBER',
  NOVEMBER = 'NOVEMBER',
  DECEMBER = 'DECEMBER',
}
