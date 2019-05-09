import { Injectable, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { SiteService } from '../modules/shared/services/site.service';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
    providedIn: 'root'
})
export class AtsI18nService implements OnInit {


    angular: any = {};

    constructor(
        private siteService: SiteService,
        private translateService: TranslateService) {}

    ngOnInit(): void {
        this.angular = window["angular"];
    }

    setupList(key, val) {
        let i18nObj = {};
        let enumObj;     
            Object.entries(val).forEach(([k, v]) => {            
                let keys = k.split('_');
                i18nObj[keys[0]] = v;
                enumObj = enumObj || {};
                enumObj[keys[0]] = Number(keys[1]);
                i18nObj[keys[1]] = v;
            });
      
            Object.entries(val).forEach(([k, v]) => {
                i18nObj[k] = v;
            });
    

        return {
            i18nObj: i18nObj,
            enumObj: enumObj
        };
    };

    processI18nJson(constants, angular) {
        let i18n = {},
            enums = {};
        Object.entries(angular.atsServerValues.i18nJson).forEach(([key, val]) => {     
            let i18nObj = val,
                enumObj = {};
            Object.entries(i18nObj).forEach(([k, v]) => {
                if (_.isObject(v)) {
                    let result = this.setupList(k, v);
                    i18nObj[k] = result.i18nObj;
                    if (result.enumObj) {
                        enumObj[k] = result.enumObj;
                    }
                }
            });

            i18n[key] = i18nObj;
            enums[key] = enumObj;

        });
        constants.i18n = i18n;
        constants.enums = enums;      
        delete angular.atsServerValues.i18nJson;
        this.siteService.setAngularObject(angular);
    }

    getLang(): string {
        return this.angular.atsServerValues.locale;
    }

    getValue(constants, token) {
        //token has already been verified as a string
        let pieces = token.split('.');
        if (pieces.length >= 2) {
            let library = constants.i18n[pieces[0]];
            if (library) {
                let value = library[pieces[1]];
                //if enum...
                if (value && pieces.length == 3) {
                    value = value[pieces[2]];
                }
                if (value) {
                    return value;
                }
            }
        }

        return undefined;
    }

    convertListToChoices(constants, list, options) {
        let choices = [];
        let listObj = this.getValue(constants, list);

        if (options && options.useValueAsText) {
            Object.keys(listObj).forEach((key) => {
                choices.push({
                    value: key,
                    text: key
                })
            });
        }
        else if (options && options.useValueAndTextAsText) {
            Object.keys(listObj).forEach((key) => {
                choices.push({
                    value: key,
                    text: key + ' - ' + listObj[key]
                });
            });
        }
        else {
            Object.keys(listObj).forEach((key) => {
                choices.push({
                    value: key,
                    text: listObj[key]
                });
            });
        }

        return choices;
    }

    convertEnumToChoices(constants, enumeration, config?) {
        let choicesConfig = config || {};
        let choices = [];
        let enumObj = this.getValue(constants, enumeration);
        Object.keys(enumObj).forEach((key) => {
            if (choicesConfig.useEnumAsValue) {
                if (!this.siteService.atsIsNumber(key)) {
                    choices.push({
                        value: key,
                        text: choicesConfig.useEnumAsText ? key : enumObj[key]
                    });
                }
            }
            else {
                if (this.siteService.atsIsNumber(key)) {
                    choices.push({
                        value: Number(key),
                        text: choicesConfig.useEnumAsText ? key : enumObj[key]
                    });
                }
            }
        });

        return choices;
    }

    applySubstitutions(text, subs) {
        let result = text;

        if (subs) {
            Object.keys(subs).forEach((key) => {
                //don't show 'undefined' (show nothing instead)
                let subValue = subs[key] === undefined ? '' : subs[key];
                result = result.replace(new RegExp('{' + key + '}', 'g'), subValue);
            });
        }
        result = result.replace(/\n/g, '<br>');

        return result;
    }

    throws = [];

    throwErrorIfNeeded(msg) {
        //1. We don't want to interrupt the return of the value... 
        //   If the service is being called by filters or directives.
        //   That could break bindings, etc.
        //2. We do want to tap into or error handling infrastructure.
        //3. So we need to log, async.
        //4. But we must do so within angular (vs. window.setTimeout()),
        //   so that angular error handling can capture it.
        //5. A single filter or directive binding call can happen many times,
        //   during multiple angular digest cycles.  We don't want it to 
        //   be logged a zillion times.  Once per page is enough.
        //   So, we limit it here.
        //6. $timeout will cause another digest cycle (which re-evaluates the
        //   the filter, which can cause an endless loop if we were not to do #5.
        //   invokeApply = false below should prevent this?  TODO: research.
        //   But in the end it doesn't matter... we don't want to log multiples anyway.

        if (!this.throws.atsContains(msg)) {
            this.throws.push(msg);
            setTimeout(function () {
                throw new Error(msg);
            }, 1000, false);
        }
    }

    getLocalizedString(constants, token, subs?, options?) {

        if (token) {
            if (_.isString(token)) {

                let value = this.getValue(constants, token);
                if (value) {
                    return this.applySubstitutions(value, subs);
                }

                if (options && options.suppressErrors) {
                    return token.split('.').atsLast(); //library.key --> key
                }

                let msg = '%%KEY_' + token + '_NOT_FOUND%%';
                //don't break function (log to the side)

                this.throwErrorIfNeeded(msg);

                return msg;
            }
            else if (_.isArray(token)) {
                return this.getLocalizedString(constants, token[0], token[1], options);
            }
            else if (_.isObject(token)) {
                return this.getLocalizedString(constants, token.token, token.subs, options);
            }
            else if (_.isFunction(token)) {
                //handle selectors (i.e. dynamic tokens)
                return this.getLocalizedString(constants, token(subs), subs, options);
            }
        }

        if (options && options.suppressErrors) {
            return this.getLocalizedString(constants, 'site.Unknown'); //This will be displayed to users
        }

        /* eslint-disable no-redeclare */
        let msg = '%%KEY_NOT_FOUND%%';
        //don't break function (log to the side)

        this.throwErrorIfNeeded(msg);

        return msg;
    }

    getEnumName(constants, enumeration, enumValue) {
        let enumObj = this.getValue(constants, enumeration);
        let enumValueText = enumObj[enumValue];
        let enumName;
        Object.keys(enumObj).forEach((key) => {
            if (enumValueText == enumObj[key]) {
                if (key != enumValue) {
                    enumName = key;
                }
            }
        });

        if (enumName) {
            return enumName;
        }

        throw new Error('Enum value not found:  ' + (enumeration || 'Missing Enum') + ' - ' +
            (enumValue || 'Missing Enum Value'));
    }
    initI18nJson(i18nJson: any, isMerge: boolean = false): TranslateService {
        let locale: string;
        let angular: any = this.siteService.getAngularJson();
        locale = angular.atsServerValues.locale;
        this.translateService.setTranslation(locale, i18nJson, isMerge);
        this.translateService.use(locale);
        return this.translateService;
    }
}
