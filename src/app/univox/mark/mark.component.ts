import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MarkPermissionService } from '../../service/permissions/mark-permission-service';
import { UserDetailsService } from '../../service/user-details-service';
declare var $: any;

@Component({
  selector: 'app-mark',
  templateUrl: './mark.component.html',
  styleUrls: ['./mark.component.scss']
})
export class MarkComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  filterMarksData = [];
  marksList = [];
  showMarkCreateForm = false;
  modalTitle = null;
  editDetails = {
    student_type: '',
    applicant_no: '',
    marks: '',
    remark: '',
    status: 1
  };
  editApplicantId;
  marksCreateForm: FormGroup;
  submitted = false;
  canMarkAdd: boolean;
  canMarkEdit: boolean;
  canMarkDelete: boolean;
  degreeList = [];

  public loading = false;

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService,
    private userDetailsService: UserDetailsService,
    private markPermissionService: MarkPermissionService
  ) {
    this.marksCreateForm = this.fb.group({
      student_type: ['', Validators.required],
      applicant_no: ['', Validators.required],
      degree_code: ['', Validators.required],
      marks: ['', Validators.required],
      remark: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
    this.canMarkAdd = this.markPermissionService.isMarkAdd(
      this.userDetailsService.getRequestInfo()
    );
    this.canMarkEdit = this.markPermissionService.isMarkEdit(
      this.userDetailsService.getRequestInfo()
    );
    this.canMarkDelete = this.markPermissionService.isMarkDelete(
      this.userDetailsService.getRequestInfo()
    );
    this.getAllMarks();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onMarkReset() {
    this.submitted = false;
    this.marksCreateForm.reset();
  }

  getAllDegree() {
    this.loading = true;
    this.univoxService.getAllDegrees().subscribe(
      res => {
        if (res.status === 200) {
        this.degreeList = res.data;
        } else {
          this.notifier.notify('warning', res.msg);
        }
        this.loading = false;
      },
      error => {
        this.notifier.notify('warning', error.msg);
        this.loading = false;
      }
    );
  }

  getAllMarks() {
    const table = $('#tblMarksData').DataTable();
    table.clear().destroy();
    this.loading = true;
    this.univoxService.getAllMarks().subscribe(
      res => {
        if (res.status === 200) {
          this.marksList = res.data;
          this.filterMarksData = res.data;
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

  createMark() {
    console.log(this.marksCreateForm);

    if (!this.marksCreateForm.invalid) {
    this.loading = true;
    this.univoxService.createMark(this.marksCreateForm.value).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.showMarkCreateForm = false;
      this.marksCreateForm.reset();
      this.getAllMarks();
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

  changeStudentType(type) {
    return this.marksCreateForm.patchValue({
      student_type: type.srcElement.value
    });
  }

  changeStatusEdit(status) {
    this.editDetails.status = parseInt(status.srcElement.value, 0);
  }

  isInvalidField(formControl) {
    return (this.marksCreateForm.controls[formControl].touched ||
      this.marksCreateForm.controls[formControl].dirty) &&
      this.marksCreateForm.controls[formControl].errors
      ? true
      : false;
  }

  deleteMark(alStudent, nvqStudent, type) {
    const makeId = (alStudent !== null) ? alStudent : nvqStudent;
    this.loading = true;
    if (type === 'NVQ') {
      this.univoxService.deleteNvqMark(makeId).subscribe(res => {
        this.notifier.notify('success', res.message);
        this.getAllMarks();
      },
      error => {
        this.notifier.notify('error', error.error);
        this.loading = false;
      }
      );
    } else {
      this.univoxService.deleteAlMark(makeId).subscribe(res => {
        this.notifier.notify('success', res.message);
        this.getAllMarks();
      },
      error => {
        this.notifier.notify('error', error.error);
        this.loading = false;
      }
      );
    }

  }

  editMark(mark, alStudent, nvqStudent) {
    this.editDetails = {
      student_type: mark.applicant.student_type,
      applicant_no: (alStudent !== null) ? alStudent : nvqStudent,
      marks: mark.marks.toString(),
      remark: mark.remark,
      status: 1
    };
    this.editApplicantId = (alStudent !== null) ? alStudent : nvqStudent;
    this.modalTitle = (alStudent !== null) ? alStudent : nvqStudent;
  }

  updateMark() {
    this.loading = true;
    this.univoxService.updateMarkById(this.editDetails).subscribe(res => {
      this.loading = false;
      this.notifier.notify('success', res.message);
    },
    error => {
      this.notifier.notify('error', error.error);
      this.loading = false;
    }
    );
  }
}
