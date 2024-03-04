// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./registerUser.sol";

/**
 * @title RegisterOrder
 * @notice RegisterOrder contract is a contract to register incoming and outgoing orders on BC
 * This contract is global, meaning all orders are registered here.
 */
contract RegisterOrder {
    enum OrderStatus {
        PLACED,
        PROCESSED,
        COMPLETED,
        CANCELED
    }
    enum OrderType {
        INCOMING,
        OUTCOMING
    }
    enum Product {
        BREAD,
        FLOUR,
        PACKED_BREAD,
        WHEAT
    }

    struct Customer {
        string id;
        string name;
        string email;
        string company;
    }

    struct Resource {
        string id;
        string product;
        uint amount;
    }

    struct Order {
        string id;
        string customerId;
        Resource resource;
        uint createdAt;
        uint deliveredAt;
        string orderType;
        string status;
    }

    address public owner;
    Customer[] private customerList;
    mapping(string => Customer) public customerByCustomerId;
    mapping(string => Customer) public customerByCustomerEmail;
    mapping(string => mapping(string => Order)) public customerInventory;
    mapping(string => bool) public isCustomerRegisteredByEmail;
    mapping(string => bool) public isCustomerRegisteredById;
    mapping(string => bool) public isOrderRegisteredByOrderId;
    mapping(string => Order) public orderByOrderId;
    mapping(string => Order[]) public ordersByCustomerId;
    mapping(string => Resource) public resourceByResourceId;
    Order[] private orders;
    OrderStatus public orderStatus;
    OrderType public orderType;
    uint private customerCounter;

    event emitCustomer(
        string _id,
        string _name,
        string _email,
        string _company
    );
    event emitBindedResources(string _companyName, uint _amount);

    event emitPlacedOrderInfo(
        string _seller,
        string _sellerEmail,
        string _buyer,
        string _buyerEmail,
        string _buyerAddress,
        uint _amount,
        string _productBought
        );

    constructor() {
        owner = msg.sender;
        customerCounter = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev Create Resource object
     * @param _resourceId Resource's ID
     * @param _product    Product name
     * @param _amount     Product amount
     */
    function createResource(
        string memory _resourceId,
        string memory _product,
        uint _amount
    ) public returns (bool) {
        Resource memory _resource = Resource(_resourceId, _product, _amount);
        resourceByResourceId[_resource.id] = _resource;
        return true;
    }

    // TEST
    // "Company_A_1", "WHEAT", 1000

    /**
     * @dev Create order object
     * @param _orderId Order's ID
     * @param _customerId Customer's ID
     * @param _resourceId Resource's ID
     * @param _createdAt Day at which order created as timestamp
     * @param _deliveredAt Day at which order delivered as timestamp
     * @param _type Order type
     * @param _status Order status
     */
    function createOrder(
        string memory _orderId,
        string memory _customerId,
        string memory _resourceId,
        uint _createdAt,
        uint _deliveredAt,
        string memory _type,
        string memory _status
    ) public returns (bool) {
        require(
            !isOrderRegisteredByOrderId[_orderId],
            "Order is already registered"
        );

        Resource memory _resource = resourceByResourceId[_resourceId];

        Order memory _order = Order(
            _orderId,
            _customerId,
            _resource,
            _createdAt,
            _deliveredAt,
            _type,
            _status
        );
        orderByOrderId[_order.id] = _order;
        Customer memory _customer = customerByCustomerId[_customerId];
        ordersByCustomerId[_customer.id].push(_order);
        customerInventory[_customer.id][_order.id] = _order;
        orders.push(_order);
        isOrderRegisteredByOrderId[_order.id] = true;
        return true;
    }

    // TEST
    // 1, "Company_A_1001", 100, 1692435018, 0, "INCOMING", "PLACED"

    /**
     * @dev Enroll customer on blockchain
     * @param _id Customer's ID
     * @param _name Customer's name
     * @param _email Customer's email
     * @param _company Company name in which customer has account
     */
    function enrollCustomer(
        string memory _id,
        string memory _name,
        string memory _email,
        string memory _company
    ) public returns (bool) {
        require(
            !isCustomerRegisteredById[_id],
            "Customer is already registered"
        );

        Customer memory _customer;
        _customer = Customer(_id, _name, _email, _company);
        customerByCustomerEmail[_customer.email] = _customer;
        customerByCustomerId[_customer.id] = _customer;
        customerList.push(_customer);
        isCustomerRegisteredByEmail[_email] = true;
        isCustomerRegisteredById[_id] = true;
        customerCounter = customerCounter + 1;
        return true;
    }

    // TEST
    // "Company_A_1001", "Customer 1",	"cust1@test.com", "Company_A"

    /**
     * @dev Returns customer info
     * @param _email Customer's email
     */
    function fetchCustomerInfoByEmail(
        string memory _email
    ) public view returns (Customer memory) {
        require(
            !isCustomerRegisteredByEmail[_email],
            "Customer is not registered on Blockchain"
        );
        Customer memory _customer = customerByCustomerEmail[_email];
        return _customer;
    }

    function informBuyerAboutBindedResources(
        string memory _company,
        uint _amount
    ) public {
        emit emitBindedResources(_company, _amount);
    }

    function informBuyerAboutCustomer(
        string memory _custId,
        string memory _name,
        string memory _email,
        string memory _company
    ) public {
        emit emitCustomer(_custId, _name, _email, _company);
    }

   function informSeller(
        // string memory _custId,
        // string memory _name,
        string memory _seller,
        string memory _sellerEmail,
        string memory _buyer,
        string memory _buyerEmail,
        string memory _buyerAddress,
        uint _amount,
        string memory _productBought
    ) public {
        // emit emitCustomer(_id, _name, _email, _company);
        // emit emitBindedResources(_company, _amount);
        emit emitPlacedOrderInfo(_seller, _sellerEmail, _buyer, _buyerEmail, _buyerAddress, _amount, _productBought);
    }

    function retrieveEverything(
        uint _role,
        string calldata _companyName
    ) public view returns (Customer[] memory) {
        RegisterUser.Role role = RegisterUser.Role(_role);
        require(
            role == RegisterUser.Role.ADMIN ||
                role == RegisterUser.Role.MODERATOR
        );

        Customer[] memory customers = this.retrieveCustomerList(
            _role,
            _companyName
        );
        return customers;
    }

    function retrieveCustomerList(
        uint _role,
        string calldata _companyName
    ) public view returns (Customer[] memory) {
        RegisterUser.Role role = RegisterUser.Role(_role);
        require(
            role == RegisterUser.Role.ADMIN ||
                role == RegisterUser.Role.MODERATOR
        );

        Customer[] memory list = new Customer[](customerList.length);

        for (uint i = 0; i < customerList.length; i++) {
            Customer memory customer = customerList[i];
            if (strcmp(_companyName, customer.company)) {
                list[i] = customer;
            }
        }

        return list;
    }

    function retrieveAllOrders() public view returns (Order[] memory) {
        return orders;
    }

    function retrieveOrders(
        string memory _customerId
    ) public view returns (Order[] memory) {
        Order[] memory list = new Order[](orders.length);
        for (uint i = 0; i < orders.length; i++) {
            Order memory order = orders[i];
            if (strcmp(_customerId, order.customerId)) {
                list[i] = order;
            }
        }

        return list;
    }

    function retrieveOrdersForCustomer(
        string memory _customerId
    ) public view returns (Order[] memory) {
        return ordersByCustomerId[_customerId];
    }

    /**
     * @dev Update order property
     * @param _orderId Order's ID
     * @param _deliveredAt Day at which order delivered as timestamp
     */
    function updateOrderDeliveryDate(
        string memory _orderId,
        uint _deliveredAt
    ) public returns (bool) {
        require(
            isOrderRegisteredByOrderId[_orderId],
            "Order is not registered"
        );

        Order storage _order = orderByOrderId[_orderId];
        _order.deliveredAt = _deliveredAt;

        return true;
    }

    /**
     * @dev Update order property
     * @param _orderId Order's ID
     * @param _status Order status
     */
    function updateOrderStatus(
        string memory _orderId,
        string memory _status
    ) public returns (bool) {
        require(
            isOrderRegisteredByOrderId[_orderId],
            "Order is not registered"
        );

        Order storage _order = orderByOrderId[_orderId];
        _order.status = _status;

        return true;
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
