import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8081/api/feedback';

  constructor(private http: HttpClient, private header: HeaderService) {}

  getFeedbackByEventId(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/event/${eventId}`, {
      headers: this.header.getHeader(),
    });
  }

  createFeedback(
    eventId: number,
    rating: number,
    comment: string
  ): Observable<any> {
    const userId = JSON.parse(localStorage.getItem('user') || '')?.id;
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('eventId', eventId.toString())
      .set('rating', rating.toString())
      .set('comment', comment);

    return this.http.post<any>(this.apiUrl, null, {
      headers: this.header.getHeader(),
      params: params,
    });
  }
}
