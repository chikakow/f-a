import { Injectable, OnInit } from '@angular/core';
import { SiteService } from '../modules/shared/services/site.service';
@Injectable({
    providedIn: 'root'
})
export class PermissionsService implements OnInit {

    siteJson;
    constructor(
        private siteService: SiteService) { }

    ngOnInit(): void {
        this.siteJson = this.siteService.getSiteJson();
    }

    checkPermission(permission) {
        let userPermission;
        let values = this.siteJson.values,
            constants = this.siteJson.constants;

        if (!values.isAuthenticated) {
            throw new Error('Authentication is required to use Session.');
        }

        if (typeof permission === 'string') {
            for (let property of constants.chrome.userPermissions) {
                if (constants.chrome.userPermissions[property].permissionName === permission) {
                    userPermission = constants.chrome.userPermissions[property];
                }
            }
        }
        else {
            userPermission = permission;
        }

        if (userPermission !== undefined) {
            if (userPermission.companies.length > 0) {
                return userPermission.companies.atsContains(constants.site.companyId);
            }

            return true;
        }

        return false;
    }
}