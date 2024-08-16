require('dotenv').config();
const { ethers } = require('ethers');

// Create an ethers provider
const provider = new ethers.JsonRpcProvider(process.env.LOCAL_PROVIDER_URL);

// Define the contract ABI
const nftManagerABI = [
    "function collect(tuple(uint256 tokenId, address recipient, uint128 amount0Max, uint128 amount1Max)) external returns (uint256 amount0, uint256 amount1)",
    "function positions(uint256 tokenId) external view returns (tuple(uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1))"
];

// Contract address of NonfungiblePositionManager (Uniswap V3)
const POSITION_MANAGER_ADDRESS = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; 

// Create a signer (replace with your private key)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Create an instance of the NonfungiblePositionManager contract with the signer
const nftManager = new ethers.Contract(POSITION_MANAGER_ADDRESS, nftManagerABI, signer);

async function collectLiquidity(tokenId) {
  try {
    // Define the maximum value for uint128 using BigInt
    const maxUint128 = BigInt("340282366920938463463374607431768211455");

    // Call the collect function with tokenId
    const tx = await nftManager.collect({
      tokenId: tokenId,
      recipient: await signer.getAddress(),
      amount0Max: maxUint128,
      amount1Max: maxUint128
    });

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Log the transaction receipt
    console.log("Liquidity collected successfully, receipt:", receipt);

  } catch (error) {
    console.error("Error collecting liquidity:", error);
  }
}

// Run the script with the correct tokenId
collectLiquidity(779559);
