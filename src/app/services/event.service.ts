import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:8081/events';

  constructor(private http: HttpClient, private header: HeaderService) {}

  getAllEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.header.getHeader(),
    });
  }

  getEventById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.header.getHeader(),
    });
  }

  createEvent(event: Event): Observable<any> {
    return this.http.post<any>(this.apiUrl, event, {
      headers: this.header.getHeader(),
    });
  }

  updateEvent(id: number, event: Event): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, event, {
      headers: this.header.getHeader(),
    });
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.header.getHeader(),
    });
  }

  getEventsByCategory(category: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${category}`, {
      headers: this.header.getHeader(),
    });
  }

  getUpcomingEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/upcoming`, {
      headers: this.header.getHeader(),
    });
  }

  searchEvents(keyword: string): Observable<Event[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Event[]>(`${this.apiUrl}/search`, {
      params,
      headers: this.header.getHeader(),
    });
  }

  getAvailableSeats(eventId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${eventId}/available-seats`, {
      headers: this.header.getHeader(),
    });
  }
}
