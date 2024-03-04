// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./registerOrder.sol";

/**
 * @title RegisterCompany
 * @notice RegisterCompany contract is a contract to register company info BC
 */
contract RegisterCompany {
// contract RegisterCompany is RegisterOrder {

  struct Company {
    string companyName;
    address companyAddress;
    string email;
    uint reservedResources;
    uint availableResources;
    string productToBuy;
    string productToSell;
  }
  string[] public companyNameList;
  mapping(string => bool) public companyRegistry;
  mapping(string => Company) public companyList;

  event UpdatedResources(string _companyName, uint _availableResources, uint _reservedResources);

  function enrollCompany(
    string memory _companyName,
    address _address,
    string memory _email,
    uint _reservedResources,
    uint _availableResources,
    string memory _productToBuy,
    string memory _productToSell
   ) public returns (bool) {

    require(!companyRegistry[_companyName], "Company already registered on Blockchain");

    Company memory company = Company(_companyName, _address, _email, _reservedResources, _availableResources, _productToBuy, _productToSell);
    companyList[_companyName] = company;
    companyRegistry[_companyName] = true;
    companyNameList.push(_companyName);
    return true;
  }

  function getCompanyFromBc(string memory _companyName) public view returns (Company memory) {
    if (companyRegistry[_companyName]) {
      Company memory company = companyList[_companyName];
      return company;
    } 
    revert("Company is not registered on blockchain");
  }

  function getCompanyNameList() public view returns (string [] memory) {
    return companyNameList;
  }

  function fetchBuyingList(string memory _product) public view returns (Company[] memory) {
    require(companyNameList.length > 0, "No companies registered yet.");
    
    Company[] memory list = new Company[](companyNameList.length); 
    
    for (uint i=0; i < companyNameList.length; i++) {
      string memory name = companyNameList[i];
      Company memory company = companyList[name];
      if (strcmp(_product, company.productToBuy) ) {
        list[i] = company;
      }
    }
    
    return list;
  }

  function fetchSellingList(string memory _product) public view returns (Company[] memory) {
    require(companyNameList.length > 0, "No companies registered yet.");

    Company[] memory list = new Company[](companyNameList.length); 
    
    for (uint i=0; i < companyNameList.length; i++) {
      string memory name = companyNameList[i];
      Company memory company = companyList[name];
      if (strcmp(_product, company.productToSell) ) {
        list[i] = company;
      }
    }
    
    return list;
  }

  /**
    * @dev Enroll customer on blockchain
    * @param _companyName Company's firm
    * @param _availableResources Resources available for sale
    * @param _reservedResources Resources reserved
    */
  function setTotalResources(
    string memory _companyName,
    uint _reservedResources,
    uint _availableResources
  ) public {
    Company storage company = companyList[_companyName];
    company.availableResources = _availableResources;
    company.reservedResources = _reservedResources;

    emit UpdatedResources(company.companyName, company.reservedResources, company.availableResources);
  }

  /**
    * @dev Enroll company resources
    * @param _companyName Company's firm
    * @param _availableResources Resources available for sale
    * @param _reservedResources Resources reserved
    * @param _productToBuy Product company buys
    * @param _productToSell Product company sells
    */
  function updateCompanyInfo(
    string memory _companyName,
    uint _reservedResources,
    uint _availableResources,
    string memory _productToBuy,
    string memory _productToSell
  ) public returns (bool) {

    require(companyRegistry[_companyName], "Company is not registered on Blockchain");
    
    Company storage company = companyList[_companyName];

    company.availableResources = _availableResources;
    company.reservedResources = _reservedResources;

    company.productToBuy = _productToBuy;
    company.productToSell = _productToSell;
    return true;
  }

  /**
    * @dev Enroll company resources
    * @param _companyName Company's firm
    * @param _availableResources Resources available for sale
    * @param _reservedResources Resources reserved
    */
  function updateTotalResources(
    string memory _companyName,
    uint _reservedResources,
    uint _availableResources
  ) public {
    Company storage company = companyList[_companyName];

    uint tempAvail = company.availableResources;
    company.availableResources = tempAvail +_availableResources;
    uint tempRes = company.reservedResources;
    company.reservedResources = tempRes + _reservedResources;

    emit UpdatedResources(_companyName, _reservedResources, _availableResources);
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
