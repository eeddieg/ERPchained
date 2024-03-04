export type Company = {
  name: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  bcAddress: string | null;
  reservedResources: number;
  availableResources: number;
  productToBuy: string;
  productToSell: string;
};

export type CompanyBc = {
  companyName: string;
  email: string;
  address: string | null;
  reservedResources: number;
  availableResources: number;
  productToBuy: string;
  productToSell: string;
};
