import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("GandalfModule", (m) => {
  // Deploy the GandalfPool contract without constructor arguments
  const gandalfPool = m.contract("GandalfPool");

  // Call the initialize function after deployment
  m.call(gandalfPool, "initialize", [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // owner
    "Gandalf Token", // tokenName
    "GLF", // tokenSymbol
    "0x1F98431c8aD98523631AE4a59f267346ea31F984", // uniswapV3FactoryAddress
    "0xE592427A0AEce92De3Edee1F18E0157C05861564", // uniswapV3SwapRouterAddress
    "0xC36442b4a4522E871399CD717aBDD847Ab11FE88", // uniswapV3PositionManagerAddress
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // wethAddress
    "0x6b175474e89094c44da98b954eedeac495271d0f", // daiAddress
    5000, // uniswapV3PoolSlippageNumerator
    3000, // poolFee
    600, // desiredTickRange
    3000 // gandalfPoolFee
  ]);

  return { gandalfPool };
});
