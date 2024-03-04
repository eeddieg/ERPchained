// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./registerCompany.sol";
import "./registerOrder.sol";

/**
 * @title Transactions
 * @notice Transactions contract is a contract that contains all transactions
 */
// contract Transactions is registerCompany, registerOrder {
contract Transactions {
  RegisterCompany public Company;
  RegisterOrder public Order;

  constructor() {
    Company = new RegisterCompany();
    Order = new RegisterOrder();
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