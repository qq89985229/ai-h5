import {Component, OnInit} from '@angular/core';
import {NzTableComponent, NzTableModule} from "ng-zorro-antd/table";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {DatePipe, NgForOf} from "@angular/common";
import {IChat} from "../../../entity/chat";
import {HttpService} from "../../../services/http.service";
import {NzSpaceComponent, NzSpaceItemDirective} from "ng-zorro-antd/space";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {RouterLink} from "@angular/router";
import {CommonService} from "../../../services/common.service";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    NzTableComponent,
    NzDividerComponent,
    NgForOf,
    NzTableModule,
    DatePipe,
    NzSpaceComponent,
    NzButtonComponent,
    NzTooltipDirective,
    NzIconDirective,
    NzSpaceItemDirective,
    RouterLink
  ],
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit{
  chatList: IChat[] = []

  constructor(
    private httpService: HttpService,
    private commonService: CommonService
  ){
  }
  ngOnInit(): void {
    this.getChatList();
  }

  getChatList = () => {
    this.httpService.get<any>(`ai/chat/list`)
      .subscribe(res => {
        if (res.code === 0){
          this.chatList = res.data;
        }
      })
  }

  delete(body: any): void{
    this.httpService.delete<any>(`ai/chat`, body)
      .subscribe(res => {
        this.commonService.resultCallback(res);
        if (res.code === 0){
          this.getChatList();
        }
      });
  }

  deleteConfirm = (ids: string[] | Set<string>) => {
    const body = {ids: [...ids]};
    this.commonService.deleteConfirm([...ids], () => this.delete(body));
  }

}
