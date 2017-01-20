module.exports = {
  database: {
    "@host:DB_HOST": "localhost",
    "@db_user:DB_USER": "",
    "@db_password:DB_PASSWORD": "",
    "collection": "col",
    "@port:DB_PORT": "27017"
  },
  elastic: {
    "@host:ELASTIC_HOST": "http://elastic.mysite.com:9200/"
  },
  transports:{
    listenings:[
      {
        type: 'http',
        port: '8003',
        host: 'localhost',
        timeout: 30000,
        pins: [
          { role: 'property', cmd: '*' }
        ]
      }
    ]
  },
}

