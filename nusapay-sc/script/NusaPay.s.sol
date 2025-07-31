// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";
import {BridgeTokenSender} from "../src/BridgeTokenSender.sol";
import {BridgeTokenReceiver} from "../src/BridgeTokenReceiver.sol";

contract NusaPayScript is Script {
    MockUSDC public mockUSDC;
    BridgeTokenSender public bridgeTokenSender;
    BridgeTokenReceiver public bridgeTokenReceiver;

    uint256 public ORIGIN_CHAIN_ID = 128123;

    // ***************************** FILL THIS ************************************************************
    uint256 public DESTINATION_CHAIN_ID = 84532;

    address public ORIGIN_mailbox = address(0);
    address public ORIGIN_interchainGasPaymaster = address(0);

    address public DESTINATION_mailbox = address(0);
    address public DESTINATION_receiverBridge = address(0);
    // ****************************************************************************************************

    function setUp() public {
        // ORIGIN chain (etherlink)
        vm.createSelectFork(vm.rpcUrl("etherlink_testnet"));

        // DESTINATION chain
        // vm.createSelectFork(vm.rpcUrl("arb_sepolia"));
        // vm.createSelectFork(vm.rpcUrl("base_sepolia"));
        // vm.createSelectFork(vm.rpcUrl("op_sepolia"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        if (block.chainid == ORIGIN_CHAIN_ID) {
            // deploy token
            mockUSDC = new MockUSDC();
            // deploy bridgetokensender
            bridgeTokenSender = new BridgeTokenSender(
                ORIGIN_mailbox,
                ORIGIN_interchainGasPaymaster,
                address(mockUSDC),
                DESTINATION_receiverBridge,
                DESTINATION_CHAIN_ID
            );

            console.log("Deployment to", block.chainid);
            console.log("bridgeTokenSender", address(bridgeTokenSender));
            console.log("mockUSDC", address(mockUSDC));
        } else if (block.chainid == DESTINATION_CHAIN_ID) {
            // deploy token
            mockUSDC = new MockUSDC();
            // deploy bridgetokenreceiver
            bridgeTokenReceiver = new BridgeTokenReceiver(DESTINATION_mailbox, address(mockUSDC));

            console.log("Deployment to", block.chainid);
            console.log("bridgeTokenReceiver", address(bridgeTokenReceiver));
            console.log("mockUSDC", address(mockUSDC));
        }
        vm.stopBroadcast();
    }
}

// How it works?
// 1.
// RUN RELAYER
// 2.
// DESTINATION CHAIN
// deploy token
// deploy bridgetokenreceiver
// 3.
// ORIGIN CHANIN
// deploy token
// deploy bridgetokensender
