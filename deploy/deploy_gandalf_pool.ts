import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deployment script started...");
  console.log(`Deployer address: ${deployer}`);

  const owner: string = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const tokenName: string = "Gandalf Token";
  const tokenSymbol: string = "GLF";
  const uniswapV3FactoryAddress: string = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
  const uniswapV3SwapRouterAddress: string = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  const uniswapV3PositionManagerAddress: string = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
  const wethAddress: string = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
  const daiAddress: string = "0x6b175474e89094c44da98b954eedeac495271d0f";
  const uniswapV3PoolSlippageNumerator: number = 5000;
  const poolFee: number = 3000;
  const desiredTickRange: number = 600;
  const gandalfPoolFee: number = 3000; 

  try {
    console.log("Attempting to deploy GandalfPool contract...");

    const deployment = await deploy("GandalfPool", {
      from: deployer,
      proxy: {
        proxyContract: "OpenZeppelinTransparentProxy",
        execute: {
          methodName: "initialize",
          args: [
            owner, 
            tokenName, 
            tokenSymbol, 
            uniswapV3FactoryAddress, 
            uniswapV3SwapRouterAddress, 
            uniswapV3PositionManagerAddress, 
            wethAddress, 
            daiAddress, 
            uniswapV3PoolSlippageNumerator, 
            poolFee, 
            desiredTickRange, 
            gandalfPoolFee
          ],
        }
      }
    });

    console.log(`GandalfPool contract deployed at address: ${deployment.address}`);
    console.log(`Transaction Hash: ${deployment.transactionHash}`);

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
  }
};

export default func;
