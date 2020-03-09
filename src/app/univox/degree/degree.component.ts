import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

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

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService
  ) {
    this.degreeCreateForm = this.fb.group({
      faculty_code: [''],
      degree_code: [''],
      degree_name: ['']
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
    this.getAllDegree();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getAllDegree() {
    this.univoxService.getAllDegrees().subscribe(
      res => {
        this.degreeList = res.data;
        this.filterDegreeData = res.data;
        this.dtTrigger.next();
        console.log(res.data);
      },
      error => {
      }
    );
  }

  createDegree() {
    this.univoxService.createDegree(this.degreeCreateForm.value).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.showDegreeCreateForm = false;
      this.degreeCreateForm = this.fb.group({
        faculty_code: [''],
        degree_code: [''],
        degree_name: [''],
      });
      this.getAllDegree();
    },
    error => {
      this.notifier.notify('error', error.error);
    }
    );
  }

  deleteDegree(id) {
    this.univoxService.deleteDegree(id).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.getAllDegree();
    },
    error => {
      this.notifier.notify('error', error.error);
    }
    );
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
    this.univoxService.updateDegreeById(this.editDegreeId, this.editDetails).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.getAllDegree();
    },
    error => {
      this.notifier.notify('error', error.error);
    }
    );
  }
}
