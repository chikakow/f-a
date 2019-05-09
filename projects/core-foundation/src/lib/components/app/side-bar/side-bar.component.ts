import { Component, OnInit } from '@angular/core';
import { SiteService } from '../../../modules/shared/services/site.service';
import { AtsI18nService } from '../../../services/ats.i18n.service';
import { Subscription } from 'rxjs';
import *as _ from 'lodash';
@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
    app: any = {};
    nodeList: any;
    text: any;
    enums: any;
    i18n: any;
    appName: any;
    sideBarUrl: any;
    selectedItem: any;
    subscription: Subscription;
    constructor(
        private siteService: SiteService,
        private atsI18nService: AtsI18nService) { }

    ngOnInit() {
        this.loadSideBar();
    }
    scrollToElement(element) {
        this.selectedItem = element;
        document.getElementById(element).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }

    // loadSideBar() {
    //     this.app = this.siteService; 
    //     this.appName = this.app.site.constants.i18n.refundsmanagement.AppName;
    //     let angular: any = {};
    //     angular = this.siteService.getAngularJson();       
    //     this.nodeList = angular.atsServerValues.nodes;
    //     this.text = this.siteService.getSiteJson().constants.i18n.refundsmanagement.NodeEnum;
    //     this.atsI18nService.initI18nJson(this.appName);
    // }

    loadSideBar() {
        // get AppName
        debugger
        let siteJson = this.siteService.getSiteJson().constants;
        let moduleName = siteJson.site.app;

        this.appName = _.get(siteJson.i18n, moduleName + '.AppName');

        //this.appName = refundsManagement.AppName;

        // get nodeList and node enums
        let angular: any = {};
        angular = this.siteService.getAngularJson();
        this.nodeList = angular.atsServerValues.nodes;
        this.text = _.get(siteJson.i18n, moduleName + '.NodeEnum');//refundsManagement.NodeEnum;

        // initialize i18n
        this.atsI18nService.initI18nJson(this.appName);
    }
}

