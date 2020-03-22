import { Injectable } from '@angular/core';
import { USERS_GROUPS } from '../common-utils';

@Injectable({
  providedIn: 'root'
})
export class CriteriaPermissionService {
  private criteriaView = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN, USERS_GROUPS.DATAENTRY];
  private criteriaAdd = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN];
  private criteriaEdit = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN];
  private criteriaDelete = [USERS_GROUPS.SUPERADMIN];

  constructor() {}

  isCriteriaView(userGroup: string): boolean {
    return this.criteriaView.includes(userGroup);
  }
  isCriteriaAdd(userGroup: string): boolean {
    return this.criteriaAdd.includes(userGroup);
  }
  isCriteriaEdit(userGroup: string): boolean {
    return this.criteriaEdit.includes(userGroup);
  }
  isCriteriaDelete(userGroup: string): boolean {
    return this.criteriaDelete.includes(userGroup);
  }
}
