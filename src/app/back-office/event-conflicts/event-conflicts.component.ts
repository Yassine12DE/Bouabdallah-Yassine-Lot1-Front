import { Component } from '@angular/core';
import { EventConflictService } from '../../services/event-conflict.service';
import {
  EventConflict,
  SeverityLevel,
  ConflictType,
} from '../interfaces/event-conflict.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-conflicts',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './event-conflicts.component.html',
  styleUrl: './event-conflicts.component.css',
})
export class EventConflictsComponent {
  conflicts: EventConflict[] = [];
  filteredConflicts: EventConflict[] = [];
  selectedConflict: EventConflict | null = null;

  // Filter options
  selectedSeverity: string = 'ALL';
  selectedConflictType: string = 'ALL';
  searchTerm: string = '';

  // Resolution modal
  showResolutionModal: boolean = false;
  resolutionSolution: string = '';
  isResolving: boolean = false;

  // UI states
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private conflictService: EventConflictService) {}

  ngOnInit(): void {
    this.loadConflicts();
  }

  loadConflicts(): void {
    this.isLoading = true;
    this.conflictService.getAllConflicts().subscribe({
      next: (conflicts) => {
        this.conflicts = conflicts;
        this.filteredConflicts = conflicts;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load event conflicts';
        this.isLoading = false;
        console.error('Error loading conflicts:', error);
      },
    });
  }

  openResolutionModal(conflict: EventConflict): void {
    this.selectedConflict = conflict;
    this.resolutionSolution = conflict.suggestedSolution || '';
    this.showResolutionModal = true;
  }

  closeModal(): void {
    this.showResolutionModal = false;
    this.selectedConflict = null;
    this.resolutionSolution = '';
  }

  resolveConflict(): void {
    if (!this.selectedConflict?.id) return;

    this.isResolving = true;
    this.conflictService
      .resolveConflict(this.selectedConflict.id, this.resolutionSolution)
      .subscribe({
        next: (resolvedConflict) => {
          this.isResolving = false;
          this.successMessage = 'Conflict resolved successfully';
          this.closeModal();
          this.loadConflicts(); // Refresh the list
        },
        error: (error) => {
          this.isResolving = false;
          this.errorMessage = 'Failed to resolve conflict';
          console.error('Error resolving conflict:', error);
        },
      });
  }

  dismissConflict(conflict: EventConflict): void {
    if (!conflict.id) return;

    if (
      !confirm(
        'Are you sure you want to dismiss this conflict? This action cannot be undone.'
      )
    ) {
      return;
    }

    this.conflictService.dismissConflict(conflict.id).subscribe({
      next: () => {
        this.successMessage = 'Conflict dismissed successfully';
        this.loadConflicts(); // Refresh the list
      },
      error: (error) => {
        this.errorMessage = 'Failed to dismiss conflict';
        console.error('Error dismissing conflict:', error);
      },
    });
  }

  filterConflicts(): void {
    this.filteredConflicts = this.conflicts.filter((conflict) => {
      const matchesSeverity =
        this.selectedSeverity === 'ALL' ||
        conflict.severity === this.selectedSeverity;
      const matchesType =
        this.selectedConflictType === 'ALL' ||
        conflict.conflictType === this.selectedConflictType;
      const matchesSearch =
        this.searchTerm === '' ||
        conflict.event.title
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        conflict.conflictingEvent.title
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        conflict.conflictType
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      return matchesSeverity && matchesType && matchesSearch;
    });
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case SeverityLevel.HIGH:
        return 'bg-danger';
      case SeverityLevel.MEDIUM:
        return 'bg-warning';
      case SeverityLevel.LOW:
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  getSeverityIcon(severity: string): string {
    switch (severity) {
      case SeverityLevel.HIGH:
        return 'ti ti-alert-triangle';
      case SeverityLevel.MEDIUM:
        return 'ti ti-alert-circle';
      case SeverityLevel.LOW:
        return 'ti ti-info-circle';
      default:
        return 'ti ti-help';
    }
  }

  getConflictTypeIcon(conflictType: string): string {
    switch (conflictType) {
      case ConflictType.SCHEDULE:
        return 'ti ti-clock';
      case ConflictType.LOCATION:
        return 'ti ti-map-pin';
      case ConflictType.RESOURCE:
        return 'ti ti-tools';
      case ConflictType.STAFF:
        return 'ti ti-users';
      default:
        return 'ti ti-alert-triangle';
    }
  }

  getConflictTypes(): string[] {
    return ['ALL', ...Object.values(ConflictType)];
  }

  getSeverityLevels(): string[] {
    return ['ALL', ...Object.values(SeverityLevel)];
  }

  hasTimeConflict(conflict: EventConflict): boolean {
    const eventStart = new Date(conflict.event.startDateTime);
    const eventEnd = new Date(conflict.event.endDateTime);
    const conflictEventStart = new Date(
      conflict.conflictingEvent.startDateTime
    );
    const conflictEventEnd = new Date(conflict.conflictingEvent.endDateTime);

    return eventStart < conflictEventEnd && eventEnd > conflictEventStart;
  }

  hasLocationConflict(conflict: EventConflict): boolean {
    return (
      conflict.event.location === conflict.conflictingEvent.location &&
      conflict.conflictType === ConflictType.LOCATION
    );
  }

  getTimeOverlap(conflict: EventConflict): string {
    if (!this.hasTimeConflict(conflict)) return '';

    const eventStart = new Date(conflict.event.startDateTime);
    const eventEnd = new Date(conflict.event.endDateTime);
    const conflictEventStart = new Date(
      conflict.conflictingEvent.startDateTime
    );
    const conflictEventEnd = new Date(conflict.conflictingEvent.endDateTime);

    const overlapStart = new Date(
      Math.max(eventStart.getTime(), conflictEventStart.getTime())
    );
    const overlapEnd = new Date(
      Math.min(eventEnd.getTime(), conflictEventEnd.getTime())
    );

    const overlapMinutes =
      (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60);

    if (overlapMinutes < 60) {
      return `${Math.round(overlapMinutes)} minutes`;
    } else {
      return `${(overlapMinutes / 60).toFixed(1)} hours`;
    }
  }

  getEventImage(event: any): string {
    return event.image || 'assets/images/event-default.jpg';
  }
}
