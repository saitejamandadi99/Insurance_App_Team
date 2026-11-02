import { ProductType } from '../Enums/ProductType';
import { PremiumType } from '../Enums/PremiumType';
import { ActiveStatus } from '../Enums/ActiveStatus';

export interface PolicyPlanResponseDto {
  planId: number;
  productId: number;
  productName: string;
  productType: ProductType;
  planName: string;
  coverageAmount: number;
  premiumAmount: number;
  premiumType: PremiumType;
  duration: number;
  termsAndConditions: string;
  activeStatus: ActiveStatus;
  createdDate: Date;
  updatedDate: Date;
}