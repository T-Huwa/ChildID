// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProofOfHumanity {
    struct Child {
        bytes32 idHash; // Encrypted hash of child’s details (e.g., name, DOB)
        address guardian; // Address of the parent/guardian
        bool active; // Active status of the child ID
    }

    struct Platform {
        string name;
        bool verified; // Whether the platform is verified to use this system
    }

    mapping(bytes32 => Child) private children; // Map child ID hashes to Child structs
    mapping(address => bool) public guardians; // Guardians registry
    mapping(address => Platform) public platforms; // Registered platforms

    event GuardianRegistered(address indexed guardian);
    event ChildRegistered(bytes32 indexed childId, address indexed guardian);
    event PlatformRegistered(address indexed platform, string name);
    event AccessRevoked(bytes32 indexed childId);

    modifier onlyGuardian() {
        require(guardians[msg.sender], "Only a registered guardian can perform this action");
        _;
    }

    modifier onlyPlatform() {
        require(platforms[msg.sender].verified, "Only a verified platform can perform this action");
        _;
    }

    /// Register a guardian
    function registerGuardian() external {
        require(!guardians[msg.sender], "Guardian already registered");
        guardians[msg.sender] = true;
        emit GuardianRegistered(msg.sender);
    }

    /// Register a child under a guardian
    function registerChild(bytes32 _idHash) external onlyGuardian {
        require(children[_idHash].guardian == address(0), "Child ID already registered");

        children[_idHash] = Child({
            idHash: _idHash,
            guardian: msg.sender,
            active: true
        });

        emit ChildRegistered(_idHash, msg.sender);
    }

    /// Register a platform
    function registerPlatform(address _platformAddress, string calldata _name) external {
        require(!platforms[_platformAddress].verified, "Platform already registered");

        platforms[_platformAddress] = Platform({
            name: _name,
            verified: true
        });

        emit PlatformRegistered(_platformAddress, _name);
    }

    /// Verify a child's access for a platform
    function verifyChildAccess(bytes32 _idHash) external view onlyPlatform returns (bool) {
        Child memory child = children[_idHash];
        return child.active;
    }

    /// Revoke a child's access
    function revokeChildAccess(bytes32 _idHash) external {
        require(children[_idHash].guardian == msg.sender, "Only the guardian can revoke access");

        children[_idHash].active = false;
        emit AccessRevoked(_idHash);
    }
}
