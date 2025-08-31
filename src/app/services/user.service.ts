import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private headerService: HeaderService) {}
  apiUrl = 'http://localhost:8081/users/';

  public getLisUser(archived: Boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}archived/${archived}`, {
      headers: this.headerService.getHeader(),
    });
  }

  public getUserById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}`, {
      headers: this.headerService.getHeader(),
    });
  }

  public setArchivedStatus(userId: any, archived: Boolean): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}archive/${userId}/${archived}`,
      null,
      {
        headers: this.headerService.getHeader(),
      }
    );
  }

  public getUserbyEmail(): Observable<any> {
    const email = localStorage.getItem('sub');
    return this.http.get(`${this.apiUrl}email/${email}`, {
      headers: this.headerService.getHeader(),
    });
  }

  public addUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, user, {
      headers: this.headerService.getHeader(),
    });
  }

  public updateUser(user: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}`, user, {
      headers: this.headerService.getHeader(),
    });
  }
  public resetPass(newPass: any): Observable<any> {
    const email = localStorage.getItem('sub');
    return this.http.patch(
      `${this.apiUrl}resetPass/${email}/${newPass}`,
      null,
      {
        headers: this.headerService.getHeader(),
      }
    );
  }
  public delete(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`, {
      headers: this.headerService.getHeader(),
    });
  }

  // Method to upload a file
  uploadFile(file: File, userId: number): Observable<string> {
    const authToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });

    const formData = new FormData();
    formData.append('image', file, file.name);

    return this.http
      .post(`${this.apiUrl}image/${userId}`, formData, {
        headers: headers,
        responseType: 'text', // Expect a plain text response
      })
      .pipe(catchError(this.handleError));
  }

  // Method to retrieve an image
  getImage(fileName: string): Observable<string> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Add authorization token if required
    });

    return this.http
      .get(`${this.apiUrl}images/${fileName}`, {
        headers: headers,
        responseType: 'blob', // Expect a binary response (Blob)
      })
      .pipe(
        map((blob) => {
          // Create a URL for the Blob
          return URL.createObjectURL(blob);
        })
      );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
