var searchSubmitBtn;
var searchTextInput;
var resultText;
var workerWindow;
var step = 0;

var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  onDeviceReady: function() {
    window.open = cordova.InAppBrowser.open;
    this.bindButtons();
  },

  bindButtons: function() {
    searchSubmitBtn = document.querySelector("#searchSubmit");
    searchTextInput = document.querySelector("#searchText");
    resultText = document.querySelector("#result");

    searchSubmitBtn.addEventListener('click', this.onSearchSubmitBtnClick.bind(this), false);
  },

  onSearchSubmitBtnClick: function() {
    workerWindow = window.open("", "_blank", "hidden=no,location=no");

    workerWindow.addEventListener("loadstop", function() {
      switch(step) {
        case 0:
          workerWindow.executeScript({code: "location.href='https://google.cz'"});
          break;
        case 1:
          workerWindow.executeScript({code: "document.getElementById('lst-ib').value = '" + searchTextInput.value + "'"});
          workerWindow.executeScript({code: "document.forms[0].submit()"});
          break;
        case 2:
          workerWindow.executeScript({code: "document.querySelector('#rso h3 > a').innerText"}, function(value) { resultText.innerText = value });
          workerWindow.close();
          break;
      }
      step++;
    });
  }
};

app.initialize();
