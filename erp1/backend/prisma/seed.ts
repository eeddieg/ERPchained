import { hashPassword } from "../src/utils/security.util";
import { AssignedBlockchainAddress, OrderStatus, OrderType, Prisma, Product, UserRole } from "@prisma/client";
import db from "../src/utils/db.utils";
import JwtUtilsClass from "../src/utils/jwt.utils";
import BlockChainService from "../src/services/blockchain.service";
import AccountService from "../src/services/account.service";

const Users: Prisma.UserCreateInput[] = [
  {
    firstName: "qwe",
    lastName: "qwe",
    email: "qwe@qwe.qwe",
    password: "qwe",
    role: UserRole.ADMIN,
    refreshToken: "",
  },
  {
    firstName: "asd",
    lastName: "asd",
    email: "asd@asd.asd",
    password: "asd",
    role: UserRole.MODERATOR,
    refreshToken: "",
  },
  {
    firstName: "zxc",
    lastName: "zxc",
    email: "zxc@zxc.zxc",
    password: "zxc",
    role: UserRole.USER,
    refreshToken: "",
  },
];

const Customers: Prisma.CustomerCreateInput[] = [
  {
    name: "Customer 1",
    email: "cust1@test.com",
  },
  {
    name: "Customer 2",
    email: "cust2@test.com",
  },
  {
    name: "Customer 3",
    email: "cust3@test.com",
  },
  {
    name: "Customer 4",
    email: "cust4@test.com",
  },
  {
    name: "Customer 5",
    email: "cust5@test.com",
  }
];

async function populateEmployees() {
  console.log("\nSeeding Employees...");
  const accounts = await BlockChainService.getAccounts();
  const limit = 20;
  // Populate available accounts
  // for (let index in accounts) {
  for (let i = 0; i < limit; i++) {
    const account = accounts[i];
    const address = account.address as string;

    await db.availableBlockchainAddress.create({
      data: {
        address: address,
      },
    });
  }

  for (let index in Users) {
    let user = Users[index];
    user.password = await hashPassword(user.password);
    let accessToken = await JwtUtilsClass.generateAccessToken(user);
    let refreshToken = await JwtUtilsClass.generateRefreshToken({
      email: user.email,
      role: user.role,
    });


    let createdUser = await db.user.create({
      data: {
        firstName: user.firstName as string,
        lastName: user.lastName as string,
        email: user.email as string,
        password: user.password as string,
        role: user.role as UserRole,
        refreshToken: user.refreshToken as string,
      },
    });

    console.log(`Employee ${createdUser.id}`);
    let availAddress = await db.availableBlockchainAddress.findUnique({
      where: {
        id: createdUser.id as number,
      }
    });

    let updatedUser = await db.user.update({
      where: {
        id: createdUser.id as number,
      },
      data: {
        address: availAddress?.address as string,
      },
    });

    let assignedAddress = await db.assignedBlockchainAddress.create({
      data: {
        address: availAddress?.address as string,
        email: createdUser?.email as string,
      },
    });

    // console.log(`Created user with id: ${updatedUser.id}`);
    // console.log("Access Token: \n" + accessToken);
    // console.log("Refresh Token: \n" + refreshToken + "\n");
  }
  console.log("Done\n");
}

async function populateCustomers() {
  console.log("Seeding Customers...");
  
  for (const cust of Customers) {
    
    const custCreated = await db.customer.create({
      data: {
        name: cust.name as string,
        email: cust.email as string,
      }
    });
    
    const invCreated = await db.inventory.create({
      data: {
        customerId: custCreated.id as number,
      }
    });

    const orderCreated = await db.order.create({
      data: {
        customerId: custCreated.id,
        createdAt: new Date(),
        type: OrderType.INCOMING,
        status: OrderStatus.PLACED
      }
    });

    const resourcesCreated = await db.resource.create({
      data: {
        inventoryId: invCreated.id,
        orderId: orderCreated.id,
        title: Product.WHEAT,
        amount: 1000,
      }
    });

    // Implementing relations
    const orderUpdated = await db.order.update({
      where: {
        id: orderCreated.id
      },
      data: {
        status: OrderStatus.COMPLETED,
        deliveredAt: new Date(),
        list: {
          connect: { id: resourcesCreated.id }
        }
      }
    });
    
    const invUpdated = await db.inventory.update({
      where: {
        id: invCreated.id,
      },
      data: {
        resources: {
          connect: { id: resourcesCreated.id }
        }
      },
    });

    // Assign blockchain address
    const assignedAddress = await assignAddress(custCreated!.email as string);
    
    const custUpdated = await db.customer.update({
      where: {
        id: custCreated.id,
      },
      data: {
        address: assignedAddress!.address,
        order: {
          connect: { id: orderUpdated.id }
        }
      },
    });
    console.log(`Customer ${custCreated.id } with assigned address ${assignedAddress!.address}`);
  }
  console.log("Done");
}

async function assignAddress(email: string){
  const addrObj = await AccountService.findNextUnassignedAccount();
  if (addrObj !== null) {
    const payload = {
      address: addrObj!.address as string,
      email: email as string
    } as AssignedBlockchainAddress;
    return await AccountService.storeAssignedBlockchainAddress(payload);
  }
}

async function addToCustomer(id: number, amount: number, type: OrderType) {
  console.log();

  const customer = await db.customer.findUnique({
    where: {
      id,
    }
  });
  
  const custId = customer!.id as number;
  console.log(`Customer ${custId }`);
  
  const inventory = await db.inventory.findUnique({
    where: {
      customerId: custId as number,
    }
  }); 

  
  const orderCreated = await db.order.create({
    data: {
      customerId: custId,
      createdAt: new Date(),
      type,
      status: OrderStatus.PLACED
    }
  });
  
  const resourcesCreated = await db.resource.create({
    data: {
      inventoryId: inventory!.id,
      orderId: orderCreated.id,
      title: Product.WHEAT,
      amount,
    }
  });

  // Implementing relations
  const orderUpdated = await db.order.update({
    where: {
      id: orderCreated.id
    },
    data: {
      status: OrderStatus.COMPLETED,
      deliveredAt: new Date(),
      list: {
        connect: { id: resourcesCreated.id }
      }
    }
  });

  const invUpdated = await db.inventory.update({
    where: {
      id: inventory!.id,
    },
    data: {
      resources: {
        connect: { id: resourcesCreated.id }
      }
    },
  });
  
  const custUpdated = await db.customer.update({
    where: {
      id: custId,
    },
    data: {
      order: {
        connect: { id: orderUpdated.id }
      }
    },
  });
  console.log(`New order created from ${amount} untis of ${Product.WHEAT}`);
  console.log(`New order created at ${orderUpdated.createdAt}`);
  console.log(`New order closed at ${orderUpdated.deliveredAt}`);
}

export async function seed() {
  console.log("Start seeding to DB...\n");
  
  await populateEmployees();
  await populateCustomers();
  // after prisma generate, CUSTOMER TABLE NEEDS ALTER. 
  // see IMPORTANT file
  await addToCustomer(1001, 500, OrderType.INCOMING);
  await addToCustomer(1001, 250, OrderType.OUTCOMING);

  console.log("\nSeeding completed.");
}

seed();
