// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBurn {
    function burn(address _from, uint256 _amount) external;
}