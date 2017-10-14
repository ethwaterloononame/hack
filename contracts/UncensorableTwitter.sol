pragma solidity ^0.4.15;

contract UncensorableTwitter {
  address public owner;

	event Tweet(address indexed _author, string _text);

	function UncensorableTwitter() {
    owner = msg.sender;
	}

  function tweet(string _text) {
    Tweet(msg.sender, _text);
  }
}
