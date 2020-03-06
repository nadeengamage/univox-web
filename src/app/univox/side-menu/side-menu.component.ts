import { Component, OnInit } from '@angular/core';
import { SideBarLink } from './side-menu-constants/side-menu.model';
import { univoxNavItems } from './side-menu-constants/univox-nav.items';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  links: SideBarLink[];

  constructor() {
    this.links = univoxNavItems;
  }

  ngOnInit() {
  }

}
