import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

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

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService
  ) {
    this.facultyCreateForm = this.fb.group({
      faculty_code: [''],
      faculty_name: [''],
      status: ['']
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
    this.getAllFaculty();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getAllFaculty() {
    this.univoxService.getAllFaculties().subscribe(
      res => {
        this.facultyList = res.data;
        this.filterFacultyData = res.data;
        this.dtTrigger.next();
        console.log(res.data);
      },
      error => {
      }
    );
  }

  createFaculty() {
    this.univoxService.createFaculty(this.facultyCreateForm.value).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.showFacultyCreateForm = false;
      this.facultyCreateForm = this.fb.group({
        faculty_code: [''],
        faculty_name: [''],
        status: ['']
      });
      this.getAllFaculty();
    },
    error => {
      this.notifier.notify('error', error.error);
    }
    );
  }

  deleteFaculty(id) {
    this.univoxService.deleteFaculty(id).subscribe(res => {
      this.notifier.notify('success', res.message);
      this.getAllFaculty();
    },
    error => {
      this.notifier.notify('error', error.error);
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
    this.univoxService.updateFacultyById(this.editFacultyId, this.editDetails).subscribe(res => {
      this.getAllFaculty();
      this.notifier.notify('success', res.message);
    },
    error => {
      this.notifier.notify('error', error.error);
    }
    );
  }
}
