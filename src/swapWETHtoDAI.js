require('dotenv').config();
const { ethers } = require('ethers');

// Setup the provider
const provider = new ethers.JsonRpcProvider(process.env.LOCAL_PROVIDER_URL);

// Uniswap V3 Router contract ABI
const routerABI = [
    "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external returns (uint256)"
];

// ERC-20 Token ABI (for balance checking and approval)
const erc20ABI = [
    "function balanceOf(address owner) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)"
];

// Address of the Uniswap V3 SwapRouter
const routerAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

// Create a signer using your private key
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Create an instance of the Uniswap Router contract
const routerContract = new ethers.Contract(routerAddress, routerABI, signer);

// Addresses of WETH and DAI tokens
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

// Create instances of the WETH and DAI token contracts
const wethContract = new ethers.Contract(WETH_ADDRESS, erc20ABI, signer);
const daiContract = new ethers.Contract(DAI_ADDRESS, erc20ABI, signer);

async function checkBalances() {
  const address = await signer.getAddress();

  // Get WETH and DAI balances
  const wethBalance = await wethContract.balanceOf(address);
  const daiBalance = await daiContract.balanceOf(address);

  console.log("WETH Balance:", ethers.formatUnits(wethBalance, 18));
  console.log("DAI Balance:", ethers.formatUnits(daiBalance, 18));
}

async function approveToken(tokenContract, spender, amount) {
  const tx = await tokenContract.approve(spender, amount);
  await tx.wait(); 
  console.log(`Approved ${ethers.formatUnits(amount, 18)} tokens for ${spender}`);
}

async function _swapExactInput(tokenIn, tokenOut, amountIn) {
  try {
    // Check balances before the swap
    console.log("Balances before the swap:");
    await checkBalances();

    // Define Uniswap V3 parameters
    const amountInUnits = ethers.parseUnits(amountIn.toString(), 18); // Convert amount to wei (18 decimals)
    const poolFee = 3000; // Pool fee (e.g., 3000 for 0.3%)

    // Approve the router to spend the tokenIn (WETH in this case)
    await approveToken(wethContract, routerAddress, amountInUnits);

    // Parameters for the swap (in the correct order and format)
    const params = [
      tokenIn,
      tokenOut,
      poolFee,
      await signer.getAddress(), // Send swapped tokens to the signer's address
      Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      amountInUnits, // Amount to swap in wei
      0, // Set to 0 for no slippage protection (not recommended for production)
      0 // No price limit
    ];

    // Execute the swap
    const tx = await routerContract.exactInputSingle(params);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    console.log("Swap executed successfully:", receipt);

    // Check balances after the swap
    console.log("Balances after the swap:");
    await checkBalances();
  } catch (error) {
    console.error("Error executing swap:", error);
  }
}

// Example usage
const amountToSwap = 1; // 1 ETH (WETH)

// Call the swap function
_swapExactInput(WETH_ADDRESS, DAI_ADDRESS, amountToSwap);
