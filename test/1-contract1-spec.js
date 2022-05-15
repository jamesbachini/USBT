const { expect } = require('chai');
const { ethers } = require('hardhat');
const lidoAbi = require('./../abis/lido.json');

// Rinkeby
const lidoAddress = '0xF4242f9d78DB7218Ad72Ee3aE14469DBDE8731eD'; // https://docs.lido.fi/deployed-contracts
const aaveAddress = '0x74E3445f239f9915D57715Efb810f67b2a7E5758'; // https://docs.aave.com/developers/deployed-contracts/v3-testnet-addresses
const dydxAddress = '0x4EC3570cADaAEE08Ae384779B0f3A45EF85289DE'; // https://www.reddit.com/r/dydxprotocol/comments/msv2it/dydx_kovan_test_network_address/

describe('BTVault', function () {
  let btv, lido, aave, dydx;

  before(async () => {
    [owner,user1] = await ethers.getSigners();
    const ownerBalance = await ethers.provider.getBalance(owner.address);
    console.log(`Owner: ${owner.address} Balance: ${ethers.utils.formatEther(ownerBalance)} ETH`);
    await hre.run("compile");
    const BTVault = await ethers.getContractFactory('BTVault');
    btv = await BTVault.deploy(lidoAddress,aaveAddress,dydxAddress);
    await btv.deployed();
    console.log(`BTVault deployed to: ${btv.address}`);
    lido = new ethers.Contract(lidoAddress, lidoAbi, ethers.provider);
  });

  it('LIDO contract is working', async function () {
    const tx1 = await lido.balanceOf(btv.address);
    expect(tx1).to.be.eq(0);
    const tx2 = await lido.totalSupply();
    expect(tx2).to.be.gt(0);
  });

  it('Convert ETH to stETH with LIDO', async function () {
    const tx1 = await btv.deposit({value: ethers.utils.parseEther('0.01')});
    const tx2 = await lido.balanceOf(btv.address);
    console.log(`stETH Balance: ${tx2}`);
    expect(tx2).to.be.gt(0);
  });

});
