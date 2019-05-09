declare interface String {
    atsStartsWith(suffix: string): boolean;
    atsEndsWith(suffix: string): boolean;
    atsHyphenate(): string;
    atsUnhyphenate(): string;
}

declare interface Array<T> {
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
    atsSelect<T>(func): T[];
    atsDistinct<T>(propertyOrFunc): T[];
    atsAll<T>(filter): boolean;
    atsIntersect<T>(array): T[];
    atsAdd<T>(item): T[];
}