interface String {
    atsStartsWith(suffix: string);
    atsEndsWith(suffix: string);
    atsHyphenate();
    atsUnhyphenate();
}

String.prototype.atsStartsWith = function (this: string, prefix: string) {
    return this.substr(0, prefix.length) === prefix;
};

String.prototype.atsEndsWith = function (this: string, suffix: string) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.atsHyphenate = function (this: string) {
    //Add hyphens before uppers and then lowercases.
    //fooBarBaz becomes foo-bar-baz
    //FooBarBaz becomes -foo-bar-baz
    //Does NOT validate for anything.
    return this.replace(/([A-Z])/g, '-$1').toLowerCase();
};

String.prototype.atsUnhyphenate = function (this: string) {
    //foo-bar-baz becomes fooBarBaz
    return this.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
};