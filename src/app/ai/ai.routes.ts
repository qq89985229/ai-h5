import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from "./pages/chat/chat.component";
import {ListComponent as ChatListComponent} from "./pages/chat/list.component";
import {PaintingComponent} from "./pages/painting/painting.component";
import {ListComponent as PaintingListComponent} from "./pages/painting/list.component";
import {EditComponent} from "./pages/user/edit.component";
import {PlanComponent} from "./pages/plan/plan.component";
import {UserPlanComponent} from "./pages/plan/user-plan.component";
import {UsageDetailComponent} from "./pages/plan/usage-detail.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'chat/chat'
  },
  {
    path: 'chat',
    data: {
      breadcrumb: 'AI对话',
    },
    children: [
      {
        path: 'chat',
        data: {
          breadcrumb: '新建会话',
        },
        component: ChatComponent
      },
      {
        path: 'chat/:id',
        data: {
          breadcrumb: '新建会话',
        },
        component: ChatComponent
      },
      {
        path: 'list',
        data: {
          breadcrumb: '历史会话',
        },
        component: ChatListComponent
      },
    ]
  },
  {
    path: 'painting',
    data: {
      breadcrumb: 'AI绘画',
    },
    children: [
      {
        path: 'painting',
        data: {
          breadcrumb: '新建绘画',
        },
        component: PaintingComponent
      },
      {
        path: 'painting/:id',
        data: {
          breadcrumb: '新建绘画',
        },
        component: PaintingComponent
      },
      {
        path: 'list',
        data: {
          breadcrumb: '历史绘画',
        },
        component: PaintingListComponent
      },
    ]
  },
  {
    path: 'plan',
    data: {
      breadcrumb: '套餐信息',
    },
    children: [
      {
        path: 'plan',
        data: {
          breadcrumb: '开通套餐',
        },
        component: PlanComponent
      },
      {
        path: 'user-plan',
        data: {
          breadcrumb: '我的套餐',
        },
        component: UserPlanComponent
      },
      {
        path: 'usage-detail',
        data: {
          breadcrumb: '使用明细',
        },
        component: UsageDetailComponent
      }
    ]
  },
  {
    path: 'user',
    data: {
      breadcrumb: '账户信息',
    },
    children: [
      {
        path: 'edit',
        data: {
          breadcrumb: '基本信息',
        },
        component: EditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiRoutes {
}
