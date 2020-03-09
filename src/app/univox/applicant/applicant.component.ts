import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss']
})
export class ApplicantComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  nvqAplicantList = [];
  nvqAplicantFilterList = [];
  alAplicantList = [];
  alAplicantFilterList = [];
  showApplicantCreateForm = false;
  applicantCreateForm: FormGroup;
  submitted = false;

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService,
  ) {
    this.applicantCreateForm = this.fb.group({
      student_type: [''],
      application_no: ['', Validators.required],
      identity_no: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^([0-9]{9}[x|X|v|V]|[0-9]{12})$/)]],
      initials: [''],
      surename: [''],
      title: [''],
      gender: [''],
      ethnicity: [''],
      address_1: [''],
      address_2: [''],
      address_3: [''],
      city: [''],
      district: [''],
      telephone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12)]],
      mobile: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12),
        Validators.pattern(/^7|0|(?:\+94)[0-9]{9,10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      preference_1: [''],
      preference_2: [''],
      preference_3: [''],
      index_no: [''],
      diploma: [''],
      remarks: [''],
      civil_status: [''],
      permenent_address: [''],
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      scrollX: true
    };
    this.getNvqAplicants();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getNvqAplicants() {
    this.univoxService.getNvqApplicant().subscribe(
      res => {
        this.nvqAplicantList = res.data;
        this.nvqAplicantFilterList = res.data;
        this.dtTrigger.next();
        console.log(res.data);
      },
      error => {
      }
    );
  }

  changeType(item) {
    return this.applicantCreateForm.patchValue({
      student_type: item.srcElement.value.slice(3)
    });
  }

  changeGender(item) {
    return this.applicantCreateForm.patchValue({
      gender: item.srcElement.value.slice(3)
    });
  }

  changeCivil(item) {
    return this.applicantCreateForm.patchValue({
      civil_status: item.srcElement.value.slice(3)
    });
  }

  isInvalidField(formControl) {
    return (this.applicantCreateForm.controls[formControl].touched ||
      this.applicantCreateForm.controls[formControl].dirty) &&
      this.applicantCreateForm.controls[formControl].errors
      ? true
      : false;
  }

  createApplicant() {
    console.log(this.applicantCreateForm);
    if (!this.applicantCreateForm.invalid) {
    this.submitted = false;
    this.univoxService.createApplicant(this.applicantCreateForm.value).subscribe(
      res => {
        this.nvqAplicantList = res.data;
        this.nvqAplicantFilterList = res.data;
        this.ngOnDestroy();
        this.getNvqAplicants();
        this.dtTrigger.next();
        this.notifier.notify('success', res.message);
        console.log(res.data);
      },
      error => {
        this.notifier.notify('error', error.error);
      }
    );
    } else {
      this.submitted = true;
    }
  }

  onReset() {
    this.submitted = false;
    this.applicantCreateForm.reset();
  }
}
