import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../../services/http.service";
import {IUsageDetail} from "../../../entity/usage-detail";
import {NzTableModule} from "ng-zorro-antd/table";
import {DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-usage-detail',
  standalone: true,
  imports: [
    NzTableModule,
    NgForOf,
    DatePipe
  ],
  templateUrl: './usage-detail.component.html',
  styleUrl: './usage-detail.component.scss'
})
export class UsageDetailComponent implements OnInit{
  usageDetails: IUsageDetail[] = []
  constructor(private httpService: HttpService) {
  }
  ngOnInit(): void {
    this.getUsageDetails();
  }

  getUsageDetails = () => {
    this.httpService.get<any>(`ai/usage-detail`)
      .subscribe(res => {
        if (res.code === 0){
          this.usageDetails = res.data;
        }
      })
  }
}
