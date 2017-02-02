Hathor Configuration Provider
===

Used to provide configuration values to a Hathor application, plugins, and routes.

Install
---

```
npm install --save hathor-config
```

Usage
---

```js
const {Server} = require('hathor');
const Config = require('hathor-config');
const logger = require('hathor-logger');

config.set('server.logger', logger);

const serverConfig = config.get('server', {});
const server = new Server(serverConfig);

server.start((err)=>{
  logger.error(err);
  process.exit(1);
});
```

API
---

### Config(config, options)

Creates a new instance of the Hathor Config object.  If config is provided then this is used as the base values.  If not an empty object is used.

Options allows setting the "baseKey" of the instance.  If baseKey is provided then this is the root that will be used when looking up values.

### Config.merge(config)

Merges the values from the JavaScript object config or from another instance of Hathor Config.  Useful for merging multiple configuration providers (Ex: file combined with environment variables) into a single configuration object.  Most projects will probably utilize merge.

### Config.get(key, defaultValue)

Lookup and return the configuration value from the store.  If the returned object is a JavaScript object then it is wrapped in a new Config object that is created with the baseKey set to key.  If it is a base type (Number, String, Boolean, RegExp, Date) then the value is returned.  If it isn't found at all then the value passed in defaultValue is returned.

To lookup values that are from the root configuration provider you can start the key with an @ symbol.

```js
const myConfig = new Config({
  someString: 'value',
  someNumber: 123,
  someBool: true,
  someObj: {
    foo: 'bar'
  }});
myConfig.get('someString'); // -> 'value'
myConfig.get('someNumber'); // -> 123
myConfig.get('someBool'); // -> true
myConfig.get('someObj'); // -> new Config({foo: 'bar'})
myConfig.get('someObj.foo'); // -> 'bar'
myConfig.get('someObj/foo'); // -> 'bar'
myConfig.get('someObj').get('foo'); // -> 'bar'
myConfig.get('someObj').get('@someNumber'); // -> 123
```

### Config.set(key, value)

Sets a value in the configuration.

```js
const myConfig = new Config();
myConfig.get('foo'); // -> undefined
myConfig.set('foo', 'bar');
myConfig.get('foo'); // -> 'bar'
```

### Config.remove(key)

Removes a value from the configuration.

```js
const myConfig = new Config({foo: 'bar'});
myConfig.get('foo'); // -> 'bar'
myConfig.remove('foo');
myConfig.get('foo'); // -> undefined
```

### Config.toJS()

Returns the configuration object at baseKey as a JavaScript object.

```js
const myConfig = new Config({foo: 'bar'});
myConfig.toJS(); // -> {foo: 'bar'}
```

### Config.prefixKey(key) - internal
