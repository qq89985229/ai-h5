import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../../services/http.service";
import {IUserPlan} from "../../../entity/user-plan";
import {NzTableModule} from "ng-zorro-antd/table";
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-user-plan',
  standalone: true,
  imports: [
    NzTableModule,
    NgForOf,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './user-plan.component.html',
  styleUrl: './user-plan.component.scss'
})
export class UserPlanComponent implements OnInit{
  userPlanList: IUserPlan[] = []
  constructor(private httpService: HttpService) {
  }
  ngOnInit(): void {
    this.getUserPlanList();
  }

  getUserPlanList = () => {
    this.httpService.get<any>(`ai/user-plan`)
      .subscribe(res => {
        if (res.code === 0){
          this.userPlanList = res.data;
        }
      })
  }

}
