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
  showNvqApplicantCreateForm = false;
  nvqApplicantCreateForm: FormGroup;
  nvqSubmitted = false;
  showAlApplicantCreateForm = false;
  alApplicantCreateForm: FormGroup;
  uploadNvqBulkForm: FormGroup;
  uploadAlBulkForm: FormGroup;
  alSubmitted = false;
  showNvqBulkUpload = false;

  public loading = false;

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService,
  ) {
    this.nvqApplicantCreateForm = this.fb.group({
      student_type: ['', Validators.required],
      application_no: ['', Validators.required],
      identity_no: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^([0-9]{9}[x|X|v|V]|[0-9]{12})$/)]],
      initials: ['', Validators.required],
      surename: ['', Validators.required],
      title: ['', Validators.required],
      gender: ['', Validators.required],
      ethnicity: ['', Validators.required],
      address_1: ['', Validators.required],
      address_2: [''],
      address_3: [''],
      city: ['', Validators.required],
      district: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12)]],
      mobile: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12),
        Validators.pattern(/^7|0|(?:\+94)[0-9]{9,10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      preference_1: ['', Validators.required],
      preference_2: [''],
      preference_3: [''],
      index_no: ['', Validators.required],
      diploma: ['', Validators.required],
      remarks: [''],
      marital_status: ['', Validators.required],
      permenent_address: ['', Validators.required],
      batch_type: ['', Validators.required]
    });
    this.uploadNvqBulkForm = this.fb.group({
      nvq_profile: ['']
    });
    this.uploadAlBulkForm = this.fb.group({
      al_profile: ['']
    });
    this.alApplicantCreateForm = this.fb.group({
      student_type: ['', Validators.required],
      application_no: ['', Validators.required],
      identity_no: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^([0-9]{9}[x|X|v|V]|[0-9]{12})$/)]],
      initials: ['', Validators.required],
      surename: ['', Validators.required],
      title: ['', Validators.required],
      gender: ['', Validators.required],
      ethnicity: ['', Validators.required],
      address_1: ['', Validators.required],
      address_2: [''],
      address_3: [''],
      city: ['', Validators.required],
      district: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12)]],
      mobile: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12),
        Validators.pattern(/^7|0|(?:\+94)[0-9]{9,10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      preference_1: ['', Validators.required],
      preference_2: [''],
      preference_3: [''],
      stream: ['', Validators.required],
      al_index_no: ['', Validators.required],
      z_score: ['', [Validators.required, Validators.pattern(/^\d*\.?\d{0,2}$/)]],
      al_ict: ['', Validators.required],
      comm_and_media: ['', Validators.required],
      general_english: ['', Validators.required],
      general_common_test: ['', Validators.required],
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
    this.loading = true;
    this.univoxService.getNvqApplicant().subscribe(
      res => {
        this.nvqAplicantList = res.data;
        this.nvqAplicantFilterList = res.data;
        this.dtTrigger.next();
        this.loading = false;
        console.log(res.data);
      },
      error => {
        this.loading = false;
        this.notifier.notify('success', error.message);
      }
    );
  }

  changeNvqType(item) {
    return this.nvqApplicantCreateForm.patchValue({
      student_type: item.srcElement.value.slice(3)
    });
  }

  changeAlType(item) {
    return this.alApplicantCreateForm.patchValue({
      student_type: item.srcElement.value.slice(3)
    });
  }

  changeNvqGender(item) {
    return this.nvqApplicantCreateForm.patchValue({
      gender: item.srcElement.value.slice(3)
    });
  }

  changeAlGender(item) {
    return this.alApplicantCreateForm.patchValue({
      gender: item.srcElement.value.slice(3)
    });
  }

  changeNvqMarital(item) {
    return this.nvqApplicantCreateForm.patchValue({
      marital_status: item.srcElement.value.slice(3)
    });
  }

  changeNvqBatchType(item) {
    return this.nvqApplicantCreateForm.patchValue({
      batch_type: item.srcElement.value.slice(3)
    });
  }

  isInvalidNvqField(formControl) {
    return (this.nvqApplicantCreateForm.controls[formControl].touched ||
      this.nvqApplicantCreateForm.controls[formControl].dirty) &&
      this.nvqApplicantCreateForm.controls[formControl].errors
      ? true
      : false;
  }

  isInvalidAlField(formControl) {
    return (this.alApplicantCreateForm.controls[formControl].touched ||
      this.alApplicantCreateForm.controls[formControl].dirty) &&
      this.alApplicantCreateForm.controls[formControl].errors
      ? true
      : false;
  }

  createNvqApplicant() {
    console.log(this.nvqApplicantCreateForm);

    if (!this.nvqApplicantCreateForm.invalid) {
    this.nvqSubmitted = false;
    this.univoxService.createApplicant(this.nvqApplicantCreateForm.value).subscribe(
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
      this.nvqSubmitted = true;
    }
  }

  onNvqFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadNvqBulkForm.get('nvq_profile').setValue(file);
    }
  }

  onAlFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadAlBulkForm.get('al_profile').setValue(file);
    }
  }

  onBulkNvqSubmit() {
    const formData = new FormData();
    formData.append('file', this.uploadNvqBulkForm.get('nvq_profile').value);
    this.univoxService.createNvqBulkApplicant(formData).subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.log(error);
      }
    );
  }

  onBulkAlSubmit() {
    const formData = new FormData();
    formData.append('file', this.uploadNvqBulkForm.get('al_profile').value);
    this.univoxService.createAlBulkApplicant(formData).subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.log(error);
      }
    );
  }

  onNvqReset() {
    this.nvqSubmitted = false;
    this.nvqApplicantCreateForm.reset();
  }

  onAlReset() {
    this.alSubmitted = false;
    this.alApplicantCreateForm.reset();
  }

  getAlAplicants() {
    this.dtTrigger.unsubscribe();
    this.dtTrigger = new Subject();
    this.loading = true;
    this.univoxService.getAlApplicant().subscribe(
      res => {
        this.alAplicantList = res.data;
        this.alAplicantFilterList = res.data;
        this.dtTrigger.next();
        this.loading = false;
        console.log(res.data);
      },
      error => {
        this.loading = false;
        this.notifier.notify('success', error.message);
      }
    );
  }

  createAlApplicant() {
    console.log(this.alApplicantCreateForm);
    if (!this.alApplicantCreateForm.invalid) {
    this.alSubmitted = false;
    this.loading = true;
    this.univoxService.createApplicant(this.alApplicantCreateForm.value).subscribe(
      res => {
        this.alAplicantList = res.data;
        this.alAplicantFilterList = res.data;
        this.ngOnDestroy();
        this.getAlAplicants();
        this.dtTrigger.next();
        this.loading = false;
        this.notifier.notify('success', res.message);
        console.log(res.data);
      },
      error => {
        this.loading = false;
        this.notifier.notify('error', error.error);
      }
    );
    } else {
      this.alSubmitted = true;
    }
  }
}
