import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: any = {};
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  selectedFileName: any;
  downloadir: any;
  imageUrl: String | null = null;

  validations = {
    minLength: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
    matchConfirm: false,
  };
  constructor(
    private userService: UserService,
    private toastService: ToastService,
    public location: Location
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.userService.getUserbyEmail().subscribe((res) => {
      this.user = res;
      this.oldPassword = this.user.password;
      this.loadImage(this.user?.image);
    });
  }

  saveInfos() {
    delete this.user.authorities;
    this.userService.updateUser(this.user).subscribe((res) => {
      this.user = res;
      this.toastService.show('edit');
    });
  }

  get isPasswordValid(): boolean {
    return Object.values(this.validations).every((v) => v === true);
  }

  validatePassword() {
    const password = this.newPassword || '';

    this.validations.minLength = password.length >= 8;
    this.validations.lowercase = /[a-z]/.test(password);
    this.validations.uppercase = /[A-Z]/.test(password);
    this.validations.number = /[0-9]/.test(password);
    this.validations.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.validations.matchConfirm = this.newPassword === this.confirmPassword;
  }

  savePassword() {
    this.userService.resetPass(this.confirmPassword).subscribe((res) => {
      this.user = res;
      this.toastService.show('edit');
    });
  }

  onFileSelected(event: any) {
    console.log('image selected');
    const file: File = event.target.files[0];
    this.selectedFileName = file.name; // Use the file name as needed
    this.userService.uploadFile(file, this.user?.id).subscribe(
      (res) => {
        this.toastService.show('edit');
        this.getUser();
      },
      (error) => {
        // the file will be uploaded and the server will return 200 OK status code because the jwt content-header read only json requests
        if (error.status == 200) {
          this.toastService.show('error');
        }
      }
    );
  }

  loadImage(fileName: string): void {
    this.userService.getImage(fileName).subscribe({
      next: (url) => {
        this.imageUrl = url;
        console.log(this.imageUrl);
      },
      error: (error) => {
        console.error('Error loading image:', error);
        this.imageUrl = null;
      },
    });
  }

  back() {
    this.location.back();
  }
}
