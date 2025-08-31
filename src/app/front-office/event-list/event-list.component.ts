import { Component } from '@angular/core';

import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventCategory } from '../../back-office/event/event.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
})
export class EventListComponent {
  events: any[] = [];
  filteredEvents: any[] = [];
  selectedCategory: string = 'ALL';
  searchTerm: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.loadUpcomingEvents();
  }

  loadUpcomingEvents(): void {
    this.isLoading = true;
    this.eventService.getUpcomingEvents().subscribe({
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

  viewEventDetails(eventId: number): void {
    this.router.navigate(['/home/event-details', eventId]);
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

  getDaysUntilEvent(eventDate: string): string {
    const today = new Date();
    const eventStart = new Date(eventDate);
    const diffTime = eventStart.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
    return `In ${Math.ceil(diffDays / 30)} months`;
  }
}
