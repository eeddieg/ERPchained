enum Actions {
  BLOCKCHAIN_INFORM_SELLER = "informSeller",
  BLOCKCHAIN_TRIGGER_BUY_EVENTS = "emitBuyEvents",
  CALCULATE_NUMBER_OF_CUSTOMERS = "calculateNumberOfCustomers",
  CALCULATE_NUMBER_OF_CUSTOMERS_ON_BC = "calculateNumberOfCustomersOnBc",
  CALCULATE_NUMBER_OF_ORDERS_PER_CUSTOMER = "calculateNumberOfOrdersPerCustomers",
  CALCULATE_NUMBER_OF_ORDERS_PER_CUSTOMER_FROM_BC = "calculateNumberOfOrdersPerCustomersFromBc",
  CALCULATE_RESOURCES_QUANTITY = "calculateResourcesQuantity",
  CHECK_BC_AUTH_STATUS = "checkAuthStatusOnBc",
  CHECK_BC_INFO_STATUS = "checkBcInfoStatus",
  CHECK_COMPANY_REGISTRATION_STATUS = "checkCompanyRegStatus",
  CHECK_MFA_STATUS = "checkMFAStatus",
  CREATE_ORDER = "createOrder",
  COUNT_USERS = "countAllUsers",
  DESERIALIZE_ORDER_TRANSACTION = "deserializeOrderTransaction",
  GENERATE_QR = "generateQrCode",
  GENERATE_INCOMING_ORDERS = "generateIncomingOrders",
  GENERATE_OUTGOING_ORDERS = "generateOutgoingOrders",
  GET_BUYERS_LIST_FROM_BC = "getBuyersListFromBc",
  GET_COMPANY_FROM_BC_BY_COMPANY_ID = "fetchCompanyFromBc",
  GET_COMPANY_RESOURCES_FROM_BC = "fetchCompanyResourcesFromBc",
  GET_CUSTOMER_BY_EMAIL = "getCustomerByEmail",
  GET_CUSTOMER_BY_ID = "getCustomerById",
  GET_CUSTOMERS = "getCustomers",
  GET_CUSTOMERS_FROM_BC = "getCustomersFromBc",
  GET_INCOMING_ORDER_FROM_BC = "receiveOrderFromBc",
  GET_SELLERS_LIST_FROM_BC = "getSellersListFromBc",
  GET_MAX_BLOCK_NUMBER = "getMaxBlockNumber",
  GET_ORDER_BY_TRANSACTION_HASH_FROM_BC = "getOrderByTransactionHashFromBc",
  GET_ORDER_BY_ORDER_ID = "getOrderById",
  GET_ORDER_BY_ORDER_ID_FROM_BC = "getOrderByIdFromBc",
  GET_ORDER_RECEIPT_BY_ORDER_ID = "getOrderReceiptByOrderId",
  GET_ORDERS_BY_CUSTOMER_EMAIL = "getOrdersByCustomer",
  GET_ORDERS_BY_CUSTOMER_EMAIL_FROM_BC = "getOrdersByCustomerEmailFromBc",
  GET_ORDERS_BY_CUSTOMER_ID = "getOrdersByCustomerId",
  GET_ORDERS_BY_CUSTOMER_ID_FROM_BC = "getOrdersByCustomerIdFromBc",
  GET_RESOURCES_BY_CUSTOMER_ID = "getResourcesByCustomerId",
  GET_RESOURCES_BY_ORDER_ID = "getResourcesByOrderId",
  GET_SPLITTED_RESOURCES_PER_CUSTOMER = "getSplittedResourcesPerCustomer",
  GET_SPLITTED_RESOURCES_PER_CUSTOMER_FROM_BC = "getSplittedResourcesPerCustomerFromBc",
  GET_USERS = "getAllUsers",
  LOGIN = "logUser",
  LOGOUT = "logout",
  PUBLISH_ORDER_TO_BC = "publishOrder",
  REGISTER = "registerUser",
  REGISTER_COMPANY_TO_BC = "enrollCompanyToBc",
  REGISTER_CUSTOMER_TO_BC = "enrollCustomerToBc",
  REGISTER_RESOURCE_TO_BC = "enrollResourceToBc",
  REGISTER_ORDER_TO_BC = "enrollOrderToBc",
  REGISTER_USER_TO_BC = "enrollUserToBc",
  RESET_MFA = "resetMFA",
  RETRIEVE_ALL = "retrieveAll",
  SANITAZE_MFA = "sanitizeMFARecord",
  SET_BC_AUTH_STATUS = "setAuthStatusOnBc",
  SET_COMPANY_RESOURCES_ON_BC = "setCompanyResourcesOnBc",
  STORE_CUSTOMER_TO_DB = "storeCustomerToDb",
  STORE_ORDER_RECEIPT = "storeOrderReceipt",
  STORE_ORDER_TO_BC = "storeOrderToBc",
  STORE_ORDER_TO_DB = "storeOrderToDb",
  STORE_TO_BROWSER = "storeToBrowserLocalStorage",
  UPDATE_COMPANY_INFO_ON_BC = "updateCompanyInfoOnBc",
  UPDATE_COMPANY_RESOURCES = "updateCompanyResourcesOnBc",
  UPDATE_ORDER_DELIVERY_DATE_ON_BC = "updateOrderDeliveryDateOnBc",
  UPDATE_ORDER_DELIVERY_DATE_ON_DB = "updateOrderDeliveryDateOnDb",
  UPDATE_ORDER_ON_DB = "updateOrderOnDb",
  UPDATE_ORDER_STATUS_ON_BC = "updateOrderStatusOnBc",
  VALIDATE_MFA = "validateMFAToken",
  VALIDATE_JWT_TOKEN = "validateJwtToken",
}

enum Mutations {
  CLEAR_USER_LIST = "clearUserList",
  SET_AUTH_STATUS = "setAuthenticatedStatus",
  SET_BC_AUTH_STATUS = "setBcAuthStatus",
  SET_COMPANY_BRAND = "setCompanyName",
  SET_COMPANY_DETAILS = "setCompanyDetails",
  SET_CUSTOMERS = "setCustomerList",
  SET_INBOUND = "setInbound",
  SET_MAX_BLOCK_NUMBER = "setMaxBlockNumber",
  SET_MFA = "setMFA",
  SET_ORDER = "setOrder",
  SET_OUTBOUND = "setOutbound",
  SET_PASSWORD = "setPassword",
  SET_PRODUCT_TO_BUY = "setProductToBuy",
  SET_PRODUCT_TO_SELL = "setProductToSell",
  SET_RESOURCE = "setResource",
  SET_REFRESH_TOKEN = "setRefreshTokenToken",
  SET_STATS_BC_VISIBILITY = "setBcStatsVisibility",
  SET_STATS_DB_VISIBILITY = "setDbStatsVisibility",
  SET_STATS_VISIBILITY = "setStatisticsVisibility",
  SET_STATUS_CODE = "setStatusCode",
  SET_TOTAL_USERS = "setUsersCounter",
  SET_USER = "setUser",
  SET_USER_LIST = "setUserList",
}

export { Actions, Mutations };
