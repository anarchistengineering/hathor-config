const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Code.expect;

const Config = require('../');

describe('Config', ()=>{
  it('Should be able to create an instance', (done)=>{
    const config = new Config();
    expect(config).to.be.an.object();
    expect(config.get).to.be.a.function();
    expect(config.set).to.be.a.function();
    expect(config.remove).to.be.a.function();
    return done();
  });

  it('Should be able to get a configuration value', (done)=>{
    const config = new Config({some: 'value'});
    const val = config.get('some');
    expect(val).to.be.a.string().and.to.equal('value');
    return done();
  });

  it('Should be able to set a configuration value', (done)=>{
    const config = new Config();
    const init = config.get('some');
    expect(init).to.be.undefined();
    config.set('some', 'value');
    const setVal = config.get('some');
    expect(setVal).to.be.a.string().and.to.equal('value');
    return done();
  });

  it('Should be able to remove a configuration value', (done)=>{
    const config = new Config({some: 'value'});
    const val = config.get('some');
    expect(val).to.be.a.string().and.to.equal('value');
    config.remove('some');
    const setVal = config.get('some');
    expect(setVal).to.be.undefined();
    return done();
  });

  it('Should be able to get a child config set', (done)=>{
    const config = new Config({foo: {bar: 'none'}});
    const child = config.get('foo');
    expect(child).to.be.an.object();
    expect(child.get).to.be.a.function();
    const bar = child.get('bar'); // get the value of foo.bar
    expect(bar).to.be.a.string().and.to.equal('none');
    done();
  });

  it('Should be able to get a root config value from a child', (done)=>{
    const config = new Config({foo: {bar: 'none'}, some: 'value'});
    const child = config.get('foo');
    expect(child).to.be.an.object();
    expect(child.get).to.be.a.function();
    const bar = child.get('@some'); // get the value of foo.bar
    expect(bar).to.be.a.string().and.to.equal('value');
    done();
  });

  it('Should be able to convert back to a basic JavaScript object', (done)=>{
    const cfg = {foo: {bar: 'none'}};
    const config = new Config(cfg);
    const cfgOut = config.toJS();
    expect(cfgOut).to.equal(cfg);
    done();
  });

  it('Should be able to convert a sub config back to a basic JavaScript object', (done)=>{
    const cfg = {foo: {bar: 'none'}};
    const config = new Config(cfg);
    const child = config.get('foo');
    const cfgOut = child.toJS();
    expect(cfgOut).to.equal(cfg.foo);
    done();
  });

  it('Should be able to merge an object into the configuration and access both', (done)=>{
    const config = new Config({foo: 'bar'});
    config.merge({bar: 'none'});
    const foo = config.get('foo');
    const bar = config.get('bar');
    expect(foo).to.equal('bar');
    expect(bar).to.equal('none');
    done();
  });

  it('Should be able to merge two different configurations and access both', (done)=>{
    const config = new Config({foo: 'bar'});
    const config2 = new Config({bar: 'none'});
    config.merge(config2);
    const foo = config.get('foo');
    const bar = config.get('bar');
    expect(foo).to.equal('bar');
    expect(bar).to.equal('none');
    done();
  });
});
