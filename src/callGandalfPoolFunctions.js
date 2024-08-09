require('dotenv').config();
const { ethers } = require('ethers');

// Create an ethers provider
const provider = new ethers.JsonRpcProvider(process.env.LOCAL_PROVIDER_URL);

// Define the contract ABI
const contractABI = [
    "function buyGandalfToken(uint256 token0Amount, uint256 token1Amount, uint256 minGandalfTokenAmount, uint256 deadline) external",
    "function sellGandalfToken(uint256 gandalfTokenAmount, uint256 minTokenAmountToReceive, bool receiveInToken0, uint256 deadline) external",
    "function rebalance() external",
    "function setGandalfPoolFeeNumerator(uint24 gandalfPoolFeeNumerator_) external",
    "function setUniswapV3PoolSlippageNumerator(uint24 uniswapV3PoolSlippageNumerator_) external",
    "function setDesiredTickRange(uint24 desiredTickRange_) external",
    "function getTokenAmountToReceiveFromSell(uint256 gandalfTokenAmountSold, bool receiveInToken0) external view returns (uint256 maxTokenAmountToReceive)",
    "function getCurrentPriceTick() external view returns (int24)",
    "function getCurrentPriceTickRounded() external view returns (int24)",
    "function getTickSpacing() external view returns (int24)",
    "function getNewDesiredTicks() external view returns (int24 newDesiredTickLower, int24 newDesiredTickUpper)",
    "function getIfLiquidityPositionNeedsUpdate() external view returns (bool)",
    "function getPriceInActualLiquidityRange() external view returns (bool priceInLiquidityRange)",
    "function getPriceInDesiredLiquidityRange() external view returns (bool priceInLiquidityRange)",
    "function getSqrtPriceX96() external view returns (uint160 sqrtPriceX96)",
    "function getEstimatedTokenOut(address tokenIn, address tokenOut, uint256 amountIn, uint24 fee) external view returns (uint256 amountOut)",
    "function getAmountOutMinimum(address tokenIn, address tokenOut, uint256 amountIn) external view returns (uint256 amountOutMinimum)",
    "function getReserveValueInToken0() external view returns (uint256)",
    "function getLiquidityPositionValueInToken0() external view returns (uint256)",
    "function getTotalValueInToken0() external view returns (uint256)",
    "function getTotalValueInToken1() external view returns (uint256)",
    "function getLiquidityPositionLiquidityAmount() external view returns (uint128 liquidityAmount)",
    "function getDesiredReserveAmounts() external view returns (uint256 token0Amount, uint256 token1Amount)",
    "function getIsTickRangeValid(uint24 tickRange) external view returns (bool)",
    "function getUniswapV3PoolFee() external view returns (uint24)",
    "function getGandalfPoolFeeNumerator() external view returns (uint24)",
    "function getUniswapV3PoolSlippageNumerator() external view returns (uint24)",
    "function getDesiredTickRange() external view returns (uint24)",
    "function getDesiredTickLower() external view returns (int24)",
    "function getDesiredTickUpper() external view returns (int24)",
    "function getActualTickLower() external view returns (int24)",
    "function getActualTickUpper() external view returns (int24)",
    "function getLiquidityPositionTokenId() external view returns (uint256)",
    "function getUniswapV3FactoryAddress() external view returns (address)",
    "function getUniswapV3SwapRouterAddress() external view returns (address)",
    "function getUniswapV3PositionManagerAddress() external view returns (address)",
    "function getUniswapV3PoolAddress() external view returns (address)",
    "function getToken0() external view returns (address)",
    "function getToken1() external view returns (address)",
    "function getGandalfTokenPriceInToken0() external view returns (uint256)",
    "function getGandalfTokenPriceInToken1() external view returns (uint256)",
    "function getFeeDenominator() external pure returns (uint24)",
    "function getTokensSorted(address tokenA, address tokenB) external pure returns (address token0_, address token1_)",
    "function getSlippageDenominator() external pure returns (uint24)"
];
  

// Contract address (replace with the actual address)
const contractAddress = "0x1F2C6E90F3DF741E0191eAbB1170f0B9673F12b3";

// Create an instance of the contract
const contract = new ethers.Contract(contractAddress, contractABI, provider);

async function main() {
  try {
    // Call getTickSpacing
    const getTickSpacing = await contract.getTickSpacing();
    console.log("getTickSpacing:", getTickSpacing.toString()); 

    // Call getUniswapV3PoolSlippageNumerator
    const getUniswapV3PoolSlippageNumerator = await contract.getUniswapV3PoolSlippageNumerator();
    console.log("getUniswapV3PoolSlippageNumerator:", getUniswapV3PoolSlippageNumerator.toString());

    // Call getFeeDenominator
    const getFeeDenominator = await contract.getFeeDenominator();
    console.log("getFeeDenominator:", getFeeDenominator.toString());
    
    // Call getUniswapV3FactoryAddress
    const getUniswapV3FactoryAddress = await contract.getUniswapV3FactoryAddress();
    console.log("getUniswapV3FactoryAddress:", getUniswapV3FactoryAddress.toString());
    
    // Call getUniswapV3SwapRouterAddress
    const getUniswapV3SwapRouterAddress = await contract.getUniswapV3SwapRouterAddress();
    console.log("getUniswapV3SwapRouterAddress:", getUniswapV3SwapRouterAddress.toString()); 

    // Call getUniswapV3PositionManagerAddress
    const getUniswapV3PositionManagerAddress = await contract.getUniswapV3PositionManagerAddress();
    console.log("getUniswapV3PositionManagerAddress:", getUniswapV3PositionManagerAddress.toString()); 

    // Call getUniswapV3PoolAddress
    const getUniswapV3PoolAddress = await contract.getUniswapV3PoolAddress();
    console.log("getUniswapV3PoolAddress:", getUniswapV3PoolAddress.toString()); 

  } catch (error) {
    console.error("Error calling contract functions:", error);
  }
}

// Run the script
main();
