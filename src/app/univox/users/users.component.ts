import { Component, OnInit } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  filterUserData = [];
  usersList = [];
  showUserCreateForm = false;
  modalTitle = null;
  editDetails = {
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    role: '',
    status: 0
  };
  editUserId;
  userCreateForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService,
  ) {
    this.userCreateForm = this.fb.group({
      username: [''],
      password: [''],
      firstname: [''],
      lastname: [''],
      role: ['']
    });
  }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.univoxService.getAllUsers().subscribe(
      res => {
        this.usersList = res.data;
        this.filterUserData = res.data;
        console.log(res.data);
      },
      error => {
      }
    );
  }

  search(term: string) {
    if (!term) {
      this.filterUserData = this.usersList;
    } else {
      this.filterUserData = this.usersList.filter(empFirstName =>
        empFirstName.firstname.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
      if (this.filterUserData.length === 0) {
        console.log('No Data Found!', this.filterUserData);
      }
    }
  }

  createUser() {
    this.univoxService.createUser(this.userCreateForm.value).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.showUserCreateForm = false;
      this.userCreateForm = this.fb.group({
        username: [''],
        password: [''],
        firstname: [''],
        lastname: [''],
        role: ['']
      });
      this.getAllUsers();
    },
    error => {
      this.notifier.notify('error', error.error);
    }
    );
  }

  deleteUser(id) {
    const set = {
      status: 0
    };
    this.univoxService.deleteUser(id, set).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.getAllUsers();
    },
    error => {
      this.notifier.notify('error', error.error);
    }
    );
  }

  editUser(user) {
    this.editDetails = {
      username: user.username,
      password: '',
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role_id.toString(),
      status: 0
    };
    this.editUserId = user.x_id;
    this.modalTitle = user.username;
  }

  updateUser() {
    this.univoxService.updateUserById(this.editUserId, this.editDetails).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.getAllUsers();
    },
    error => {
      this.notifier.notify('error', error.error);
    }
    );
  }
}
