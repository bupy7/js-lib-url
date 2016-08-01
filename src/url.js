/**
 * The methods for works with an URL.
 * @author Vasilij Belosludcev <https://github.com/bupy7>
 */
var Url = (function() {
    'use strict';
    var Url = function() {

    };
    Url.prototype = {
        /**
         * Join several parts of URI.
         * @param {...String} uri1 Some parts of URI.
         * @returns {String|false}
         * @since 1.0.0
         */
        join: function(uri1) {
            if (!arguments.length) {
               return false;
            }
            var uri = arguments[0];
            for (var i = 1; i != arguments.length; i++) {
                if (uri.indexOf('http') === 0 || uri.indexOf('/') === 0) {
                    if (uri.indexOf('?') < 0) {
                        uri += '?' + arguments[i];
                    } else {
                        uri += arguments[i];
                    }
                } else {
                   uri += '&' + arguments[i];
                }
            }
            return uri;
        },
        /**
         * Encode an object to an query string.
         * @param {Object} Some object with data.
         * @example Url.encodeQuery({var: "test", len: 1}) returns var=test&len=1
         * @returns {Object}
         * @since 1.0.0
         */
        encodeQuery: function(object) {
            // recursive function to construct the result string
            function createString(element, nest) {
                if (element === null) {
                    return '';
                }
                if (Array.isArray(element)) {
                    var count = 0,
                        url = '';
                    for (var t = 0; t < element.length; t++) {
                        if (count > 0) {
                            url += '&';
                        }
                        url += nest + '[]=' + element[t];
                        count++;
                    }
                    return url;
                } else if (typeof element == 'object') {
                    var count = 0,
                        url = '';
                    for (var name in element) {
                        if (element.hasOwnProperty(name)) {
                            if (count > 0) {
                                url += '&';
                            }
                            url += createString(element[name], nest + '[' + name + ']');
                            count++;
                        }
                    }
                    return url;
                } else {
                    return nest + '=' + element;
                }
            }
            var url = '',
                count = 0;
            // execute a createString on every property of object
            for (var name in object) {
                if (object.hasOwnProperty(name)) {
                    if (count > 0) {
                        url += '&';
                    }
                    url += createString(object[name], name);
                    count++;
                }
            }
            return url;
        },
        /**
         * The URL parser that returns an object. This function is meant to be used with a query URL.
         * @param {String} query The query string of an URL.
         * @example Url.parseQuery('var=string').
         *          Simple variable:  var=abc                        returns {var: "abc"}
         *          Simple object:    var.length=2&var.scope=123     returns {var: {length: "2", scope: "123"}}
         *          Simple array:     var[]=0&var[]=9                returns {var: ["0", "9"]}
         *          Array with index: var[0]=0&var[1]=9              returns {var: ["0", "9"]}
         *          Nested objects:   my.var.is.here=5               returns {my: {var: {is: {here: "5"}}}}
         *                            my[var][is][here]=5            same as above
         *          All together:     var=a&my.var[]=b&my.cookie=no  returns {var: "a", my: {var: ["b"], cookie: "no"}}
         *          You just cant have an object in an array, var[1].test=abc DOES NOT WORK
         * @returns {Object}
         * @since 1.0.0
         */
        parseQuery: function(query) {
            var re = /([^&=]+)=?([^&]*)/g,
                decode = function(str) {
                    return decodeURIComponent(str.replace(/\+/g, ' '));
                };
            // recursive function to construct the result object
            var createElement = function(params, key, value) {
                key = key + '';
                // if the key is a property
                if (key.indexOf('.') !== -1) {
                    // extract the first part with the name of the object
                    var list = key.split('.'),
                        // the rest of the key
                        newKey = key.split(/\.(.+)?/)[1];
                    // create the object if it doesnt exist
                    if (!params[list[0]]) {
                        params[list[0]] = {};
                    }
                    // if the key is not empty, create it in the object
                    if (newKey !== '') {
                        createElement(params[list[0]], newKey, value);
                    } else {
                        console.warn('Url.parseQuery() :: empty property in key "' + key + '"');
                    }
                } else
                // if the key is an array
                if (key.indexOf('[') !== -1) {
                    // extract the array name
                    var list = key.split('[');
                    key = list[0];
                    // extract the index of the array
                    list = list[1].split(']');
                    var index = list[0];
                    // if index is empty, just push the value at the end of the array
                    if (index == '') {
                        if (!params) {
                            params = {};
                        }
                        if (!params[key] || !Array.isArray(params[key])) {
                            params[key] = [];
                        }
                        params[key].push(value);
                    } else
                    // add the value at the index (must be an integer)
                    {
                        if (!params) {
                            params = {};
                        }
                        if (!params[key] || !Array.isArray(params[key])) {
                            params[key] = [];
                        }
                        params[key][parseInt(index)] = value;
                    }
                } else { // just normal key
                    if (!params) {
                        params = {};
                    }
                    params[key] = value;
                }
            };
            // be sure the query is a string
            var params = {},
                e;
            if (query) {
                // remove # from end of query
                if (query.indexOf('#') !== -1) {
                    query = query.substr(0, query.indexOf('#'));
                }
                // execute a createElement on every key and value
                while ((e = re.exec(query))) {
                    var key = decode(e[1]).replace(/\[(\w+)\]/g, '.$1'),
                        value = decode(e[2]);
                    createElement(params, key, value);
                }
            }
            return params;
        }
    };
    return Url;
})();
