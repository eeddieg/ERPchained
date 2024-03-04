import { NextFunction, Request, Response } from "express";
import { CompanyService } from "../services/company.service";
import { Company } from "../model/company.model";

export class CompanyController {
  public static async fetchBuyList(req: Request, res: Response, next: NextFunction) {
    const payload = {
      address: req.body.address as string,
      product: req.body.product as string,
    };

    const data = await CompanyService.fetchBuyList(payload) as Company[] | null;

    if (typeof data !== "string" && typeof data !== null) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `List of companies buying -> ${payload.product}`,
        list: JSON.parse(JSON.stringify(data)),
      });
    } else {
      res.status(200).json({
        status: false,
        statusCode: 200,
        message: data,
      });
    }
  }
  
  public static async fetchSellList(req: Request, res: Response, next: NextFunction) {
    const payload = {
      address: req.body.address as string,
      product: req.body.product as string,
    };

    const data = await CompanyService.fetchSellList(payload) as Company[] | null;
    console.log(data);
    if (typeof data !== "string" && typeof data !== null) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `List of companies selling -> ${payload.product}`,
        list: JSON.parse(JSON.stringify(data)),
      });
    } else {
      res.status(200).json({
        status: false,
        statusCode: 200,
        message: data,
      });
    }
  }

  public static async fetchUpdatedData(req: Request, res: Response, next: NextFunction) {
    const companyName = req.body.companyName;

    const data = await CompanyService.streamedResources(companyName);
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Updated company resources",
      company: JSON.parse(data),
    });
  }

  public static async getCompanyInstance(req: Request, res: Response, next: NextFunction) {
    let company: Company | null = null;
    
    try {
      const payload = {
        address: req.body.address as string,
        companyName: req.body.companyName as string,
      };

      company = await CompanyService.fetchCompany(payload);
    } catch (error: any) {
      console.log("CompanyController.getCompanyInstance - ERROR");
      console.log(error);
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
        error,
      }); 
    }
       
    if (company !== null) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Company instance fetched",
        company
      });
    } else {
      res.status(200).json({
        status: false,
        statusCode: 404,
        message: "Company not found on blockchain",
      });
    }
  }

  // public static async receiveIncomingOrder(req: Request, res: Response, next: NextFunction) {
  //   const seller = req.body.seller;

  //   const data = await CompanyService.receiveIncomingOrder(seller);
    
  //   res.status(200).json({
  //     status: true,
  //     statusCode: 200,
  //     message: "Incoming Order",
  //     order: JSON.parse(data),
  //   });
  // }

  public static async registerCompany(req: Request, res: Response, next: NextFunction) {
    let result: any = null;
    
    try {      
      const payload = {
        address: req.body.address as string,
        availableResources: req.body.availableResources as number,
        companyName: req.body.companyName as string,
        email: req.body.email as string,
        productToBuy: req.body.productToBuy as string,
        productToSell: req.body.productToSell as string,
        reservedResources: req.body.reservedResources as number,
      };
      
      result = await CompanyService.registerCompany(payload);
    } catch (error: any) {
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }
    const { transaction, receipt, error } = result;
        
    if (error === null) {
      if (receipt !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Company registered on blockchain",
          transaction: JSON.parse(JSON.stringify(transaction)),
          receipt: JSON.parse(JSON.stringify(receipt)),
        });
      } else {
        res.status(200).json({
          status: false,
          statusCode: 403,
          message: "Company is already registered on blockchain",
          transaction: JSON.parse(JSON.stringify(transaction)),
        });
      }
    } else {
      res.status(200).json({
        status: false,
        statusCode: 500,
        message: "Server Error - please try again later",
        error
      });
    }
  };
  
  public static async registrationStatus(req: Request, res: Response, next: NextFunction) {
    let result: any = null;
    
    try {
      const payload = {
        address: req.body.address as string,
        companyName: req.body.companyName as string,
      };

      result = await CompanyService.checkRegStatus(payload);
    } catch (error: any) {
      // console.log("ERROR: Calling contract failed\n");
      // console.log(error);
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }
        
    if (result) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: `Company is Registred on blockchain: ${result}`,
        regStatus: result,
      });
    } else {
      res.status(200).json({
        status: false,
        statusCode: 404,
        message: `Company is Registered on blockchain: ${result}`,
        regStatus: result,
      });
      }
  };
  
  public static async setTotalResources(req: Request, res: Response, next: NextFunction) {
    let result: any = null;
    
    try {      
      const payload = {
        address: req.body.address as string,
        companyName: req.body.companyName as string,
        reservedResources: req.body.reservedResources as number,
        availableResources: req.body.availableResources as number,
      };

      result = await CompanyService.setResources(payload);
    } catch (error: any) {
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      });
    }

    const { transaction, receipt, event, error } = result;
      
    if (error === null) {
      if (receipt !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Store company resources on blockchain was successful",
          transaction: JSON.parse(JSON.stringify(transaction)),
          receipt: JSON.parse(JSON.stringify(receipt)),
        });
      } else {
        res.status(200).json({
          status: false,
          statusCode: 403,
          message: "Store Company resources on blockchain failed. Is company registered on Blockchain?",
          transaction: JSON.parse(JSON.stringify(transaction)),
        });
      }
    } else {
      res.status(200).json({
        status: false,
        statusCode: 500,
        message: "Server Error - please try again later",
        error
      });
    }
  };
  
  public static async updateCompanyInfo(req: Request, res: Response, next: NextFunction) {
    let result: any = null;
    
    try {      
      const payload = {
        address: req.body.address as string,
        companyName: req.body.companyName as string,
        reservedResources: req.body.reservedResources as number,
        availableResources: req.body.availableResources as number,
        productToBuy: req.body.productToBuy as string,
        productToSell: req.body.productToSell as string,
      };
      
      result = await CompanyService.updateCompany(payload);
    } catch (error: any) {
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }

    const { transaction, receipt, error } = result;
    
    if (error === null) {
      if (receipt !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Update on Company Info on blockchain was successful",
          transaction: JSON.parse(JSON.stringify(transaction)),
          receipt: JSON.parse(JSON.stringify(receipt)),
        });
      } else {
        res.status(200).json({
          status: false,
          statusCode: 403,
          message: "Update on Company Info on blockchain failed. Is company registered on Blockchain?",
          transaction: JSON.parse(JSON.stringify(transaction)),
        });
      }
    } else {
      res.status(200).json({
        status: false,
        statusCode: 500,
        message: "Server Error - please try again later",
        error
      });
    }
  };
  
  public static async updateTotalResources(req: Request, res: Response, next: NextFunction) {
    let result: any = null;
    
    try {      
      const payload = {
        address: req.body.address as string,
        companyName: req.body.companyName as string,
        reservedResources: req.body.reservedResources as number,
        availableResources: req.body.availableResources as number,
      };

      console.log("\n\n\n\n\n\n\n");
      console.log("updateTotalResources");
      console.log(payload);
      console.log("\n\n\n\n\n\n\n");

      result = await CompanyService.updateResources(payload);
    } catch (error: any) {
      res.status(200).json({
        status: false,
        statusCode: error.statusCode,
        message: error.message,
      }); 
    }

    const { transaction, receipt, error } = result;
    
    if (error === null) {
      if (receipt !== null) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Update on Company resources on blockchain was successful",
          transaction: JSON.parse(JSON.stringify(transaction)),
          receipt: JSON.parse(JSON.stringify(receipt)),
        });
      } else {
        res.status(200).json({
          status: false,
          statusCode: 403,
          message: "Update on Company resources on blockchain failed. Is company registered on Blockchain?",
          transaction: JSON.parse(JSON.stringify(transaction)),
        });
      }
    } else {
      res.status(200).json({
        status: false,
        statusCode: 500,
        message: "Server Error - please try again later",
        error
      });
    }
  };
};
