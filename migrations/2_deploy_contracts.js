const FooozCrowdsale = artifacts.require('./FooozCrowdsale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0x305EE1AEA4cE97F764618F0540EA6Fb37C7186Ba";
    deployer.deploy(FooozCrowdsale, owner);

};
