import { Component, OnInit } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  filterUserData = [];
  usersList = [];

  constructor(
    private univoxService: UnivoxService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.univoxService.getAllUsers().subscribe(
      res => {
        this.usersList = res.data;
        this.filterUserData = res.data;
        console.log(res.data);
      },
      error => {
      }
    );
  }

  search(term: string) {
    if (!term) {
      this.filterUserData = this.usersList;
    } else {
      this.filterUserData = this.usersList.filter(empFirstName =>
        empFirstName.firstname.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
      if (this.filterUserData.length === 0) {
        console.log('No Data Found!', this.filterUserData);
      }
    }
  }
}
