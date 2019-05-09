export interface IAppConfig {
    appUrl: string;     // must be same as url from app list
    configUrl: string;  // url for configuring the app bar nodes (path to app-config.json)
}

export class AppConfig implements IAppConfig {
    appUrl: string;     // must be same as url from app list
    configUrl: string;  // url for configuring the app bar nodes (path to app-config.json)

    constructor(_appUrl: string, companyId: string) {
        if (_appUrl.trim() !== "") {
            this.appUrl = _appUrl;
            let lhs: string = "../../../../../int-src/modules/apps/";
            let rhs: string = "/appbar-config.json";
            let app: string = "";          
            let tmp: string = this.appUrl;
            tmp = tmp.replace("https://", "");
            tmp = tmp.replace("http://", "");
            let arr: string[] = tmp.split(/\//gi);
            if (arr[arr.length - 1] === "{co_id}") {
                // need to handle this
            }
            else {
                let isco_id: boolean = false;
                for (let i = 0; i < arr.length; ++i) {
                    if (isco_id === true) {
                        app += arr[i];
                    }
                    if (arr[i] === "{co_id}") {
                        isco_id = true;
                    }                    
                }
            }
            if (app.trim() !== "") {
                this.configUrl = lhs + app + rhs;
            }
            this.appUrl = this.appUrl.replace("{co_id}", companyId);
            
        }
    }
}
