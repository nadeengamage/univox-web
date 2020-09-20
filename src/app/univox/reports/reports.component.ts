import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ReportsPermissionService } from '../../service/permissions/reports-permission-service';
import { UserDetailsService } from '../../service/user-details-service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '../../../../node_modules/@angular/common';
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
  makeJson = [];
  bindReport = [];
  mockJson = [
    {
      std_identity_no: '945211954V',
      std_application_no: 'NVQ/BED/B2/001',
      std_student_type: 'NVQ',
      std_batch_type: 'B2',
      deg_code: 'BED',
      std_title: 'Ms.',
      std_initials: 'R.A.M.M.',
      std_surename: '`ZXDER',
      std_gender: 'Male',
      std_telephone: '03928475',
      std_address_1: '403/125',
      std_address_2: '80th Lane',
      std_address_3: '0th Lane',
      std_district: 'Nugegoda',
      std_marks: '100',
      preference_sequence: 1
    },
    {
      std_identity_no: '111111',
      std_application_no: 'NVQ/BED/B2/001',
      std_student_type: '111',
      std_batch_type: '111',
      deg_code: '111',
      std_title: 'Ms.',
      std_initials: 'R.A.M.M.',
      std_surename: '`1111',
      std_gender: 'Male',
      std_telephone: '11111',
      std_address_1: '403/125',
      std_address_2: '80th Lane',
      std_address_3: '0th Lane',
      std_district: 'Nugegoda',
      std_marks: '100',
      preference_sequence: 1
    }
  ];

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService,
    private userDetailsService: UserDetailsService,
    private reportsPermissionService: ReportsPermissionService,
    private datePipe: DatePipe
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

  cancelCreateReport() {
    this.details = {
      degree: '',
      studentType: '',
      steam: '',
    };
    this.showStudentType = false;
    this.showSteam = false;
    this.showGenerate = false;
  }

  createReport() {
    this.bindReport = [];
    for (let i = 0; i < this.mockJson.length; i++) {
      console.log(i, 'i');
      this.makeJson = new Array(
        this.mockJson[i].std_identity_no, this.mockJson[i].std_application_no, this.mockJson[i].std_student_type,
        this.mockJson[i].std_batch_type, this.mockJson[i].deg_code,
        this.mockJson[i].std_title, this.mockJson[i].std_initials,
        this.mockJson[i].std_surename, this.mockJson[i].std_gender,
        this.mockJson[i].std_telephone, this.mockJson[i].std_address_1,
        this.mockJson[i].std_address_2, this.mockJson[i].std_address_3,
        this.mockJson[i].std_district, this.mockJson[i].std_marks,
        this.mockJson[i].preference_sequence.toString()
      );
      this.bindReport.push(this.makeJson);

      this.makeJson = [];
    }
    console.log(this.bindReport, 'make');


    const title = 'UNIVOTEC Student Selection Report - 2020(UnivoX)';
    const header = ['Identity No', 'Application No', 'Student Type', 'Batch Type', 'Degree Code', 'Title', 'Initials',
  'Surename', 'Gender', 'Address 1', 'Address 2', 'Address 3', 'District', 'Telephone', 'Marks', 'Preference Sequence'];
    const data = this.bindReport;

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Univox Report');

    const titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
    worksheet.addRow([]);
    const subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')]);

    // Blank Row
    worksheet.addRow([]);
    // Add Header Row
    const headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    data.forEach(d => {
      const row = worksheet.addRow(d);
      const qty = row.getCell(5);
      let color = 'FFFFFF';
      if (+qty.value < 500) {
        color = 'FFFFFF';
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      };
    }
    );
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 20;
    worksheet.getColumn(12).width = 20;
    worksheet.getColumn(13).width = 20;
    worksheet.getColumn(14).width = 20;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 20;
    worksheet.addRow([]);
    // Footer Row
    const footerRow = worksheet.addRow(['This is UnivoX© 2020 system generated excel sheet. - ' + this.datePipe.transform(new Date(), 'medium')]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCFFE5' }
    };
    footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    // Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:P${footerRow.number}`);

    if (this.mockJson.length === this.bindReport.length) {
    // Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Univox-Report -' + this.datePipe.transform(new Date(), 'medium') + '.xlsx');
        });
    }

  }
}
