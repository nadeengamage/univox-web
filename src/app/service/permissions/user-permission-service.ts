import { Injectable } from '@angular/core';
import { USERS_GROUPS } from '../common-utils';

@Injectable({
  providedIn: 'root'
})
export class UserPermissionService {
  private userView = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN];
  private userAdd = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN];
  private userEdit = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN];
  private userDelete = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN];

  constructor() {}

  isUserView(userGroup: string): boolean {
    return this.userView.includes(userGroup);
  }
  isUserAdd(userGroup: string): boolean {
    return this.userAdd.includes(userGroup);
  }
  isUserEdit(userGroup: string): boolean {
    return this.userEdit.includes(userGroup);
  }
  isUserDelete(userGroup: string): boolean {
    return this.userDelete.includes(userGroup);
  }
}
