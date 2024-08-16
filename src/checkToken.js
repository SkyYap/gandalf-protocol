require('dotenv').config();
const { ethers } = require('ethers');

// Setup the provider
const provider = new ethers.JsonRpcProvider(process.env.LOCAL_PROVIDER_URL);

// ERC-20 Token ABI (for balance checking)
const erc20ABI = [
    "function balanceOf(address owner) external view returns (uint256)"
];

// Addresses of WETH and DAI tokens
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

// Create a signer using your private key
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Create instances of the WETH and DAI token contracts
const wethContract = new ethers.Contract(WETH_ADDRESS, erc20ABI, signer);
const daiContract = new ethers.Contract(DAI_ADDRESS, erc20ABI, signer);

async function checkBalances() {
    const address = await signer.getAddress();

    // Get ETH balance
    const ethBalance = await provider.getBalance(address);
    console.log("ETH Balance:", ethers.formatEther(ethBalance));

    // Get WETH balance
    const wethBalance = await wethContract.balanceOf(address);
    console.log("WETH Balance:", ethers.formatUnits(wethBalance, 18));

    // Get DAI balance
    const daiBalance = await daiContract.balanceOf(address);
    console.log("DAI Balance:", ethers.formatUnits(daiBalance, 18));
}

// Call the function to check balances
checkBalances();
