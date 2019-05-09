
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
//import { AtsI18nService, SiteService, InitDataService } from 'core-foundation';

//import { SiteService } from '../../shared/services/site.service';

import { SiteService } from '../../modules/shared/services/site.service';
import { AtsI18nService } from '../../services/ats.i18n.service';
import { InitDataService } from '../../services/init-data.service';

@Component({
    selector: 'app-site',
    templateUrl: './site.component.html',
    styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {
    angular: any = {};
    siteModule: any = {};
    isShowChrome: boolean = false;

    constructor(private initDataService: InitDataService
    ) { }

    ngOnInit() {

        // retrieve values from server
        this.angular = window["angular"];
        this.initDataService.initSite(this.angular);
        this.isShowChrome = true;
    }

}