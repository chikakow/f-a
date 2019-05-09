import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
//import { KendoUiAngularModule } from './shared/modules/kendo-ui-angular/kendo-ui-angular.module';

import { KendoUiAngularModule } from '../lib/modules/shared/kendo-ui-angular/kendo-ui-angular.module';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// Services
//import { SiteService } from './shared/services/site.service';
import { SiteService } from '../lib/modules/shared/services/site.service';

//import { AtsI18nService } from './shared/services/ats.i18n.service';
import { AtsI18nService } from '../lib/services/ats.i18n.service';
import { PermissionsService } from '../lib/services/permissions.service';
import { InitDataService } from '../lib/services/init-data.service';
import { ChromeService } from '../lib/services/chrome.service';

// Components
import { CoreFoundationComponent } from './core-foundation.component';
import { AppBarComponent } from '../lib/components/app/app-bar/app-bar.component';
import { SideBarComponent } from '../lib/components/app/side-bar/side-bar.component';
import { LoadOverlayComponent } from '../lib/components/app/load-overlay/load-overlay.component';
import { AppoverlayComponent } from '../lib/components/app/appoverlay/appoverlay.component';

import { QuicklookupSlideoutComponent } from './components/app/quicklookup-slideout/quicklookup-slideout.component';
import { DateFormatPipe } from '../lib/pipes/core-date-format.pipe';
import { FilterdataPipe } from '../lib/pipes/search-by-name.pipe';
import { ChromeBarComponent } from '../lib/components/chrome/chrome-bar/chrome-bar.component';
import { CompanyBranchComponent } from '../lib/components/chrome/company-branch/company-branch.component';
import { EmployeeComponent } from '../lib/components/chrome/employee/employee.component';
import { AppListComponent } from '../lib/components/chrome/app-list/app-list.component';
import { NotificationsComponent } from '../lib/components/chrome/notifications/notifications.component';
import { SettingsComponent } from '../lib/components/chrome/settings/settings.component';
import { HistoryComponent } from '../lib/components/chrome/history/history.component';
import { SiteComponent } from '../lib/components/site/site.component';

import { LoadOverlayService } from '../lib/services/load-overlay.service';

import { AppLayoutComponent } from './components/app/app-layout/app-layout.component';
//import { LayoutsModule } from './layouts/layouts.module';


// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

@NgModule({
    declarations: [
        CoreFoundationComponent,
        LoadOverlayComponent,
        AppBarComponent,
        SideBarComponent,
        AppoverlayComponent,
        DateFormatPipe,
        FilterdataPipe,
        QuicklookupSlideoutComponent,
        ChromeBarComponent,
        CompanyBranchComponent,
        EmployeeComponent,
        AppListComponent,
        NotificationsComponent,
        SettingsComponent,
        HistoryComponent,
        SiteComponent,
		AppLayoutComponent
    ],
    imports: [
        FormsModule,
        HttpClientModule,
        KendoUiAngularModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                //useFactory: HttpLoaderFactory,
                useFactory: HttpLoaderFactory,     // (http: any) => new TranslateHttpLoader(http),

                deps: [HttpClient]
            }
        }),

        //LayoutsModule
    ],
    providers: [
        InitDataService,
        // SiteService, // To use core library service in client app and other library projects we need to provide services in here instead of { providedIn: 'root' }
        AtsI18nService,
        PermissionsService,
        ChromeService,
        //LoadOverlayService
    ],
    exports: [
        KendoUiAngularModule,
        TranslateModule,
        CoreFoundationComponent,
        LoadOverlayComponent,
        AppBarComponent,
        SideBarComponent,
        AppoverlayComponent,
        DateFormatPipe,
        FilterdataPipe,
        QuicklookupSlideoutComponent,
        ChromeBarComponent,
        CompanyBranchComponent,
        EmployeeComponent,
        AppListComponent,
        NotificationsComponent,
        SettingsComponent,
        HistoryComponent,
        SiteComponent,
		AppLayoutComponent
    ]
})
export class CoreFoundationModule {
    // use static services as needed here
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreFoundationModule,
            providers: [SiteService, InitDataService]
        };
    }
}


