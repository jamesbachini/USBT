const { expect } = require('chai');
const { ethers } = require('hardhat');
const lidoAbi = require('./../abis/lido.json');
const aaveAbi = require('./../abis/aave.json');
const usdcAbi = require('./../abis/usdc.json');

// Rinkeby
const lidoAddress = '0xF4242f9d78DB7218Ad72Ee3aE14469DBDE8731eD'; // https://docs.lido.fi/deployed-contracts
const aaveAddress = '0x87530ED4bd0ee0e79661D65f8Dd37538F693afD5'; // https://docs.aave.com/developers/deployed-contracts/v3-testnet-addresses
const usdcAddress = '0x5b8b635c2665791cf62fe429cb149eab42a3ced8';
const dydxAddress = '0x4EC3570cADaAEE08Ae384779B0f3A45EF85289DE'; // not right

describe('btETH', function () {
  let btETH, lido, aave, dydx;

  before(async () => {
    [owner,user1] = await ethers.getSigners();
    const ownerBalance = await ethers.provider.getBalance(owner.address);
    console.log(`    Owner: ${owner.address} Balance: ${ethers.utils.formatEther(ownerBalance)} ETH`);
    await hre.run('compile');
    const btETHContract = await ethers.getContractFactory('btETH');
    btETH = await btETHContract.deploy(lidoAddress,aaveAddress,usdcAddress,dydxAddress);
    await btETH.deployed();
    console.log(`    btETH deployed to: ${btETH.address}`);
    lido = new ethers.Contract(lidoAddress, lidoAbi, ethers.provider);
    aave = new ethers.Contract(aaveAddress, aaveAbi, ethers.provider);
    usdc = new ethers.Contract(usdcAddress, usdcAbi, ethers.provider);
  });

  it('LIDO contract is working', async function () {
    const tx1 = await lido.balanceOf(btETH.address);
    expect(tx1).to.be.eq(0);
    const tx2 = await lido.totalSupply();
    expect(tx2).to.be.gt(0);
  });

  it('Deposit ETH', async function () {
    const tx1 = await btETH.deposit({value: ethers.utils.parseEther('0.01')});
  });

  it('Check stETH balance on btETH contract', async function () {
    const tx1 = await lido.balanceOf(btETH.address);
    expect(tx1).to.be.gt(0);
  });

  it('Check btETH balance for owner', async function () {
    const btEthBalance = await btETH.balanceOf(owner.address);
    expect(btEthBalance).to.be.gt(0);
  });

});
