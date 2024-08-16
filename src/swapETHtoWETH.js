require('dotenv').config();
const { ethers } = require('ethers');

// Setup the provider
const provider = new ethers.JsonRpcProvider(process.env.LOCAL_PROVIDER_URL);

// WETH contract ABI and address
const wethABI = [
    "function deposit() public payable",
    "function balanceOf(address account) external view returns (uint256)"
];
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH mainnet address

// Create a signer using your private key
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Create an instance of the WETH contract
const wethContract = new ethers.Contract(wethAddress, wethABI, signer);

async function convertEthToWeth(amountInEth) {
  try {
    // Convert ETH to WETH by calling the deposit function
    const tx = await wethContract.deposit({ value: ethers.parseUnits(amountInEth.toString(), "ether") });

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Check the WETH balance after deposit
    const wethBalance = await wethContract.balanceOf(await signer.getAddress());
    console.log(`Successfully converted ${amountInEth} ETH to WETH.`);
    console.log("New WETH Balance:", ethers.formatUnits(wethBalance, 18));
  } catch (error) {
    console.error("Error converting ETH to WETH:", error);
  }
}

// Example usage
const ethAmount = 1; // Amount of ETH to convert to WETH

// Call the conversion function
convertEthToWeth(ethAmount);
