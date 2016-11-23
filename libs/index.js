"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_ROOT = __dirname + "/./../../../configs";

function isObject(item) {
  return (typeof item === "undefined" ? "undefined" : _typeof(item)) === "object" && !Array.isArray(item) && item !== null;
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
  for (var _len = arguments.length, confs = Array(_len), _key = 0; _key < _len; _key++) {
    confs[_key] = arguments[_key];
  }

  return confs.reduce(function (acc, curr) {
    return Object.assign(acc, curr);
  }, {});
};

var resolveEnvValue = function resolveEnvValue(evalue) {
  if (evalue == "TRUE" || evalue == "true") return true;else if (evalue == "FALSE" || evalue == "false") return false;else if (!isNaN(+evalue)) return +evalue;
  return evalue;
};

var resolveConfig = function resolveConfig(conf) {
  return Object.keys(conf).map(function (v) {
    var envs = /^@(.*)/.exec(v);
    var cenvs = /^@(.*?):([^:]*)/.exec(v);
    var value = isObject(conf[v]) ? resolveConfig(conf[v]) : conf[v];
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

module.exports = function () {
  var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref4$dir = _ref4.dir,
      dir = _ref4$dir === undefined ? DEFAULT_ROOT : _ref4$dir;

  return resolveConfig(mergeConfigs(readCommon(dir), process.env.NODE_ENV === "production" ? readProduction(dir) : readDevelopment(dir)));
};
//# sourceMappingURL=index.js.map