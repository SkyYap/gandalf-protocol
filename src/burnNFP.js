require('dotenv').config();
const { ethers } = require('ethers');

// Create an ethers provider
const provider = new ethers.JsonRpcProvider(process.env.LOCAL_PROVIDER_URL);

// Define the contract ABI for NonfungiblePositionManager
const nftManagerABI = [
    "function burn(uint256 tokenId) external"
];

// Address of NonfungiblePositionManager
const POSITION_MANAGER_ADDRESS = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; 

// Create a signer (replace with your private key)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Create an instance of the NonfungiblePositionManager contract with the signer
const nftManager = new ethers.Contract(POSITION_MANAGER_ADDRESS, nftManagerABI, signer);

async function burnPosition(tokenId) {
  try {
    // Burn the position NFT
    const tx = await nftManager.burn(tokenId);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Position NFT burned successfully, receipt:", receipt);

  } catch (error) {
    console.error("Error burning the position NFT:", error);
  }
}

// Run the script with the appropriate tokenId
burnPosition(779559);  
