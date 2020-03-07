import { Component, OnInit } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.scss']
})
export class DegreeComponent implements OnInit {

  filterDegreeData = [];
  degreeList = [];
  showDegreeCreateForm = false;
  modalTitle = null;
  editDetails = {
    faculty_id: '',
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
      faculty_id: [''],
      degree_code: [''],
      degree_name: [''],
      status: ['']
    });
  }

  ngOnInit() {
    this.getAllDegree();
  }

  getAllDegree() {
    this.univoxService.getAllDegrees().subscribe(
      res => {
        this.degreeList = res.data;
        this.filterDegreeData = res.data;
        console.log(res.data);
      },
      error => {
      }
    );
  }

  search(term: string) {
    if (!term) {
      this.filterDegreeData = this.degreeList;
    } else {
      this.filterDegreeData = this.degreeList.filter(dcode =>
        dcode.degree_code.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
      if (this.filterDegreeData.length === 0) {
        console.log('No Data Found!', this.filterDegreeData);
      }
    }
  }

  createDegree() {
    this.univoxService.createDegree(this.degreeCreateForm.value).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.showDegreeCreateForm = false;
      this.degreeCreateForm = this.fb.group({
        faculty_id: [''],
        degree_code: [''],
        degree_name: [''],
        status: ['']
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
      faculty_id: degree.faculty.faculty_code,
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
