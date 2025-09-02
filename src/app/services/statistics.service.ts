import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatisticsResponse } from '../back-office/interfaces/statistics.model';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8081/statistics';

  constructor(private http: HttpClient, private header: HeaderService) {}

  getEventStatistics(eventId: number): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(
      `${this.apiUrl}/event/${eventId}`,
      {
        headers: this.header.getHeader(),
      }
    );
  }

  getOverallStatistics(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(`${this.apiUrl}/overall`, {
      headers: this.header.getHeader(),
    });
  }

  getFinancialStatistics(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(`${this.apiUrl}/financial`, {
      headers: this.header.getHeader(),
    });
  }
}
