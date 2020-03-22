import { Injectable } from '@angular/core';
import { USERS_GROUPS } from '../common-utils';

@Injectable({
  providedIn: 'root'
})
export class FacultyPermissionService {
  private facultyView = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN];
  private facultyAdd = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN];
  private facultyEdit = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN];
  private facultyDelete = [USERS_GROUPS.SUPERADMIN, USERS_GROUPS.ADMIN];

  constructor() {}

  isFacultyView(userGroup: string): boolean {
    return this.facultyView.includes(userGroup);
  }
  isFacultyAdd(userGroup: string): boolean {
    return this.facultyAdd.includes(userGroup);
  }
  isFacultyEdit(userGroup: string): boolean {
    return this.facultyEdit.includes(userGroup);
  }
  isFacultyDelete(userGroup: string): boolean {
    return this.facultyDelete.includes(userGroup);
  }
}
