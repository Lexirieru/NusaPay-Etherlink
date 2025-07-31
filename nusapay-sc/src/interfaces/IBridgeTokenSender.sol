// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IBridgeTokenSender{
    function chainId() external view returns (uint32);
    function bridge(uint256 _amount, address _recipient, address _token) external payable returns (bytes32);
}
