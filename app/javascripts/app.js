// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import uncensorabletwitter_artifacts from '../../build/contracts/UncensorableTwitter.json'

// UncensorableTwitter is our usable abstraction, which we'll use through the code below.
var UncensorableTwitter = contract(uncensorabletwitter_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the UncensorableTwitter abstraction for Use.
    UncensorableTwitter.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

    });

		UncensorableTwitter.deployed().then(function(instance) {
			instance.Tweet({
				_author: "0x8f3457c4741f283a36e64d239e5b275c321fa318"
			}).watch(function(error, result){
      	if (!error)
					console.log(result)
					self.receiveTweet(result);        	
      });

		});
  },

	receiveTweet: function(tweet) {
		var tweet = tweet.args._text;

		var timeline = document.getElementById("timeline");

		var newLi = document.createElement('li');

    newLi.appendChild(document.createTextNode(tweet));

    timeline.appendChild(newLi);
	},

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  sendMessage: function() {
    var self = this;

    var message = document.getElementById("message").value;

    this.setStatus("Initiating transaction... (please wait)");

    var twitter;
    UncensorableTwitter.deployed().then(function(instance) {
      twitter = instance;
      return twitter.tweet(message, { from: account });
    }).then(function() {
      self.setStatus("Transaction complete!");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending message; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 UncensorableTwitter, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
