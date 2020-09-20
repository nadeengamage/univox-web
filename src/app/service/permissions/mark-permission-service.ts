import { Injectable } from '@angular/core';
import { USERS_GROUPS } from '../common-utils';

@Injectable({
  providedIn: 'root'
})
export class MarkPermissionService {
  private markView = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN, USERS_GROUPS.DATAENTRY];
  private markAdd = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN, USERS_GROUPS.DATAENTRY];
  private markEdit = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN, USERS_GROUPS.DATAENTRY];
  private markDelete = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN];

  constructor() {}

  isMarkView(userGroup: string): boolean {
    return this.markView.includes(userGroup);
  }
  isMarkAdd(userGroup: string): boolean {
    return this.markAdd.includes(userGroup);
  }
  isMarkEdit(userGroup: string): boolean {
    return this.markEdit.includes(userGroup);
  }
  isMarkDelete(userGroup: string): boolean {
    return this.markDelete.includes(userGroup);
  }
}
