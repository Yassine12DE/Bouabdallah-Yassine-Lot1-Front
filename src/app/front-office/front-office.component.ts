import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from './top-nav/top-nav.component';
import { ToastService } from '../services/toast.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-front-office',
  standalone: true,
  imports: [RouterOutlet, TopNavComponent],
  templateUrl: './front-office.component.html',
  styleUrl: './front-office.component.css',
})
export class FrontOfficeComponent {
  constructor(
    private toastService: ToastService,
    private loginService: LoginService
  ) {}

  closeToast() {
    // verify only ORGANIZER had access to this component
    if (this.loginService.getAuthLevel() != 0) this.loginService.verifyAuth();
    this.toastService.closeSuccessToast();
  }
}
