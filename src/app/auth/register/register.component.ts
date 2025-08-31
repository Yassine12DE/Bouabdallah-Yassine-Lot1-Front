import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { tap, switchMap, catchError, of } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  error: boolean = false;
  constructor(
    private router: Router,
    private loginService: LoginService,
    private userService: UserService
  ) {}

  ngOnInit() {}

  // convenience getter for easy access to form fields

  register(form: NgForm) {
    this.error = false;
    this.loginService
      .register(form.value)
      .pipe(
        tap((logRes: any) => {
          this.loginService.setToken(logRes['access_token']);
          this.loginService.connectedUser = this.loginService.decodeToken();
          localStorage.setItem('pageNbr', '1');
        }),
        switchMap((res: any) =>
          this.userService.getUserbyEmail().pipe(
            catchError((err) => {
              console.error('Failed to log login', err);
              return of(null); // Continue even if logging fails
            })
          )
        )
      )
      .subscribe({
        next: (res) => {
          localStorage.setItem('user', JSON.stringify(res));
          this.router.navigateByUrl('main');
        },
        error: (err) => {
          this.error = true;
        },
      });
  }
}
