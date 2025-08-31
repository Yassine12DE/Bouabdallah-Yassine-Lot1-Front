import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HeaderService } from './header.service';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  connectedUser: any;
  constructor(
    private http: HttpClient,
    private headerService: HeaderService,
    private router: Router
  ) {
    this.connectedUser = this.decodeToken();
  }

  getAuthLevel(): number {
    if (this.connectedUser?.role == 'ADMIN') return 2;
    else if (this.connectedUser?.role == 'ORGANIZER') return 1;
    else return 0;
  }

  setToken(token: any) {
    localStorage.setItem('token', token);
  }
  decodeToken() {
    let helper = new JwtHelperService();
    let decode = localStorage.getItem('token');

    if (decode) {
      let token = helper.decodeToken(decode);
      console.log(token);
      localStorage.setItem('sub', token?.sub);
      return token;
    }
    return null;
  }
  verifToken() {
    let decode = localStorage.getItem('token');
    let helper = new JwtHelperService();
    return !helper.isTokenExpired(decode);
  }
  // method to rediract users by role to his default compoenent
  verifyAuth() {
    if (this.verifToken()) {
      if (this.getAuthLevel() > 0) {
        this.router.navigateByUrl('main');
      } else {
        this.router.navigateByUrl('main/dashboard-client');
      }
    } else {
      this.router.navigateByUrl('login');
    }
  }
  ReloadToken(email: any, body: any) {
    return this.http.post(
      `http://localhost:8081/event/ReloadToken/${email}`,
      body
    );
  }
  login(body: any) {
    return this.http.post(`http://localhost:8081/event/authenticate`, body);
  }
  register(body: any) {
    return this.http.post(`http://localhost:8081/event/register`, body);
  }
  logout() {
    return this.http.post(`http://localhost:8081/logout`, null, {
      headers: this.headerService.getHeader(),
    });
  }
  public verifyEmail(email: any): Observable<any> {
    return this.http.get(`http://localhost:8081/event/verifyMail/${email}`);
  }
  public sendEmail(email: any): Observable<any> {
    return this.http.get(`http://localhost:8081/event/sendResetMail/${email}`);
  }

  public logLoginSuccess(): Observable<any> {
    return this.http.post(`http://localhost:8081/logs/login-success`, null, {
      headers: this.headerService.getHeader(),
    });
  }
}
