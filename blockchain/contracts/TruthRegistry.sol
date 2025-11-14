// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TruthRegistry {
    mapping(bytes32 => uint256) public fileRegistry;
    event FileRegistered(bytes32 indexed fileHash, address indexed creator, uint256 timestamp);

    function registerFile(bytes32 fileHash) public {
        require(fileRegistry[fileHash] == 0, "File already registered");
        fileRegistry[fileHash] = block.timestamp;
        emit FileRegistered(fileHash, msg.sender, block.timestamp);
    }

    function isFileRegistered(bytes32 fileHash) public view returns (bool) {
        return fileRegistry[fileHash] > 0;
    }
}