import { Component, OnInit } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss']
})
export class CriteriaComponent implements OnInit {

  filterCriteriaData = [];
  criteriaList = [];

  constructor(
    private univoxService: UnivoxService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.getAllCriterias();
  }

  getAllCriterias() {
    this.univoxService.getAllCriterias().subscribe(
      res => {
        this.criteriaList = res.data;
        this.filterCriteriaData = res.data;
        console.log(res.data);
      },
      error => {
      }
    );
  }

  search(term: string) {
    if (!term) {
      this.filterCriteriaData = this.criteriaList;
    } else {
      this.filterCriteriaData = this.criteriaList.filter(fcode =>
        fcode.faculty_code.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
      if (this.filterCriteriaData.length === 0) {
        console.log('No Data Found!', this.filterCriteriaData);
      }
    }
  }
}
