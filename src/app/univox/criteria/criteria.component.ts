import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

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

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService
  ) {
    this.criteriaCreateForm = this.fb.group({
      degree_code: [''],
      btch_one_stud_per_program: [''],
      btch_two_stud_per_program: [''],
      first_exam_paper_mark: [''],
      second_exam_paper_mark: [''],
      btch_one_cut_off_mark: [''],
      btch_two_cut_off_mark: [''],
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
    this.getAllCriterias();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getAllCriterias() {
    this.univoxService.getAllCriterias().subscribe(
      res => {
        this.criteriaList = res.data;
        this.filterCriteriaData = res.data;
        this.dtTrigger.next();
        console.log(res.data);
      },
      error => {
      }
    );
  }

  createCriteria() {
    this.univoxService.createCriteria(this.criteriaCreateForm.value).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.showCriteriaCreateForm = false;
      this.criteriaCreateForm = this.fb.group({
        degree_code: [''],
        btch_one_stud_per_program: [''],
        btch_two_stud_per_program: [''],
        first_exam_paper_mark: [''],
        second_exam_paper_mark: [''],
        btch_one_cut_off_mark: [''],
        btch_two_cut_off_mark: [''],
      });
      this.getAllCriterias();
    },
    error => {
      this.notifier.notify('error', error.error);
    }
    );
  }

  deleteCriteria(id) {
    this.univoxService.deleteCriteria(id).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.getAllCriterias();
    },
    error => {
      this.notifier.notify('error', error.error);
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
          },
        error => {
          this.notifier.notify('error', error.error);
        }
      );
  }
}
