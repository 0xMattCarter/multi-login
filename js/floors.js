/**
 * All code for floor prices/ last selling price of nfts
 */

// Gets a contracts floor price
getFloorPrice = async (_contractAddress, _cId) => {
  var options = {
    address: _contractAddress,
    chain: _cId,
  };
  var floor = { price: 0.0 };
  try {
    floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
  } catch (error) {
    console.log("No sales the past 7 days");
    try {
      options.days = 30;
      floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
    } catch (error) {
      console.log("No sales the past 30 days");
      try {
        options.days = 90;
        floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
      } catch (error) {
        console.log("No sales the past 90 days");
      }
    }
  }
  console.log("fl", floor);
  // const floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
  price = parseFloat(ethers.utils.formatUnits(floor.price, 18));
  console.log(price);
  return price;
};

/// Gets the price a token was sold for last, if any
getLastSoldPrice = async (_contractAddress, _tId, _cId) => {};

/// Gets the gain/loss of a token
// Floor / LastSoldPrice
getUnrealizedGain = async (_contractAddress, _tId, _cId) => {};
