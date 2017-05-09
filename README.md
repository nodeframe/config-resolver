[![Build Status](https://travis-ci.org/nodeframe/config-resolver.svg?branch=master)](https://travis-ci.org/nodeframe/config-resolver)

[![npm](https://img.shields.io/npm/v/nfs-config-resolver.svg)](https://www.npmjs.com/package/nfs-config-resolver)

# config-resolver

An environment base config resolver that will reduce your worries about config and environments! Have a development environment and the production where you need it to be different config? fine! config-resolver will solve it! Have a config you want to declare only once and share on all environments? fine! config-resolver got you covered!

## Installation
```sh
npm install nfs-config-resolver --save
```

## Usage Example

Create `configs` folder within your project directory

Create `common.js` `development.js` `production.js` files inside `configs` directory

```javscript
// common.js

module.exports = {
  "host":"localhost",
  "port":80
};

```

```javscript
// development.js

module.exports = {
  "port":81,
  "mongodb":{
    "host": "localhost"
    "port": "27017"
  },
  "mode": "admin"
};

```

```javscript
// production.js

module.exports = {
  "port":82
};

```

### How to use ###
You can override configuration with environment parameter

```javascript
// run with environment NODE_ENV=development MONGO_HOST=182.166.12.2 MODE=customer
const config = require('nfs-config-resolver')();

console.log(config)
/*
 {
  "port":81,
  "mongodb":{
    "host": "182.166.12.2"
    "port": "27017"
  },
  "mode": "customer"
}
*/
```

```javascript
// run with environment NODE_ENV = production
const config = require('nfs-config-resolver')();

console.log(config.port)
// 82
```

### ENV compatible

The great thing about this config-resolver is that it can help you on declaring config that needs to bind with the Environment Variables (eg. docker ENV)

You can declare you config by just adding `@` prefix and comma like so:

```javscript
// development.js

module.exports = {
  "port":81,
  "mongodb":{
    "@host:MONGODB_HOST": "localhost"
    "@port:MONGODB_PORT": "27017"
  },
  "@mode": "admin"
};

```

The config generated from this file will be as same as this config

```javscript
// development.js

module.exports = {
  "port":81,
  "mongodb":{
    "host": process.env.MONGODB_HOST || "localhost"
    "port": process.env.MONGODB_PORT || "27017"
  },
  "mode": process.env.MODE || "admin"
};

```

by this config, at runtime, the config value will be overwritten by the environment variable, wether it's linux or Docker. This allow you to have a cleaner setting and save your time on worrying and declaring those environments.

as from the example above, you can override the mongo host just by changing the environment variable at runtime, like this

    MONGODB_HOST=11.11.11.11 node ./index.js

and so on.

The most beneficial to this feature is those who make Docker image!
