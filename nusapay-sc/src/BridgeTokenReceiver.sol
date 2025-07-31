// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IMessageRecipient} from "@hyperlane-xyz/interfaces/IMessageRecipient.sol";
import {IMint} from "./interfaces/IMint.sol";

contract BridgeTokenReceiver is IMessageRecipient {
    error MailboxNotSet();
    error NotMailbox();

    event ReceivedMessage(uint32 origin, bytes32 sender, bytes message);

    address public mailbox;
    address public token;

    constructor(address _mailbox, address _token) {
        if (_mailbox == address(0)) revert MailboxNotSet();
        mailbox = _mailbox;
        token = _token;
    }

    modifier onlyMailbox() {
        _onlyMailbox();
        _;
    }

    function _onlyMailbox() internal view {
        if (msg.sender != address(mailbox)) revert NotMailbox();
    }

    // ***************************** OWNER AREA ************************************************************
    function setMailbox(address _mailbox) external {
        mailbox = _mailbox;
    }

    function setToken(address _token) external {
        token = _token;
    }
    // ****************************************************************************************************

    // Called by Hyperlane when message arrives
    function handle(uint32 _origin, bytes32 _sender, bytes calldata _messageBody) external override onlyMailbox {
        (address recipient, uint256 amount) = abi.decode(_messageBody, (address, uint256));
        IMint(token).mint(recipient, amount);
        emit ReceivedMessage(_origin, _sender, _messageBody);
    }
}
