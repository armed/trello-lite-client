var request = require('request'),
    urljoin = require('url-join'),
    _ = require('lodash');

var BASE_URL = 'https://api.trello.com/1/',
    ORGS = BASE_URL + 'organizations',
    BOARDS = BASE_URL + 'boards',
    CARDS = BASE_URL + 'cards',
    LISTS = BASE_URL + 'lists',
    CARD_FIELDS = '?fields=name,idList,idShort,labels,' +
                  'dateLastActivity&actions=createCard';

var Client, Proxy;

function appendKeys (u) {
  if (!this.opts) {
    return u;
  }

  if (~u.indexOf('?')) {
    u += '&';
  } else {
    u += '?';
  }
  return u + 'key=' + this.opts.apiKey + '&token=' + this.opts.token;
}

module.exports.Client = Client = function (opts) {
  if (!(this instanceof Client)) return new Client(opts);
  this.opts = opts;
};
_.extend(Client.prototype, {
  getNotifications: function (callback) {
    var u = this.appendKeys(urljoin(BASE_URL, 'members/me',
      'notifications?filter=addedAttachmentToCard,commentCard,' +
        'changeCard&limit=20&read_filter=unread'));

    request.get(u, function (err, response, body) {
      if (err) {
        callback(err);
      } else if (response.statusCode >= 200 && response.statusCode < 299) {
        callback(null, JSON.parse(body));
      } else {
        callback(new Error('failed to access trello.com: ' + response.statusCode));
      }
    });
  },
  markNotificationsAsRead: function (callback) {
    var u = this.appendKeys(urljoin(BASE_URL, 'notifications/all/read'));
    request.post(u, function (err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, response.statusCode);
      }
    });
  },
  appendKeys: appendKeys
});

module.exports.Proxy = Proxy = function (opts) {
  if (!(this instanceof Proxy)) return new Proxy(opts);
  this.opts = opts;
};
_.extend(Proxy.prototype, {
  _createBoardUrl: function (idBoard, qs) {
    return this.appendKeys(urljoin(BOARDS, idBoard, qs));
  },
  _createCommentsUrl: function (idCard) {
    var u = urljoin(CARDS, idCard, 'actions?filter=commentCard,updateCard:idList,createCard');
    return this.appendKeys(u);
  },
  appendKeys: appendKeys,
  getMembers: function (req, res) {
    var u = this.appendKeys(urljoin(ORGS, this.opts.organization, 'members'));
    proxify(req, res, u);
  },
  getBoards: function (req, res) {
    var u = this.appendKeys(urljoin(ORGS, this.opts.organization,
      'boards?fields=name,desc&filter=open'));
    proxify(req, res, u);
  },
  getLists: function (req, res) {
    var u = this._createBoardUrl(req.params.idBoard, 'lists?fields=name');
    proxify(req, res, u);
  },
  getCardsInBoard: function (req, res) {
    var u = this._createBoardUrl(req.params.idBoard, 'cards' + CARD_FIELDS);
    proxify(req, res, u);
  },
  getCardsInList: function (req, res) {
    var u = this.appendKeys(urljoin(LISTS, req.params.idList, 'cards', CARD_FIELDS));
    proxify(req, res, u);
  },
  getCard: function (req, res) {
    var p = req.params;
    var u = this._createBoardUrl(p.idBoard, urljoin('cards/' + p.idShort,
      '?actions=createCard,addAttachmentToCard,commentCard,updateCard'));
    proxify(req, res, u);
  },
  createCard: function (req, res) {
    var u = this.appendKeys(CARDS);
    proxify(req, res, { url: u, json: req.body });
  },
  setCardLabel: function (req, res) {
    var u = this.appendKeys(urljoin(CARDS, req.params.idCard, 'labels'));
    proxify(req, res, { url: u, json: req.body });
  },
  addAttachment: function (req, res) {
    var u = this.appendKeys(urljoin(CARDS, req.params.idCard, 'attachments'));
    proxify(req, res, u);
  },
  getCardComments: function (req, res) {
    var u = this._createCommentsUrl(req.params.idCard);
    proxify(req, res, u);
  },
  postCardComment: function (req, res) {
    var u = this.appendKeys(urljoin(CARDS, req.params.idCard, 'actions/comments'));
    proxify(req, res, { url: u, json: req.body });
  }
});

function proxify (req, res, params) {
  var method = req.method.toLowerCase();
  req.pipe(request[method](params)).pipe(res);
}
