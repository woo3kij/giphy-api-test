'use strict';
let Query = function(input) {
  this.publicKey = 'dc6zaTOxFJmzC';
  this.limit = 1;
  this.offset = 0;
  this.baseURI = 'https://api.giphy.com/v1/gifs/search?q=';
  this.input = input;
  this.search = () => {
    let search = this.input.split(' ');
    return search;
  }

  this.fullURI = () => {
    const uriComponents = this.search(this.input).join('+');
    const finalURI = this.baseURI + uriComponents + '&api_key=' + this.publicKey;
    return finalURI;
  }

  this.printAlerts = status => {
    let output = document.getElementById('score');
    if (status === 'not-found') {
      output.textContent = 'Couldn`t get such resource, something`s wrong.';
      return;
    }
    output.textContent = 'Fetch returned an error';
    return;
  }

  this.clearArea = function() {
    const target = document.getElementById('score');
    target.removeChild(target.firstChild);
  }

  this.displayResult = function(url) {
    const target = document.getElementById('score');
    const video = document.createElement('video');
    video.src = url;
    video.autoplay = true;
    video.loop = true;

    target.appendChild(video);
  }
}

const waitForInput = debounce(initSearch, 400);
const userSeek = document.querySelector('input[name=search]');
userSeek.addEventListener('input', waitForInput, false);

function initSearch() {
    const searchTerm = userSeek.value;
    const q = new Query(searchTerm);
    const uri = q.fullURI();

    if (!searchTerm) return;
    
    fetchResource.call(q, uri);
}


function fetchResource(uri) {
  let self = this;
  let target = document.getElementById('score');
  
  fetch(uri)
    .then(function(response) {
      if (response.status !== 200) {
        console.log(response.status);
        return this.printAlerts('not-found');
      }
      response.json().then(function(json) {
        if (!json.data.length) {
          target.textContent = "Sorry, no results for your query";
        }
        let i = parseInt(Math.random() * json.data.length);
        let url = json.data[i].images.fixed_height.mp4;

        self.clearArea();
        self.displayResult(url);
      });
    })
    .catch(function(error) {
      console.log(error);
      return this.printAlerts();
    });
}

//debounce function from https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};