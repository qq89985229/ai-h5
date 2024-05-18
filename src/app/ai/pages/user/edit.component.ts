import {Component, OnInit} from '@angular/core';
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {IUser} from "../../../entity/user";
import {UserService} from "../../../services/user.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {HttpService} from "../../../services/http.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  user: Observable<IUser | null>;
  validateForm: FormGroup;

  constructor(
    private fb: NonNullableFormBuilder,
    private userService: UserService,
    private httpService: HttpService,
    private messageService: NzMessageService,
  ) {
    this.validateForm = this.fb.group({});
    this.user = this.userService.user$;
  }

  ngOnInit(): void {
    this.user.subscribe(user => {
      this.validateForm =  this.fb.group({
        name: [user?.name, [Validators.required], ],
        mobile: [user?.mobile, [Validators.required]]
      });
    })
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const value = this.validateForm.value;
      this.httpService.post<any>(`ai/user/edit`, value)
        .subscribe(res => {
          if (res.code === 0){
            this.userService.setUser(res.data);
            this.messageService.create('success', res.message);
          }else {
            this.messageService.create('error', res.message);
          }
        })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }
}
