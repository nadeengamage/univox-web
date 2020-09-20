import { Injectable } from '@angular/core';
import { USERS_GROUPS } from '../common-utils';

@Injectable({
  providedIn: 'root'
})
export class ReportsPermissionService {
  private reportView = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN, USERS_GROUPS.DATAENTRY];

  constructor() {}

  isMarkView(userGroup: string): boolean {
    return this.reportView.includes(userGroup);
  }
}
