//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

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

contract BTVault {
	address lidoAddress;
	address aaveAddress;
	address dydxAddress;

	constructor(address _lidoAddress, address _aaveAddress, address _dydxAddress) {
		lidoAddress = _lidoAddress;
		aaveAddress = _aaveAddress;
		dydxAddress = _dydxAddress;
	}

	function deposit() payable public {
		uint256 stEthAmount = ILido(lidoAddress).submit{value: msg.value}(address(this));
	}

	function withdraw() public {

	}
	
}
