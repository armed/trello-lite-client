var trello = require('../src/trello')
var request = require('request')

var tests = module.exports = {
  setUp: function (callback) {
    this.opts = { apiKey: 'someKey', organization: 'MyORG', token: 'tok' };
    this._get = request.get;
    this._post = request.post;
    callback();
  },
  tearDown: function (callback) {
    request.get = this._get;
    request.post = this._post;
    callback();
  }
}

tests.client = {

  init: function (test) {
    var c = trello.Client(this.opts);
    test.ok(c.opts === this.opts, 'client options');
    test.done();
  },

  appendKeys: function (test) {
    var c = new trello.Client(this.opts);

    test.strictEqual(c.appendKeys('http://test.com'), 'http://test.com?key=someKey&token=tok',
      'appendKeys to parameterless url');
    test.strictEqual(c.appendKeys('http://test.com?data=123'),
      'http://test.com?data=123&key=someKey&token=tok', 'appedKeys to url with params');
    test.done()
  },

  getNotifications: function (test) {
    test.expect(5);

    var c = trello.Client(this.opts);

    var _get = request.get;

    request.get = function (url, cb) {
      cb(new Error('some err'));
    }

    c.getNotifications(function (err, data) {
      test.ok(err, 'it should pass error');
    })

    request.get = function (url, cb) {
      cb(null, { statusCode: 200 }, '{ "hello": "world" }');
    }

    c.getNotifications(function (err, data) {
      test.equal(err, null, 'error should be null');
      test.strictEqual(data.hello, 'world', 'data');
    })

    request.get = function (url, cb) {
      cb(null, { statusCode: 300 });
    }

    c.getNotifications(function (err, data) {
      test.ok(err, 'it should pass error');
      test.strictEqual(err.message, 'failed to access trello.com: 300', 'error message');
      test.done();
    })

    request.get = _get;
  },

  markNotificationsAsRead: function (test) {
    test.expect(4);

    var c = trello.Client(this.opts);

    var _post = request.post;

    request.post = function (url, callback) {
      callback(null, { statusCode: 200 });
    };

    c.markNotificationsAsRead(function (err, status) {
      test.equal(err, null, 'no error');
      test.equal(status, 200, 'status code');
    })

    request.post = function (url, callback) {
      callback(new Error('request error'));
    };

    c.markNotificationsAsRead(function (err, status) {
      test.ok(err, 'should be error');
      test.equal(err.message, 'request error');
      test.done();
    })

    request.post = _post;
  }
};

