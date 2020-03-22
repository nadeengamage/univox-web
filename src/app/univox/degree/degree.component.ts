import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DegreePermissionService } from '../../service/permissions/degree-permission-service';
import { UserDetailsService } from '../../service/user-details-service';
declare var $: any;

@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.scss']
})
export class DegreeComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  filterDegreeData = [];
  degreeList = [];
  showDegreeCreateForm = false;
  modalTitle = null;
  editDetails = {
    faculty_code: '',
    degree_code: '',
    degree_name: '',
    status: 0
  };
  editDegreeId;
  degreeCreateForm: FormGroup;
  submitted = false;
  canDegreeAdd: boolean;
  canDegreeEdit: boolean;
  canDegreeDelete: boolean;

  public loading = false;

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService,
    private userDetailsService: UserDetailsService,
    private degreePermissionService: DegreePermissionService
  ) {
    this.degreeCreateForm = this.fb.group({
      faculty_code: ['', Validators.required],
      degree_code: ['', Validators.required],
      degree_name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
    this.canDegreeAdd = this.degreePermissionService.isDegreeAdd(
      this.userDetailsService.getRequestInfo()
    );
    this.canDegreeEdit = this.degreePermissionService.isDegreeEdit(
      this.userDetailsService.getRequestInfo()
    );
    this.canDegreeDelete = this.degreePermissionService.isDegreeDelete(
      this.userDetailsService.getRequestInfo()
    );
    this.getAllDegree();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onDegreeReset() {
    this.submitted = false;
    this.degreeCreateForm.reset();
  }

  getAllDegree() {
    const table = $('#tblDegreeData').DataTable();
    table.clear().destroy();
    this.loading = true;
    this.univoxService.getAllDegrees().subscribe(
      res => {
        if (res.status === 200) {
        this.degreeList = res.data;
        this.filterDegreeData = res.data;
        this.dtTrigger.next();
        console.log(res.data);
        } else {
          this.notifier.notify('warning', res.msg);
        }
        this.loading = false;
      },
      error => {
      }
    );
  }

  createDegree() {
    if (!this.degreeCreateForm.invalid) {
    this.loading = true;
    this.univoxService.createDegree(this.degreeCreateForm.value).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.showDegreeCreateForm = false;
      this.degreeCreateForm.reset();
      this.getAllDegree();
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

  isInvalidField(formControl) {
    return (this.degreeCreateForm.controls[formControl].touched ||
      this.degreeCreateForm.controls[formControl].dirty) &&
      this.degreeCreateForm.controls[formControl].errors
      ? true
      : false;
  }

  deleteDegree(id) {
    this.loading = true;
    this.univoxService.deleteDegree(id).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.getAllDegree();
    },
    error => {
      this.notifier.notify('error', error.error);
      this.loading = false;
    }
    );
  }

  changeStatusEdit(status) {
    this.editDetails.status = parseInt(status.srcElement.value, 0);
  }

  editDegree(degree) {
    this.editDetails = {
      faculty_code: degree.faculty.faculty_code,
      degree_code: degree.degree_code,
      degree_name: degree.degree_name,
      status: 1
    };
    this.editDegreeId = degree.degree_code;
    this.modalTitle = degree.degree_name;
  }

  updateDegree() {
    this.loading = true;
    this.univoxService.updateDegreeById(this.editDegreeId, this.editDetails).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.getAllDegree();
    },
    error => {
      this.notifier.notify('error', error.error);
      this.loading = false;
    }
    );
  }
}
