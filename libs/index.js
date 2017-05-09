"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _deepmerge = require("deepmerge");

var _deepmerge2 = _interopRequireDefault(_deepmerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_ROOT = __dirname + "/./../../../configs";

function isObject(item) {
  return (typeof item === "undefined" ? "undefined" : _typeof(item)) === "object" && !Array.isArray(item) && item !== null;
}
function isArray(item) {
  return Array.isArray(item);
}

var requireWithDefault = function requireWithDefault(path) {
  var default_require = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  try {
    return require(path);
  } catch (e) {
    return default_require;
  }
};

var mergeConfigs = function mergeConfigs() {
  return _deepmerge2.default.apply(undefined, arguments);
};

var resolveConfig = function resolveConfig(conf) {
  if ((typeof conf === "undefined" ? "undefined" : _typeof(conf)) !== 'object') {
    return conf;
  }
  return Object.keys(conf).map(function (v) {
    var envs = /^@(.*)/.exec(v);
    var cenvs = /^@(.*?):([^:]*)/.exec(v);
    var value = isObject(conf[v]) ? resolveConfig(conf[v]) : isArray(conf[v]) ? conf[v].map(function (cf) {
      return resolveConfig(cf);
    }) : conf[v];
    if (cenvs && cenvs[1] && cenvs[2]) {
      return _defineProperty({}, cenvs[1], process.env[cenvs[2].toUpperCase()] || value);
    } else if (envs && envs[1]) {
      return _defineProperty({}, envs[1], process.env[envs[1].toUpperCase()] || value);
    } else {
      return _defineProperty({}, v, value);
    }
  }).reduce(function (acc, curr) {
    return _extends({}, acc, curr);
  }, {});
};

var readCommon = function readCommon(dir) {
  return requireWithDefault(dir + "/./common.js", {});
};

var readProduction = function readProduction(dir) {
  return requireWithDefault(dir + "/./production.js", {});
};

var readDevelopment = function readDevelopment(dir) {
  return requireWithDefault(dir + "/./development.js", {});
};

var read = function read(dir, env) {
  try {
    return require(dir + "/./" + env + ".js");
  } catch (e) {
    return readDevelopment(dir);
  }
};

module.exports = function () {
  var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref4$dir = _ref4.dir,
      dir = _ref4$dir === undefined ? DEFAULT_ROOT : _ref4$dir;

  var file = void 0;
  if (process.env.NODE_ENV === 'production') {
    file = readProduction(dir);
  } else {
    file = read(dir, process.env.NODE_ENV);
  }

  return resolveConfig(mergeConfigs(readCommon(dir), file));
};
//# sourceMappingURL=index.js.map