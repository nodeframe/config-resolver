# config-resolver


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

prefix key with `@` to allow a parameter to be overriden with environment parameter
```javscript
// development.js

module.exports = {
  "port":81,
  "mongodb":{
    "@host:MONGO_HOST": "localhost"
    "@port:MONGO_PORT": "27017"
  },
  "@mode": "admin"
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
