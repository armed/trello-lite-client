angular.module('trelloLite').service('Commons', Commons);

Commons.$inject = ['$filter', 'Statuses', 'Products'];
function Commons ($filter, Statuses, Products, loginTag) {
  var simpleDate = $filter('simpleDate');

  return {
    firstStatus: function () {
      return Statuses.statuses()[0];
    },
    statuses: function () {
      return Statuses.statuses();
    },
    issueStatus: function (issue) {
      if (issue) {
        if (!issue.issueStatus) {
          var st = Statuses.statusById(issue.idList);
          issue.issueStatus = st.name;
        }
        return issue.issueStatus;
      }
      return '';
    },
    issuePriorityClass: function (issue) {
      var claz = '';
      if (issue && issue.labels.length > 0) {
        var label = issue.labels[0];

        switch (label.color) {
        case 'red':
          claz = 'label-important';
          break;
        case 'orange':
          claz = 'label-warning';
          break;
        case 'blue':
          claz = 'label-info';
          break;
        case 'green':
          claz = 'label-success';
        }
      }
      return claz;
    },
    issuePriorityName: function (issue) {
      var pName = '';
      if (issue && issue.labels.length > 0) {
        pName = issue.labels[0].name;
      }

      if (!pName) {
        return 'No priority';
      }
      return pName;
    },
    issueSimpleDate: function (issue) {
      if (issue && issue.actions.length) {
        return simpleDate(_.last(issue.actions).date);
      } else {
        return '';
      }
    },
    issueCode: function (issue) {
      if (issue) {
        if (!issue.issueCode) {
          var code = Products.productCode();
          issue.issueCode = code ? code + '-' + issue.idShort : issue.idShort;
        }
        return issue.issueCode;
      }
      return '';
    },
    extractText: function (dataText) {
      if (dataText) {
        var index = dataText.lastIndexOf(loginTag);

        if (~index) {
          return dataText.substring(0, index);
        }
      }
      return dataText || '';
    },
    extractLogin: function (dataText) {
      if (dataText) {
        var index = dataText.lastIndexOf(loginTag);

        if (~index) {
          return dataText.substring(index + loginTag.length - 1,
            dataText.length).trim();
        }
      }
      return  '';
    }
  };
}
