import * as _ from 'lodash';

declare global {
    interface Array<T> {
        atsWhere<T>(filter, maxHits?): T[];
        atsExclude<T>(filter): T[];
        atsFirstOrDefault<T>(filter, defaultValue?): T;
        atsFirst<T>(filter): T;
        atsSingle<T>(filter): T;
        atsSingleOrDefault<T>(filter, defaultValue?): T;
        atsLast<T>(): T;
        atsLastOrDefault<T>(defaultValue?): T;
        atsAny<T>(filter): boolean;
        atsContains<T>(item: T): boolean;
        atsRemove<T>(item: T): T[];
        atsMove<T>(fromIndex: number, toIndex: number): T[];
        atsCount<T>(filter): number;
        atsSum<T>(propertyOrFunc): number;
        atsMax<T>(propertyOrFunc): number;
        atsPipe<T>(func): T[];
        atsSelect<T>(funct): T[];
        atsDistinct<T>(propertyOrFunc): T[];
        atsAll<T>(filter): boolean;
        atsIntersect<T>(array): T[];
        atsAdd<T>(item): T[];
    }
}

Array.prototype.atsWhere = function<T> (this, filter, maxHits?): T[] | undefined {
    let collection = this;

    switch (typeof filter) {

        case 'function':
            //return $.grep(collection, filter);  //doesn't support short-circuiting
            let returnCollection = [];
            for (let i = 0; i < collection.length; i++) {
                if (filter(collection[i])) {
                    returnCollection.push(collection[i]);
                    if (maxHits && returnCollection.length == maxHits) {
                        break;
                    }
                }
            }
            return returnCollection;

        case 'object':
            //there may be multiple properties on filter object like this { foo: true, bar: 42 }
            //match all properties like as an "and"

            //$.grep doesn't short-circuit, so we do this manually

            let properties = [];
            for (let property in filter) {
                //only get "real" properties on our filter object.
                if (filter.hasOwnProperty(property)) {
                    properties.push(property);
                }
            }

            return Array.prototype.atsWhere(function (item) {

                for (let i = 0; i < properties.length; i++) {
                    if (item[properties[i]] != filter[properties[i]]) {
                        return false; //no match
                    }
                }

                return true; //matched all properties

            }, maxHits);

        default:
            throw new TypeError('func must be either a ' +
                ' function or an object of properties and values to filter by.');
    }
};

Array.prototype.atsExclude = function <T>(this, filter): T[] | undefined {
    let unwanteds = Array.isArray(filter) ? filter : this.atsWhere(filter);

    return _.difference(_.flatten(this), _.flatten(unwanteds));
};

Array.prototype.atsFirst = function <T>(this, filter): T | undefined {
    let item = this.atsFirstOrDefault(filter);

    if (!item) {
        throw new Error('.atsFirst() is not applicable if there are no items. ' +
            'Use .atsFirstOrDefault() if null is acceptable.');
    }

    return item;
};

Array.prototype.atsFirstOrDefault = function <T>(this, filter, defaultValue?): T | undefined {
    let items = this;

    if (filter) {
        items = this.atsWhere(filter, 1);
    }

    if (!items.length) {
        if (arguments.length == 2) {
            return defaultValue;
        }
        return null;
    }

    return items[0];
};

Array.prototype.atsSingle = function <T>(this, filter): T | undefined {
    let item = this.atsSingleOrDefault(filter);

    if (!item) {
        throw new Error('.atsFirst() is not applicable if there are no items. ' +
            'Use .atsFirstOrDefault() if null is acceptable.');
    }

    return item;
};

Array.prototype.atsSingleOrDefault = function <T>(this, filter, defaultValue?): T | undefined {
    let items = this;

    if (filter) {
        items = this.atsWhere(filter, 2); //pull back max of 2 so we can throw exception below
    }

    if (items.length == 1) {
        return items[0];
    }

    if (items.length > 1) {
        throw new Error('.atsSingle() is not applicable if there is not exactly one match. Multiple matches found.');
    }

    if (arguments.length == 2) {
        return defaultValue;
    }

    return null;
};

Array.prototype.atsLast = function <T>(this): T | undefined {
    let item = this.atsLastOrDefault();

    if (!item) {
        throw new Error('.atsLast is not applicable if there is not exactly one match. ' +
            'Use .atsLastOrDefault() if null is acceptable.');
    }

    return item;
};