tests.proxy = {
  setUp: function (callback) {
    this.p = trello.Proxy(this.opts);
    this.rr = {
      method: 'GET',
      pipe: function () {
        return this;
      }
    }
    callback();
  },

  init: function (test) {
    test.ok(this.p.opts === this.opts);
    test.done();
  },

  createBoardUrl: function (test) {
    var u = this.p._createBoardUrl(123, 'members');
    test.strictEqual(u, 'https://api.trello.com/1/boards/123/members?key=someKey&token=tok');
    test.done();
  },

  createCommentsUrl: function (test) {
    var u = this.p._createCommentsUrl(123);
    test.strictEqual(u, 'https://api.trello.com/1/cards/123/actions?filter=commentCard,' +
      'updateCard:idList,createCard&key=someKey&token=tok');
    test.done();
  },

  getMembers: function (test) {
    test.expect(1);

    request.get = function (url) {
      test.strictEqual(url,
        'https://api.trello.com/1/organizations/MyORG/members?key=someKey&token=tok');
      test.done();
    }

    this.p.getMembers(this.rr, this.rr);
  },

  getBoards: function (test) {
    test.expect(1);

    request.get = function (url) {
      test.strictEqual(url,
        'https://api.trello.com/1/organizations/MyORG/boards?fields=name,desc&' +
        'filter=open&key=someKey&token=tok');
      test.done();
    }

    this.p.getBoards(this.rr, this.rr);
  },

  getLists: function (test) {
    test.expect(1);

    request.get = function (url) {
      test.strictEqual(url,
        'https://api.trello.com/1/boards/123/lists?fields=name&key=someKey&token=tok');
      test.done();
    }

    this.rr.params = { idBoard: 123 };

    this.p.getLists(this.rr, this.rr);
  },

  getCardsInBoard: function (test) {
    test.expect(1);

    request.get = function (url) {
      test.strictEqual(url,
        'https://api.trello.com/1/boards/123/cards?fields=name,idList,idShort,labels,' +
        'dateLastActivity&actions=createCard&key=someKey&token=tok');
      test.done();
    }

    this.rr.params = { idBoard: 123 };

    this.p.getCardsInBoard(this.rr, this.rr);
  },

  getCardsInList: function (test) {
    test.expect(1);

    request.get = function (url) {
      test.strictEqual(url,
        'https://api.trello.com/1/lists/listId123/cards?fields=name,idList,idShort,labels,' +
        'dateLastActivity&actions=createCard&key=someKey&token=tok');
      test.done();
    }

    this.rr.params = { idList: 'listId123' };

    this.p.getCardsInList(this.rr, this.rr);
  },

  getCard: function (test) {
    test.expect(1);

    request.get = function (url) {
      test.strictEqual(url,
        'https://api.trello.com/1/boards/board123/cards/short123?actions=createCard,' +
        'addAttachmentToCard,commentCard,updateCard&key=someKey&token=tok');
      test.done();
    }

    this.rr.params = { idBoard: 'board123', idShort: 'short123' };

    this.p.getCard(this.rr, this.rr);
  },

  createCard: function (test) {
    test.expect(2);

    this.rr.method = 'POST';
    var body = this.rr.body = '{ "some": "body" }';

    request.post = function (params) {
      test.strictEqual(params.url,
        'https://api.trello.com/1/cards?key=someKey&token=tok');
      test.strictEqual(params.json, body);
      test.done();
    }

    this.p.createCard(this.rr, this.rr);
  },

  setCardLabel: function (test) {
    test.expect(2);

    this.rr.method = 'POST';
    this.rr.params = {
      idCard: 'card123'
    };

    var body = this.rr.body = '{ "some": "body" }';

    request.post = function (params) {
      test.strictEqual(params.url,
        'https://api.trello.com/1/cards/card123/labels?key=someKey&token=tok');
      test.strictEqual(params.json, body);
      test.done();
    }

    this.p.setCardLabel(this.rr, this.rr);
  },

  addAttachment: function (test) {
    test.expect(1);

    this.rr.method = 'POST';
    this.rr.params = {
      idCard: 'card123'
    };

    var body = this.rr.body = '{ "some": "body" }';

    request.post = function (url) {
      test.strictEqual(url,
        'https://api.trello.com/1/cards/card123/attachments?key=someKey&token=tok');
      test.done();
    }

    this.p.addAttachment(this.rr, this.rr);
  },

  getCardComments: function (test) {
    test.expect(1);

    request.get = function (url) {
      test.strictEqual(url,
        'https://api.trello.com/1/cards/card123/actions?filter=commentCard,' +
        'updateCard:idList,createCard&key=someKey&token=tok');
      test.done();
    }

    this.rr.params = { idCard: 'card123' };

    this.p.getCardComments(this.rr, this.rr);
  },

  postCardComment: function (test) {
    test.expect(2);

    this.rr.method = 'POST';
    this.rr.params = { idCard: 'card123' };
    var body = this.rr.body = '{ "some": "body" }';

    request.post = function (params) {
      test.strictEqual(params.url,
        'https://api.trello.com/1/cards/card123/actions/comments?key=someKey&token=tok');
      test.strictEqual(params.json, body);
      test.done();
    }

    this.p.postCardComment(this.rr, this.rr);
  }
};
