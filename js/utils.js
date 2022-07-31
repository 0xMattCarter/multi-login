/**
 * UTILITY FUNCTIONS
 * Convert decimal tokenId to json hex format
 * Shrink a string (address) to first 6 chars and last 4
 * Creates contract instances using ethers.js
 */

/// Converts decimal tokenId -> hex 1155 json format (64 padded 0s)
tokenToJson = (tokenId) => {
  let dec = ethers.BigNumber.from(tokenId);
  let hex = dec.toHexString();
  let pad = 64 - hex.length + 2;
  let padded = "";
  for (let i = 0; i < pad; i++) {
    padded += "0";
  }
  padded += hex.substring(2);
  return padded;
};

/// Shrinks address to 0xabcd...1234 format
shrinkAddr = (_addr) => {
  return (
    _addr.substring(0, 6) +
    "..." +
    _addr.substring(_addr.length - 4, _addr.length)
  );
};

/// Returns ethers.js contract instances
getContractInstance = (_addr, _abi, _chainId) => {
  return new ethers.Contract(_addr, _abi, providers[_chainId]);
};
