module.exports = {
  transports: {
    listenings: [
      {
        type: 'amqp',
        "@url:AMQP_URL": 'amqp://guest:guest@amqpSite:5672'
      }
    ],
    uses: ["seneca-amqp-transport"]

  }
}