import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { CommonModule } from '@angular/common';
import { ReservationStatus } from '../../back-office/interfaces/reservation.model';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css',
})
export class ReservationListComponent implements OnInit {
  isLoading: boolean = true;
  reservations: any;
  errorMessage: any;
  filteredReservations: any;
  searchTerm: any;
  selectedStatus: any;
  selectedReservation: any;
  constructor(
    private reservationService: ReservationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getReservationsByUserId().subscribe({
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

  searchReservations(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredReservations = this.reservations;
    } else {
      this.filteredReservations = this.reservations.filter(
        (reservation: {
          user: { firstName: string; lastName: string; email: string };
          event: { title: string };
        }) =>
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
        (reservation: { status: any }) =>
          reservation.status === this.selectedStatus
      );
    }
  }
  getReservationStatuses(): string[] {
    return ['ALL', ...Object.values(ReservationStatus)];
  }

  cancelReservation() {
    document.getElementById('cancel-btn-Modal')?.click();
    this.reservationService
      .cancelReservation(this.selectedReservation?.id)
      .subscribe({
        next: () => {
          this.toastService.show('edit');
        },
      });
  }
}
