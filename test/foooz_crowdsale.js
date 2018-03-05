var FooozCrowdsale = artifacts.require("./FooozCrowdsale.sol");
//import assertRevert from './helpers/assertRevert';

contract('FooozCrowdsale', (accounts) => {
    var contract;
    var owner = "0x305EE1AEA4cE97F764618F0540EA6Fb37C7186Ba";
    //var owner = accounts[0];
    var rate = 1000;
    var buyWei = 5 * 10**17;
    var rateNew = 1000;
    var buyWeiNew = 5 * 10**17;
    var buyWeiMin = 1 * 10**16;
    var buyWeiCap = 30000 * (10 ** 18);

    var period = 0;

    var totalSupply = 33e+24;

    it('should deployed contract', async ()  => {
        assert.equal(undefined, contract);
        contract = await FooozCrowdsale.deployed();
        assert.notEqual(undefined, contract);
    });

    it('get address contract', async ()  => {
        assert.notEqual(undefined, contract.address);
    });

    it('verification balance owner contract', async ()  => {
        var balanceOwner = await contract.balanceOf(owner);
        //console.log("balanceOwner = " + balanceOwner);
        assert.equal(totalSupply, balanceOwner);
    });

    it('verification owner burn token', async ()  => {
        var burnTokens = 20 * 10**22;
        var totalSupplyBefore = await contract.totalSupply.call();
        //console.log("totalSupplyBefore = " + totalSupplyBefore)
        var balanceOwnerBeforeBurn = await contract.balanceOf(owner);
        //console.log("balanceOwnerBeforeBurn = " + balanceOwnerBeforeBurn);
        await contract.ownerBurnToken(burnTokens, {from:owner});
        var balanceOwnerAfterBurn = await contract.balanceOf(owner);
        //console.log("balanceOwnerAfterBurn = " + balanceOwnerAfterBurn);

        var totalSupplyAfterBurn = await contract.totalSupply.call();
        //console.log("totalSupplyAfterBurn = " + totalSupplyAfterBurn)
        assert.equal(totalSupplyBefore, Number(totalSupplyAfterBurn) + Number(burnTokens));
        assert.equal(balanceOwnerBeforeBurn, Number(balanceOwnerAfterBurn) + Number(burnTokens));

    });

    it('verification of receiving Ether', async ()  => {
        var tokenAllocatedBefore = await contract.tokenAllocated.call();
        var balanceAccountTwoBefore = await contract.balanceOf(accounts[2]);
        var weiRaisedBefore = await contract.weiRaised.call();
        //console.log("tokenAllocatedBefore = " + tokenAllocatedBefore);

        var numberToken = await contract.validPurchaseTokens.call(Number(buyWei));
        //console.log(" numberTokens = " + JSON.stringify(numberToken));
        //console.log("numberTokens = " + numberToken);

        await contract.buyTokens(accounts[2],{from:accounts[2], value:buyWei});
        var tokenAllocatedAfter = await contract.tokenAllocated.call();
        //console.log("tokenAllocatedAfter = " + tokenAllocatedAfter);

        assert.isTrue(tokenAllocatedBefore < tokenAllocatedAfter);
        assert.equal(0, tokenAllocatedBefore);
        assert.equal(rate*buyWei, tokenAllocatedAfter);

        var balanceAccountTwoAfter = await contract.balanceOf(accounts[2]);
        assert.isTrue(balanceAccountTwoBefore < balanceAccountTwoAfter);
        assert.equal(0, balanceAccountTwoBefore);
        assert.equal(rate*buyWei, balanceAccountTwoAfter);

        var weiRaisedAfter = await contract.weiRaised.call();
        //console.log("weiRaisedAfter = " + weiRaisedAfter);
        assert.isTrue(weiRaisedBefore < weiRaisedAfter);
        assert.equal(0, weiRaisedBefore);
        assert.equal(buyWei, weiRaisedAfter);

        var depositedAfter = await contract.getDeposited.call(accounts[2]);
        //console.log("DepositedAfter = " + depositedAfter);
        assert.equal(buyWei, depositedAfter);

        var balanceAccountThreeBefore = await contract.balanceOf(accounts[3]);
        await contract.buyTokens(accounts[3],{from:accounts[3], value:buyWeiNew});
        var balanceAccountThreeAfter = await contract.balanceOf(accounts[3]);
        assert.isTrue(balanceAccountThreeBefore < balanceAccountThreeAfter);
        assert.equal(0, balanceAccountThreeBefore);
        //console.log("balanceAccountThreeAfter = " + balanceAccountThreeAfter);
        assert.equal(rateNew*buyWeiNew, balanceAccountThreeAfter);

        var balanceOwnerAfter = await contract.balanceOf(owner);
        //console.log("balanceOwnerAfter = " + Number(balanceOwnerAfter));
        //assert.equal(totalSupply - balanceAccountThreeAfter - balanceAccountTwoAfter, balanceOwnerAfter);

    });


    it('verification tokens limit min amount', async ()  => {
            var numberTokensMinWey = await contract.validPurchaseTokens.call(buyWeiMin);
            //console.log("numberTokensMinWey = " + numberTokensMinWey);
            assert.equal(0, Number(numberTokensMinWey));
    });


    it('verification tokens cap reached', async ()  => {
            var numberTokensNormal = await contract.validPurchaseTokens.call(buyWei);
            //console.log("numberTokensNormal = " + numberTokensNormal);
            assert.equal(1000*buyWei, numberTokensNormal);

            var numberTokensFault = await contract.validPurchaseTokens.call(buyWeiCap);
            //console.log("numberTokensFault = " + numberTokensFault);
            assert.equal(0, numberTokensFault);
    });


});



