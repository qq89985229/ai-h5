import {Component, Inject} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import {IUser} from "../../../entity/user";
import {UserService} from "../../../services/user.service";
import {Observable} from "rxjs";
import {LoginComponent} from "../login/login.component";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {AsyncPipe, NgIf} from "@angular/common";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzDropDownModule,
    NzAvatarModule,
    NzDividerModule,
    NgIf,
    AsyncPipe,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent{
  user: Observable<IUser | any>;
  isCollapsed = false;

  constructor(
    @Inject(DA_SERVICE_TOKEN) private iTokenService: ITokenService,
    private modalService: NzModalService,
    private userService: UserService,
  ) {
    this.user = this.userService.user$;
    this.userService.showLoginModal$.subscribe(showLoginModal => {
      if (showLoginModal) {
        this.modalService.create({
          nzTitle: "手机号登录",
          nzContent: LoginComponent,
          nzCentered: true,
          nzFooter: null})
      }
    })
  }

  showLoginModal = () => this.userService.setShowLoginModal(true);

  logout = () => {
    this.modalService.confirm({
      nzTitle: '<i>确定要退出吗?</i>',
      nzContent: '<b>退出后需要重新登录</b>',
      nzOnOk: () => {
        this.iTokenService.clear();
        this.userService.deleteUser()
      }
    });
  }

}
