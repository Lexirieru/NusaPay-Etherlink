// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IMint {
    function mint(address _to, uint256 _amount) external;
}