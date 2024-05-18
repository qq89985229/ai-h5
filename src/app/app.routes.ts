import { Routes } from '@angular/router';
import {LayoutComponent} from "./ai/pages/layout/layout.component";

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/ai' },
  { path: 'ai', loadChildren: () => import('./ai/ai.routes').then(m => m.AiRoutes), component: LayoutComponent }
];
