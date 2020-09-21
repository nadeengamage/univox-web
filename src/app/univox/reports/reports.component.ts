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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
declare var $: any;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  public loading = false;
  degreeList = [];
  filterDegreeData = [];
  details = {
    degree: '',
    batch_type: '',
    stream: '',
  };
  showStudentType = false;
  showSteam = false;
  showGenerate = false;
  makeJson = [];
  bindReport = [];
  reportsList = [];

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
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      scrollX: true
    };
    this.getAllDegree();
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  getAllDegree() {
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

  changeStudentType(batchType) {
    this.details.batch_type = batchType.srcElement.value;
    if (this.details.degree !== null && this.details.batch_type !== null && this.details.batch_type === 'B1') {
      this.showSteam = true;
    } else {
      this.showSteam = false;
      this.showGenerate = true;
      this.details.stream = 'NVQ';
    }
  }

  changeSteam(stream) {
    this.details.stream = stream.srcElement.value;
    if (this.details.stream !== null) {
      this.showGenerate = true;
    }
  }

  cancelCreateReport() {
    this.details = {
      degree: '',
      batch_type: '',
      stream: '',
    };
    this.showStudentType = false;
    this.showSteam = false;
    this.showGenerate = false;
  }

  createReport() {
    const table = $('#tblReportData').DataTable();
    table.clear().destroy();
    this.loading = true;
    this.univoxService.createReports(this.details).subscribe(
      res => {
        if (res.message) {
        this.reportsList = res.result;
        } else {
          this.notifier.notify('warning', 'Cannot create report!');
          this.loading = false;
        }
        setTimeout(() => {
          this.dtTrigger.next();
          this.loading = false;
        }, 300);
      },
      error => {
        this.notifier.notify('error', 'Oops!, Connection failed.');
        this.loading = false;
        this.cancelCreateReport();
      }
    );
  }

  downloadExcelReport() {
    this.bindReport = [];
    for (let i = 0; i < this.reportsList.length; i++) {
      console.log(i, 'i');
      this.makeJson = new Array(
        this.reportsList[i].std_identity_no, this.reportsList[i].std_application_no, this.reportsList[i].std_student_type,
        this.reportsList[i].std_batch_type, this.reportsList[i].deg_degree_code,
        this.reportsList[i].std_title, this.reportsList[i].std_initials,
        this.reportsList[i].std_surename, this.reportsList[i].std_gender, this.reportsList[i].std_address_1,
        this.reportsList[i].std_address_2, this.reportsList[i].std_address_3,
        this.reportsList[i].std_district, this.reportsList[i].std_telephone,
        this.reportsList[i].student_marks.toString(),
        this.reportsList[i].preferance_type
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

    if (this.reportsList.length === this.bindReport.length) {
    // Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Univox-Report -' + this.datePipe.transform(new Date(), 'medium') + '.xlsx');
        });
    }

  }

  downloadPdfReport() {
    // this.notifier.notify('warning', 'Sorry! This feature does not support yet.');
    this.bindReport = [];
    for (let i = 0; i < this.reportsList.length; i++) {
      console.log(i, 'i');
      this.makeJson.push(this.reportsList[i].std_identity_no === undefined ? '' : this.reportsList[i].std_identity_no);
      this.makeJson.push(this.reportsList[i].std_application_no);
      this.makeJson.push(this.reportsList[i].std_student_type);
      this.makeJson.push(this.reportsList[i].std_batch_type  === undefined ? '' : this.reportsList[i].std_batch_type);
      this.makeJson.push(this.reportsList[i].deg_degree_code);
      this.makeJson.push(this.reportsList[i].std_title);
      this.makeJson.push(this.reportsList[i].std_initials);
      this.makeJson.push(this.reportsList[i].std_surename);
      this.makeJson.push(this.reportsList[i].std_gender);
      this.makeJson.push(this.reportsList[i].std_address_1);
      this.makeJson.push(this.reportsList[i].std_address_2);
      this.makeJson.push(this.reportsList[i].std_address_3);
      this.makeJson.push(this.reportsList[i].std_district);
      this.makeJson.push(this.reportsList[i].std_telephone);
      this.makeJson.push(this.reportsList[i].student_marks.toString());
      this.makeJson.push(this.reportsList[i].preferance_type);

      this.bindReport.push(this.makeJson);

      this.makeJson = [];
    }
    // const finalArray = this.makeArray();
    console.log(this.bindReport);
    if (this.reportsList.length === this.bindReport.length) {
      const docPdf = {
        header: '',
        pageOrientation: 'landscape',
        pageSize: 'A3',
        content: [
          {text: 'UNIVOTEC Student Selection Report - 2020(UnivoX)', style: 'header'},
          {text: 'This is UnivoX© 2020 system generated PDF. - ' + this.datePipe.transform(new Date(), 'medium'), style: 'subheader',
          fontSize: 10, color: 'gray', italics: true, margin: [0, 0, 0, 10]},
          {
            style: 'tableExample',
            table: {
              // widths: [ '*', '*' ],
              headerRows: 1,
              body: [
                [
                  {text: 'Identity No', bold: true, fillColor: '#ffe49f'},
                  {text: 'Application No', bold: true, fillColor: '#ffe49f'},
                  {text: 'Student Type', bold: true, fillColor: '#ffe49f'},
                  {text: 'Batch Type', bold: true, fillColor: '#ffe49f'},
                  {text: 'Degree Code', bold: true, fillColor: '#ffe49f'},
                  {text: 'Title', bold: true, fillColor: '#ffe49f'},
                  {text: 'Initials', bold: true, fillColor: '#ffe49f'},
                  {text: 'Surename', bold: true, fillColor: '#ffe49f'},
                  {text: 'Gender', bold: true, fillColor: '#ffe49f'},
                  {text: 'Address 1', bold: true, fillColor: '#ffe49f'},
                  {text: 'Address 2', bold: true, fillColor: '#ffe49f'},
                  {text: 'Address 3', bold: true, fillColor: '#ffe49f'},
                  {text: 'District', bold: true, fillColor: '#ffe49f'},
                  {text: 'Telephone', bold: true, fillColor: '#ffe49f'},
                  {text: 'Marks', bold: true, fillColor: '#ffe49f'},
                  {text: 'Preference Sequence', bold: true, fillColor: '#ffe49f'}
                ],
                this.bindReport
              ]
            }
          }
        ]
      };
      // const test = [
      //   ['Identity No', 'Application No', 'Student Type', 'Batch Type', 'Degree Code', 'Title', 'Initials',
      // 'Surename', 'Gender', 'Address 1', 'Address 2', 'Address 3', 'District', 'Telephone', 'Marks', 'Preference Sequence'],
      // ['Identity No', 'Application No', 'Student Type', 'Batch Type', 'Degree Code', 'Title', 'Initials',
      // 'Surename', 'Gender', 'Address 1', 'Address 2', 'Address 3', 'District', 'Telephone', 'Marks', 'Preference Sequence']
      // ];
      // console.log(docPdf, 'test');
      pdfMake.createPdf(docPdf).open();
    }

  }

  makeArray() {
    console.log(this.bindReport)
    this.bindReport.forEach(item => {
      return item;
    });
  }
}
