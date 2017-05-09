const expect = require('expect');

const config = require('../src');

describe("Config",()=>{
  afterEach(()=>{
    delete process.env.NODE_ENV;
    delete process.env.A;
    delete process.env.B;
    delete process.env.C;
    delete process.env.D;
    delete process.env.E;
    delete process.env.K;
    delete process.env.Z;
    delete process.env.XA;
  });

  it('should be work correctly',()=>{
    process.env.B = 1;
    const conf1 = config({
      dir:__dirname+'/./configs.1'
    });
    const conf2 = config({
      dir:__dirname+'/./configs.2'
    });
    expect(conf1).toEqual({ a: 'aValue', b: 'bValue', c: { d: { e: 'eValue' }, k: 'kValue', x: [ { xa: 'xaValue' }, { xb: 'xbValue' } ] } });
    expect(conf2).toEqual({ a: 'aValue', b: 'bdValue', c: { d: { e: 'eValue' }, k: 'kValue' }, f: 'fdValue', g: 'gdValue', m: { n: 'n2Value', p: 'pValue', q: 'qValue' } });
  });

  it('should be able to use as production',()=>{
    process.env.NODE_ENV = "production";
    const conf3 = config({
      dir:__dirname+'/./configs.3'
    });
    expect(conf3).toEqual({ a: 'aValue', b: 'bpValue', c: { d: { e: 'eValue' }, k: 'kValue' }, f: 'fpValue', g: 'gpValue' });
  });

  it("should be overriden with environment A",()=>{
    process.env.A = "1";
    const conf1 = config({
      dir:__dirname+'/./configs.1'
    });
    expect(conf1).toEqual({ a: "1", b: 'bValue', c: { d: { e: 'eValue' }, k: 'kValue', x: [ { xa: 'xaValue' }, { xb: 'xbValue' } ] } });
  });

  it("should be overriden with environment K",()=>{
    process.env.K = "3";
    const conf1 = config({
      dir:__dirname+'/./configs.1'
    });
    expect(conf1).toEqual({ a: 'aValue', b: 'bValue', c: { d: { e: 'eValue' }, k: "3" , x: [ { xa: 'xaValue' }, { xb: 'xbValue' } ] } });
  });

  it("should be overriden with environment Z",()=>{
    process.env.Z = "3";
    const conf1 = config({
      dir:__dirname+'/./configs.1'
    });
    expect(conf1).toEqual({ a: 'aValue', b: '3', c: { d: { e: 'eValue' }, k: "kValue", x: [ { xa: 'xaValue' }, { xb: 'xbValue' } ]  } });
  });

  it("should be overriden with environment A K D",()=>{
    process.env.A = "1";
    process.env.K = "3";
    process.env.D = "4";
    const conf1 = config({
      dir:__dirname+'/./configs.1'
    });
    expect(conf1).toEqual({ a: '1', b: 'bValue', c: { d: '4', k: '3', x: [ { xa: 'xaValue' }, { xb: 'xbValue' } ] } });
  });

  it("should be overriden with environment XA",()=>{
    process.env.XA = "1";
    const conf1 = config({
      dir:__dirname+'/./configs.1'
    });
    expect(conf1).toEqual({ a: 'aValue', b: 'bValue', c: { d: { e: 'eValue' }, k: 'kValue', x: [ { xa: '1' }, { xb: 'xbValue' } ] } });
  });

  it("should be able to merge undefined with string correctly" , ()=>{
    process.env.NODE_ENV = "production"
    const conf1 = config({
      dir: __dirname+'/./configs.5'
    });
    expect(conf1).toEqual({
      database: {
        "host": "localhost",
        "db_user": "",
        "db_password": "",
        "collection": "col",
        "port": "27017"
      },
      elastic: {
        "host": "http://elastic.mysite.com:9200/"
      },
      transports:{
        listenings:[
          {
            type: 'amqp',
            port: '8003',
            host: 'localhost',
            timeout: 30000,
            pins: [
              { role: 'property', cmd: '*' }
            ],
            "url": 'amqp://guest:guest@amqpSite:5672'
          }
        ],
        uses: ["seneca-amqp-transport"]
      },
    })
  })

  it('should be able to merge custom environment', () => {
    process.env.NODE_ENV = "custom"
    const conf1 = config({
      dir: __dirname+'/./configs.6'
    });
    expect(conf1.overriden).toEqual('yes')
  })

  it('should be able to load common configs on unknown custom environment', () => {
    process.env.NODE_ENV = 'unknown-whatever'
    const conf1 = config({
      dir: __dirname+'/./configs.6'
    });
    expect(conf1.overriden).toEqual('no')
  })
});


describe("Mail Configuration",()=>{
  it("should render correctly",()=>{
    const conf4 = config({
      dir:__dirname+'/./configs.4'
    });
    expect(conf4).toEqual({
       "senecaLog": {
        "log": "silent"
       },
       "ses": {
        "accessKeyId": "cccaaa",
        "secretAccessKey": "xxxyyy",
        "region": "us-west-2"
       },
       "redisMQ": {
        "host": "127.0.0.1",
        "port": "6379",
        "ns": "rsmq"
       },
       "transports": {
        "listenings": [
         {
          "type": "tcp",
          "pins": [
           {
            "role": "MAIL",
            "cmd": "*"
           }
          ]
         },
         {
          "type": "amqp",
          "pins": [
           {
            "role": "MAIL",
            "cmd": "QUEUE"
           },
           {
            "role": "MAIL",
            "cmd": "TEST"
           }
          ],
          "url": "amqp://guest:guest@128.199.105.153:5672"
         }
        ]
       },
       "send_actual_mail": "true",
       "host": "http://www.rentspree.com",
       "spawn": {
        "stdio": "ignore"
       }
      });
  });
})
