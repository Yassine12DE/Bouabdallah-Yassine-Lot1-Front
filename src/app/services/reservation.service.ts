import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Reservation,
  ReservationStatus,
} from '../back-office/interfaces/reservation.model';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = 'http://localhost:8081/api/reservations';

  constructor(private http: HttpClient, private header: HeaderService) {}

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl, {
      headers: this.header.getHeader(),
    });
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`, {
      headers: this.header.getHeader(),
    });
  }

  getReservationsByUserId(): Observable<Reservation[]> {
    const userId = JSON.parse(localStorage.getItem('user') || '')?.id;
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.header.getHeader(),
    });
  }

  getReservationsByEventId(eventId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/event/${eventId}`, {
      headers: this.header.getHeader(),
    });
  }

  createReservation(
    eventId: number,
    numberOfSeats: number
  ): Observable<Reservation> {
    const userId = JSON.parse(localStorage.getItem('user') || '')?.id;
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('eventId', eventId.toString())
      .set('numberOfSeats', numberOfSeats.toString());

    return this.http.post<Reservation>(this.apiUrl, null, {
      headers: this.header.getHeader(),
      params: params,
    });
  }

  createGroupReservation(
    eventId: number,
    numberOfSeats: number,
    guestNames: string[],
    guestEmails: string[]
  ): Observable<Reservation> {
    const userId = JSON.parse(localStorage.getItem('user') || '')?.id;
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('eventId', eventId.toString())
      .set('numberOfSeats', numberOfSeats.toString())
      .set('guestNames', guestNames.join(','))
      .set('guestEmails', guestEmails.join(','));

    return this.http.post<Reservation>(`${this.apiUrl}/group`, null, {
      headers: this.header.getHeader(),
      params: params,
    });
  }

  updateReservationStatus(
    id: number,
    status: ReservationStatus
  ): Observable<Reservation> {
    const params = new HttpParams().set('status', status);

    return this.http.put<Reservation>(`${this.apiUrl}/${id}/status`, null, {
      headers: this.header.getHeader(),
      params: params,
    });
  }

  cancelReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.header.getHeader(),
    });
  }

  getReservedSeatsCount(eventId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/event/${eventId}/reserved-seats`,
      {
        headers: this.header.getHeader(),
      }
    );
  }

  getReservationByUserAndEvent(eventId: any): Observable<Reservation[]> {
    const userId = JSON.parse(localStorage.getItem('user') || '')?.id;
    return this.http.get<Reservation[]>(
      `${this.apiUrl}/userAndEvent/${userId}/${eventId}`,
      {
        headers: this.header.getHeader(),
      }
    );
  }
}
