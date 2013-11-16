var trello = require('./trello'),
    config = require('../config');

var Proxy = trello.Proxy(config.trello);

var api = {
  index: function (req, res) {
    res.sendfile('index.html', { root: config.client.dist });
  },
  version: function (req, res) {
    res.send(res.locals.version);
  },
  members: function (req, res) {
    Proxy.getMembers(req, res)
  },
  boards: function (req, res) {
    Proxy.getBoards(req, res)
  },
  lists: function (req, res) {
    Proxy.getLists(req, res)
  },
  cardsInList: function (req, res) {
    Proxy.getCardsInList(req, res)
  },
  cardsInBoard: function (req, res) {
    Proxy.getCardsInBoard(req, res)
  },
  card: function (req, res) {
    Proxy.getCard(req, res)
  },
  createCard: function (req, res) {
    Proxy.createCard(req, res)
  },
  cardLabel: function (req, res) {
    Proxy.setCardLabel(req, res)
  },
  attachment: function (req, res) {
    Proxy.addAttachment(req, res)
  },
  cardComments: function (req, res) {
    Proxy.getCardComments(req, res)
  },
  postComment: function (req, res) {
    Proxy.postCardComment(req, res)
  }
};

module.exports = function (app) {
  app.get('/', api.index)
    .get('/api/version', api.version)
    .get('/api/members', api.members)
    .get('/api/boards', api.boards)
    .get('/api/boards/:idBoard/lists', api.lists)
    .get('/api/boards/:idBoard/cards', api.cardsInBoard)
    .get('/api/lists/:idList/cards', api.cardsInList)
    .get('/api/boards/:idBoard/cards/:idShort', api.card)
    .get('/api/cards/:idCard/comments', api.cardComments)
    .post('/api/cards', api.card)
    .post('/api/cards/:idCard/labels', api.cardLabel)
    .post('/api/cards/:idCard/attachments', api.attachment)
    .post('/api/cards/:idCard/comments', api.postComment)
    .get('*', api.index);
};
