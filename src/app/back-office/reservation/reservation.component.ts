import { Component } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import {
  EventCategory,
  Reservation,
  ReservationStatus,
  UserRole,
} from '../interfaces/reservation.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
})
export class ReservationComponent {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  selectedReservation: Reservation = this.getEmptyReservation();
  selectedStatus: string = 'ALL';
  searchTerm: string = '';

  // Group reservation fields
  guestNames: string[] = [''];
  guestEmails: string[] = [''];

  // Modal states
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  isGroupReservation: boolean = false;

  // Loading and error states
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.filteredReservations = reservations;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load reservations';
        this.isLoading = false;
        console.error('Error loading reservations:', error);
      },
    });
  }

  getEmptyReservation(): Reservation {
    return {
      user: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: UserRole.ATTENDEE,
      },
      event: {
        title: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
        location: '',
        category: EventCategory.CONFERENCE,
        capacity: 0,
        availableSeats: 0,
        price: 0,
        image: '',
      },
      reservationDate: new Date().toISOString(),
      status: ReservationStatus.PENDING,
      numberOfSeats: 1,
      groupMembers: [],
      isGroupReservation: false,
    };
  }

  openCreateModal(): void {
    this.selectedReservation = this.getEmptyReservation();
    this.guestNames = [''];
    this.guestEmails = [''];
    this.isGroupReservation = false;
    this.showCreateModal = true;
  }

  openEditModal(reservation: Reservation): void {
    this.selectedReservation = { ...reservation };
    this.showEditModal = true;
  }

  openDeleteModal(reservation: Reservation): void {
    this.selectedReservation = { ...reservation };
    this.showDeleteModal = true;
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
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

  createReservation(): void {
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
          this.selectedReservation.event.id!,
          this.selectedReservation.numberOfSeats,
          validGuestNames,
          validGuestEmails
        )
        .subscribe({
          next: () => {
            this.loadReservations();
            this.closeModals();
          },
          error: (error) => {
            this.errorMessage = 'Failed to create group reservation';
            console.error('Error creating group reservation:', error);
          },
        });
    } else {
      this.reservationService
        .createReservation(
          this.selectedReservation.event.id!,
          this.selectedReservation.numberOfSeats
        )
        .subscribe({
          next: () => {
            this.loadReservations();
            this.closeModals();
          },
          error: (error) => {
            this.errorMessage = 'Failed to create reservation';
            console.error('Error creating reservation:', error);
          },
        });
    }
  }

  updateReservationStatus(): void {
    if (!this.selectedReservation.id) return;

    this.reservationService
      .updateReservationStatus(
        this.selectedReservation.id,
        this.selectedReservation.status
      )
      .subscribe({
        next: () => {
          this.loadReservations();
          this.closeModals();
        },
        error: (error) => {
          this.errorMessage = 'Failed to update reservation status';
          console.error('Error updating reservation status:', error);
        },
      });
  }

  deleteReservation(): void {
    if (!this.selectedReservation.id) return;

    this.reservationService
      .cancelReservation(this.selectedReservation.id)
      .subscribe({
        next: () => {
          this.loadReservations();
          this.closeModals();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete reservation';
          console.error('Error deleting reservation:', error);
        },
      });
  }

  searchReservations(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredReservations = this.reservations;
    } else {
      this.filteredReservations = this.reservations.filter(
        (reservation) =>
          reservation.user.firstName
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          reservation.user.lastName
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          reservation.user.email
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          reservation.event.title
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    }
  }

  filterByStatus(): void {
    if (this.selectedStatus === 'ALL') {
      this.filteredReservations = this.reservations;
    } else {
      this.filteredReservations = this.reservations.filter(
        (reservation) => reservation.status === this.selectedStatus
      );
    }
  }

  getStatusClass(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return 'bg-success';
      case ReservationStatus.PENDING:
        return 'bg-warning';
      case ReservationStatus.CANCELLED:
        return 'bg-danger';
      case ReservationStatus.WAITLIST:
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  getStatusIcon(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return 'ti ti-check';
      case ReservationStatus.PENDING:
        return 'ti ti-clock';
      case ReservationStatus.CANCELLED:
        return 'ti ti-x';
      case ReservationStatus.WAITLIST:
        return 'ti ti-list';
      default:
        return 'ti ti-help';
    }
  }

  getReservationStatuses(): string[] {
    return ['ALL', ...Object.values(ReservationStatus)];
  }
}
