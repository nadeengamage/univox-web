import { Injectable } from '@angular/core';
import { USERS_GROUPS } from '../common-utils';

@Injectable({
  providedIn: 'root'
})
export class DegreePermissionService {
  private degreeView = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN, USERS_GROUPS.DATAENTRY];
  private degreeAdd = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN];
  private degreeEdit = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN];
  private degreeDelete = [USERS_GROUPS.SUPERADMIN];

  constructor() {}

  isDegreeView(userGroup: string): boolean {
    return this.degreeView.includes(userGroup);
  }
  isDegreeAdd(userGroup: string): boolean {
    return this.degreeAdd.includes(userGroup);
  }
  isDegreeEdit(userGroup: string): boolean {
    return this.degreeEdit.includes(userGroup);
  }
  isDegreeDelete(userGroup: string): boolean {
    return this.degreeDelete.includes(userGroup);
  }
}
