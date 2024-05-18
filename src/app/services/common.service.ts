import {EventEmitter, Injectable, TemplateRef, Type} from '@angular/core';
import {NzModalRef, NzModalService, OnClickCallback} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzImageService} from "ng-zorro-antd/image";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {Observable, of} from "rxjs";
import {ModalButtonOptions} from "ng-zorro-antd/modal/modal-types";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private imageService: NzImageService,
  ) { }

  // 图片预览
  imagePreview(data: string | string[] | undefined): void {
    let images: any = [];
    if (typeof data === 'string'){
      images.push({src: data});
    }
    if (typeof data === 'object'){
      images = data.map(src => {
        return {
          src
        };
      });
    }
    this.imageService.preview(images, {nzZoom: 1, nzRotate: 0});
  }

  // 检查id
  checkIds(ids: string[]): Observable<boolean>{
    if (ids.length === 0){
      this.messageService.create('error', '请选择要操作的数据!');
      return of(false);
    }
    return of(true);
  }

  // 结果回调
  resultCallback(res: any): void{
    if (res.code === 0){
      this.messageService.create('success', res.message);
    }else {
      this.messageService.create('error', res.message);
    }
  }

  //  删除确认
  deleteConfirm<T>(ids: string[], nzOnOk?: EventEmitter<T> | OnClickCallback<T>): void{
    this.checkIds(ids).subscribe(res => {
      if (res){
        this.showConfirm('操作确认', '确定该条操作？执行后无法恢复!',  nzOnOk);
      }
    });
  }

  // 显示确认
  showConfirm<T>(nzTitle: string, nzContent: string, nzOnOk?: EventEmitter<T> | OnClickCallback<T>): NzModalRef<T>{
    return this.modalService.confirm({
      nzTitle,
      nzContent,
      nzOnOk
    });
  }

}
