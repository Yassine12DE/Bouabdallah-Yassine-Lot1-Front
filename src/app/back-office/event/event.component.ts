import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';

export enum EventCategory {
  CONFERENCE = 'CONFERENCE',
  CONCERT = 'CONCERT',
  WORKSHOP = 'WORKSHOP',
  SEMINAR = 'SEMINAR',
  NETWORKING = 'NETWORKING',
  EXHIBITION = 'EXHIBITION',
  FESTIVAL = 'FESTIVAL',
  SPORTS = 'SPORTS',
  OTHER = 'OTHER',
}
@Component({
  selector: 'app-event',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent {
  events: any[] = [];
  filteredEvents: any[] = [];
  selectedEvent: any;
  searchTerm: string = '';
  selectedCategory: string = 'ALL';

  // Modal states
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  // Loading and error states
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private eventService: EventService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    // verify only ORGANIZER had access to this component
    if (this.loginService.getAuthLevel() != 1) this.loginService.verifyAuth();
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = events;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load events';
        this.isLoading = false;
        console.error('Error loading events:', error);
      },
    });
  }

  getEmptyEvent(): any {
    return {
      title: '',
      description: '',
      startDateTime: new Date().toISOString().slice(0, 16),
      endDateTime: new Date().toISOString().slice(0, 16),
      location: '',
      category: EventCategory.CONFERENCE,
      capacity: 0,
      availableSeats: 0,
      price: 0,
    };
  }

  openCreateModal(): void {
    this.selectedEvent = this.getEmptyEvent();
    this.showCreateModal = true;
  }

  openEditModal(event: Event): void {
    this.selectedEvent = { ...event };
    this.showEditModal = true;
  }

  openDeleteModal(event: Event): void {
    this.selectedEvent = { ...event };
    this.showDeleteModal = true;
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
  }

  createEvent(): void {
    this.eventService.createEvent(this.selectedEvent).subscribe({
      next: () => {
        this.loadEvents();
        this.closeModals();
      },
      error: (error) => {
        this.errorMessage = 'Failed to create event';
        console.error('Error creating event:', error);
      },
    });
  }

  updateEvent(): void {
    if (!this.selectedEvent.id) return;

    this.eventService
      .updateEvent(this.selectedEvent.id, this.selectedEvent)
      .subscribe({
        next: () => {
          this.loadEvents();
          this.closeModals();
        },
        error: (error) => {
          this.errorMessage = 'Failed to update event';
          console.error('Error updating event:', error);
        },
      });
  }

  deleteEvent(): void {
    if (!this.selectedEvent.id) return;

    this.eventService.deleteEvent(this.selectedEvent.id).subscribe({
      next: () => {
        this.loadEvents();
        this.closeModals();
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete event';
        console.error('Error deleting event:', error);
      },
    });
  }

  searchEvents(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredEvents = this.events;
      return;
    }

    this.eventService.searchEvents(this.searchTerm).subscribe({
      next: (events) => {
        this.filteredEvents = events;
      },
      error: (error) => {
        this.errorMessage = 'Failed to search events';
        console.error('Error searching events:', error);
      },
    });
  }

  filterByCategory(): void {
    if (this.selectedCategory === 'ALL') {
      this.filteredEvents = this.events;
    } else {
      this.eventService
        .getEventsByCategory(this.selectedCategory as EventCategory)
        .subscribe({
          next: (events) => {
            this.filteredEvents = events;
          },
          error: (error) => {
            this.errorMessage = 'Failed to filter events';
            console.error('Error filtering events:', error);
          },
        });
    }
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

  getEventCategories(): string[] {
    return ['ALL', ...Object.values(EventCategory)];
  }
}
