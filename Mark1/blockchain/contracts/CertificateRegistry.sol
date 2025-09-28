// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry {
    event CertificateSet(bytes32 indexed hash, string certificateId, address indexed issuer);

    mapping(bytes32 => bool) public exists;

    function batchSetCertificates(bytes32[] calldata hashes, string[] calldata ids) external {
        require(hashes.length == ids.length, "length mismatch");
        for (uint256 i = 0; i < hashes.length; i++) {
            exists[hashes[i]] = true;
            emit CertificateSet(hashes[i], ids[i], msg.sender);
        }
    }
}





