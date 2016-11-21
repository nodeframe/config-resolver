

const DEFAULT_ROOT = __dirname + "/./../";

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
    const keys = /^@(.*)/.exec(v);
    const value = (isObject(conf[v]))?resolveConfig(conf[v]):conf[v];
    return {[(keys&&keys[1])?keys[1]:v]:(keys&&keys[1])?(resolveEnvValue(process.env[keys[1].toUpperCase()])||value):value};
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

module.exports = function({dir = DEFAULT_ROOT} = requireWithDefault(process.env.PWD+'/./.config',{})){
  return resolveConfig(
    mergeConfigs(
      readCommon(dir),
      (process.env.NODE_ENV==="production")?
        readProduction(dir):readDevelopment(dir)
    )
  );
};
