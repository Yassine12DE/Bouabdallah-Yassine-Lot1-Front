import { Component } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  error: any;
  passRecovered: boolean = false;
  constructor(private loginService: LoginService) {}
  sendMail(form: NgForm) {
    this.error = false;
    this.passRecovered = false;
    this.loginService.sendEmail(form.value.email).subscribe(
      () => {
        this.passRecovered = true;
      },
      () => {
        this.error = true;
      }
    );
  }
}
