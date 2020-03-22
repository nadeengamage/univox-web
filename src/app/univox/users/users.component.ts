import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserPermissionService } from '../../service/permissions/user-permission-service';
import { UserDetailsService } from '../../service/user-details-service';
declare var $: any;

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
  submitted = false;
  canUserAdd: boolean;
  canUserEdit: boolean;
  canUserDelete: boolean;

  public loading = false;

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService,
    private userDetailsService: UserDetailsService,
    private userPermissionService: UserPermissionService
  ) {
    this.userCreateForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
    this.canUserAdd = this.userPermissionService.isUserAdd(
      this.userDetailsService.getRequestInfo()
    );
    this.canUserEdit = this.userPermissionService.isUserEdit(
      this.userDetailsService.getRequestInfo()
    );
    this.canUserDelete = this.userPermissionService.isUserDelete(
      this.userDetailsService.getRequestInfo()
    );
    this.getAllUsers();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  showCreate() {
    this.userCreateForm.reset();
    this.submitted = false;
  }

  getAllUsers() {
    const table = $('#tblUserData').DataTable();
    table.clear().destroy();
    this.loading = true;
    this.univoxService.getAllUsers().subscribe(
      res => {
        if (res.status === 200) {
          this.usersList = res.data;
          this.filterUserData = res.data;
          this.dtTrigger.next();
        } else {
          this.notifier.notify('warning', res.msg);
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.notifier.notify('error', error.error);
      }
    );
  }

  changeStatusEdit(status) {
    this.editDetails.status = parseInt(status.srcElement.value, 0);
  }

  changeRoleEdit(role) {
    this.editDetails.role = role.srcElement.value;
    console.log(this.editDetails.role);
  }

  isInvalidField(formControl) {
    return (this.userCreateForm.controls[formControl].touched ||
      this.userCreateForm.controls[formControl].dirty) &&
      this.userCreateForm.controls[formControl].errors
      ? true
      : false;
  }

  changeRole(item) {
    return this.userCreateForm.patchValue({
      role: item.srcElement.value
    });
  }

  createUser() {
    console.log(this.userCreateForm);

    if (!this.userCreateForm.invalid) {
    this.loading = true;
    this.univoxService.createUser(this.userCreateForm.value).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.showUserCreateForm = false;
      this.userCreateForm.reset();
      this.getAllUsers();
    },
    error => {
      this.notifier.notify('error', error.error);
      this.loading = false;
    }
    );
  } else {
    this.submitted = true;
  }
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
      role: user.role_code,
      status: user.status,
    };
    this.editUserId = user.x_id;
    this.modalTitle = user.username;
  }

  updateUser() {
    if (this.editDetails.username !== '' && this.editDetails.firstname !== '' &&
      this.editDetails.lastname !== '' &&
      this.editDetails.role !== '') {
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
    } else {
      this.notifier.notify('info', 'Cannot proceed!, Filed Empty!');
    }
  }
}
