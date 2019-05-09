import './array.extensions';

const daysOfWeek = ['sun', 'sunday', 'mon', 'monday', 'tue', 'tues', 'tuesday', 'wed', 'wednesday',
    'thu', 'thur', 'thurs', 'thursday', 'fri', 'friday', 'sat', 'saturday'];

export class DatetimeService {

    static getDateOnly(date: string): any {
        if (!date) {
            return date;
        }
        else {
            var newDate;
            if (typeof date == 'string') {
                newDate = this.getDate(date);
            }
            else {
                newDate = this.clone(date);
            }
            newDate.setHours(0, 0, 0, 0);
            return newDate;
        }
    }

    static getDate(dateString: string): Date {
        var formattedDate = dateString;
        if (!this.isServerFormat(formattedDate)) {
            formattedDate = this.convertHotKeysToDate(formattedDate) || formattedDate;
        }
        return new Date(formattedDate);
    }

    static isServerFormat(date: string) {
        if (date) {
            return /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d[+-]\d\d.\d\d$/.test(date);
        }
        return false;
    }

    static convertHotKeysToDate(value: string) {
        if (!value)
            return null;
        var date = null;
        var trimmedValue = value.trim().toLowerCase();
        var today = this.getToday();
        if (trimmedValue == 'bw') {
            date = this.getPrevDayOfWeek('monday', '');
        }
        else if (trimmedValue == 'ew') {
            date = this.getNextDayOfWeek('friday', '');
        }
        else if (trimmedValue == 'bm') {
            date = this.buildDate(today.getFullYear(), today.getMonth(), 1);
        }
        else if (trimmedValue == 'em') {
            var nextMonth = this.buildDate(today.getFullYear(), today.getMonth() + 1, 1);
            date = this.addDays(nextMonth, -1);
        }
        else if (trimmedValue == 't') {
            date = this.getToday();
        }
        else if (trimmedValue == 'y') {
            date = this.getYesterday();
        }
        else if (trimmedValue == 'tt') {
            date = this.getTomorrow();
        }
        else if (daysOfWeek.atsContains(trimmedValue)) {
            date = this.getNextDayOfWeek(trimmedValue, '');
        }
        else if (trimmedValue.match('^[0-9]{8}$')) {
            date = this.getDateOnly(trimmedValue.substring(0, 2) + '/' +
                trimmedValue.substring(2, 4) + '/' + trimmedValue.substring(4, 8));
        }
        return date;
    }

    static getToday() {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    }

    static getYesterday() {
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        return yesterday;
    }

    static getPrevDayOfWeek(dayOfWeek, date) {
        var next = this.getDay(dayOfWeek.toLowerCase());
        //date is optional... if not supplied, will use today
        var newDate = this.clone(date || this.getToday());
        while (newDate.getDay() != next) {
            newDate = this.addDays(newDate, -1);
        }
        return newDate;
    }

    static clone(date) {
        return new Date(date.valueOf());
    }

    static addDays(date, daysToAdd) {
        var newDate = this.clone(date);
        newDate.setDate(newDate.getDate() + daysToAdd);
        return newDate;
    }

    static getDay(dayOfWeek) {
        if (dayOfWeek == 1 || dayOfWeek == 'monday') {
            return 1;
        }
        else if (dayOfWeek == 2 || dayOfWeek == 'tuesday') {
            return 2;
        }
        else if (dayOfWeek == 3 || dayOfWeek == 'wednesday') {
            return 3;
        }
        else if (dayOfWeek == 4 || dayOfWeek == 'thursday') {
            return 4;
        }
        else if (dayOfWeek == 5 || dayOfWeek == 'friday') {
            return 5;
        }
        else if (dayOfWeek == 6 || dayOfWeek == 'saturday') {
            return 6;
        }
        return 0; //assume Sunday
    }

    static getNextDayOfWeek(dayOfWeek, date) {
        var next = this.getDay(dayOfWeek.toLowerCase());
        var newDate = this.clone(date || this.getToday());
        while (newDate.getDay() != next) {
            newDate = this.addDays(newDate, 1);
        }
        return newDate;
    }

    static buildDate(year, month, day) {
        return new Date(year, month - 1, day);
    }

    static getTomorrow() {
        var tomorrow = this.getToday();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    }

    static toServerFormat(date, kendoFormat) {
        var dateObj = null;
        if (date) {
            if (this.isServerFormat(date)) {
                return date; //no conversion necessary
            }

            //convert kendo-formatted string to date Obj
            //  dateObj = kendo.parseDate(date, kendoFormat || constants.k.defaultDateFormat);
        }
        else if (date) {
            dateObj = this.clone(date);
        }

        if (dateObj) {
            return this.convertDateObjToServerFormat(dateObj);
        }

        return null;
    }

    static convertDateObjToServerFormat(dateObj) { }

}