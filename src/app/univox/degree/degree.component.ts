import { Component, OnInit } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.scss']
})
export class DegreeComponent implements OnInit {

  filterDegreeData = [];
  degreeList = [];

  constructor(
    private univoxService: UnivoxService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
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
}
