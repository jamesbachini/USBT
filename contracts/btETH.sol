//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface ILido {
	function submit(address _referral) external payable returns (uint256 StETH);
	function withdraw(uint256 _amount, bytes32 _pubkeyHash) external; // wont be available until post-merge
	function balanceOf(address _owner) external returns (uint balance);
	function sharesOf(address _owner) external returns (uint balance);
	function totalSupply() external returns (uint balance);
	function transfer(address _to, uint _value) external returns (bool success);
  function approve(address _spender, uint _value) external returns (bool success);
	function depositBufferedEther() external;
}

interface IAave {
	function supply(address asset,uint256 amount,address onBehalfOf,uint16 referralCode) external;
	function borrow(address asset,uint256 amount,uint256 interestRateMode,uint16 referralCode,address onBehalfOf) external;
	function repay(address asset,uint256 amount,uint256 rateMode,address onBehalfOf) external returns (uint256);
	 function withdraw(address asset,uint256 amount,address to) external returns (uint256);
}

contract btETH is ERC20 {
	address lidoAddress;
	address aaveAddress;
	address usdcAddress;
	address dydxAddress;

	constructor(address _lidoAddress, address _aaveAddress, address _usdcAddress, address _dydxAddress) ERC20("Basis Trade Ether", "btETH") {
		lidoAddress = _lidoAddress;
		aaveAddress = _aaveAddress;
		usdcAddress = _usdcAddress;
		dydxAddress = _dydxAddress;
	}

	function deposit() payable public {
		uint256 stEthAmount = ILido(lidoAddress).submit{value: msg.value}(address(this));
		uint256 stEthCollateral = stEthAmount / 2;
		ILido(lidoAddress).approve(aaveAddress, stEthCollateral);
		//IAave(aaveAddress).supply(lidoAddress,stEthCollateral,address(this),0);
		//IAave(aaveAddress).borrow(usdcAddress,10000,0,0,address(this));
		_mint(msg.sender, msg.value); // 1 ETH = 1 btETH
	}

	function withdraw() public {

	}
	
}
