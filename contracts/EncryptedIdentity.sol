// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, eaddress, externalEuint32, externalEaddress} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Encrypted Identity Registry
/// @notice Stores user info with mixed offchain and FHE encryption
/// - Name is client-encrypted using the user's EVM address as key material and stored as string
/// - Address, birthYear and countryId are stored as FHE ciphertexts
contract EncryptedIdentity is SepoliaConfig {
    struct UserInfo {
        // Client-side encrypted name (e.g., base64 of AES-GCM payload)
        string nameCiphertext;
        // Zama FHE-encrypted values
        eaddress encAddress;
        euint32 birthYear;
        euint32 countryId;
        bool exists;
    }

    mapping(address => UserInfo) private users;
    address[] private userIndex;

    event UserSubmitted(address indexed user);
    event UserUpdated(address indexed user);

    /// @notice Submit or update caller's encrypted info
    /// @param nameCiphertext Client-encrypted name string
    /// @param extEncAddress External encrypted address handle
    /// @param extBirthYear External encrypted birth year handle
    /// @param extCountryId External encrypted country id handle
    /// @param inputProof Zama input proof for all external handles
    function submitUser(
        string calldata nameCiphertext,
        externalEaddress extEncAddress,
        externalEuint32 extBirthYear,
        externalEuint32 extCountryId,
        bytes calldata inputProof
    ) external {
        // Import external encrypted inputs
        eaddress encAddr = FHE.fromExternal(extEncAddress, inputProof);
        euint32 byear = FHE.fromExternal(extBirthYear, inputProof);
        euint32 ctry = FHE.fromExternal(extCountryId, inputProof);

        // Update storage
        UserInfo storage info = users[msg.sender];
        bool isNew = !info.exists;

        info.nameCiphertext = nameCiphertext;
        info.encAddress = encAddr;
        info.birthYear = byear;
        info.countryId = ctry;
        if (isNew) {
            info.exists = true;
            userIndex.push(msg.sender);
            emit UserSubmitted(msg.sender);
        } else {
            emit UserUpdated(msg.sender);
        }

        // ACL: allow contract and user to work with and decrypt their data
        FHE.allowThis(info.encAddress);
        FHE.allow(info.encAddress, msg.sender);

        FHE.allowThis(info.birthYear);
        FHE.allow(info.birthYear, msg.sender);

        FHE.allowThis(info.countryId);
        FHE.allow(info.countryId, msg.sender);
    }

    /// @notice Returns whether a user has a record
    /// @param user The user address to check
    function hasUser(address user) external view returns (bool) {
        return users[user].exists;
    }

    /// @notice Get all registered users
    function getAllUsers() external view returns (address[] memory) {
        return userIndex;
    }

    /// @notice Get the stored encrypted info for a user
    /// @dev View methods MUST NOT depend on msg.sender per project rules
    /// @param user The user address whose info to read
    /// @return nameCiphertext Client-encrypted name string
    /// @return encAddr Encrypted address (eaddress)
    /// @return birthYear Encrypted birth year (euint32)
    /// @return countryId Encrypted country id (euint32)
    function getUserInfo(address user)
        external
        view
        returns (string memory nameCiphertext, eaddress encAddr, euint32 birthYear, euint32 countryId)
    {
        UserInfo storage info = users[user];
        require(info.exists, "No record");
        return (info.nameCiphertext, info.encAddress, info.birthYear, info.countryId);
    }
}

