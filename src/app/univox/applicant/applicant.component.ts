import { Component, OnInit } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss']
})
export class ApplicantComponent implements OnInit {

  nvqAplicantList = [];
  nvqAplicantFilterList = [];
  alAplicantList = [];
  alAplicantFilterList = [];

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService,
  ) {
  }

  ngOnInit() {
    this.getNvqAplicants();
  }

  getNvqAplicants() {
    this.univoxService.getNvqApplicant().subscribe(
      res => {
        this.nvqAplicantList = res.data;
        this.nvqAplicantFilterList = res.data;
        console.log(res.data);
      },
      error => {
      }
    );
  }

  search(term: string) {
    if (!term) {
      this.nvqAplicantFilterList = this.nvqAplicantList;
    } else {
      this.nvqAplicantFilterList = this.nvqAplicantList.filter(dcode =>
        dcode.degree_code.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
      if (this.nvqAplicantFilterList.length === 0) {
        console.log('No Data Found!', this.nvqAplicantFilterList);
      }
    }
  }

  getAlAplicants() {

  }
}
