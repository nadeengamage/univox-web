import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { FacultyPermissionService } from '../../service/permissions/faculty-permission-service';
import { UserDetailsService } from '../../service/user-details-service';
declare var $: any;

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})
export class FacultyComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  filterFacultyData = [];
  facultyList = [];
  showFacultyCreateForm = false;
  modalTitle = null;
  editDetails = {
    faculty_code: '',
    faculty_name: '',
    status: 0
  };
  editFacultyId;
  facultyCreateForm: FormGroup;
  submitted = false;
  canFacultyAdd: boolean;
  canFacultyEdit: boolean;
  canFacultyDelete: boolean;

  public loading = false;

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService,
    private userDetailsService: UserDetailsService,
    private facultyPermissionService: FacultyPermissionService
  ) {
    this.facultyCreateForm = this.fb.group({
      faculty_code: ['', Validators.required],
      faculty_name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
    this.canFacultyAdd = this.facultyPermissionService.isFacultyAdd(
      this.userDetailsService.getRequestInfo()
    );
    this.canFacultyEdit = this.facultyPermissionService.isFacultyEdit(
      this.userDetailsService.getRequestInfo()
    );
    this.canFacultyDelete = this.facultyPermissionService.isFacultyDelete(
      this.userDetailsService.getRequestInfo()
    );
    this.getAllFaculty();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onFacultyReset() {
    this.submitted = false;
    this.facultyCreateForm.reset();
  }

  getAllFaculty() {
    const table = $('#tblFacultyData').DataTable();
    table.clear().destroy();
    this.loading = true;
    this.univoxService.getAllFaculties().subscribe(
      res => {
        if (res.status === 200) {
          this.facultyList = res.data;
          this.filterFacultyData = res.data;
          this.dtTrigger.next();
        } else {
          this.notifier.notify('warning', res.msg);
        }
        this.loading = false;
      },
      error => {
        this.notifier.notify('error', error.error);
        this.loading = false;
      }
    );
  }

  createFaculty() {
    console.log(this.facultyCreateForm);

    if (!this.facultyCreateForm.invalid) {
    this.loading = true;
    this.univoxService.createFaculty(this.facultyCreateForm.value).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.showFacultyCreateForm = false;
      this.facultyCreateForm.reset();
      this.getAllFaculty();
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

  changeStatusEdit(status) {
    this.editDetails.status = parseInt(status.srcElement.value, 0);
  }

  isInvalidField(formControl) {
    return (this.facultyCreateForm.controls[formControl].touched ||
      this.facultyCreateForm.controls[formControl].dirty) &&
      this.facultyCreateForm.controls[formControl].errors
      ? true
      : false;
  }

  deleteFaculty(id) {
    this.loading = true;
    this.univoxService.deleteFaculty(id).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.getAllFaculty();
    },
    error => {
      this.notifier.notify('error', error.error);
      this.loading = false;
    }
    );
  }

  editFaculty(faculty) {
    this.editDetails = {
      faculty_code: faculty.faculty_code,
      faculty_name: faculty.faculty_name,
      status: 1
    };
    this.editFacultyId = faculty.faculty_code;
    this.modalTitle = faculty.faculty_name;
  }

  updateFaculty() {
    this.loading = true;
    this.univoxService.updateFacultyById(this.editFacultyId, this.editDetails).subscribe(res => {
      this.getAllFaculty();
      this.notifier.notify('success', res.message);
    },
    error => {
      this.notifier.notify('error', error.error);
      this.loading = false;
    }
    );
  }
}
