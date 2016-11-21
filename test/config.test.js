const expect = require('expect');

const config = require('../src');

describe("Config 1",()=>{
  afterEach(()=>{
    delete process.env.NODE_ENV;
    delete process.env.A;
    delete process.env.B;
    delete process.env.C;
    delete process.env.D;
    delete process.env.E;
    delete process.env.K;
  });

  it('should be work correctly',()=>{
    process.env.B = 1;
    const conf1 = config({
      dir:__dirname+'/./configs.1'
    });
    const conf2 = config({
      dir:__dirname+'/./configs.2'
    });

    expect(conf1).toEqual({ a: 'aValue', b: 'bValue', c: { d: { e: 'eValue' }, k: 'kValue' } });
    expect(conf2).toEqual({ a: 'aValue', b: 'bdValue', c: { d: { e: 'eValue' }, k: 'kValue' }, f: 'fdValue', g: 'gdValue' });

  });

  it('should be able to use as production',()=>{
    process.env.NODE_ENV = "production";
    const conf3 = config({
      dir:__dirname+'/./configs.3'
    });
    expect(conf3).toEqual({ a: 'aValue', b: 'bpValue', c: { d: { e: 'eValue' }, k: 'kValue' }, f: 'fpValue', g: 'gpValue' });
  });

  it("should be overriden with environment A",()=>{
    process.env.A = 1;
    const conf1 = config({
      dir:__dirname+'/./configs.1'
    });
    const conf2 = config({
      dir:__dirname+'/./configs.2'
    });
    const conf3 = config({
      dir:__dirname+'/./configs.3'
    });
    expect(conf1).toEqual({ a: 1, b: 'bValue', c: { d: { e: 'eValue' }, k: 'kValue' } });
  });

  it("should be overriden with environment K",()=>{
    process.env.K = 3;
    const conf1 = config({
      dir:__dirname+'/./configs.1'
    });
    const conf2 = config({
      dir:__dirname+'/./configs.2'
    });
    const conf3 = config({
      dir:__dirname+'/./configs.3'
    });
    expect(conf1).toEqual({ a: 'aValue', b: 'bValue', c: { d: { e: 'eValue' }, k: 3 } });
  });

  it("should be overriden with environment A K D",()=>{
    process.env.A = 1;
    process.env.K = 3;
    process.env.D = 4;
    const conf1 = config({
      dir:__dirname+'/./configs.1'
    });
    const conf2 = config({
      dir:__dirname+'/./configs.2'
    });
    const conf3 = config({
      dir:__dirname+'/./configs.3'
    });
    expect(conf1).toEqual({ a: 1, b: 'bValue', c: { k: 3, d: 4 } });
  });
});
