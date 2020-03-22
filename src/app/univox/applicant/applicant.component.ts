import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApplicantPermissionService } from '../../service/permissions/applicant-permission-service';
import { UserDetailsService } from '../../service/user-details-service';
declare var $: any;

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss']
})
export class ApplicantComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  dtaOptions: DataTables.Settings = {};
  dtaTrigger = new Subject();

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
  nvqStudentType = 'NVQ';
  alStudentType = 'AL';
  canApplicantAdd: boolean;
  canApplicantEdit: boolean;
  canApplicantDelete: boolean;

  public loading = false;

  constructor(
    public fb: FormBuilder,
    private univoxService: UnivoxService,
    private notifier: NotifierService,
    private userDetailsService: UserDetailsService,
    private applicantPermissionService: ApplicantPermissionService
  ) {
    this.nvqApplicantCreateForm = this.fb.group({
      student_type: [''],
      application_no: ['', Validators.required],
      identity_no: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^([0-9]{9}[x|X|v|V]|[0-9]{12})$/)]],
      initials: ['', Validators.required],
      surename: ['', Validators.required],
      title: ['', Validators.required],
      gender: ['', Validators.required],
      ethnicity: [''],
      address_1: ['', Validators.required],
      address_2: [''],
      city: ['', Validators.required],
      district: ['', Validators.required],
      telephone: ['', [Validators.minLength(10), Validators.maxLength(12),
        Validators.pattern(/^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\d)\d{6}$/)]],
      mobile: ['', [Validators.minLength(10), Validators.maxLength(12),
        Validators.pattern(/^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\d)\d{6}$/)]],
      email: ['', [Validators.email,
        Validators.pattern(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)]],
      preference_1: ['', Validators.required],
      preference_2: [''],
      preference_3: [''],
      index_no: ['', Validators.required],
      diploma: ['', Validators.required],
      remarks: [''],
      marital_status: ['', Validators.required],
      permenent_address: [''],
      batch_type: ['', Validators.required]
    });
    this.uploadNvqBulkForm = this.fb.group({
      nvq_profile: ['']
    });
    this.uploadAlBulkForm = this.fb.group({
      al_profile: ['']
    });
    this.alApplicantCreateForm = this.fb.group({
      student_type: [''],
      application_no: ['', Validators.required],
      identity_no: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^([0-9]{9}[x|X|v|V]|[0-9]{12})$/)]],
      initials: ['', Validators.required],
      surename: ['', Validators.required],
      title: ['', Validators.required],
      gender: ['', Validators.required],
      ethnicity: [''],
      address_1: ['', Validators.required],
      address_2: [''],
      city: ['', Validators.required],
      district: ['', Validators.required],
      telephone: ['', [Validators.minLength(10), Validators.maxLength(12),
        Validators.pattern(/^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\d)\d{6}$/)]],
      mobile: ['', [Validators.minLength(10), Validators.maxLength(12),
        Validators.pattern(/^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\d)\d{6}$/)]],
      email: ['', [Validators.email,
        Validators.pattern(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)]],
      preference_1: ['', Validators.required],
      preference_2: [''],
      preference_3: [''],
      stream: ['', Validators.required],
      al_index_no: ['', Validators.required],
      z_score: ['', [Validators.required]],
      al_ict: [''],
      comm_and_media: [''],
      general_english: [''],
      general_common_test: ['']
    });
    // this.alApplicantCreateForm.patchValue({
    //   student_type: 'AL'
    // });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      scrollX: true
    };
    this.dtaOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      scrollX: true
    };
    this.canApplicantAdd = this.applicantPermissionService.isApplicantAdd(
      this.userDetailsService.getRequestInfo()
    );
    this.canApplicantEdit = this.applicantPermissionService.isApplicantEdit(
      this.userDetailsService.getRequestInfo()
    );
    this.canApplicantDelete = this.applicantPermissionService.isApplicantDelete(
      this.userDetailsService.getRequestInfo()
    );
    this.getNvqAplicants();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.dtaTrigger.unsubscribe();
  }

  getNvqAplicants() {
    const table = $('#tblNvqApplicantData').DataTable();
    table.clear().destroy();
    this.loading = true;
    this.univoxService.getNvqApplicant().subscribe(
      res => {
        this.nvqAplicantList = res.data;
        this.nvqAplicantFilterList = res.data;
        this.dtTrigger.next();
        this.loading = false;
        this.nvqApplicantCreateForm.reset();
        console.log(res.data);
      },
      error => {
        this.loading = false;
        this.notifier.notify('success', error.message);
      }
    );
  }

  changeNvqGender(item) {
    this.nvqApplicantCreateForm.patchValue({
      student_type: this.nvqStudentType
    });
    return this.nvqApplicantCreateForm.patchValue({
      gender: item.srcElement.value
    });
  }

  changeNvqTitle(item) {
    return this.nvqApplicantCreateForm.patchValue({
      title: item.srcElement.value
    });
  }

  changeNvqDistrict(item) {
    return this.nvqApplicantCreateForm.patchValue({
      district: item.srcElement.value
    });
  }

  changeNvqDiploma(item) {
    return this.nvqApplicantCreateForm.patchValue({
      diploma: item.srcElement.value
    });
  }

  changeNvqPreferenceOne(item) {
    return this.nvqApplicantCreateForm.patchValue({
      preference_1: item.srcElement.value
    });
  }
  changeNvqPreferenceTwo(item) {
    return this.nvqApplicantCreateForm.patchValue({
      preference_2: item.srcElement.value
    });
  }
  changeNvqPreferenceThree(item) {
    return this.nvqApplicantCreateForm.patchValue({
      preference_3: item.srcElement.value
    });
  }

  changeAlPreferenceOne(item) {
    return this.alApplicantCreateForm.patchValue({
      preference_1: item.srcElement.value
    });
  }
  changeAlPreferenceTwo(item) {
    return this.alApplicantCreateForm.patchValue({
      preference_2: item.srcElement.value
    });
  }
  changeAlPreferenceThree(item) {
    return this.alApplicantCreateForm.patchValue({
      preference_3: item.srcElement.value
    });
  }

  changeAlDistrict(item) {
    return this.alApplicantCreateForm.patchValue({
      district: item.srcElement.value
    });
  }

  changeAlGender(item) {
    this.alApplicantCreateForm.patchValue({
      student_type: this.alStudentType
    });
    return this.alApplicantCreateForm.patchValue({
      gender: item.srcElement.value
    });
  }

  changeAlSteam(item) {
    return this.alApplicantCreateForm.patchValue({
      stream: item.srcElement.value
    });
  }

  changeNvqMarital(item) {
    return this.nvqApplicantCreateForm.patchValue({
      marital_status: item.srcElement.value
    });
  }

  changeNvqBatchType(item) {
    return this.nvqApplicantCreateForm.patchValue({
      batch_type: item.srcElement.value
    });
  }

  changeAlTitle(item) {
    return this.alApplicantCreateForm.patchValue({
      title: item.srcElement.value
    });
  }

  changeAlEthnicity(item) {
    return this.alApplicantCreateForm.patchValue({
      ethnicity: item.srcElement.value
    });
  }

  changeNvqEthnicity(item) {
    return this.nvqApplicantCreateForm.patchValue({
      ethnicity: item.srcElement.value
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
        this.getNvqAplicants();
        this.nvqApplicantCreateForm.reset();
        this.showNvqApplicantCreateForm = false;
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
    this.loading = true;
    this.univoxService.createNvqBulkApplicant(this.uploadNvqBulkForm.get('nvq_profile').value).subscribe(
      res => {
        console.log(res);
        this.loading = false;
        this.getNvqAplicants();
        this.notifier.notify('success', res.message);
      },
      error => {
        console.log(error);
        this.loading = false;
        this.notifier.notify('error', error.error);
      }
    );
  }

  onBulkAlSubmit() {
    this.loading = true;
    this.univoxService.createAlBulkApplicant(this.uploadAlBulkForm.get('al_profile').value).subscribe(
      res => {
        console.log(res);
        this.loading = false;
        this.getAlAplicants();
        this.notifier.notify('success', res.message);
      },
      error => {
        console.log(error);
        this.loading = false;
        this.notifier.notify('error', error.error);
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
    const table = $('#tblAlApplicantData').DataTable();
    table.clear().destroy();
    this.loading = true;
    this.univoxService.getAlApplicant().subscribe(
      res => {
        this.alAplicantList = res.data;
        this.alAplicantFilterList = res.data;
        this.dtaTrigger.next();
        this.alApplicantCreateForm.reset();
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
        this.getAlAplicants();
        this.alApplicantCreateForm.reset();
        this.showAlApplicantCreateForm = false;
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

  editNvqApplicant(applicant) {
    this.nvqApplicantCreateForm.reset();
    this.nvqApplicantCreateForm.patchValue({
      student_type: applicant.student_type,
      application_no: applicant.nvq_details.application_no,
      identity_no: applicant.identity_no,
      initials: applicant.initials,
      surename: applicant.surename,
      title: applicant.title,
      gender: applicant.gender,
      ethnicity: applicant.ethnicity,
      address_1: [''],
      address_2: applicant.address_2,
      city: applicant.city,
      district: applicant.district,
      telephone: applicant.telephone,
      mobile: applicant.mobile,
      email: applicant.email,
      preference_1: applicant.preference_1,
      preference_2: applicant.preference_2,
      preference_3: applicant.preference_3,
      index_no: applicant.nvq_details.index_no,
      diploma: applicant.nvq_details.diploma,
      remarks: applicant.nvq_details.remarks,
      marital_status: [''],
      permenent_address: applicant.permenent_address,
      batch_type: applicant.batch_type
    });
    this.showNvqApplicantCreateForm = true;
  }
}
