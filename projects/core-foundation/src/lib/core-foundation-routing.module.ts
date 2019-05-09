import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiniPortalComponent } from '@mini-portal/public_api';
import { FisReconcileComponent } from '@fis-reconcile/public_api';

const routes: Routes = [
    { path: '', component: MiniPortalComponent },
    { path: 'reconcile', component: FisReconcileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CoreFoundationRoutingModule { }