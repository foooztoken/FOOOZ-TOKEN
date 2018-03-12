var FooozCrowdsale = artifacts.require("./FooozCrowdsale.sol");
//import assertRevert from './helpers/assertRevert';

contract('FooozCrowdsale', (accounts) => {
    var contract;
    var owner = "0x6d2Faf6A5706bCC104E9C001f0Af585c11F72437";
    var addressFundBonus = "0x1f318fE745bEE511a72A8AB2b704a5F285587335";
    //var owner = accounts[0];
    var rate = 3362*1.1;
    var buyWei = 5 * 10**17;
    var rateNew = 3362*1.1;
    var buyWeiNew = 5 * 10**17;
    var buyWeiMin = 1 * 10**16;
    var buyWeiCap = 120000 * (10 ** 18);

    var period = 0;

    var totalSupply = 466133330* (10 ** 18);

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
        //assert.equal(rate*buyWei, tokenAllocatedAfter - tokenAllocatedBefore);

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

    it('verification define ICO period', async ()  => {
        var currentDate = 1519516800; // Feb, 25
        period = await contract.getPeriod(currentDate);
        assert.equal(10, period);

        currentDate = 1522627200; // Apr, 02
        period = await contract.getPeriod(currentDate);
        assert.equal(0, period);

        currentDate = 1523318400; // Apr, 10
        period = await contract.getPeriod(currentDate);
        assert.equal(1, period);

        currentDate = 1524182400; // Apr, 20
        period = await contract.getPeriod(currentDate);
        assert.equal(2, period);

        currentDate = 1525219200; // May, 02
        period = await contract.getPeriod(currentDate);
        assert.equal(3, period);

        currentDate = 1525910400; // May, 10
        period = await contract.getPeriod(currentDate);
        assert.equal(4, period);

        currentDate = 1526774400; // May, 20
        period = await contract.getPeriod(currentDate);
        assert.equal(5, period);

        currentDate = 1536537600; // Sep, 10
        period = await contract.getPeriod(currentDate);
        assert.equal(10, period);
    });

    it('verification define After ICO period', async ()  => {
        var currentDate = 1519516800; // Feb, 25
        period = await contract.getAfterIcoPeriod(currentDate);
        assert.equal(0, period);

        currentDate = 1564704000; // Aug, 02, 2019
        period = await contract.getAfterIcoPeriod(currentDate);
        assert.equal(100, period);

        currentDate = 1627862400; // Aug, 02, 2021
        period = await contract.getAfterIcoPeriod(currentDate);
        assert.equal(200, period);

        currentDate = 1690934400; // Aug, 02, 2023
        period = await contract.getAfterIcoPeriod(currentDate);
        assert.equal(300, period);

        currentDate = 1754092800; // Aug, 02, 2025
        period = await contract.getAfterIcoPeriod(currentDate);
        assert.equal(400, period);

        currentDate = 1817164800; // Aug, 02, 2027
        period = await contract.getAfterIcoPeriod(currentDate);
        assert.equal(0, period);
    });

    it('verification tokens limit min amount', async ()  => {
            var numberTokensMinWey = await contract.validPurchaseTokens.call(buyWeiMin);
            //console.log("numberTokensMinWey = " + numberTokensMinWey);
            assert.equal(0, Number(numberTokensMinWey));
    });


    it('verification tokens cap reached', async ()  => {
            var numberTokensNormal = await contract.validPurchaseTokens.call(buyWei);
            //console.log("numberTokensNormal = " + numberTokensNormal);
            assert.equal(rate*buyWei, numberTokensNormal);

            var numberTokensFault = await contract.validPurchaseTokens.call(buyWeiCap);
            //console.log("numberTokensFault = " + numberTokensFault);
            assert.equal(0, numberTokensFault);
    });

    it('verification mint After ICO period', async ()  => {
            var tokenAllocatedBefore = await contract.tokenAllocated.call();
            //console.log("tokenAllocatedBefore = " + tokenAllocatedBefore);
            var totalCost = tokenAllocatedBefore/3362;
            //console.log("totalCost = " + totalCost);
            var weiRaised = await contract.weiRaised.call();
            //console.log("weiRaised = " + weiRaised);
            //console.log("rate = " + (totalCost/weiRaised)*100);

            await contract.mintAfterIcoPeriod();

            var tokenAllocatedAfter = await contract.tokenAllocated.call();
            //console.log("tokenAllocatedAfter = " + tokenAllocatedAfter);

            var currentAfterIcoPeriod = await contract.currentAfterIcoPeriod.call();
            //console.log("currentAfterIcoPeriod = " + currentAfterIcoPeriod);
            var fundBonus = await contract.balanceOf(addressFundBonus);
            //console.log("fundBonus = " + fundBonus);
            //console.log("totalSupply - tokenAllocatedBefore = " + (totalSupply - tokenAllocatedBefore));
            //console.log((totalSupply - tokenAllocatedBefore) * 0.25 * 0.1);
            //assert.equal(0, Number(numberTokensMinWey));
    });

});