Array.prototype.atsLastOrDefault = function <T>(this, defaultValue?): T | undefined {
    if (this.length > 0) {
        return this[this.length - 1];
    }

    if (arguments.length == 1) {
        return defaultValue;
    }

    return null;
};

Array.prototype.atsAny = function <T>(this, filter?): boolean | undefined {
    if (filter) {
        return this.atsWhere(filter, 1).length > 0;
    }

    return this.length > 0;
};

Array.prototype.atsContains = function <T>(this, item: T): boolean | undefined {
    let serializedItems: any;
    if (Object.prototype.toString.call(item) === '[object Date]') {
        serializedItems = _.map(this, function (i) {
            return i.toString();
        });
        return serializedItems.indexOf(item.toString()) != -1;
    }

    return this.indexOf(item) != -1;
};

Array.prototype.atsRemove = function <T>(this, item: T): T[] | undefined {
    if (_.isNumber(item)) {
        this.splice(item, 1);
    }
    else {

        //assume the item is an item to remove
        var index = this.indexOf(item);
        if (index > -1) {
            this.splice(index, 1);
        }
        else {
            //else, assume the item is a filter of item(s) to remove
            var objects = this.atsWhere(item);
            for (var i = 0; i < objects.length; i++) {
                this.atsRemove(objects[i]);
            }
        }

    }

    return this;
};

Array.prototype.atsMove = function <T>(this, fromIndex: number, toIndex: number): T[] | undefined {
    //move the item without destroying the reference (this is not a copy)
    this.splice(toIndex, 0, this.splice(fromIndex, 1)[0]);
    return this; //for chaining
};

Array.prototype.atsCount = function <T>(this, filter): number {
    if (filter) {
        return this.atsWhere(filter).length;
    }

    return this.length;
};

Array.prototype.atsSum = function <T>(this, propertyOrFunc): number {
    var sum = 0;
    var isFunc = _.isFunction(propertyOrFunc);

    for (let i = 0; i < this.length; i++) {

        let value: number = (isFunc ? propertyOrFunc(this[i]) : this[i][propertyOrFunc]) || 0;
        value = _.isNumber(value) ? parseFloat(value.toString()) : 0;

        sum += value;
    }

    return sum;
};

Array.prototype.atsMax = function <T>(this, propertyOrFunc): number {
    let max: number = Number.MIN_VALUE;
    let isFunc: boolean = _.isFunction(propertyOrFunc);

    for (let i = 0; i < this.length; i++) {

        let value: number = (isFunc ? propertyOrFunc(this[i]) : this[i][propertyOrFunc]) || Number.MIN_VALUE;
        value = _.isNumber(value) ? parseFloat(value.toString()) : Number.MIN_VALUE;

        max = Math.max(max, value);
    }

    return max;
};

//similar to foreach but returns the array for chaining
Array.prototype.atsPipe = function <T>(this, func): T[] | undefined {
    for (let i = 0; i < this.length; i++) {
        func(this[i]);
    }

    return this;
};

Array.prototype.atsSelect = function <T>(this, func): T[] | undefined {
    return _.map(this, function (item) {
        return func(item);
    });
};

Array.prototype.atsDistinct = function <T>(this, propertyOrFunc): T[] | undefined {
    let uniqueItems = [];
    let isFunc = _.isFunction(propertyOrFunc);

    for (let i = 0; i < this.length; i++) {

        let value = isFunc ? propertyOrFunc(this[i]) : this[i][propertyOrFunc];

        if (!uniqueItems.atsContains(value)) {
            uniqueItems.push(value);
        }
    }
    return uniqueItems;
};

Array.prototype.atsAll = function <T>(this, filter): boolean {
    if (filter) {
        return this.atsWhere(filter).length == this.length;
    }
    throw new Error('filter is required');
};

Array.prototype.atsIntersect = function <T>(this, array): T[] | undefined {
    if (array) {
        return this.atsWhere(function (i) {
            return array.atsContains(i);
        });
    }
    throw new Error('array is required');
};

Array.prototype.atsAdd = function <T>(this, item): T[] | undefined {
    this.push(item);
    return this;
};