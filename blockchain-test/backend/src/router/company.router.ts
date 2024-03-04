import { Router } from "express";
import { CompanyController } from "../controllers/company.controller";

const companyRouter = Router();

companyRouter.patch("/setResources", CompanyController.setTotalResources);
companyRouter.patch("/updateResources", CompanyController.updateTotalResources);
companyRouter.patch("/updateCompany", CompanyController.updateCompanyInfo);
companyRouter.post("/buyList", CompanyController.fetchBuyList);
companyRouter.post("/info", CompanyController.getCompanyInstance);
// companyRouter.post("/receiveIncomingOrder", CompanyController.receiveIncomingOrder);
companyRouter.post("/registerCompany", CompanyController.registerCompany);
companyRouter.post("/regStatus", CompanyController.registrationStatus);
companyRouter.post("/sellList", CompanyController.fetchSellList);
companyRouter.post("/updatedData", CompanyController.fetchUpdatedData);

export default companyRouter;
