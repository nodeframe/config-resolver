
import merge from 'deepmerge';

const DEFAULT_ROOT = __dirname + "/./../../../configs";

function isObject (item) {
  return (typeof item === "object" && !Array.isArray(item) && item !== null);
}
function isArray(item){
  return Array.isArray(item);
}

const requireWithDefault = (path,default_require={})=>{
  try{
    return require(path);
  }catch(e){
    if(e.code === "MODULE_NOT_FOUND")
      return default_require;
    else
      throw e
  }
}

const mergeConfigs = (...confs)=>{
  return merge(...confs);
};

const resolveConfig = (conf)=>{
  if(typeof conf !== 'object') {return conf}
  return Object.keys(conf).map((v)=>{
    const envs = /^@(.*)/.exec(v);
    const cenvs = /^@(.*?):([^:]*)/.exec(v);
    const value = (isObject(conf[v]))?
      resolveConfig(conf[v]):
      (isArray(conf[v]))?conf[v].map((cf)=>resolveConfig(cf))
      :conf[v];
    if(cenvs && cenvs[1] && cenvs[2]){
      return {[cenvs[1]]:(process.env[cenvs[2].toUpperCase()]||value)};
    }else if(envs && envs[1]){
      return {[envs[1]]:(process.env[envs[1].toUpperCase()]||value)};
    }else{
      return {[v]:value};
    }
  }).reduce((acc,curr)=>{
    return {...acc,...curr};
  },{});
};

const readCommon = (dir)=>{
  return requireWithDefault(dir+"/./common.js",{});
};

const readProduction = (dir)=>{
  return requireWithDefault(dir+"/./production.js",{});
};

const readDevelopment = (dir)=>{
  return requireWithDefault(dir+"/./development.js",{});
};

const read = (dir, env) => {
  try{
    return require(dir + "/./" + env + ".js");
  }catch(e){
    return readDevelopment(dir);
  }
}

module.exports = function({dir = DEFAULT_ROOT} = {}){
  let file
  if (process.env.NODE_ENV === 'production') {
    file = readProduction(dir)
  } else {
    file = read(dir, process.env.NODE_ENV)
  }

  return resolveConfig(
    mergeConfigs(readCommon(dir),file)
  );
};
