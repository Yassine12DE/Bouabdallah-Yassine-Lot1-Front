import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventConflict } from '../back-office/interfaces/event-conflict.model';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root',
})
export class EventConflictService {
  private apiUrl = 'http://localhost:8081/event-conflicts';

  constructor(private http: HttpClient, private header: HeaderService) {}

  getAllConflicts(): Observable<EventConflict[]> {
    return this.http.get<EventConflict[]>(this.apiUrl, {
      headers: this.header.getHeader(),
    });
  }

  getConflictsByEventId(eventId: number): Observable<EventConflict[]> {
    return this.http.get<EventConflict[]>(`${this.apiUrl}/event/${eventId}`, {
      headers: this.header.getHeader(),
    });
  }

  getConflictById(id: number): Observable<EventConflict> {
    return this.http.get<EventConflict>(`${this.apiUrl}/${id}`, {
      headers: this.header.getHeader(),
    });
  }

  resolveConflict(id: number, solution: string): Observable<EventConflict> {
    return this.http.post<EventConflict>(
      `${this.apiUrl}/${id}/resolve`,
      { solution },
      { headers: this.header.getHeader() }
    );
  }

  dismissConflict(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.header.getHeader(),
    });
  }

  suggestAlternative(
    id: number,
    alternativeEventId: number
  ): Observable<EventConflict> {
    return this.http.post<EventConflict>(
      `${this.apiUrl}/${id}/suggest-alternative`,
      { alternativeEventId },
      { headers: this.header.getHeader() }
    );
  }
}
