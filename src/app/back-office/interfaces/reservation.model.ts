export interface Reservation {
  id?: number;
  user: User;
  event: Event;
  reservationDate: string;
  status: ReservationStatus;
  numberOfSeats: number;
  groupMembers: GroupReservation[];
  isGroupReservation: boolean;
}

export interface GroupReservation {
  id?: number;
  reservation: Reservation;
  guestName: string;
  guestEmail: string;
}

export interface User {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
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

export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  WAITLIST = 'WAITLIST',
}

export enum WaitlistStatus {
  ACTIVE = 'ACTIVE',
  NOTIFIED = 'NOTIFIED',
  CONVERTED = 'CONVERTED',
  CANCELLED = 'CANCELLED',
}

export enum UserRole {
  ORGANIZER = 'ORGANIZER',
  ATTENDEE = 'ATTENDEE',
  ADMIN = 'ADMIN',
}

export enum EventCategory {
  CONFERENCE = 'CONFERENCE',
  CONCERT = 'CONCERT',
  WORKSHOP = 'WORKSHOP',
  SEMINAR = 'SEMINAR',
  NETWORKING = 'NETWORKING',
}
