import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  listUsers: any;
  archived: boolean = false;
  editUser: any;
  newUser: any;
  toDeleteUser: any;
  editPassword: Boolean = false;
  unidinticalPass: Boolean = true;
  listDepartments: any;
  authLvl: any;
  editUserDepartment: any;
  inputType = 'password';
  toggleIcon = '';
  passError: boolean = true;
  emailError: boolean = false;
  constructor(
    private usersService: UserService,
    private toastService: ToastService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    // verify only ADMIN had access to this component
    if (this.loginService.getAuthLevel() < 2) this.loginService.verifyAuth();
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getLisUser(this.archived).subscribe({
      next: (users) => {
        this.listUsers = users.map((user: { image: any; imageUrl: any }) => {
          if (user.image) {
            // Generate the image URL for each user
            this.usersService.getImage(user.image).subscribe({
              next: (url) => {
                user.imageUrl = url;
              },
            });
          }
          return user;
        });
      },
      error: (error) => {
        console.error('Error loading users:', error);
      },
    });
  }

  setArchived(userId: any) {
    const archivBool = this.archived ? false : true;
    this.usersService.setArchivedStatus(userId, archivBool).subscribe((res) => {
      this.loadUsers();
    });
  }

  onAddUser(form: NgForm) {
    console.log(form.value);
    document.getElementById('addModalCloseBtn')?.click();
    this.usersService.addUser(form.value).subscribe(
      (res) => {
        this.loadUsers();
        form.reset();
        this.toastService.show('add');
      },
      () => {
        this.toastService.show('error');
      }
    );
  }
  onUpdateUser(form: NgForm) {
    //Object Destructuring for Conciseness:
    const { firstName, lastName, email, enabled, role } = form.value;
    this.editUser = {
      ...this.editUser,
      firstName,
      lastName,
      email,
      enabled,
      role,
    };
    if (form.value.mdp) {
      this.editUser.mdp = form.value.mdp;
    }
    delete this.editUser?.authorities;
    document.getElementById('updateModalCloseBtn')?.click();
    this.usersService.updateUser(this.editUser).subscribe((res) => {
      this.toastService.show('edit');
      this.loadUsers();
    });
  }
  onDeleteUser() {
    document.getElementById('deleteModalCloseBtn')?.click();
    this.usersService.delete(this.toDeleteUser?.id).subscribe(() => {
      this.loadUsers();
      this.toastService.show('delete');
    });
  }

  validateString(str: any) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$/;
    console.log(regex.test(str));
    this.passError = regex.test(str);
  }
  validateEmail(str: any) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailError = emailRegex.test(str);
  }

  togglePasswordVisibility() {
    var passwordInput = document.getElementById('password');
    var toggleIcon = document.getElementById('toggleIcon');

    if (this.inputType === 'password') {
      this.inputType = 'text';
      this.toggleIcon = 'eye-closed.png'; // Change to an icon representing 'hide'
    } else {
      this.inputType = 'password';
      this.toggleIcon = 'eye-open.png'; // Change to an icon representing 'show'
    }
  }

  public onOpenModal(user: any, mode: string) {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');
    if (mode == 'add') {
      button.setAttribute('data-bs-target', '#addModal');
    }
    if (mode == 'edit') {
      this.editUser = user;

      button.setAttribute('data-bs-target', '#updateModal');
    }
    if (mode == 'delete') {
      this.toDeleteUser = user;
      button.setAttribute('data-bs-target', '#deleteModal');
    }
    container?.appendChild(button);
    button.click();
  }
}
