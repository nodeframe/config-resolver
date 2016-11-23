

const DEFAULT_ROOT = __dirname + "/./../../../configs";

function isObject (item) {
  return (typeof item === "object" && !Array.isArray(item) && item !== null);
}

const requireWithDefault = (path,default_require={})=>{
  try{
    return require(path);
  }catch(e){
    return default_require;
  }
}

const mergeConfigs = (...confs)=>{
  return confs.reduce((acc,curr)=>{
    return Object.assign(acc,curr);
  },{});
};

const resolveEnvValue = (evalue)=>{
  if(evalue == "TRUE" || evalue == "true") return true;
  else if(evalue == "FALSE" || evalue == "false") return false;
  else if(!isNaN(+evalue))return +evalue;
  return evalue;
};

const resolveConfig = (conf)=>{
  return Object.keys(conf).map((v)=>{
    const envs = /^@(.*)/.exec(v);
    const cenvs = /^@(.*?):([^:]*)/.exec(v);
    const value = (isObject(conf[v]))?resolveConfig(conf[v]):conf[v];
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

module.exports = function({dir = DEFAULT_ROOT} = {}){
  return resolveConfig(
    mergeConfigs(
      readCommon(dir),
      (process.env.NODE_ENV==="production")?
        readProduction(dir):readDevelopment(dir)
    )
  );
};
