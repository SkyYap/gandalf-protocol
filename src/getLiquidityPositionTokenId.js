require('dotenv').config();
const { ethers } = require('ethers');

// Setup the provider
const provider = new ethers.JsonRpcProvider(process.env.LOCAL_PROVIDER_URL);

// Addresses of NonfungiblePositionManager
const POSITION_MANAGER_ADDRESS = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; 

// Uniswap V3 NonfungiblePositionManager ABI
const positionManagerABI = [
    "function balanceOf(address owner) external view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId)",
    "function positions(uint256 tokenId) external view returns (tuple(uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1))"
];

// Create a signer using your private key
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const positionManager = new ethers.Contract(POSITION_MANAGER_ADDRESS, positionManagerABI, signer);

async function getLiquidityPosition() {
    try {
        const ownerAddress = await signer.getAddress();
        const balance = await positionManager.balanceOf(ownerAddress);
        console.log(`Total Liquidity Positions: ${balance}`);

        if (balance === 0n) {
            console.log("No liquidity positions found.");
            return;
        }

        const poolFee = 3000; // 0.3%
        const tickLower = -887220; 
        const tickUpper = 887220;  

        for (let i = 0; i < balance; i++) {
            const tokenId = await positionManager.tokenOfOwnerByIndex(ownerAddress, i);
            const position = await positionManager.positions(tokenId);

            // Log the position & tokenId details
            console.log(`Position ${i + 1}:`);
            console.log(`  Token0: ${position.token0}`);
            console.log(`  Token1: ${position.token1}`);
            console.log(`  Fee: ${position.fee}`);
            console.log(`  Tick Lower: ${position.tickLower}`);
            console.log(`  Tick Upper: ${position.tickUpper}`);
            console.log(`  Liquidity: ${position.liquidity}`);
            console.log(`  TokenId: ${tokenId}`);
        }
    } catch (error) {
        console.error("Error fetching liquidity position:", error);
    }
}

getLiquidityPosition();
