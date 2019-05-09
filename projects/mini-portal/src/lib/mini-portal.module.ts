import { NgModule } from '@angular/core';
import { MiniPortalComponent } from './mini-portal.component';
import { CoreFoundationModule, SiteService } from 'core-foundation';

@NgModule({
    declarations: [
        MiniPortalComponent
    ],
    imports: [
        CoreFoundationModule
    ],
    providers: [
        SiteService
    ], 
    exports: [
        MiniPortalComponent
    ]
})
export class MiniPortalModule { }
