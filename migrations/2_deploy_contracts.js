var UncensorableTwitter = artifacts.require("./UncensorableTwitter.sol");

module.exports = function(deployer) {
  deployer.deploy(UncensorableTwitter);
};
