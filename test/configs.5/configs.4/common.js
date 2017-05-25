module.exports = {
  senecaLog:{
    log:'silent'
  },
  ses:{
    "@accessKeyId:AMAZON_SES_ACCESS_KEY_ID": 'cccaaa',
    "@secretAccessKey:AMAZON_SES_SECRET_KEY": 'xxxyyy',
    "@region:AMAZON_SES_REGION":'us-west-2'
  },
  redisMQ:{
    "@host:REDISMQ_HOST": "127.0.0.1",
    "@port:REDISMQ_PORT": "6379",
    "@ns:REDISMQ_NAMESPACE": "rsmq"
  },
  transports:{
    listenings:[
      {
        type:'tcp',
        pins: [
          { role: 'MAIL', cmd:'*'}
        ]
      },
      {
        type: 'amqp',
        pins: [
          { role: 'MAIL', cmd: 'QUEUE' },
          { role: 'MAIL', cmd: 'TEST' }
        ],
        "@url:AMQP_URL":'amqp://guest:guest@128.199.105.153:5672'
      }
    ]
  },
  "@send_actual_mail:SEND_MAIL": "true",
  "@host:HOST": 'http://www.rentspree.com',
  spawn: { "@stdio": "ignore" }
};
