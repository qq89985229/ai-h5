import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder, ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NzCommentModule} from "ng-zorro-antd/comment";
import {NzFlexModule} from "ng-zorro-antd/flex";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzImageModule} from "ng-zorro-antd/image";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";

@Component({
  selector: 'app-painting',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzCommentModule,
    NzFlexModule,
    NzButtonModule,
    NzImageModule,
    NzIconModule,
    NzAvatarModule,
    NzDividerModule,
    NzFormModule,
    NzInputModule,
    NzToolTipModule
  ],
  templateUrl: './painting.component.html',
  styleUrl: './painting.component.scss'
})
export class PaintingComponent {
  list = [0,1,2,3]
  validateForm: FormGroup<{
    content: FormControl<string>;
  }> = this.fb.group({
    content: ['', [Validators.required]],
  });

  constructor(
    private fb: NonNullableFormBuilder,
  ) {
  }

  keydownEnter = (event: any) => {
    event.preventDefault();
    this.submitForm();
  }

  submitForm = () => {
    if (this.validateForm.valid) {
    }
  }
}
