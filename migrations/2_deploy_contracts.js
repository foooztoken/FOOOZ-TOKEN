const FooozCrowdsale = artifacts.require('./FooozCrowdsale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner =    "0x6d2Faf6A5706bCC104E9C001f0Af585c11F72437";
    var ownerTwo = "0xDF8Ea37a5Ec5159c54E6E18a5ECB120E6Df5044F";
    deployer.deploy(FooozCrowdsale, owner, ownerTwo);

};
