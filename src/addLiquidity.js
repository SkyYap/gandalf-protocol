require('dotenv').config();
const { ethers } = require('ethers');

// Setup the provider
const provider = new ethers.JsonRpcProvider(process.env.LOCAL_PROVIDER_URL);

// Addresses of WETH, DAI, and NonfungiblePositionManager
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const POSITION_MANAGER_ADDRESS = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; 

// Uniswap V3 NonfungiblePositionManager ABI
const positionManagerABI = [
    "function mint(tuple(address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) external returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)"
];

// ERC-20 Token ABI (for approval)
const erc20ABI = [
    "function approve(address spender, uint256 value) external returns (bool)"
];

// Create a signer using your private key
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Create instances of the WETH, DAI, and NonfungiblePositionManager contracts
const wethContract = new ethers.Contract(WETH_ADDRESS, erc20ABI, signer);
const daiContract = new ethers.Contract(DAI_ADDRESS, erc20ABI, signer);
const positionManager = new ethers.Contract(POSITION_MANAGER_ADDRESS, positionManagerABI, signer);

async function addLiquidity() {
    try {
        // Define the amounts of WETH and DAI to provide
        const wethAmount = ethers.parseUnits("0.1", 18); // 0.1 WETH
        const daiAmount = ethers.parseUnits("100", 18);  // 100 DAI

        // Approve the NonfungiblePositionManager to spend WETH and DAI
        await wethContract.approve(POSITION_MANAGER_ADDRESS, wethAmount);
        await daiContract.approve(POSITION_MANAGER_ADDRESS, daiAmount);

        // Define the pool parameters
        const poolFee = 3000;
        const tickLower = -887220;
        const tickUpper = 887220;
        
        // Mint the liquidity position
        const params = [
            DAI_ADDRESS,
            WETH_ADDRESS,
            poolFee,
            tickLower,
            tickUpper,
            daiAmount,         // Amount of DAI to add
            wethAmount,        // Amount of WETH to add
            0,                 // Min amount of DAI to add (slippage protection)
            0,                 // Min amount of WETH to add (slippage protection)
            await signer.getAddress(), // Address to receive the position NFT
            Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
        ];

        // Get the current nonce
        const nonce = await provider.getTransactionCount(await signer.getAddress(), 'latest');

        // Send the transaction with the correct nonce
        const tx = await positionManager.mint(params, { nonce: nonce });
        const receipt = await tx.wait();

        console.log("Liquidity added successfully:", receipt);
    } catch (error) {
        console.error("Error adding liquidity:", error);
    }
}

// Call the function to add liquidity
addLiquidity();
