js-lib-url
==========

The methods for works with an URL.

Install
-------

**Using Bower:**

```
bower install js-lib-url
```

**Using NPM:**

```
npm install js-lib-url
```

Usage
-----

**Include the script on your a document:**

```html
<script type="text/javascript" src="/PATH_TO_BOWER/js-lib-url/dist/url.min.js"></script>
<script type="text/javascript">
var UrlUtils = new Url;
</script>
```

API
---

Descriptions the api methods of the library.

### Url.join(uri1, uri2, uri3[, uri4][, etc...])

Join several parts of URI.

```js
var UrlUtils = new Url;
UrlUtils.join('foo=1&bar=3', 'foo2=5&bar2=8'); // "foo=1&bar=3&foo2=5&bar2=8"
UrlUtils.join('http://domain.name', 'foo2=5&bar2=8'); // "http://domain.name?foo2=5&bar2=8"
UrlUtils.join('/foo/bar', 'foo2=5&bar2=8'); // "/foo/bar?foo2=5&bar2=8"
```

### Url.encodeQuery(object)

Encode an object to an query string.

```js
var UrlUtils = new Url;
UrlUtils.encodeQuery({var: "test", len: 1, ids: [2, 6, 8]}); // "var=test&len=1&ids[]=2&ids[]=6&ids[]=8"
```

### Url.parseQuery(query)

The URL parser that returns an object. This function is meant to be used with a query URL.

```js
var UrlUtils = new Url;
UrlUtils.parseQuery('foo=2&bar=8&k[]=3&k[]=4#to-top'); // "{foo: 2, bar: 8, k: [3, 4]}"
```

License
-------

js-lib-url is released under the BSD 3-Clause License.
