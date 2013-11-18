var path = require('path');

function mkpath (p) {
  return path.resolve(__dirname + p);
}

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    cookieSecret: 'trello-lite-client-secret'
  },
  client: {
    dist: mkpath('/../client/dist'),
    partials: mkpath('/../client/dist/partials')
  },
  trello: {
    apiKey: process.env.API_KEY || 'someKey',
    organization: process.env.ORG || 'MyORG',
    token: process.env.TOKEN || 'tok'
  }
};
