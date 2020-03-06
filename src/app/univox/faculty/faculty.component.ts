import { Component, OnInit } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})
export class FacultyComponent implements OnInit {

  filterFacultyData = [];
  facultyList = [];

  constructor(
    private univoxService: UnivoxService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
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
}
