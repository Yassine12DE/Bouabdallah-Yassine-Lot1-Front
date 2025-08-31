import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [RouterLink, RouterLink],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css',
})
export class TopNavComponent implements OnInit {
  imageUrl: any;
  user: any;
  constructor(
    private toastService: ToastService,
    private loginService: LoginService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // this.loginService.verifyAuth();
    this.authLvl = this.loginService.getAuthLevel();
    this.user = JSON.parse(localStorage.getItem('user') || '');
    this.loadImage();
  }

  files: any;
  authLvl: number = 0;
  closeToast() {
    this.toastService.closeSuccessToast();
  }

  logout() {
    this.loginService.logout().subscribe();
    localStorage.clear();
    this.router.navigateByUrl('auth/login');
  }

  loadImage(): void {
    const imageUrl = this.user?.image;
    this.userService.getImage(imageUrl).subscribe({
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
}
