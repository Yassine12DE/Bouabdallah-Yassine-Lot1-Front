import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastEl: any; // Reference to the toast element
  private bgColor: any;
  constructor() {
    // Get the toast element by ID
  }

  show(type?: string): void {
    this.toastEl = document.getElementById('myToast');
    let message;
    // check if toast element exist
    if (!this.toastEl) {
      console.error(
        'Toast element not found. Ensure you have an element with ID "myToast"'
      );
      return;
    }
    // Set the message and the bg color

    if (type == 'add') {
      message = 'Addition successful';
    } else if (type == 'edit') {
      message = 'Update successful';
    } else if (type == 'delete') {
      message = 'Deleted successfully';
    } else if (type == 'error') {
      message = 'An error has occurred';
      this.bgColor = 'text-bg-danger';
    }

    if (type !== 'error') {
      this.bgColor = 'text-bg-success';
    }

    this.toastEl.classList.add(this.bgColor);
    this.toastEl.querySelector('.toast-body').textContent = message;

    this.showSuccessToast();
  }

  private showSuccessToast() {
    this.toastEl.classList.add('d-block');
    setTimeout(() => {
      this.closeSuccessToast();
    }, 5000); // Hide the toast after 3 seconds
  }

  closeSuccessToast() {
    this.toastEl.classList.remove('d-block');
    this.toastEl.classList.remove(this.bgColor);
  }
}
