module.exports = {
  server: {
    port: process.env.PORT || 3000,
    cookieSecret: 'trello-lite-client-secret'
  },
  client: {
    dist: __dirname + '/../client/dist',
    partials: __dirname + '/../client/dist/partials'
  },
  trello: {
    apiKey: process.env.API_KEY || 'someKey',
    organization: process.env.ORG || 'MyORG',
    token: process.env.TOKEN || 'tok'
  }
};
