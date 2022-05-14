const { expect } = require("chai");
const { ethers } = require("hardhat");

// Kovan
const lido = 0x4b7FCBC11BB45075b9A1F953128C09bC97D6a0D7; // https://docs.lido.fi/deployed-contracts
const aave = 0x9D2729bC36f9E203002Bc5B5ee2E08C68Bd13794; // https://docs.aave.com/developers/deployed-contracts/v3-testnet-addresses
const dydx = 0x4EC3570cADaAEE08Ae384779B0f3A45EF85289DE; // https://www.reddit.com/r/dydxprotocol/comments/msv2it/dydx_kovan_test_network_address/

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
