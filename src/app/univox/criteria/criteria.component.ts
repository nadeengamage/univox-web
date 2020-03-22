import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CriteriaPermissionService } from '../../service/permissions/criteria-permission-service';
import { UserDetailsService } from '../../service/user-details-service';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss']
})
export class CriteriaComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  filterCriteriaData = [];
  criteriaList = [];
  showCriteriaCreateForm = false;
  modalTitle = null;
  editDetails = {
    degree_code: '',
    btch_one_stud_per_program: '',
    btch_two_stud_per_program: '',
    first_exam_paper_mark: '',
    second_exam_paper_mark: '',
    btch_one_cut_off_mark: '',
    btch_two_cut_off_mark: '',
    status: 0
  };
  editCriteriaId;
  criteriaCreateForm: FormGroup;
  submitted = false;
  canCriteriaAdd: boolean;
  canCriteriaEdit: boolean;
  canCriteriaDelete: boolean;

  public loading = false;

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService,
    private userDetailsService: UserDetailsService,
    private criteriaPermissionService: CriteriaPermissionService
  ) {
    this.criteriaCreateForm = this.fb.group({
      degree_code: ['', Validators.required],
      btch_one_stud_per_program: ['', Validators.required],
      btch_two_stud_per_program: ['', Validators.required],
      first_exam_paper_mark: ['', Validators.required],
      second_exam_paper_mark: ['', Validators.required],
      btch_one_cut_off_mark: ['', Validators.required],
      btch_two_cut_off_mark: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
    this.canCriteriaAdd = this.criteriaPermissionService.isCriteriaAdd(
      this.userDetailsService.getRequestInfo()
    );
    this.canCriteriaEdit = this.criteriaPermissionService.isCriteriaEdit(
      this.userDetailsService.getRequestInfo()
    );
    this.canCriteriaDelete = this.criteriaPermissionService.isCriteriaDelete(
      this.userDetailsService.getRequestInfo()
    );
    this.getAllCriterias();
  }

  onCriteriaReset() {
    this.submitted = false;
    this.criteriaCreateForm.reset();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getAllCriterias() {
    const table = $('#tblCriteriaData').DataTable();
    table.clear().destroy();
    this.loading = true;
    this.univoxService.getAllCriterias().subscribe(
      res => {
        if (res.status === 200) {
        this.criteriaList = res.data;
        this.filterCriteriaData = res.data;
        this.dtTrigger.next();
        console.log(res.data);
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

  createCriteria() {
    if (!this.criteriaCreateForm.invalid) {
    this.loading = true;
    this.univoxService.createCriteria(this.criteriaCreateForm.value).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.showCriteriaCreateForm = false;
      this.criteriaCreateForm.reset();
      this.getAllCriterias();
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
    return (this.criteriaCreateForm.controls[formControl].touched ||
      this.criteriaCreateForm.controls[formControl].dirty) &&
      this.criteriaCreateForm.controls[formControl].errors
      ? true
      : false;
  }

  changeStatusEdit(status) {
    this.editDetails.status = parseInt(status.srcElement.value, 0);
  }

  deleteCriteria(id) {
    this.loading = true;
    this.univoxService.deleteCriteria(id).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.getAllCriterias();
    },
    error => {
      this.notifier.notify('error', error.error);
      this.loading = false;
    }
    );
  }

  editCriteria(criteria) {
    this.editDetails = {
      degree_code: criteria.degree.degree_code,
      btch_one_stud_per_program: criteria.btch_one_stud_per_program.toString(),
      btch_two_stud_per_program: criteria.btch_two_stud_per_program.toString(),
      first_exam_paper_mark: criteria.first_exam_paper_mark.toString(),
      second_exam_paper_mark: criteria.second_exam_paper_mark.toString(),
      btch_one_cut_off_mark: criteria.btch_one_cut_off_mark.toString(),
      btch_two_cut_off_mark: criteria.btch_two_cut_off_mark.toString(),
      status: 1
    };
    // this.modalTitle = criteria.degree.degree_name;
  }

  updateCriteria() {
      this.loading = true;
      this.univoxService.getAllDegrees().subscribe(
        res => {
          const degreeList = res.data;
          console.log(res.data);
          for (const element of degreeList) {
            console.log('inloop');
            if (element.degree_code === this.editDetails.degree_code) {
              console.log('incon');
              this.editCriteriaId = element.degree_code;
              this.univoxService.updateCriteriaById(this.editCriteriaId, this.editDetails).subscribe(resp => {
                this.notifier.notify('success', resp.message);
                this.getAllCriterias();
              },
              error => {
                this.notifier.notify('error', error.error);
              }
              );
              }
            }
          this.loading = false;
          },
        error => {
          this.notifier.notify('error', error.error);
          this.loading = false;
        }
      );
  }
}
