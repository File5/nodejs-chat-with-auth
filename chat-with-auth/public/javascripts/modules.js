var app = angular.module("chat", ['btford.socket-io']);

app.factory('mySocket', function (socketFactory) {
  return socketFactory();
});
app.controller("UserController", function (mySocket, $http) {
  this.users = [];
  var self = this;
  $http.get('./users/').then(function (response) {
    for (var user in response.data) {
      self.users.push(response.data[user].username);
    }
  });
  mySocket.on('login', function (username) {
    if (self.users.indexOf(username) == -1) {
      self.users.push(username);
    }
  });
  mySocket.on('logout', function (username) {
    if (self.users.indexOf(username) != -1) {
      self.users = deleteFromArray(self.users, self.users.indexOf(username));
    }
  });
});

app.directive("onFinishRender", function ($timeout) {
  return {
    restrict: "A",
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit("ngRepeatFinished");
        });
      }
    }

  }
});
app.controller("MessageController", function ($scope, mySocket) {
  var username = document.getElementById("username").innerHTML;
  var scrollBottom = function () {
    document.getElementById("bottom").scrollIntoView();
  };
  $scope.$on('ngRepeatFinished', function (event) {
    scrollBottom();
  });
  var self = this;
  this.isOwn = function (message) {
    if (message.from_id == username) {
      return true;
    } else {
      return false;
    }
  };
  this.msgauthor = function (message) {
    if (this.isOwn(message)) {
      return "datenameown";
    } else {
      return "datenameget";
    }
  };
  this.msgClass = function (message) {
    if (this.isOwn(message)) {
      return "ownmsg";
    } else {
      return "msg";
    }
  };
});

app.controller("TyperController", function (mySocket, $scope) {
  var username = document.getElementById("username").innerHTML;
  this.message = {
    text: "",
    from_id: username
  };
  var self = this;
  this.sendMessage = function () {
    if (self.message.text != "") {
      if (self.message.text.indexOf("lorem") == 0) {
        var mas = self.message.text.split(" ");
        if ((mas[1] != undefined) && (isFinite(mas[1]))) {
          self.message.text = lorem(mas[1]);
        } else {
          self.message.text = lorem(undefined);
        }
      }
      var msg = {
        text: self.message.text,
        from_id: self.message.from_id
      };
      if ($scope.to_id) {
        msg.to_id = $scope.to_id;
      }
      self.message.text = "";
      mySocket.emit("message", msg);
    }
  };
  document.querySelector('textarea').onkeypress = function (e) {
    if (e.which == '13') {
      setTimeout(self.sendMessage(), 1);
    }
  };
});

app.controller('TabsController', function (mySocket, $scope, $http) {
  var username = document.getElementById("username").innerHTML;
  this.tabs = [
    {
      title: "Chat",
      messages: []
    },
  ];

  this.active = 0;
  var self = this;
  this.isActive = function (tabNo) {
    return tabNo == self.active;
  };
  this.setActive = function (tabNo) {
    if (tabNo in this.tabs) {
      this.active = tabNo;
      $scope.messages = self.tabs[tabNo].messages;
      if (tabNo != 0) {
        $scope.to_id = self.tabs[tabNo].title;
      } else {
        $scope.to_id = '';
      }
    }
  };
  this.deleteTab = function (tabNo) {
    if (tabNo in this.tabs && tabNo != 0) {
      self.tabs = deleteFromArray(self.tabs, tabNo);
      if (self.active == tabNo && self.active > 0) {
        self.setActive(self.active - 1);
      }
    }
  };
  this.createTab = function (userid) {
    for (var tab in self.tabs) {
      if (self.tabs[tab].title == userid) {
        return tab;
      }
    }
    return self.tabs.push({
      title: userid,
      messages: []
    }) - 1;
  };
  this.loadMessages = function () {
    if (self.active == 0) {
      $http.get('/messages/chat/10/' + $scope.messages.length).then(function (response) {
        $scope.messages.unshift.apply($scope.messages, response.data);
      });
    } else {
      $http.get('/messages/p/' + self.tabs[self.active].title + '/10/' + $scope.messages.length).then(function (response) {
        $scope.messages.unshift.apply($scope.messages, response.data);
      });
    }
  }
  $scope.messages = self.tabs[0].messages;
  $scope.to_id = '';
  mySocket.on('message', function (data) {
    if (data.to_id) {
      var tabNo = 0;
      if (data.from_id == username) {
        tabNo = self.createTab(data.to_id);
      } else {
        tabNo = self.createTab(data.from_id);
      }
      self.tabs[tabNo].messages.push(data);
    } else {
      self.tabs[0].messages.push(data);
    }
  });
})

function deleteFromArray(array, index) {
  var a = [];
  for (var i = 0; i < array.length; i++) {
    if (i == index) continue;
    a.push(array[i]);
  }
  return a;
}