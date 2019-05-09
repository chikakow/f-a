import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { AppConfig } from '../../../interfaces/i-app-config';
const AppListEndPoint = "../../api/layouts/chrome/apps/getapps";

@Injectable()
export class SiteService {


    private site: any = {};
    private angular: any = {};
    siteModule: any = {};
    appConfigs: AppConfig[] = [];
    private appBarUrl = new BehaviorSubject<string>("");
    private sideBarUrl = new BehaviorSubject<string>("");
    private margin = new BehaviorSubject<boolean>(true);

    constructor(private httpClient: HttpClient) { }

    getAngularObject(url: string) {
        return this.httpClient.get(url);
    }

    getAngularJson() {
        return (this.angular);
    }

    setAngularObject(val) {
        this.angular = val;
    }

    getSiteJson() {
        return this.site;
    }

    setSiteJson(val) {
        this.site = val;
    }

    // extensions for number
    atsIsNumber(val: any): boolean {
        //test to see if this == number (NOT this === number)
        //isNaN is too unreliable... too many annoying edge case (like isNaN('') === false !!!)
        //parseFloat is too unreliable... example:  parseFloat("40 years") === 40 !!!
        //NaN is the only value in JS that is unequal to itself (thus the last check).

        if (val === null || val === '' || val === undefined || val !== val) {
            return false;
        }
        let str = val.toString();
        return /^-?[\d.]+(?:e?(-|\+)?\d+)?$/.test(str);
    };

    atsRoundNumber(val: any, places: number): number {
        //this function will allow you to pass in a value and the amount of decimal
        //places that you would like to round to. 
        //decimal places will default to 2 if not passed in.
        //since javaScript does not round well we are handling it here.
        if (this.atsIsNumber(val)) {
            var power = Math.pow(10, places);
            var test = Math.round((val * power) + ((places > 0 ? 1 : 0) * (val * (10 / Math.pow(100, places))))) / power;
            return test;
        }
    }

    getAppBarUrl(): Observable<any> {
        return this.appBarUrl;
    }

    setAppBarUrl(url: string): void {
        this.appBarUrl.next(url);
    }

    getSideBarUrl(): Observable<any> {
        return this.sideBarUrl;
    }

    setSideBarUrl(url: string): void {
        this.sideBarUrl.next(url);
    }

    setAppConfigFromAppList(appListJson: any): void {
        let appConfigs: AppConfig[] = [];
        for (let i = 0; i < appListJson.length; i++) {
            appConfigs.push(new AppConfig(appListJson[i].url.trim(), this.angular.atsServerValues.companyId));
        }
        this.appConfigs = appConfigs;
    }

    getAppConfigs(): AppConfig[] {
        return this.appConfigs;
    }

    getSidemargin(): Observable<any> {
        return this.margin;
    }

    setSidemargin(url: boolean): void {
        this.margin.next(url);
    }
    getAppsList() {
        return this.httpClient.get(AppListEndPoint);
    }
    getCompanies() {
        return this.httpClient.get("../../api/plugins/reprintcheck/reprintchecks/getcompanies");
    }

    getPayeeDetails(searchName: string, selectedComapanyId: number, selectedPayee: number) {
        return this.httpClient.get("../../api/plugins/reprintcheck/reprintchecks/getpayeedetails/" + selectedComapanyId + "/" + selectedPayee + "/" + searchName + "");
    }
}

