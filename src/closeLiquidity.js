require('dotenv').config();
const { ethers } = require('ethers');

// Create an ethers provider
const provider = new ethers.JsonRpcProvider(process.env.LOCAL_PROVIDER_URL);

// Define the contract ABI for NonfungiblePositionManager
const nftManagerABI = [
    "function decreaseLiquidity(tuple(uint256 tokenId, uint128 liquidity, uint256 amount0Min, uint256 amount1Min, uint256 deadline)) external returns (uint256 amount0, uint256 amount1)",
    "function positions(uint256 tokenId) external view returns (tuple(uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1))",
    "function collect(tuple(uint256 tokenId, address recipient, uint128 amount0Max, uint128 amount1Max)) external returns (uint256 amount0, uint256 amount1)"
];

// Addresses of NonfungiblePositionManager
const POSITION_MANAGER_ADDRESS = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; 

// Create a signer (replace with your private key)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Create an instance of the NonfungiblePositionManager contract with the signer
const nftManager = new ethers.Contract(POSITION_MANAGER_ADDRESS, nftManagerABI, signer);

// Max uint128 value (2^128 - 1)
const MaxUint128 = 2n ** 128n - 1n;

async function closeLiquidity(tokenId) {
  try {
    // Fetch position details
    const position = await nftManager.positions(tokenId);

    // Extract the liquidity amount
    const liquidityAmount = position.liquidity;
    console.log("Liquidity Amount:", liquidityAmount.toString());

    // Define minimum amounts and deadline
    const amount0Min = 0n;
    const amount1Min = 0n;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

    // Decrease liquidity
    const tx = await nftManager.decreaseLiquidity({
      tokenId: tokenId,
      liquidity: liquidityAmount,
      amount0Min: amount0Min,
      amount1Min: amount1Min,
      deadline: deadline
    });

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Liquidity decreased, receipt:", receipt);

    // Collect tokens
    const collectTx = await nftManager.collect({
      tokenId: tokenId,
      recipient: await signer.getAddress(),
      amount0Max: MaxUint128,
      amount1Max: MaxUint128
    });

    // Wait for the collect transaction to be mined
    const collectReceipt = await collectTx.wait();
    console.log("Tokens collected successfully, receipt:", collectReceipt);

  } catch (error) {
    console.error("Error decreasing liquidity and collecting tokens:", error);
  }
}

// Run the script with the appropriate tokenId
closeLiquidity(779559);  // Replace with your actual tokenId if different
