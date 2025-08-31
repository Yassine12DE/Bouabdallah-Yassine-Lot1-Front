import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from './top-nav/top-nav.component';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-front-office',
  standalone: true,
  imports: [RouterOutlet, TopNavComponent],
  templateUrl: './front-office.component.html',
  styleUrl: './front-office.component.css',
})
export class FrontOfficeComponent {
  constructor(private toastService: ToastService) {}

  closeToast() {
    this.toastService.closeSuccessToast();
  }
}
