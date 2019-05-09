import { Injectable } from '@angular/core';
import '../extensions/string.extensions';
import '../extensions/array.extensions';


@Injectable({
    providedIn: 'root'
})

export class AppService {
    appJson:any;
    constructor() { }

    setAppJson(appJson) {
        this.appJson = appJson;
    }

    getAppJson() {
        return this.appJson;
    }

    getAccessKeyLabel(accessKeyElement, constants) {
        if (accessKeyElement) {
            this.logToConsoleIfReservedKey(accessKeyElement, constants);
            /**
             * The current HTML spec https://html.spec.whatwg.org/multipage/interaction.html#assigned-access-key,
             * recommends an accesskeylabel property to get the full shortcut key. However, only Firefox has
             * implemented it. Chrome and IE have open requests for it:
             * https://bugs.chromium.org/p/chromium/issues/detail?id=393466
             * https://wpdev.uservoice.com/forums/257854-microsoft-edge-developer/suggestions/
             * 10853625-implement-dom-accesskeylabel
             */
            let accessKeyLabel = accessKeyElement.accessKeyLabel;
            if (!accessKeyLabel) {
                var accessKeyPrefix = constants.userAgent.isMac ? 'Ctrl + Alt' : 'Alt';
                accessKeyLabel = accessKeyPrefix + ' + ' + accessKeyElement;
            }
            return accessKeyLabel;
        }
        return null;
    }

    logToConsoleIfReservedKey(accessKey, constants) {
        //Only have to check chrome and ie in windows since firefox and browsers on mac have no conflicts 
        let chromeReservedKeys: Array<string> = ['d', 'e', 'f', 'n'];
        let ieReservedKeys: Array<string> = ['d', 'p'];
        if (constants.userAgent.isWindows) {
            if (constants.userAgent.isChrome && chromeReservedKeys.atsContains(accessKey)) {
                // eslint-disable-next-line no-console
                console.error('The key "' + accessKey + '" is reserved for a chrome shortcut. ' +
                    'Use a different accessKey.');
            }
            else if (constants.userAgent.isIE && ieReservedKeys.atsContains(accessKey)) {
                // eslint-disable-next-line no-console
                console.error('The key "' + accessKey + '" is reserved for a IE shortcut. ' +
                    'Use a different accessKey.');
            }
        }
    }
}
