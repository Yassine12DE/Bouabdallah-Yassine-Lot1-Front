import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoyaltyBadge } from '../front-office/interfaces/loyalty-badge.model';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root',
})
export class LoyaltyBadgeService {
  private apiUrl = 'http://localhost:8081/loyalty';

  constructor(private http: HttpClient, private header: HeaderService) {}

  getLoyaltyBadgeByUserId(): Observable<LoyaltyBadge> {
    const userId = JSON.parse(localStorage.getItem('user') || '')?.id;
    return this.http.get<LoyaltyBadge>(`${this.apiUrl}/user/${userId}`, {
      headers: this.header.getHeader(),
    });
  }

  addPoints(points: number): Observable<LoyaltyBadge> {
    const userId = JSON.parse(localStorage.getItem('user') || '')?.id;
    return this.http.post<LoyaltyBadge>(
      `${this.apiUrl}/${userId}/add-points`,
      null,
      {
        headers: this.header.getHeader(),
        params: { points: points.toString() },
      }
    );
  }

  redeemPoints(points: number): Observable<LoyaltyBadge> {
    const userId = JSON.parse(localStorage.getItem('user') || '')?.id;
    return this.http.post<LoyaltyBadge>(
      `${this.apiUrl}/${userId}/redeem-points`,
      null,
      {
        headers: this.header.getHeader(),
        params: { points: points.toString() },
      }
    );
  }
}
