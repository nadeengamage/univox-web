import { Component, OnInit } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})
export class FacultyComponent implements OnInit {

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
    this.getAllFaculty();
  }

  getAllFaculty() {
    this.univoxService.getAllFaculties().subscribe(
      res => {
        this.facultyList = res.data;
        this.filterFacultyData = res.data;
        console.log(res.data);
      },
      error => {
      }
    );
  }

  search(term: string) {
    if (!term) {
      this.filterFacultyData = this.facultyList;
    } else {
      this.filterFacultyData = this.facultyList.filter(fcode =>
        fcode.faculty_code.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
      if (this.filterFacultyData.length === 0) {
        console.log('No Data Found!', this.filterFacultyData);
      }
    }
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
