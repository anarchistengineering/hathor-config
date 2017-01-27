const {
  merge,
  camelKeys,
  getObjectValue,
  setObjectValue,
  removeObjectValue,
  keyToPath
} = require('hathor-utils');

class Config{
  constructor(config = {}, options = {}){
    this.CONFIG = config || {};
    this.baseKey = options.baseKey || '';
  }

  merge(config){
    this.CONFIG = merge(this.CONFIG, (config instanceof Config)?config.toJS():config);
  }

  prefixKey(key){
    if(key[0] === '@'){
      return key.substr(1);
    }
    if(this.baseKey){
      return `${this.baseKey}/${key}`;
    }
    return key;
  }

  toJS(){
    return this.baseKey?getObjectValue(keyToPath(this.baseKey), this.CONFIG):this.CONFIG;
  }

  get(key, defaultValue){
    const baseKey = this.prefixKey(key);
    const val = getObjectValue(keyToPath(baseKey), this.CONFIG, defaultValue);
    return typeof(val)==='object'?new Config(this.CONFIG, {baseKey}):val;
  }

  set(key, value){
    const baseKey = this.prefixKey(key);
    this.CONFIG = setObjectValue(keyToPath(baseKey), this.CONFIG, value);
  }

  remove(key){
    const baseKey = this.prefixKey(key);
    this.CONFIG = removeObjectValue(keyToPath(baseKey), this.CONFIG);
  }
}

module.exports = Config;
