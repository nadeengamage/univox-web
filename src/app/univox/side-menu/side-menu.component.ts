import { Component, OnInit } from '@angular/core';
import { SideBarLink } from './side-menu-constants/side-menu.model';
import { univoxNavItems } from './side-menu-constants/univox-nav.items';
import { UserPermissionService } from '../../service/permissions/user-permission-service';
import { UserDetailsService } from '../../service/user-details-service';
import { USERS_GROUPS } from '../../service/common-utils';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  links: SideBarLink[];
  canShowLink: boolean;
  UserGroups;

  constructor(
    private userDetailsService: UserDetailsService,
    private userPermissionService: UserPermissionService
  ) {
    this.UserGroups = USERS_GROUPS;
    this.links = univoxNavItems;
  }

  ngOnInit() {
    this.canShowLink = this.userPermissionService.isUserView(
      this.userDetailsService.getRequestInfo()
    );
  }

}
