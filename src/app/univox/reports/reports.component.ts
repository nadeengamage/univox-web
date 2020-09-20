import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ReportsPermissionService } from '../../service/permissions/reports-permission-service';
import { UserDetailsService } from '../../service/user-details-service';
declare var $: any;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnDestroy, OnInit {

  public loading = false;
  degreeList = [];
  filterDegreeData = [];
  details = {
    degree: '',
    studentType: '',
    steam: '',
  };
  showStudentType = false;
  showSteam = false;
  showGenerate = false;

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService,
    private userDetailsService: UserDetailsService,
    private reportsPermissionService: ReportsPermissionService
  ) {

  }

  ngOnInit() {
    this.getAllDegree();
  }

  ngOnDestroy() {
  }

  getAllDegree() {
    const table = $('#tblDegreeData').DataTable();
    table.clear().destroy();
    this.loading = true;
    this.univoxService.getAllDegrees().subscribe(
      res => {
        if (res.status === 200) {
        this.degreeList = res.data;
        } else {
          this.notifier.notify('warning', res.msg);
        }
        this.loading = false;
      },
      error => {
      }
    );
  }

  changeDegree(degree) {
    this.details.degree = degree.srcElement.value;
    if (this.details.degree !== null) {
      this.showStudentType = true;
    }
  }

  changeStudentType(studentType) {
    this.details.studentType = studentType.srcElement.value;
    if (this.details.degree !== null && this.details.studentType !== null && this.details.studentType === 'B1') {
      this.showSteam = true;
    } else {
      this.showSteam = false;
      this.showGenerate = true;
      this.details.steam = 'NVQ';
    }
  }

  changeSteam(steam) {
    this.details.steam = steam.srcElement.value;
    if (this.details.steam !== null) {
      this.showGenerate = true;
    }
  }

  createReport() {
    
  }
}
