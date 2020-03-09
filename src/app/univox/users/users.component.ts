import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  filterUserData = [];
  usersList = [];
  showUserCreateForm = false;
  modalTitle = null;
  editDetails = {
    username: '',
    firstname: '',
    lastname: '',
    role: '',
    status: 0
  };
  editUserId;
  userCreateForm: FormGroup;

  public loading = false;

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
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
    this.getAllUsers();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getAllUsers() {
    this.loading = true;
    this.univoxService.getAllUsers().subscribe(
      res => {
        this.usersList = res.data;
        this.filterUserData = res.data;
        this.dtTrigger.next();
        this.loading = false;
        console.log(res.data);
      },
      error => {
        this.loading = false;
      }
    );
  }

  createUser() {
    this.loading = true;
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
      this.loading = false;
    }
    );
  }

  deleteUser(id) {
    this.loading = true;
    this.univoxService.deleteUser(id).subscribe(res => {
      this.notifier.notify('success', 'User Deactivated!');
      this.getAllUsers();
    },
    error => {
      this.notifier.notify('error', error.error);
      this.loading = false;
    }
    );
  }

  editUser(user) {
    this.editDetails = {
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role_id.toString(),
      status: user.status ? 1 : 0
    };
    this.editUserId = user.x_id;
    this.modalTitle = user.username;
  }

  updateUser() {
    this.loading = true;
    this.univoxService.updateUserById(this.editUserId, this.editDetails).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.loading = false;
      this.getAllUsers();
    },
    error => {
      this.notifier.notify('error', error.error);
      this.loading = false;
    }
    );
  }
}
