import { Injectable } from '@angular/core';
import { USERS_GROUPS } from '../common-utils';

@Injectable({
  providedIn: 'root'
})
export class ApplicantPermissionService {
  private applicantView = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN, USERS_GROUPS.DATAENTRY];
  private applicantAdd = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN, USERS_GROUPS.DATAENTRY];
  private applicantEdit = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN, USERS_GROUPS.DATAENTRY];
  private applicantDelete = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN];

  constructor() {}

  isApplicantView(userGroup: string): boolean {
    return this.applicantView.includes(userGroup);
  }
  isApplicantAdd(userGroup: string): boolean {
    return this.applicantAdd.includes(userGroup);
  }
  isApplicantEdit(userGroup: string): boolean {
    return this.applicantEdit.includes(userGroup);
  }
  isApplicantDelete(userGroup: string): boolean {
    return this.applicantDelete.includes(userGroup);
  }
}
