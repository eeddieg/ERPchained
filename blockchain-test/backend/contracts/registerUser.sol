 // SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

/**
 * @title RegisterUser
 * @notice RegisterUser contract is a contract to register user
 * This contract is global, meaning all users are registered here.
 */
contract RegisterUser {
    address public owner;
    enum Authentication {
        NO,
        YES
    }
    
    enum Register {
        NO,
        YES
    }

    enum Role {
        ADMIN,
        MODERATOR,
        USER
    }

    struct User {
        address userAddr;
        uint8 userId;
        string email;
        string company;
        string role;
        Register regStatus;
        Authentication authStatus;
    }

    User user;
    mapping(address => bool) public usersAddrMapping;
    mapping(string => bool) public usersEmailMapping;
    mapping(address => User) usersAddrList;
    mapping(string => User) usersEmailList;

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev a modifier onlyOwner is created to limit the access to function register to contract deployer
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @notice function to register user info
     * @param _address is user's ethereum address
     * @param _id is user ID
     * @param _email user's email
     * @param _company user's company
     * @param _role user's role's
     */
    function register(
        address _address,
        uint8 _id,
        string memory _email,
        string memory _company,
        string memory _role
    ) public onlyOwner returns (bool) {
        /**
         * @dev require statement to block multiple entries
         */
        require(!usersAddrMapping[_address], "User is already registered.");

        user = User(
            _address,
            _id,
            _email,
            _company,
            _role,
            Register(1),
            Authentication(0)
        );
        usersAddrList[_address] = user;
        usersEmailList[_email] = user;
        usersAddrMapping[_address] = true;
        usersEmailMapping[_email] = true;
        // 0xC26CcA564bB56324cc37aC54DaBEdfc07E8d08AA, 27, "asd@asd.asd", "C company", "MODERATOR" -> to hex no 0x prepended
        return true;
    }

    /**
     * @notice function to get the details of an user when email is given
     * @param _email is user's email
     */
    function getUserDetailsByEmail(
        string memory _email
    ) public view returns (User memory) {
        /**
         * @dev returns all user info corresponding to the key
         */

        User memory result;
        if (!usersEmailMapping[_email]) {
            return result;
        } else {
            return usersEmailList[_email];
        }
    }

    /**
     * @notice function to get the details of an user when userId is given
     * @param _address is user's ethereum address
     */
    function getUserDetailsByAddress(
        address _address
    ) public view returns (User memory) {
        /**
         * @dev returns all user info corresponding to the key
         */
        User memory result;
        if (!usersAddrMapping[_address]) {
            return result;
        } else {
            return (usersAddrList[_address]);
        }
    }

    function getOwner() public view returns (User memory) {
        return getUserDetailsByAddress(msg.sender);
    }

    /**
     * @notice function to get user's authentication status
     * @param _address is user's ethereum address
     */
    function getAuthStatus(address _address) public view returns (Authentication) {
        User memory temp = usersAddrList[_address];
        return temp.authStatus;
    }

    function setAuthStatus(address _address, uint status) public onlyOwner returns (User memory) {
        User storage tmpUser = usersAddrList[_address];
        tmpUser.authStatus = Authentication(status);
        return usersAddrList[_address];
    }

    /**
     * @notice function to compare two strings
     * @param str1 first string
     * @param str2 second string
     */
    function strcmp(
        string memory str1,
        string memory str2
    ) public pure returns (bool) {
        if (bytes(str1).length != bytes(str2).length) {
            return false;
        }
        return
            keccak256(abi.encodePacked(str1)) ==
            keccak256(abi.encodePacked(str2));
    }
}
