// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IMailbox} from "@hyperlane-xyz/interfaces/IMailbox.sol";
import {IInterchainGasPaymaster} from "@hyperlane-xyz/interfaces/IInterchainGasPaymaster.sol";
import {IERC20} from "@openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IBurn} from "./interfaces/IBurn.sol";

contract BridgeTokenSender {
    error SameChain();
    error TransferFailed();
    error MailboxNotSet();
    error InterchainGasPaymasterNotSet();
    error ReceiverBridgeNotSet();
    error NotOwner();

    address public owner;

    address public mailbox;
    address public interchainGasPaymaster;
    address public token;
    address public receiverBridge; // ** DESTINATION CHAIN
    uint256 public destinationChainId; // ** DESTINATION CHAIN

    constructor(
        address _mailbox,
        address _interchainGasPaymaster,
        address _token,
        address _receiverBridge,
        uint256 _chainId
    ) {
        mailbox = _mailbox;
        interchainGasPaymaster = _interchainGasPaymaster;
        token = _token;
        receiverBridge = _receiverBridge;
        destinationChainId = _chainId;
        owner = msg.sender;

        _validateConstructorParams();
    }

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    function _onlyOwner() internal view {
        if (msg.sender != owner) revert NotOwner();
    }

    function _validateConstructorParams() private view {
        _validateSameChain();
        _validateDifferentChain();
    }

    function _validateSameChain() private view {
        if (mailbox == address(0)) revert MailboxNotSet();
        if (interchainGasPaymaster == address(0)) revert InterchainGasPaymasterNotSet();
    }

    function _validateDifferentChain() private view {
        if (receiverBridge == address(0)) revert ReceiverBridgeNotSet();
        if (block.chainid == destinationChainId) revert SameChain();
    }

    // ***************************** OWNER AREA ************************************************************
    function setMailbox(address _mailbox) external onlyOwner {
        mailbox = _mailbox;
    }

    function setInterchainGasPaymaster(address _interchainGasPaymaster) external onlyOwner {
        interchainGasPaymaster = _interchainGasPaymaster;
    }

    function setToken(address _token) external onlyOwner {
        token = _token;
    }

    function setReceiverBridge(address _receiverBridge) external onlyOwner {
        receiverBridge = _receiverBridge;
    }
    // ****************************************************************************************************

    function bridge(uint256 _amount, address _recipient, address _token) external payable returns (bytes32) {
        if (receiverBridge == address(0)) revert ReceiverBridgeNotSet();
        if (!IERC20(_token).transferFrom(msg.sender, address(this), _amount)) revert TransferFailed();
        IBurn(token).burn(address(this), _amount);
        bytes memory message = abi.encode(_recipient, _amount);
        uint256 gasAmount =
            IInterchainGasPaymaster(interchainGasPaymaster).quoteGasPayment(uint32(destinationChainId), _amount);
        bytes32 recipientAddress = bytes32(uint256(uint160(receiverBridge)));
        bytes32 messageId =
            IMailbox(mailbox).dispatch{value: gasAmount}(uint32(destinationChainId), recipientAddress, message);
        return messageId;
    }
}
