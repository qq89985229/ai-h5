import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import {NzMessageService} from "ng-zorro-antd/message";
import {HttpService} from "../../../services/http.service";
import {CommonService} from "../../../services/common.service";
import {UserService} from "../../../services/user.service";
import {NgIf} from "@angular/common";
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  countdown = 60; // 倒计时初始值
  isCountdownActive = false; // 控制倒计时是否激活
  countdownInterval: any; // 存储setInterval的返回值，以便可以清除它
  validateForm: FormGroup<{
    mobile: FormControl<string>;
    code: FormControl<string>;
  }> = this.fb.group({
    mobile: ['', [Validators.required, Validators.pattern(/^1[3456789]\d{9}$/)]],
    code: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]]
  });

  constructor(
    protected nzModalRef: NzModalRef,
    @Inject(DA_SERVICE_TOKEN) private iTokenService: ITokenService,
    private messageService: NzMessageService,
    private fb: NonNullableFormBuilder,
    private httpService: HttpService,
    private commonService: CommonService,
    private userService: UserService,
  ) {
  }

  getMobileCode = () => {
    const mobileControl = this.validateForm.get('mobile');
    if (mobileControl && mobileControl.value) {
      if (!this.isCountdownActive) {
        const mobile = mobileControl.value;
        this.httpService.post<any>(`ai/login/get-mobile-code`, {mobile})
          .subscribe((res: any) => this.commonService.resultCallback(res))
        this.startCountdown();
      }
    } else {
      mobileControl?.markAsDirty();
      mobileControl?.updateValueAndValidity({onlySelf: true});
    }
  }

  startCountdown = () => {
    this.isCountdownActive = true;
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.stopCountdown();
      }
    }, 1000);
  }

  stopCountdown = () => {
    clearInterval(this.countdownInterval);
    this.countdown = 60;
    this.isCountdownActive = false;
  }

  login(): void {
    if (this.validateForm.valid) {
      const value = this.validateForm.value;
      this.httpService.post<any>(`ai/login`, value)
        .subscribe(res => {
          if (res.code === 0){
            this.iTokenService.set({token: res.data.token});
            this.userService.setUser(res.data.user)
            this.userService.setShowLoginModal(false);
            this.nzModalRef.destroy(true);
          }else {
            this.messageService.create('error', res.message);
          }
        })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}

