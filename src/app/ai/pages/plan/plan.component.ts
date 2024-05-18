import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {IPlan} from "../../../entity/plan";
import {HttpService} from "../../../services/http.service";
import {NzQRCodeModule} from "ng-zorro-antd/qr-code";
import {IOrder} from "../../../entity/order";
import {environment} from "../../../../environments/environment";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {NzMessageService} from "ng-zorro-antd/message";
import {Router} from "@angular/router";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzListModule} from "ng-zorro-antd/list";
import {NzFlexModule} from "ng-zorro-antd/flex";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzButtonModule} from "ng-zorro-antd/button";

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzGridModule,
    NzFlexModule,
    NzBadgeModule,
    NzCardModule,
    NzListModule,
    NzModalModule,
    NzButtonModule,
    NzQRCodeModule,
  ],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss'
})
export class PlanComponent implements OnInit, OnDestroy{
  webSocketUrl: string = environment.webSocketUrl;
  webSocket$: WebSocketSubject<any>;
  planList: IPlan[] = []
  order: IOrder  = {} as IOrder;
  showPayModal = false;
  constructor(
    private router: Router,
    private messageService: NzMessageService,
    private httpService: HttpService) {
    this.webSocket$ = webSocket(`${this.webSocketUrl}/order`);
  }

  ngOnInit(): void {
    this.getPlanList();
  }

  ngOnDestroy(): void {
    this.webSocket$.complete();
  }

  getPlanList = () => {
    this.httpService.get<any>(`ai/plan`)
      .subscribe(res => {
        if (res.code === 0){
          this.planList = res.data;
        }
      })
  }

  submitOrder = (planId: string) => {
    this.httpService.post<any>(`ai/order`, {planId})
      .subscribe(res => {
        if (res.code === 0 && res.data) {
          this.showPayModal = true;
          this.order = res.data;
          this.webSocket$.next({"orderId": this.order.id});
          this.webSocket$.subscribe((message: IOrder) => {
            if (message.tradeState === 'SUCCESS'){
              this.showPayModal = false;
              this.webSocket$.complete();
              this.messageService.success('支付成功', {
                nzDuration: 3000
              });
              setTimeout(() => this.router.navigate(['/ai/plan/user-plan']).then(), 4000);
            }
          })
        }
      });
  }

}
