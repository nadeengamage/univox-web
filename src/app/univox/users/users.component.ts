import { Component, OnInit } from '@angular/core';
import { UnivoxService } from './../../service/univox-service.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(
    private univoxService: UnivoxService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
  }
}
