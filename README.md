node-pathname
=============

[![CircleCI](https://circleci.com/gh/yadex205/node-pathname.svg?style=shield)](https://circleci.com/gh/yadex205/node-pathname)

Node.js implementation of Ruby's Pathname.

Usage
-----

Install with npm

```bash
$ npm install --save node-pathname
```

```js
const Pathname = require('node-pathname')

const NODE_ROOT = new Pathname('.')
let packageJson = NODE_ROOT.join('package.json')
console.log(packageJson.expandPath().toString()) // => /path/to/current/directory/package.json
```

Requirements
------------

* Node.js >= 4.0.0


License
-------

The code is licensed under the MIT License.
See `LICENSE` file for details.
