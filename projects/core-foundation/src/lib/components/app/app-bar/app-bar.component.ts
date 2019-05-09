import { Component, OnInit, HostListener, ViewEncapsulation, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../../services/app.service';
import { SiteService } from '../../../modules/shared/services/site.service';
import { AtsI18nService } from '../../../services/ats.i18n.service';
import { PermissionsService } from '../../../services/permissions.service';

import * as _ from 'lodash';

@Component({
    selector: 'app-bar',
    templateUrl: './app-bar.component.html',
    styleUrls: ['./app-bar.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class AppBarComponent implements OnInit {

    appJson: any = {};
    nodes: any;
    app: any = {};
    angular: any = {};
    siteJson: any = {};
    sideBar: boolean;
    appBarUrl: string;
    tooltip: any;
    isQuickLoolUp: boolean;

    constructor(
        private siteService: SiteService,
        private http: HttpClient,
        private permissionsService: PermissionsService,
        private appService: AppService,
        public atsI18nService: AtsI18nService) {
        this.sideBar = true;
    }

    ngOnInit() {
        let configURLs = this.siteService.getAppConfigs();

        if (configURLs.length <= 0) {
            this.siteService.getAppsList()
                .subscribe(response => {
                    this.siteService.setAppConfigFromAppList(response);
                    configURLs = this.siteService.getAppConfigs();
                    this.setAppBarUrl(configURLs);
                });
        }
        else {
            this.setAppBarUrl(configURLs);
        }
    }

    setAppBarUrl(configURLs) {
        for (let i = configURLs.length - 1; i >= 0; i--) {
            if (configURLs[i].appUrl === document.location.href) {
                this.appBarUrl = configURLs[i].configUrl;
            }
            else {
                // getting ReconcileAccountSetting  url
                this.appBarUrl = "../../../../../int-src/modules/apps/reconcileaccountsettings/appbar-config.json";
            }
        }

        if (this.appBarUrl.trim() !== "") {
            this.loadAppBar();
        }
    }

    loadAppBar() {
        this.siteJson = this.siteService.getSiteJson();
        this.app.showAppBar = true;
        this.app.app = this.siteJson.constants.site.app;
        this.app.title = this.siteJson.constants.site.title;
        // this.app.nodes = this.angular.atsServerValues.nodes; //may be undefined if app doesn't support nodes
        this.app.isRootNodeVisible = true;
        //items destined for the app-bar can be hosted here
        //we'll get them started with these items
        this.app.appbar = {
            app: this.app.app,
            title: this.app.title,
            nodes: this.app.nodes //may be undefined if app doesn't support nodes
        }

        this.http.get(this.appBarUrl)
            .subscribe(data => {
                // DEM: for permissions, we remove menuitem if user doesnt have the specified permission
                let allMenuItems: any = data || [];
                console.log('appData', allMenuItems);
                this.app.menuItems = allMenuItems.atsWhere((item) => {
                    console.log('appData', item);
                    if (item.permission) {
                        return this.permissionsService.checkPermission(item.permission);
                    }
                    return true;
                });
            });
        this.appService.setAppJson(this.app);
        this.appJson = this.appService.getAppJson();
        this.atsI18nService.initI18nJson(this.siteJson);
    }

    @HostListener('document:keydown', ['$event']) onKeydownHandler(zEvent: KeyboardEvent) {
        var reportStr =
            (zEvent.ctrlKey ? "Control " : "") +
            (zEvent.shiftKey ? "Shift " : "") +
            (zEvent.altKey ? "Alt " : "") +
            (zEvent.metaKey ? "Meta " : "") + zEvent.code;
        if (reportStr === "Alt KeyT") {
            if (this.sideBar) {
                this.sideBar = false;
                this.siteService.setSidemargin(this.sideBar);
            }
            else {
                this.sideBar = true;
                this.siteService.setSidemargin(this.sideBar);
            }
        }
        else if (reportStr === "Alt KeyC") { }
    }

    formatKey(key) {
        let shortcutKey = this.appService.getAccessKeyLabel(key, this.siteJson.constants);
        return shortcutKey;
    }


    hideSideBar(key: string) {

        if (key == "t") {
            if (this.sideBar) {
                this.sideBar = false;
                this.siteService.setSidemargin(this.sideBar);
            }
            else {
                this.sideBar = true;
                this.siteService.setSidemargin(this.sideBar);
            }
            this.isQuickLoolUp = false;
        }
        else if (key == "q") {
            if (this.sideBar) {
                this.sideBar = false;
                this.siteService.setSidemargin(this.sideBar);
            }
            else {
                this.sideBar = true;
                this.siteService.setSidemargin(this.sideBar);
            }
            this.isQuickLoolUp = true;
        }
    }

    format(val: string): any {
        let angular: any = {};
        angular = this.siteJson;
        let s: string = "constants.i18n." + val;
        let tmp: any = _.get(angular, s);
        return tmp;
    }

}


