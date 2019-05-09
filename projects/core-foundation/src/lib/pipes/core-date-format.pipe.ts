import { PipeTransform, Pipe } from "@angular/core";
import { DatePipe } from "@angular/common";

@Pipe({
    name: 'DateFormatPipe',
})

export class DateFormatPipe implements PipeTransform {
    transform(value: string) {
        var _value = Date.parse(value); //Number(value);
        var dif = Math.floor(((Date.now() - _value) / 1000) / 86400);
        if (dif < 2) {
            return convertToNiceDate(value);
        } else {
            var datePipe = new DatePipe("en-US");
            value = datePipe.transform(value, 'MMM-dd-yyyy');
            return value;
        }
    }
}

function convertToNiceDate(time: string) {
    var date = new Date(time),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        daydiff = Math.floor(diff / 86400);
    if (isNaN(daydiff) || daydiff < 0 || daydiff >= 31)
        return '';
    return daydiff == 0 && (
        diff < 7200 && "Today" ||
        diff < 86400 && "Today") ||
        daydiff == 1 && "Yesterday" ||
        daydiff < 7 && daydiff + " days ago" ||
        daydiff < 31 && Math.ceil(daydiff / 7) + " week(s) ago";
}
