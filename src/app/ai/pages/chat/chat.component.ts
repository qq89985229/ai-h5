import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {IChat, IChoice, IUserChoiceBody} from "../../../entity/chat";
import {ActivatedRoute} from "@angular/router";
import {HttpParams} from "@angular/common/http";
import {HttpService} from "../../../services/http.service";
import {environment} from "../../../../environments/environment";
import {IUser} from "../../../entity/user";
import {UserService} from "../../../services/user.service";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import {IResponse} from "../../../entity/response";
import {PlanComponent} from "../plan/plan.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzListModule} from "ng-zorro-antd/list";
import {NzCommentModule} from "ng-zorro-antd/comment";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzIconModule} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzListModule,
    NzCommentModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzAvatarModule,
    NzIconModule,
  ],
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit, OnDestroy {
  user: IUser | any;
  chat = {} as IChat;
  webSocketUrl: string = environment.webSocketUrl;
  webSocket$: WebSocketSubject<any>;
  validateForm: FormGroup<{
    content: FormControl<string>;
  }> = this.fb.group({
    content: ['', [Validators.required]],
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    @Inject(DA_SERVICE_TOKEN) private iTokenService: ITokenService,
    private httpService: HttpService,
    private userService: UserService,
  ) {
    this.userService.user$.subscribe(user => this.user = user)
    this.webSocket$ = webSocket(`${this.webSocketUrl}/chat`);
    this.webSocket$.subscribe((message: IChat | IResponse) => {
      if ('id' in message) {
        const content = (message as IChat).choices[0].delta.content;
        if (content) {
          this.chat.choices[this.chat.choices.length - 1].delta.content += content;
        }
      }
      if ('code' in  message){
        if (this.chat.choices.length > 0) {
          this.chat.choices.pop();
        }
        this.modalService.create({
          nzTitle: "开通套餐",
          nzWidth: "80%",
          nzContent: PlanComponent,
          nzFooter: null
        });
      }
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chat.id = <string>params.get("id");
      this.getChat();
    });
  }

  ngOnDestroy(): void {
    this.webSocket$.complete();
  }

  getChat = () => {
    let params = new HttpParams();
    if (this.chat.id) params = params.set("id", this.chat.id);
    this.httpService.get<string>(`ai/chat`, params)
      .subscribe((res: any) => {
        if (res.code === 0) {
          this.chat = res.data;
          this.chat.choices.forEach((choice) => {
            if (choice.delta.role === 'user') {
              choice.author = this.user.name;
              choice.avatar = "";
            }
            if (choice.delta.role === 'system') {
              choice.author = "AI";
              choice.avatar = "https://nlp-eb.cdn.bcebos.com/static/eb/asset/robin.e9dc83e5.png";
            }
          })
        }
      })
  }

  keydownEnter = (event: any) => {
    event.preventDefault();
    this.submitForm();
  }

  submitForm = () => {
    if (this.validateForm.valid) {
      const token = this.iTokenService.get()?.token;
      if (this.chat.id && token) {
        const content = this.validateForm.value.content || '';
        const userChoice: IChoice = {
          author: this.user?.name,
          avatar: '',
          delta: {
            role: "user",
            content
          }
        }
        this.chat.choices.push(userChoice);
        const systemChoice: IChoice = {
          author: 'AI',
          avatar: 'https://nlp-eb.cdn.bcebos.com/static/eb/asset/robin.e9dc83e5.png',
          delta: {
            role: "system",
            content: ""
          }
        }
        this.chat.choices.push(systemChoice)

        this.validateForm.reset();
        const userChoiceBody: IUserChoiceBody = {
          token,
          chatId: this.chat.id,
          content
        }
        this.webSocket$.next(userChoiceBody);
      }else {
        this.userService.setShowLoginModal(true);
      }
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
