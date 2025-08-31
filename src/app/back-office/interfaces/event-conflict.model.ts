export interface EventConflict {
  id?: number;
  event: Event;
  conflictingEvent: Event;
  conflictType: string; // SCHEDULE, LOCATION, RESOURCE, etc.
  severity: string; // LOW, MEDIUM, HIGH
  detectedAt: string;
  suggestedSolution: string;
}

export interface Event {
  id?: number;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  category: EventCategory;
  capacity: number;
  availableSeats: number;
  price: number;
  image: string;
}

export enum EventCategory {
  CONFERENCE = 'CONFERENCE',
  CONCERT = 'CONCERT',
  WORKSHOP = 'WORKSHOP',
  SEMINAR = 'SEMINAR',
  NETWORKING = 'NETWORKING',
}

export enum ConflictType {
  SCHEDULE = 'SCHEDULE',
  LOCATION = 'LOCATION',
  RESOURCE = 'RESOURCE',
  STAFF = 'STAFF',
  OTHER = 'OTHER',
}

export enum SeverityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}
