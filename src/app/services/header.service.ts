import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  constructor() {}

  getHeader() {
    const auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    });
    return headers;
  }

  getFileHeader(): HttpHeaders {
    const auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${auth_token}`,
    });

    return headers;
  }
}
