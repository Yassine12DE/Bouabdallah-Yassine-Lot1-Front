import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { ReservationService } from '../../services/reservation.service';

import { FeedbackService } from '../../services/feedback.service';
import {
  EventCategory,
  Reservation,
} from '../../back-office/interfaces/reservation.model';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css',
})
export class EventDetailsComponent {
  event: any | null = null;
  reservation: any;
  feedbacks: any[] = [];

  // Reservation form
  reservationSeats: number = 1;
  isGroupReservation: boolean = false;
  guestNames: string[] = [''];
  guestEmails: string[] = [''];

  // Feedback form
  newFeedback = {
    rating: 5,
    comment: '',
  };

  // UI states
  isLoading: boolean = false;
  isReserving: boolean = false;
  isSubmittingFeedback: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  activeTab: string = 'details';
  showCreateModal: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private reservationService: ReservationService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {
    this.loadEventDetails();
    this.loadReservations();
    this.loadFeedbacks();
  }

  loadEventDetails(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (!eventId) {
      this.errorMessage = 'Event ID is required';
      return;
    }

    this.isLoading = true;
    this.eventService.getEventById(+eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load event details';
        this.isLoading = false;
        console.error('Error loading event:', error);
      },
    });
  }

  loadReservations(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (!eventId) return;

    this.reservationService.getReservationByUserAndEvent(+eventId).subscribe({
      next: (reservations) => {
        this.reservation = reservations;
        console.log(this.reservation);
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
      },
    });
  }

  loadFeedbacks(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (!eventId) return;

    this.feedbackService.getFeedbackByEventId(+eventId).subscribe({
      next: (feedbacks) => {
        this.feedbacks = feedbacks;
      },
      error: (error) => {
        console.error('Error loading feedbacks:', error);
      },
    });
  }

  addGuestField(): void {
    this.guestNames.push('');
    this.guestEmails.push('');
  }

  removeGuestField(index: number): void {
    if (this.guestNames.length > 1) {
      this.guestNames.splice(index, 1);
      this.guestEmails.splice(index, 1);
    }
  }

  makeReservation(): void {
    if (!this.event || !this.event.id) {
      this.errorMessage = 'Event information is missing';
      return;
    }

    this.isReserving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.showCreateModal = false;
    if (this.isGroupReservation) {
      // Filter out empty guest entries
      const validGuestNames = this.guestNames.filter(
        (name) => name.trim() !== ''
      );
      const validGuestEmails = this.guestEmails.filter(
        (email) => email.trim() !== ''
      );

      this.reservationService
        .createGroupReservation(
          this.event.id,
          this.reservationSeats,
          validGuestNames,
          validGuestEmails
        )
        .subscribe({
          next: (reservation) => {
            this.handleReservationSuccess();
          },
          error: (error) => {
            this.handleReservationError(error, 'group reservation');
          },
        });
    } else {
      this.reservationService
        .createReservation(this.event.id, this.reservationSeats)
        .subscribe({
          next: (reservation) => {
            this.handleReservationSuccess();
          },
          error: (error) => {
            this.handleReservationError(error, 'reservation');
          },
        });
    }
  }

  private handleReservationSuccess(): void {
    this.isReserving = false;
    this.successMessage = `Reservation successful! You have reserved ${this.reservationSeats} seat(s) for ${this.event?.title}`;

    // Reload data
    this.loadEventDetails();
    this.loadReservations();

    // Reset form
    this.reservationSeats = 1;
    this.isGroupReservation = false;
    this.guestNames = [''];
    this.guestEmails = [''];
  }

  private handleReservationError(error: any, reservationType: string): void {
    this.isReserving = false;
    this.errorMessage = `Failed to create ${reservationType}. Please try again.`;
    console.error(`Error creating ${reservationType}:`, error);
  }

  submitFeedback(): void {
    if (!this.event || !this.event.id) {
      this.errorMessage = 'Event information is missing';
      return;
    }

    // In a real app, you would get the user ID from authentication service

    this.isSubmittingFeedback = true;
    this.errorMessage = '';

    this.feedbackService
      .createFeedback(
        this.event.id,
        this.newFeedback.rating,
        this.newFeedback.comment
      )
      .subscribe({
        next: (feedback) => {
          this.isSubmittingFeedback = false;
          this.newFeedback = { rating: 5, comment: '' };
          this.loadFeedbacks();
          this.activeTab = 'feedback';
        },
        error: (error) => {
          this.isSubmittingFeedback = false;
          this.errorMessage = 'Failed to submit feedback. Please try again.';
          console.error('Error submitting feedback:', error);
        },
      });
  }

  getDaysUntilEvent(): string {
    if (!this.event) return '';

    const today = new Date();
    const eventStart = new Date(this.event.startDateTime);
    const diffTime = eventStart.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Event has passed';
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
    return `In ${Math.ceil(diffDays / 30)} months`;
  }

  getEventDuration(): string {
    if (!this.event) return '';

    const start = new Date(this.event.startDateTime);
    const end = new Date(this.event.endDateTime);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) return `${diffHours} hours`;

    const diffDays = Math.ceil(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }

  getEventImage(): string {
    if (!this.event) return 'assets/images/event-default.jpg';
    return this.event.image || 'assets/images/event-default.jpg';
  }

  getCategoryClass(category: EventCategory): string {
    switch (category) {
      case EventCategory.CONFERENCE:
        return 'bg-primary';
      case EventCategory.CONCERT:
        return 'bg-success';
      case EventCategory.WORKSHOP:
        return 'bg-warning';
      case EventCategory.SEMINAR:
        return 'bg-info';
      case EventCategory.NETWORKING:
        return 'bg-purple';
      default:
        return 'bg-secondary';
    }
  }

  getRatingStars(rating: number): any[] {
    return Array(rating).fill(0);
  }

  goBack(): void {
    this.router.navigate(['home/event-list']);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
